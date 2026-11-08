import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Dumbbell,
  HeartPulse,
  Laptop,
  Search,
  Shirt,
  ShoppingBasket,
  TrendingDown,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { Card } from '@/components/ui/Card.jsx'
import Skeleton from '@/components/ui/Skeleton.jsx'
import QueryError from '@/components/ui/QueryError.jsx'
import { useCompanies } from '@/features/dashboard/hooks/useDashboard.js'
import { formatCompact, formatCurrency, formatPercent } from '@/lib/format.js'
import { normalizeText } from '@/lib/text.js'
import { cn } from '@/lib/cn.js'

const categoryMeta = {
  technology: { icon: Laptop, tone: 'bg-primary/15 text-primary' },
  grocery: { icon: ShoppingBasket, tone: 'bg-success/15 text-success' },
  fashion: { icon: Shirt, tone: 'bg-warning/15 text-warning' },
  health: { icon: HeartPulse, tone: 'bg-danger/15 text-danger' },
  sports: { icon: Trophy, tone: 'bg-info/15 text-info' },
  fitness: { icon: Dumbbell, tone: 'bg-primary/15 text-primary' },
}

const columns = ['company', 'category', 'views', 'revenue', 'sales']

// کلید ستون ← فیلدی که مرتب‌سازی روش انجام می‌شه
const sortField = { company: 'name', category: 'category', views: 'views', revenue: 'revenue', sales: 'sales' }
const textColumns = new Set(['company', 'category'])

export default function CompaniesTable() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const { data, isPending, isError, refetch } = useCompanies()

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ column: 'revenue', dir: 'desc' })

  const categoryLabel = (c) => t(`dashboard.companies.categories.${c.category}`)

  const rows = useMemo(() => {
    const q = normalizeText(query)
    const filtered = (data ?? []).filter(
      (c) => !q || normalizeText(`${c.name} ${c.email} ${categoryLabel(c)}`).includes(q)
    )

    const field = sortField[sort.column]
    const direction = sort.dir === 'asc' ? 1 : -1
    const valueOf = (c) => (field === 'category' ? categoryLabel(c) : c[field])

    return [...filtered].sort((a, b) => {
      const av = valueOf(a)
      const bv = valueOf(b)
      const result = typeof av === 'string' ? av.localeCompare(bv, lng) : av - bv
      return result * direction
    })
    // categoryLabel به t وابسته‌ست
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, query, sort, lng, t])

  const toggleSort = (column) =>
    setSort((s) =>
      s.column === column
        ? { column, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { column, dir: textColumns.has(column) ? 'asc' : 'desc' }
    )

  return (
    <Card className="h-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-6 pb-4">
        <h2 className="text-lg font-semibold text-heading">{t('dashboard.companies.title')}</h2>

        <label className="flex h-10 w-full items-center gap-2 rounded-lg border border-border px-3 text-muted focus-within:border-primary sm:w-60">
          <Search size={16} className="shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('dashboard.companies.search')}
            aria-label={t('dashboard.companies.search')}
            className="min-w-0 flex-1 bg-transparent text-sm text-heading outline-none placeholder:text-muted"
          />
        </label>
      </div>

      {isError ? (
        <div className="p-6 pt-2">
          <QueryError onRetry={refetch} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="bg-hover/60">
              <tr>
                {columns.map((column) => {
                  const active = sort.column === column
                  const SortIcon = !active ? ChevronsUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown
                  return (
                    <th
                      key={column}
                      scope="col"
                      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                      className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-heading first:ps-6 last:pe-6"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(column)}
                        className={cn(
                          'inline-flex items-center gap-1.5 uppercase transition-colors hover:text-primary',
                          active && 'text-primary'
                        )}
                      >
                        {t(`dashboard.companies.columns.${column}`)}
                        <SortIcon size={14} className={cn(!active && 'text-muted')} />
                      </button>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {isPending &&
                Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="border-t border-border">
                    {columns.map((column) => (
                      <td key={column} className="px-4 py-4 first:ps-6 last:pe-6">
                        <Skeleton className="h-5 w-full max-w-28" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!isPending && rows.length === 0 && (
                <tr className="border-t border-border">
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-muted">
                    {t('dashboard.companies.empty')}
                  </td>
                </tr>
              )}

              {rows.map((c) => {
                const { icon: CategoryIcon, tone } = categoryMeta[c.category]
                const TrendIcon = c.trend === 'up' ? TrendingUp : TrendingDown
                return (
                  <tr key={c.id} className="border-t border-border transition-colors hover:bg-hover/60">
                    <td className="px-4 py-3 ps-6">
                      <div className="flex items-center gap-3">
                        <span className={cn('grid size-10 shrink-0 place-items-center rounded-lg font-bold', tone)}>
                          {c.name[0]}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-heading">{c.name}</p>
                          <p className="truncate text-xs text-muted">
                            <bdi dir="ltr">{c.email}</bdi>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2.5">
                        <span className={cn('grid size-8 shrink-0 place-items-center rounded-full', tone)}>
                          <CategoryIcon size={16} />
                        </span>
                        {categoryLabel(c)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-heading">{formatCompact(c.views, lng)}</p>
                      <p className="text-xs text-muted">{t(`dashboard.companies.periods.${c.period}`)}</p>
                    </td>

                    <td className="px-4 py-3">{formatCurrency(c.revenue, lng)}</td>

                    <td className="px-4 py-3 pe-6">
                      <span className="inline-flex items-center gap-2 font-semibold text-heading">
                        {formatPercent(c.sales / 100, lng, 0)}
                        <TrendIcon
                          size={16}
                          role="img"
                          aria-label={t(c.trend === 'up' ? 'dashboard.companies.trendUp' : 'dashboard.companies.trendDown')}
                          className={c.trend === 'up' ? 'text-success' : 'text-danger'}
                        />
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}