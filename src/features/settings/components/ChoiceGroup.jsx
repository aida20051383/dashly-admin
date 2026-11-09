import { cn } from '@/lib/cn.js'

export default function ChoiceGroup({ label, value, options, onChange }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg border border-border p-1">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              active ? 'bg-primary text-white shadow-glow' : 'text-foreground hover:bg-hover'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}