import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Lock, Mic, Square } from 'lucide-react'
import { useSpeechToText } from '../../hooks/useSpeechToText.js'
import { backendLanguage } from '../../utils/sachiIntake.js'

const MAX_HEIGHT = 140

const MAX_LENGTH = 1500

// Enter sends, Shift+Enter adds a new line, empty messages are ignored.
// `disabled` blocks sending (for example while Sachi is writing a reply) but keeps the text editable.
// The microphone fills the box with what the person says; they review it and press send.
function ChatComposer({ onSend, disabled = false, placeholder }) {
  const { t, i18n } = useTranslation()
  const hint = placeholder ?? t('app.chat.placeholder')
  const [value, setValue] = useState('')
  const ref = useRef(null)

  // The language is read from i18n so the microphone follows the English/Hindi switch.
  const voice = useSpeechToText({
    language: i18n.language ? backendLanguage() : 'en',
    onText: (text) => setValue(text.slice(0, MAX_LENGTH)),
  })

  // Grow the box with its text (typed or spoken), up to MAX_HEIGHT. Runs after the new text is in
  // the page, so it never measures stale text. The listening state is a dependency because it
  // widens the right padding and changes where lines wrap.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    // scrollHeight leaves out the borders (and rounds), so add them back plus 1px of margin;
    // without it a needless scrollbar appears on some screens.
    const borders = el.offsetHeight - el.clientHeight
    el.style.height = `${Math.min(Math.ceil(el.scrollHeight + borders) + 1, MAX_HEIGHT)}px`
  }, [value, voice.listening])

  const submit = () => {
    const text = value.trim()
    if (!text || disabled) return
    voice.stop()
    onSend(text)
    setValue('')
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  const toggleMic = () => {
    if (voice.listening) voice.stop()
    else {
      voice.start(value)
      ref.current?.focus()
    }
  }

  return (
    <div className="chat-composer">
      <div className="chat-composer__box">
        <label className="sr-only" htmlFor="chat-input">{hint}</label>
        <div className={`chat-field${voice.listening ? ' is-listening' : ''}`}>
          <textarea
            id="chat-input"
            ref={ref}
            rows={1}
            value={value}
            maxLength={MAX_LENGTH}
            placeholder={voice.listening ? t('app.chat.listeningHint') : hint}
            onChange={(event) => {
              // Typing by hand takes over from the microphone.
              voice.stop()
              setValue(event.target.value)
            }}
            onKeyDown={onKeyDown}
          />
          {voice.supported && (
            <div className="chat-field__voice">
              {voice.listening && (
                <span className="chat-wave" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              )}
              <button
                type="button"
                className={`chat-mic${voice.listening ? ' is-listening' : ''}`}
                aria-label={voice.listening ? t('app.chat.micStop') : t('app.chat.micStart')}
                aria-pressed={voice.listening}
                title={voice.listening ? t('app.chat.micStop') : t('app.chat.micStart')}
                onClick={toggleMic}
              >
                {voice.listening ? <Square aria-hidden="true" strokeWidth={2.5} /> : <Mic aria-hidden="true" strokeWidth={2} />}
              </button>
            </div>
          )}
        </div>
        <button type="button" className="chat-send" aria-label={t('app.chat.send')} aria-busy={disabled} disabled={disabled} onClick={submit}>
          <ArrowRight aria-hidden="true" strokeWidth={2.25} />
        </button>
      </div>

      {voice.listening && (
        <p className="chat-voice" role="status">
          {t('app.chat.listening')} {t('app.chat.voiceNote')}
        </p>
      )}
      {voice.errorKey && !voice.listening && (
        <p className="chat-voice chat-voice--error" role="alert">
          {t(`app.chat.micErrors.${voice.errorKey}`)}
        </p>
      )}

      <p className="chat-composer__privacy">
        <Lock aria-hidden="true" strokeWidth={1.6} />
        {t('app.chat.privacy')}
      </p>
    </div>
  )
}

export default ChatComposer
