import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PhoneCall } from 'lucide-react'
import SachiAvatar from './SachiAvatar.jsx'
import { mockUser } from '../../data/app.js'
import { sachiQuestions } from '../../data/sachiQuestions.js'

// Maps a failure reason from the service to the key of its message.
const ERROR_KEYS = {
  'not-connected': 'notConnected',
  AI_NOT_CONFIGURED: 'notConfigured',
  AI_RATE_LIMITED: 'rateLimited',
  RATE_LIMITED: 'rateLimited',
  AI_TIMEOUT: 'timeout',
  AI_UNAVAILABLE: 'unavailable',
  AI_BAD_RESPONSE: 'unavailable',
  network: 'network',
}

// Reasons where trying again cannot help until something is configured.
const NO_RETRY = new Set(['not-connected', 'AI_NOT_CONFIGURED'])

function UserMessage({ message }) {
  const { t } = useTranslation()
  let text = message.text
  if (message.kind === 'answer') text = t(`app.chat.questions.${message.qid}.options.${message.option}`)
  if (message.kind === 'skip') text = t('app.chat.skipped')
  return (
    <div className="chat-row chat-row--user">
      <p className="chat-bubble chat-bubble--user">{text}</p>
    </div>
  )
}

// Three bouncing dots in Sachi's bubble: "she is typing". Used before scripted messages and AI replies.
export function TypingRow() {
  const { t } = useTranslation()
  return (
    <div className="chat-row">
      <SachiAvatar />
      <div className="chat-col">
        <span className="chat-sender">{t('app.chat.sachi')}</span>
        <p className="chat-bubble chat-bubble--typing" role="status" aria-label={t('app.chat.thinking')}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </p>
      </div>
    </div>
  )
}

// Suggested follow-up questions, so the person can keep going without typing.
export function QuickReplies({ onPick }) {
  const { t } = useTranslation()
  return (
    <div className="chat-quick" role="group" aria-label={t('app.chat.quickLabel')}>
      {['documents', 'where', 'advocate'].map((id) => (
        <button key={id} type="button" className="chat-quick__chip" onClick={() => onPick(t(`app.chat.quick.${id}`))}>
          {t(`app.chat.quick.${id}`)}
        </button>
      ))}
    </div>
  )
}

const NextSteps = () => {
  const { t } = useTranslation()
  return (
    <div className="chat-options">
      <Link className="chat-option" to="/app/resources">{t('app.chat.official')}</Link>
      <Link className="chat-option" to="/app/advocates">{t('app.chat.advocates')}</Link>
    </div>
  )
}

const CallButton = () => {
  const { t } = useTranslation()
  return (
    <a className="chat-action chat-action--call" href="tel:112">
      <PhoneCall aria-hidden="true" strokeWidth={1.8} />
      {t('app.emergency.shortNumber')}
    </a>
  )
}

// One message from Sachi. For a question it also renders the answer buttons.
function SachiMessage({ message, active, answers, onAnswer, onSkip, onRetry }) {
  const { t } = useTranslation()
  const question = message.kind === 'question' ? sachiQuestions.find((q) => q.id === message.qid) : null
  const answered = question ? answers[question.id] : undefined

  let text = ''
  if (message.kind === 'greeting') {
    text = message.guest ? t('app.chat.greetingGuest') : t('app.chat.greeting', { name: mockUser.name })
  }
  if (message.kind === 'question') text = t(`app.chat.questions.${message.qid}.text`)
  if (message.kind === 'dangerYes') text = t('app.chat.dangerYes')
  if (message.kind === 'areaChanged') text = t('app.chat.areaChanged', { area: t(`app.areas.${message.area}`) })
  if (message.kind === 'ai') text = message.text
  if (message.kind === 'aiError') text = t(`app.chat.errors.${ERROR_KEYS[message.reason] ?? 'generic'}`)

  const isReply = message.kind === 'ai'

  return (
    <div className="chat-row">
      <SachiAvatar />
      <div className="chat-col">
        <span className="chat-sender">{t('app.chat.sachi')}</span>
        <p className={`chat-bubble${isReply ? ' chat-bubble--reply' : ''}`}>{text}</p>

        {(message.kind === 'dangerYes' || (isReply && message.emergency)) && <CallButton />}

        {isReply && message.emergency && message.helplines?.length > 0 && (
          <div className="chat-helplines">
            <strong>{t('app.chat.helplines')}</strong>
            <ul>
              {message.helplines.map((line) => (
                <li key={line.number}>
                  <a href={`tel:${line.number}`}>
                    <b>{line.number}</b> {line.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isReply && !message.emergency && !message.grounded && <p className="chat-note">{t('app.chat.notChecked')}</p>}

        {message.kind === 'aiError' && (
          <>
            {!NO_RETRY.has(message.reason) && (
              <button type="button" className="chat-option" onClick={onRetry}>{t('app.chat.retry')}</button>
            )}
            <CallButton />
          </>
        )}

        {(message.kind === 'aiError' || (isReply && !message.emergency)) && message.offer && <NextSteps />}

        {question?.type === 'choice' && (
          <div className="chat-options" role="group" aria-label={text}>
            {question.options.map((option) => {
              const selected = answered === option
              return (
                <button
                  key={option}
                  type="button"
                  className={`chat-option${selected ? ' is-selected' : ''}`}
                  aria-pressed={selected}
                  disabled={!active}
                  onClick={() => onAnswer(question.id, option)}
                >
                  {t(`app.chat.questions.${question.id}.options.${option}`)}
                </button>
              )
            })}
          </div>
        )}

        {question && active && (
          <button type="button" className="chat-skip" onClick={() => onSkip(question.id)}>
            {t('app.chat.skip')}
          </button>
        )}
      </div>
    </div>
  )
}

function ChatMessage({ message, ...rest }) {
  if (message.role === 'user') return <UserMessage message={message} />
  if (message.kind === 'thinking') return <TypingRow />
  return <SachiMessage message={message} {...rest} />
}

export default ChatMessage
