import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { ContactAvatar } from '@/features/chat/components/ConversationList.jsx'
import MessageComposer from '@/features/chat/components/MessageComposer.jsx'
import { useConversation, useMarkConversationRead } from '@/features/chat/hooks/useChat.js'
import { formatMessageTime } from '@/features/chat/format.js'
import { cn } from '@/lib/cn.js'

export default function ChatThread({ id, typing, onBack, onSend }) {
  const { t, i18n } = useTranslation()
  const { data, isPending, isError } = useConversation(id)
  const { mutate: markRead } = useMarkConversationRead()
  const scrollRef = useRef(null)

  const unread = data?.unread ?? 0
  const count = data?.messages.length ?? 0

  // مکالمه‌ی بازشده خوانده‌شده حساب می‌شه، حتی وقتی جواب جدید میاد
  useEffect(() => {
    if (unread > 0) markRead(id)
  }, [id, unread, markRead])

  // همیشه ته مکالمه
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [count, typing])

  const backButton = (
    <button
      type="button"
      onClick={onBack}
      aria-label={t('chat.back')}
      className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-hover hover:text-heading lg:hidden"
    >
      <ArrowLeft size={20} className="rtl:rotate-180" />
    </button>
  )

  if (isPending) {
    return (
      <div aria-hidden="true" className="space-y-4 p-6">
        <div className="h-12 w-1/2 animate-pulse rounded-md bg-hover" />
        <div className="ms-auto h-10 w-2/3 animate-pulse rounded-2xl bg-hover" />
        <div className="h-10 w-1/2 animate-pulse rounded-2xl bg-hover" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div role="alert" className="p-6">
        {backButton}
        <p className="mt-4 text-sm text-danger">{t('chat.error.title')}</p>
      </div>
    )
  }

  const { contact } = data

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-border px-3 py-3 sm:px-5">
        {backButton}
        <ContactAvatar contact={contact} size="size-10" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-heading">{contact.name}</p>
          <p className="truncate text-xs text-muted">
            {typing ? (
              <span className="text-primary">{t('chat.typing', { name: contact.name.split(' ')[0] })}</span>
            ) : contact.online ? (
              t('chat.online')
            ) : (
              t('chat.offline')
            )}
          </p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4 sm:p-5" aria-live="polite">
        {data.messages.map((message) => {
          const mine = message.from === 'me'
          return (
            <div key={message.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm sm:max-w-[70%]',
                  mine ? 'rounded-ee-sm bg-primary text-white' : 'rounded-es-sm bg-hover text-heading',
                  message.pending && 'opacity-70'
                )}
              >
                <p dir="auto" className="whitespace-pre-wrap break-words">
                  {message.text}
                </p>
                <p className={cn('mt-1 text-end text-[11px]', mine ? 'text-white/70' : 'text-muted')}>
                  {formatMessageTime(message.at, i18n.language)}
                </p>
              </div>
            </div>
          )
        })}

        {typing && (
          <div className="flex justify-start" aria-hidden="true">
            <div className="flex gap-1 rounded-2xl rounded-es-sm bg-hover px-4 py-3">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="size-1.5 animate-bounce rounded-full bg-muted"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <MessageComposer onSend={onSend} />
    </div>
  )
}