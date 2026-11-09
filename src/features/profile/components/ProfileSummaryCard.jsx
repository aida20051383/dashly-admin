import { useTranslation } from 'react-i18next'
import { CalendarDays, Mail, Phone } from 'lucide-react'
import { Card } from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import { useAuth } from '@/features/auth/AuthContext.jsx'
import { formatDate } from '@/lib/format.js'
import { getInitials } from '@/lib/text.js'

export default function ProfileSummaryCard() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()

  return (
    <Card className="p-6 text-center">
      <span className="mx-auto grid size-24 place-items-center rounded-full bg-linear-to-br from-primary to-primary/60 text-3xl font-semibold text-white shadow-glow">
        {getInitials(user.name)}
      </span>

      <h2 className="mt-4 text-xl font-bold text-heading">{user.name}</h2>
      <Badge className="mt-2">{t(`users.roles.${user.role}`)}</Badge>

      {user.bio && <p className="mt-4 text-sm">{user.bio}</p>}

      <ul className="mt-6 space-y-3 border-t border-border pt-6 text-start text-sm">
        <li className="flex items-center gap-3">
          <Mail size={18} className="shrink-0 text-muted" />
          <bdi dir="ltr" className="truncate">
            {user.email}
          </bdi>
        </li>
        {user.phone && (
          <li className="flex items-center gap-3">
            <Phone size={18} className="shrink-0 text-muted" />
            <bdi dir="ltr">{user.phone}</bdi>
          </li>
        )}
        {user.createdAt && (
          <li className="flex items-center gap-3">
            <CalendarDays size={18} className="shrink-0 text-muted" />
            {t('profile.memberSince', { date: formatDate(user.createdAt, i18n.language) })}
          </li>
        )}
      </ul>
    </Card>
  )
}