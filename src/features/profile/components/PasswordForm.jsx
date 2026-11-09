import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader } from '@/components/ui/Card.jsx'
import TextField from '@/components/ui/TextField.jsx'
import { useChangePassword } from '@/features/auth/hooks/useProfile.js'
import { useToast } from '@/app/ToastProvider.jsx'

const emptyForm = { current: '', next: '', confirm: '' }

export default function PasswordForm() {
  const { t } = useTranslation()
  const toast = useToast()
  const mutation = useChangePassword()

  const [form, setForm] = useState(emptyForm)
  const [show, setShow] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const currentWrong = mutation.error?.code === 'INVALID_PASSWORD'
  const genericError = mutation.isError && !currentWrong

  const currentError = currentWrong
    ? t('profile.errors.currentWrong')
    : submitted && !form.current
      ? t('profile.errors.currentRequired')
      : null

  const nextError = !submitted
    ? null
    : form.next.length < 8
      ? t('profile.errors.newShort')
      : form.next === form.current
        ? t('profile.errors.newSame')
        : null

  const confirmError =
    submitted && form.confirm !== form.next ? t('profile.errors.confirmMismatch') : null

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (mutation.isError) mutation.reset()
  }

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (!form.current || form.next.length < 8 || form.next === form.current || form.confirm !== form.next) return

    mutation.mutate(
      { currentPassword: form.current, newPassword: form.next },
      {
        onSuccess: () => {
          setForm(emptyForm)
          setSubmitted(false)
          toast.success(t('profile.password.saved'))
        },
      }
    )
  }

  const type = show ? 'text' : 'password'

  return (
    <Card className="p-6">
      <CardHeader title={t('profile.password.title')} />

      <form onSubmit={submit} noValidate className="space-y-5">
        <TextField
          label={t('profile.password.current')}
          type={type}
          dir="ltr"
          autoComplete="current-password"
          value={form.current}
          onChange={set('current')}
          error={currentError}
          className="sm:max-w-sm"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label={t('profile.password.new')}
            type={type}
            dir="ltr"
            autoComplete="new-password"
            value={form.next}
            onChange={set('next')}
            error={nextError}
            hint={t('profile.password.newHint')}
          />
          <TextField
            label={t('profile.password.confirm')}
            type={type}
            dir="ltr"
            autoComplete="new-password"
            value={form.confirm}
            onChange={set('confirm')}
            error={confirmError}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
            className="size-4 accent-primary"
          />
          {t('profile.password.show')}
        </label>

        {genericError && (
          <p role="alert" className="text-sm text-danger">
            {t('profile.errors.generic')}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            {mutation.isPending ? t('common.saving') : t('profile.password.submit')}
          </button>
        </div>
      </form>
    </Card>
  )
}