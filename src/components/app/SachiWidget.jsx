import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ExternalLink, PhoneCall, RotateCcw, X } from 'lucide-react'
import SachiAvatar from './SachiAvatar.jsx'
import ChatThread from './ChatThread.jsx'
import ChatComposer from './ChatComposer.jsx'
import { useSachiChat } from '../../hooks/useSachiChat.js'

const emptyChat = { description: '', area: null, guest: true }

// The open chat panel. It only exists once the visitor has opened the widget, so Sachi's greeting
// and first question are "typed" while they are looking, not before. Closing the panel only hides
// it, so reopening keeps the conversation.
function WidgetPanel({ open, onClose }) {
  const { t } = useTranslation()
  const chat = useSachiChat(emptyChat)
  const endRef = useRef(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: 'end' })
  }, [open, chat.state.messages.length, chat.typing, chat.showQuickReplies])

  return (
    <section className="sachi-widget__panel" role="dialog" aria-label={t('app.widget.title')} hidden={!open}>
      <header className="sachi-widget__head">
        <SachiAvatar />
        <div className="sachi-widget__who">
          <strong>{t('app.widget.title')}</strong>
          <span>{t('app.widget.sub')}</span>
        </div>
        <button
          type="button"
          className="sachi-widget__icon-btn"
          aria-label={t('app.widget.startOver')}
          title={t('app.widget.startOver')}
          onClick={() => chat.reset(emptyChat)}
        >
          <RotateCcw aria-hidden="true" />
        </button>
        <button type="button" className="sachi-widget__icon-btn" aria-label={t('app.widget.close')} onClick={onClose}>
          <X aria-hidden="true" />
        </button>
      </header>

      <div className="sachi-widget__links">
        <a href="tel:112">
          <PhoneCall aria-hidden="true" strokeWidth={1.8} />
          {t('app.widget.call')}
        </a>
        <Link to="/app/ask-sachi">
          {t('app.widget.openFull')}
          <ExternalLink aria-hidden="true" strokeWidth={1.8} />
        </Link>
      </div>

      <div className="sachi-widget__scroll">
        <div className="sachi-widget__thread" aria-live="polite">
          <ChatThread chat={chat} />
          <div ref={endRef} />
        </div>
      </div>

      <ChatComposer onSend={chat.sendText} disabled={chat.busy} placeholder={t(chat.placeholderKey)} />
    </section>
  )
}

// Floating Sachi launcher for the public pages.
function SachiWidget() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [everOpened, setEverOpened] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const toggle = () => {
    setOpen((value) => !value)
    setEverOpened(true)
  }

  return (
    <div className="sachi-widget">
      {everOpened && <WidgetPanel open={open} onClose={() => setOpen(false)} />}

      <button
        type="button"
        className="sachi-widget__launcher"
        aria-label={t('app.widget.open')}
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="sachi-widget__label">{t('app.widget.launcher')}</span>
        <span className="sachi-widget__bubble">{open ? <X aria-hidden="true" /> : <SachiAvatar />}</span>
      </button>
    </div>
  )
}

export default SachiWidget
