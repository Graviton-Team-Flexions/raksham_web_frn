import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Lock } from 'lucide-react'

const MAX_HEIGHT = 140

const MAX_LENGTH = 1500

// Enter sends, Shift+Enter adds a new line, empty messages are ignored.
// `disabled` blocks sending (for example while Sachi is writing a reply) but keeps the text editable.
function ChatComposer({ onSend, disabled = false, placeholder }) {
  const { t } = useTranslation()
  const hint = placeholder ?? t('app.chat.placeholder')
  const [value, setValue] = useState('')
  const ref = useRef(null)

  const resize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`
  }

  const submit = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
    requestAnimationFrame(() => {
      if (ref.current) ref.current.style.height = 'auto'
    })
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div className="chat-composer">
      <div className="chat-composer__box">
        <label className="sr-only" htmlFor="chat-input">{hint}</label>
        <textarea
          id="chat-input"
          ref={ref}
          rows={1}
          value={value}
          maxLength={MAX_LENGTH}
          placeholder={hint}
          onChange={(event) => {
            setValue(event.target.value)
            resize()
          }}
          onKeyDown={onKeyDown}
        />
        <button type="button" className="chat-send" aria-label={t('app.chat.send')} aria-busy={disabled} disabled={disabled} onClick={submit}>
          <ArrowRight aria-hidden="true" strokeWidth={2.25} />
        </button>
      </div>
      <p className="chat-composer__privacy">
        <Lock aria-hidden="true" strokeWidth={1.6} />
        {t('app.chat.privacy')}
      </p>
    </div>
  )
}

export default ChatComposer
