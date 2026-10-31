import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ChatHeader from '../../components/app/ChatHeader.jsx'
import ChatThread from '../../components/app/ChatThread.jsx'
import ChatComposer from '../../components/app/ChatComposer.jsx'
import { useSachiChat } from '../../hooks/useSachiChat.js'
import { sachiQuestions } from '../../data/sachiQuestions.js'

function SachiChat({ description, area }) {
  const { t } = useTranslation()
  const chat = useSachiChat({ description, area })
  const { state } = chat
  const endRef = useRef(null)

  // Keep the newest message in view, including the typing dots and suggested follow-ups.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [state.messages.length, chat.typing, chat.showQuickReplies])

  const progress = (chat.current / (chat.total + 1)) * 100

  return (
    <div className="chat">
      <ChatHeader
        area={state.area}
        onChangeArea={chat.setArea}
        onStartOver={() => chat.reset({ description: '', area: state.area })}
      />

      {/* Only while the short intake is running; afterwards the screen space goes to the conversation. */}
      {!state.finished && (
        <div className="chat__progress">
          <p>{t('app.chat.progress', { current: chat.current, total: chat.total })}</p>
          <div
            className="chat__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={sachiQuestions.length}
            aria-valuenow={state.index}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="chat__scroll">
        <div className="chat__thread" aria-live="polite">
          <ChatThread chat={chat} />
          <div ref={endRef} />
        </div>
      </div>

      <ChatComposer onSend={chat.sendText} disabled={chat.busy} placeholder={t(chat.placeholderKey)} />
    </div>
  )
}

function AskSachiPage() {
  const { state, key } = useLocation()
  // Keyed by navigation, so arriving with a new description or area starts a fresh conversation.
  return <SachiChat key={key} description={state?.description ?? ''} area={state?.area ?? null} />
}

export default AskSachiPage
