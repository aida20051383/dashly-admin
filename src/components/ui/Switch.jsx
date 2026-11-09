import { useId } from 'react'
import { cn } from '@/lib/cn.js'

export default function Switch({ checked, onChange, label, description }) {
  const id = useId()

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block cursor-pointer text-sm font-medium text-heading">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-border'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow transition-all',
            checked ? 'start-[1.375rem]' : 'start-0.5'
          )}
        />
      </button>
    </div>
  )
}