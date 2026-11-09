import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader } from '@/components/ui/Card.jsx'
import TextField from '@/components/ui/TextField.jsx'
import { useAuth } from '@/features/auth/AuthContext.jsx'
import { useUpdateProfile } from '@/features/auth/hooks/useProfile.js'
import { useToast } from '@/app/ToastProvider.jsx'
import { formatNumber } from '@/lib/format.js'

const BIO_MAX = 160
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\+?[\d۰-۹\s()-]{7,20}$/

const fromUser = (u) => ({
  name: u.name ?? '',
  email: u.email ?? '',
  phone: u.phone ?? '',
  bio: u.bio ?? '',
})

export default function ProfileForm() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const { user } = useAuth()
  const toast = useToast()
  const mutation = useUpdateProfile()

  const initial = fromUser(user)
  const [form, setForm] = useState(initial)
  const [submitted, setSubmitted] = useState(false)

  const dirty = Object.keys(initial).some((key) => form[key] !== initial[key])

  const nameInvalid = form.name.trim().length < 2
  const emailInvalid = !emailPattern.test(form.email.trim())
  const phoneInvalid = form.phone.trim() !== '' && !phonePattern.test(form.phone.trim())

  const emailTaken = mutation.error?.code === 'EMAIL_TAKEN'
  const genericError = mutation.isError && !emailTaken

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (mutation.isError) mutation.reset()
  }

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (nameInvalid || emailInvalid || phoneInvalid) return

    mutation.mutate(form, {
      onSuccess: (updated) => {
        setForm(fromUser(updated))
        setSubmitted(false)
        toast.success(t('profile.info.saved'))
      },
    })
  }

  const reset = () => {
    setForm(initial)
    setSubmitted(false)
    mutation.reset()
  }

  return (
    <Card className="p-6">
      <CardHeader title={t('profile.info.title')} />

      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label={t('profile.info.name')}
            value={form.name}
            onChange={set('name')}
            autoComplete="name"
            error={submitted && nameInvalid ? t('profile.errors.name') : null}
          />
          <TextField
            label={t('profile.info.email')}
            type="email"
            dir="ltr"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
            error={
              emailTaken
                ? t('profile.errors.emailTaken')
                : submitted && emailInvalid
                  ? t('profile.errors.email')
                  : null
            }
          />
        </div>

        <TextField
          label={t('profile.info.phone')}
          type="tel"
          dir="ltr"
          value={form.phone}
          onChange={set('phone')}
          autoComplete="tel"
          error={submitted && phoneInvalid ? t('profile.errors.phone') : null}
          className="sm:max-w-xs"
        />

        <TextField
          multiline
          label={t('profile.info.bio')}
          value={form.bio}
          onChange={set('bio')}
          maxLength={BIO_MAX}
          hint={t('profile.info.bioCount', {
            n: formatNumber(form.bio.length, lng),
            max: formatNumber(BIO_MAX, lng),
          })}
        />

        {genericError && (
          <p role="alert" className="text-sm text-danger">
            {t('profile.errors.generic')}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={!dirty || mutation.isPending}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-hover disabled:pointer-events-none disabled:opacity-40"
          >
            {t('profile.info.reset')}
          </button>
          <button
            type="submit"
            disabled={!dirty || mutation.isPending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            {mutation.isPending ? t('common.saving') : t('profile.info.save')}
          </button>
        </div>
      </form>
    </Card>
  )
}