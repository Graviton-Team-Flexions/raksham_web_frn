import ChatMessage, { QuickReplies, TypingRow } from './ChatMessage.jsx'

// The messages of one Sachi conversation, plus the "typing" row and the suggested follow-ups.
// Shared by the Ask Sachi page and the floating widget. `chat` is the useSachiChat result.
function ChatThread({ chat }) {
  const { state, question } = chat
  return (
    <>
      {state.messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          active={message.kind === 'question' && question?.id === message.qid}
          answers={state.answers}
          onAnswer={chat.answer}
          onSkip={chat.skip}
          onRetry={chat.retry}
        />
      ))}
      {chat.typing && <TypingRow />}
      {chat.showQuickReplies && <QuickReplies onPick={chat.sendText} />}
    </>
  )
}

export default ChatThread
