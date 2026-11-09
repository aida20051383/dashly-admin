import { useTranslation } from 'react-i18next'
import ProfileSummaryCard from '@/features/profile/components/ProfileSummaryCard.jsx'
import ProfileForm from '@/features/profile/components/ProfileForm.jsx'
import PasswordForm from '@/features/profile/components/PasswordForm.jsx'

export default function ProfilePage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">{t('profile.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('profile.subtitle')}</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <ProfileSummaryCard />
        <div className="space-y-6 lg:col-span-2">
          <ProfileForm />
          <PasswordForm />
        </div>
      </div>
    </div>
  )
}