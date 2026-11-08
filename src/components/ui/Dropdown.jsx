import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn.js'

/**
 * trigger:  ({ open, toggle }) => element   ← دکمه‌ای که پنجره رو باز می‌کنه
 * children: node یا ({ close }) => node      ← محتوای پنجره
 * align:    'end' | 'start'                   ← پنجره با کدوم لبه هم‌تراز بشه
 */
export default function Dropdown({ trigger, children, align = 'end', className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)
  const toggle = () => setOpen((o) => !o)

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle })}

      {open && (
        <div
          className={cn(
            'absolute top-full z-50 mt-3 rounded-xl border border-border bg-card shadow-card',
            align === 'end' ? 'end-0' : 'start-0',
            className
          )}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  )
}