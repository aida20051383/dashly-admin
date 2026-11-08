import { useTranslation } from 'react-i18next'

export default function FallbackPage() {
  const { t } = useTranslation()
  return <p className="py-20 text-center text-muted">{t('common.comingSoon')}</p>
}