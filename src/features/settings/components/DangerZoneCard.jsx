import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TriangleAlert } from 'lucide-react'
import { Card } from '@/components/ui/Card.jsx'

// این کلیدها می‌مونن تا کاربر از حساب و تم و زبانش بیرون نیفته
const KEEP = /auth|theme|lang|i18n/i

function resetDemoData() {
  try {
    Object.keys(localStorage)
      .filter((key) => !KEEP.test(key))
      .forEach((key) => localStorage.removeItem(key))
  } catch {
    /* storage unavailable */
  }
  // ری‌لود، داده‌های mock درون حافظه رو هم به حالت اول برمی‌گردونه
  window.location.reload()
}

export default function DangerZoneCard() {
  const { t } = useTranslation()
  const [confirming, setConfirming] = useState(false)

  return (
    <Card className="border border-danger/40 p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-danger/15 text-danger">
          <TriangleAlert size={20} />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-heading">{t('settings.danger.title')}</h2>
          <p className="mt-1 text-sm">{t('settings.danger.description')}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {confirming ? (
              <>
                <span role="alert" className="me-2 text-sm font-medium text-danger">
                  {t('settings.danger.confirmText')}
                </span>
                <button
                  type="button"
                  onClick={resetDemoData}
                  className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  {t('settings.danger.confirm')}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover"
                >
                  {t('settings.danger.cancel')}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="rounded-lg border border-danger px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
              >
                {t('settings.danger.reset')}
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}