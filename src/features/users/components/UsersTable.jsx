import { useTranslation } from 'react-i18next'
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Crown,
  FileText,
  Pencil,
  SearchX,
  SquarePen,
  Trash2,
  User,
  Wrench,
} from 'lucide-react'
import Badge from '@/components/ui/Badge.jsx'
import Skeleton from '@/components/ui/Skeleton.jsx'
import { formatDate } from '@/lib/format.js'
import { cn } from '@/lib/cn.js'

const roleMeta = {
  admin: { icon: Crown, tone: 'bg-danger/15 text-danger' },
  editor: { icon: Pencil, tone: 'bg-info/15 text-info' },
  author: { icon: FileText, tone: 'bg-success/15 text-success' },
  maintainer: { icon: Wrench, tone: 'bg-primary/15 text-primary' },
  subscriber: { icon: User, tone: 'bg-warning/15 text-warning' },
}

const statusTone = { active: 'success', pending: 'warning', inactive: 'neutral' }

const avatarTones = [
  'bg-primary/15 text-primary',
  'bg-success/15 text-success',
  'bg-info/15 text-info',
  'bg-warning/15 text-warning',
  'bg-danger/15 text-danger',
]

const columns = [
  { key: 'name', labelKey: 'user' },
  { key: 'role', labelKey: 'role' },
  { key: 'status', labelKey: 'status' },
  { key: 'joinedAt', labelKey: 'joined' },
]

const initialsOf = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

const actionBtn =
  'grid size-8 place-items-center rounded-full text-foreground transition-colors'

export default function UsersTable({
  users,
  loading,
  skeletonRows,
  sort,
  onSort,
  onEdit,
  onDelete,
  onClearFilters,
  dimmed,
}) {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const columnCount = columns.length + 1 // + ستون عملیات

  return (
    <div className={cn('overflow-x-auto transition-opacity', dimmed && 'opacity-60')}>
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="bg-hover/60">
          <tr>
            {columns.map(({ key, labelKey }) => {
              const active = sort.by === key
              const SortIcon = !active ? ChevronsUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown
              return (
                <th
                  key={key}
                  scope="col"
                  aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-heading first:ps-6"
                >
                  <button
                    type="button"
                    onClick={() => onSort(key)}
                    className={cn(
                      'inline-flex items-center gap-1.5 uppercase transition-colors hover:text-primary',
                      active && 'text-primary'
                    )}
                  >
                    {t(`users.columns.${labelKey}`)}
                    <SortIcon size={14} className={cn(!active && 'text-muted')} />
                  </button>
                </th>
              )
            })}
            <th scope="col" className="px-4 py-3 pe-6">
              <span className="sr-only">{t('users.columns.actions')}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {loading &&
            Array.from({ length: skeletonRows }, (_, i) => (
              <tr key={i} className="border-t border-border">
                {Array.from({ length: columnCount }, (_, c) => (
                  <td key={c} className="px-4 py-4 first:ps-6 last:pe-6">
                    <Skeleton className="h-5 w-full max-w-32" />
                  </td>
                ))}
              </tr>
            ))}

          {!loading && users.length === 0 && (
            <tr className="border-t border-border">
              <td colSpan={columnCount} className="px-6 py-14 text-center">
                <SearchX size={32} className="mx-auto mb-3 text-muted" />
                <p className="font-medium text-heading">{t('users.empty.title')}</p>
                <p className="mt-1 text-sm text-muted">{t('users.empty.hint')}</p>
                {onClearFilters && (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-4 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    {t('users.empty.clear')}
                  </button>
                )}
              </td>
            </tr>
          )}

          {!loading &&
            users.map((u) => {
              const { icon: RoleIcon, tone } = roleMeta[u.role]
              return (
                <tr key={u.id} className="border-t border-border transition-colors hover:bg-hover/60">
                  <td className="px-4 py-3 ps-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold',
                          avatarTones[u.id % avatarTones.length]
                        )}
                      >
                        {initialsOf(u.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-heading">{u.name}</p>
                        <p className="truncate text-xs text-muted">
                          <bdi dir="ltr">{u.email}</bdi>
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2.5">
                      <span className={cn('grid size-8 shrink-0 place-items-center rounded-full', tone)}>
                        <RoleIcon size={16} />
                      </span>
                      {t(`users.roles.${u.role}`)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <Badge tone={statusTone[u.status]}>{t(`users.statuses.${u.status}`)}</Badge>
                  </td>

                  <td className="px-4 py-3 text-muted">{formatDate(u.joinedAt, lng)}</td>

                  <td className="px-4 py-3 pe-6">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(u)}
                        aria-label={`${t('users.actions.edit')}: ${u.name}`}
                        title={t('users.actions.edit')}
                        className={cn(actionBtn, 'hover:bg-hover hover:text-primary')}
                      >
                        <SquarePen size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(u)}
                        aria-label={`${t('users.actions.delete')}: ${u.name}`}
                        title={t('users.actions.delete')}
                        className={cn(actionBtn, 'hover:bg-danger/10 hover:text-danger')}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}