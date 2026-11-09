import { useTranslation } from 'react-i18next'
import { Card, CardHeader } from '@/components/ui/Card.jsx'
import ChoiceGroup from '@/features/settings/components/ChoiceGroup.jsx'
import { useTheme } from '@/app/ThemeProvider.jsx'

export default function AppearanceCard() {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()

  const lng = i18n.language.startsWith('fa') ? 'fa' : 'en'

  const setTheme = (value) => {
    // فقط وقتی با حالت فعلی فرق داره
    if ((value === 'dark') !== isDark) toggleTheme()
  }

  return (
    <Card className="p-6">
      <CardHeader title={t('settings.appearance.title')} />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-heading">{t('settings.appearance.theme')}</span>
          <ChoiceGroup
            label={t('settings.appearance.theme')}
            value={isDark ? 'dark' : 'light'}
            onChange={setTheme}
            options={[
              { value: 'light', label: t('settings.appearance.light') },
              { value: 'dark', label: t('settings.appearance.dark') },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-heading">{t('settings.appearance.language')}</span>
          <ChoiceGroup
            label={t('settings.appearance.language')}
            value={lng}
            onChange={(value) => i18n.changeLanguage(value)}
            options={[
              { value: 'en', label: 'English' },
              { value: 'fa', label: 'فارسی' },
            ]}
          />
        </div>
      </div>
    </Card>
  )
}