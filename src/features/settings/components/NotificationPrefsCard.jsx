import { useTranslation } from 'react-i18next'
import { Card, CardHeader } from '@/components/ui/Card.jsx'
import Switch from '@/components/ui/Switch.jsx'
import { useLocalStorage } from '@/hooks/useLocalStorage.js'

const DEFAULTS = { email: true, push: true, orders: true, weekly: false }
const KEYS = ['email', 'push', 'orders', 'weekly']

export default function NotificationPrefsCard() {
  const { t } = useTranslation()
  const [prefs, setPrefs] = useLocalStorage('settings-notifications', DEFAULTS)

  const toggle = (key) => (value) => setPrefs((p) => ({ ...DEFAULTS, ...p, [key]: value }))

  return (
    <Card className="p-6">
      <CardHeader
        title={t('settings.notifications.title')}
        subtitle={t('settings.notifications.subtitle')}
      />

      <div className="divide-y divide-border">
        {KEYS.map((key) => (
          <Switch
            key={key}
            checked={(prefs ?? DEFAULTS)[key] ?? DEFAULTS[key]}
            onChange={toggle(key)}
            label={t(`settings.notifications.${key}`)}
            description={t(`settings.notifications.${key}Desc`)}
          />
        ))}
      </div>
    </Card>
  )
}