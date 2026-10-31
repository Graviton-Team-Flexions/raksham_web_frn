import { useCallback, useEffect, useReducer, useRef } from 'react'
import { sachiQuestions } from '../data/sachiQuestions.js'
import { requestGuidance } from '../services/sachiService.js'
import { backendLanguage, buildIntakeSummary } from '../utils/sachiIntake.js'

const MAX_HISTORY = 18 // the backend accepts at most 20 messages per request

// Pacing, so the chat feels like talking to a person instead of a form. Scripted messages show
// a typing indicator first; AI replies are held back until a believable typing time has passed.
// Emergency help is never delayed.
const TYPING_MS = { greeting: 1000, question: 1200, areaChanged: 700 }
const typingDelay = (message) => (TYPING_MS[message.kind] ?? 900) + Math.random() * 300
const MIN_REPLY_MS = 1200
const MAX_EXTRA_MS = 1600
const replyDelay = (text) => MIN_REPLY_MS + Math.min(text.length * 4, MAX_EXTRA_MS)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Messages store structured data (not translated text) so the conversation re-translates
// when the language changes and is never reset by it. Sachi's scripted messages wait in `queue`
// and are revealed one at a time.
function createInitialState({ description, area, guest = false }) {
  const messages = description ? [{ id: 1, role: 'user', kind: 'free', text: description }] : []
  const queue = [
    { role: 'sachi', kind: 'greeting', guest },
    { role: 'sachi', kind: 'question', qid: sachiQuestions[0].id },
  ]
  return { area, messages, queue, answers: {}, index: 0, finished: false, nextId: messages.length + 1 }
}

// What the backend sees: only the person's own words and Sachi's earlier replies.
const startConversation = ({ description }) => (description ? [{ role: 'user', content: description }] : [])

// Add the person's message now and queue Sachi's next question, or finish after the last one.
function advance(state, added) {
  const messages = [...state.messages, ...added.map((m, i) => ({ ...m, id: state.nextId + i }))]
  const nextId = state.nextId + added.length
  const index = state.index + 1
  if (index >= sachiQuestions.length) {
    return { ...state, messages, nextId, index, finished: true }
  }
  const queue = [...state.queue, { role: 'sachi', kind: 'question', qid: sachiQuestions[index].id }]
  return { ...state, messages, queue, nextId, index }
}

// Drops the "writing a reply" placeholder and any earlier error before a new one is shown.
const withoutPending = (messages) => messages.filter((m) => m.kind !== 'thinking' && m.kind !== 'aiError')

function appendSachi(state, message) {
  return {
    ...state,
    messages: [...withoutPending(state.messages), { id: state.nextId, role: 'sachi', ...message }],
    nextId: state.nextId + 1,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'answer': {
      const question = sachiQuestions[state.index]
      if (state.finished || question?.id !== action.qid) return state
      const added = [{ role: 'user', kind: 'answer', qid: action.qid, option: action.option }]
      // Safety first: this message appears at once, with no typing pause.
      if (action.qid === 'danger' && action.option === 'yes') added.push({ role: 'sachi', kind: 'dangerYes' })
      return advance({ ...state, answers: { ...state.answers, [action.qid]: action.option } }, added)
    }
    case 'skip': {
      if (state.finished || sachiQuestions[state.index]?.id !== action.qid) return state
      return advance(state, [{ role: 'user', kind: 'skip', qid: action.qid }])
    }
    case 'text': {
      const userMessage = { role: 'user', kind: 'free', text: action.text }
      if (state.finished) {
        return { ...state, messages: [...state.messages, { ...userMessage, id: state.nextId }], nextId: state.nextId + 1 }
      }
      const qid = sachiQuestions[state.index].id
      return advance({ ...state, answers: { ...state.answers, [qid]: action.text } }, [userMessage])
    }
    case 'area':
      return { ...state, area: action.area, queue: [...state.queue, { role: 'sachi', kind: 'areaChanged', area: action.area }] }
    case 'reveal': {
      const [next, ...rest] = state.queue
      if (!next) return state
      return { ...state, messages: [...state.messages, { id: state.nextId, ...next }], queue: rest, nextId: state.nextId + 1 }
    }
    case 'thinking':
      return appendSachi(state, { kind: 'thinking' })
    case 'reply':
      return appendSachi(state, { kind: 'ai', ...action.reply })
    case 'error':
      return appendSachi(state, { kind: 'aiError', reason: action.reason, offer: action.offer })
    case 'reset':
      return createInitialState(action.initial)
    default:
      return state
  }
}

export function useSachiChat(initial) {
  const [state, dispatch] = useReducer(reducer, initial, createInitialState)
  const total = sachiQuestions.length
  const isLast = state.index === total - 1
  const thinking = state.messages.some((m) => m.kind === 'thinking')
  const typing = state.queue.length > 0
  const busy = thinking || typing

  // Reveal queued scripted messages one by one, each after its typing pause.
  useEffect(() => {
    if (state.queue.length === 0) return undefined
    const timer = setTimeout(() => dispatch({ type: 'reveal' }), typingDelay(state.queue[0]))
    return () => clearTimeout(timer)
  }, [state.queue])

  // Refs hold what the backend request needs without re-creating the callbacks below.
  const conversation = useRef(startConversation(initial))
  const run = useRef(0) // bumps on reset so a late reply to an old conversation is ignored
  const offerRef = useRef(false)
  const areaRef = useRef(state.area)
  useEffect(() => {
    areaRef.current = state.area
  }, [state.area])

  // Sends the conversation so far to Sachi on the backend and shows the outcome.
  // `offer` adds the "official resources / advocates" next steps under the reply.
  const ask = useCallback(async (offer = false) => {
    offerRef.current = offer
    const ticket = ++run.current
    const startedAt = Date.now()
    dispatch({ type: 'thinking' })
    const result = await requestGuidance({
      messages: conversation.current.slice(-MAX_HISTORY),
      language: backendLanguage(),
      area: areaRef.current,
    })
    if (ticket !== run.current) return

    if (result.ok) {
      // Hold a normal reply back for a believable typing time. Emergency help comes straight away.
      if (!result.emergency) {
        const remaining = replyDelay(result.reply) - (Date.now() - startedAt)
        if (remaining > 0) await sleep(remaining)
        if (ticket !== run.current) return
      }
      conversation.current = [...conversation.current, { role: 'assistant', content: result.reply }]
      dispatch({
        type: 'reply',
        reply: {
          text: result.reply,
          emergency: result.emergency,
          helplines: result.helplines,
          grounded: result.grounded,
          sources: result.sources ?? [],
          attribution: result.attribution ?? null,
          offer,
        },
      })
    } else {
      dispatch({ type: 'error', reason: result.reason, offer })
    }
  }, [])

  // Called when the final question is answered or skipped.
  const finish = useCallback(
    (answers) => {
      conversation.current = [...conversation.current, { role: 'user', content: buildIntakeSummary(answers) }]
      ask(true)
    },
    [ask],
  )

  const answer = useCallback(
    (qid, option) => {
      dispatch({ type: 'answer', qid, option })
      if (isLast) finish({ ...state.answers, [qid]: option })
    },
    [finish, isLast, state.answers],
  )

  const skip = useCallback(
    (qid) => {
      dispatch({ type: 'skip', qid })
      if (isLast) finish(state.answers)
    },
    [finish, isLast, state.answers],
  )

  const sendText = useCallback(
    (text) => {
      if (busy) return
      dispatch({ type: 'text', text })
      if (state.finished) {
        conversation.current = [...conversation.current, { role: 'user', content: text }]
        ask(false)
      } else if (isLast) {
        finish({ ...state.answers, [sachiQuestions[state.index].id]: text })
      }
    },
    [ask, busy, finish, isLast, state.answers, state.finished, state.index],
  )

  const retry = useCallback(() => ask(offerRef.current), [ask])

  const reset = useCallback((nextInitial) => {
    run.current += 1
    conversation.current = startConversation(nextInitial)
    dispatch({ type: 'reset', initial: nextInitial })
  }, [])

  const question = state.finished ? null : sachiQuestions[state.index]
  const last = state.messages.at(-1)

  // Which hint the message box shows, so it always says what is expected next.
  let placeholderKey = 'app.chat.placeholder'
  if (busy) placeholderKey = 'app.chat.placeholderWait'
  else if (state.finished) placeholderKey = 'app.chat.placeholderFollowUp'
  else if (question?.type === 'text') placeholderKey = 'app.chat.placeholderWhat'

  return {
    state,
    total,
    thinking,
    typing,
    busy,
    placeholderKey,
    // Suggested follow-ups, shown only under a finished normal reply.
    showQuickReplies: state.finished && !busy && last?.kind === 'ai' && !last.emergency,
    current: Math.min(state.index + 1, total),
    question,
    answer,
    skip,
    sendText,
    retry,
    setArea: (area) => dispatch({ type: 'area', area }),
    reset,
  }
}
