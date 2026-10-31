import { useCallback, useEffect, useRef, useState } from 'react'

// Voice typing with the browser's built-in speech recognition (Chrome, Edge, Safari).
// The browser's own speech service listens and transcribes, and that service may send the audio to
// its provider; the chat says so. Firefox has no support, so `supported` is false there.
const getRecognition = () =>
  typeof window === 'undefined' ? undefined : window.SpeechRecognition || window.webkitSpeechRecognition

const LOCALES = { en: 'en-IN', hi: 'hi-IN' }

// Maps the browser's error code to the key of a message the person can understand.
const ERROR_KEYS = {
  'not-allowed': 'denied',
  'service-not-allowed': 'denied',
  'no-speech': 'noSpeech',
  'audio-capture': 'noMic',
  network: 'network',
}

// Joins the engine's results into one sentence. Some browsers (notably Chrome on Android) send the
// whole sentence so far again as each new result ("hello", "hello world", "hello world how"); joining
// those naively types every word several times. When a result starts with, or is contained at the
// start of, the previous one, only the longer one is kept.
export function buildTranscript(results) {
  const parts = []
  for (const result of Array.from(results)) {
    const text = (result[0]?.transcript ?? '').trim()
    if (!text) continue
    const previous = parts.at(-1)
    if (previous !== undefined && (text.startsWith(previous) || previous.startsWith(text))) {
      parts[parts.length - 1] = text.length >= previous.length ? text : previous
    } else {
      parts.push(text)
    }
  }
  return parts.join(' ')
}

// `onText` receives the full text so far (what was in the box before, plus everything spoken),
// updated as the person speaks. The person still presses send themselves.
export function useSpeechToText({ language, onText }) {
  const [listening, setListening] = useState(false)
  const [errorKey, setErrorKey] = useState(null)
  const recognition = useRef(null)
  const onTextRef = useRef(onText)

  useEffect(() => {
    onTextRef.current = onText
  }, [onText])

  // Stop listening if the chat is closed while the microphone is on.
  useEffect(() => {
    const holder = recognition
    return () => holder.current?.abort()
  }, [])

  const stop = useCallback(() => recognition.current?.stop(), [])

  const start = useCallback(
    (baseText = '') => {
      const Recognition = getRecognition()
      if (!Recognition || recognition.current) return
      const engine = new Recognition()
      engine.lang = LOCALES[language] ?? LOCALES.en
      engine.continuous = true
      engine.interimResults = true

      const base = baseText && !/\s$/.test(baseText) ? `${baseText} ` : baseText

      engine.onresult = (event) => {
        // Rebuild from every result each time, so the text always matches what the engine heard so far.
        onTextRef.current(base + buildTranscript(event.results))
      }
      engine.onerror = (event) => {
        if (event.error !== 'aborted') setErrorKey(ERROR_KEYS[event.error] ?? 'generic')
      }
      engine.onend = () => {
        recognition.current = null
        setListening(false)
      }

      setErrorKey(null)
      try {
        engine.start()
        recognition.current = engine
        setListening(true)
      } catch {
        setErrorKey('generic')
      }
    },
    [language],
  )

  return { supported: Boolean(getRecognition()), listening, errorKey, start, stop }
}
