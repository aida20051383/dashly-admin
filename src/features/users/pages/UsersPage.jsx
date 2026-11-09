import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/Card.jsx";
import Select from "@/components/ui/Select.jsx";
import Pagination from "@/components/ui/Pagination.jsx";
import QueryError from "@/components/ui/QueryError.jsx";
import ConfirmDialog from "@/components/ui/ConfirmDialog.jsx";
import UsersTable from "@/features/users/components/UsersTable.jsx";
import UserFormModal from "@/features/users/components/UserFormModal.jsx";
import { useDeleteUser, useUsers } from "@/features/users/hooks/useUsers.js";
import { ROLES, STATUSES } from "@/features/users/api/usersApi.js";
import { useToast } from "@/app/ToastProvider.jsx";
import { useDebouncedValue } from "@/hooks/useDebouncedValue.js";

export default function UsersPage() {
  const { t } = useTranslation();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState({ by: "joinedAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // مودال فرم: null = بسته | 'new' = افزودن | آبجکت کاربر = ویرایش
  const [formTarget, setFormTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isPending, isError, isPlaceholderData, refetch } = useUsers({
    page,
    pageSize,
    search: debouncedSearch.trim(),
    role,
    status,
    sortBy: sort.by,
    sortDir: sort.dir,
  });

  const deleteUser = useDeleteUser();

  // اگه سرور صفحه رو کم کرد (مثلاً آخرین ردیف صفحه‌ی آخر حذف شد)، state رو هم‌گام کن
  useEffect(() => {
    if (data && !isPlaceholderData && data.page !== page) setPage(data.page);
  }, [data, isPlaceholderData, page]);

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const toggleSort = (by) => {
    setSort((s) =>
      s.by === by
        ? { by, dir: s.dir === "asc" ? "desc" : "asc" }
        : { by, dir: by === "joinedAt" ? "desc" : "asc" },
    );
    setPage(1);
  };

  const hasFilters = search !== "" || role !== "all" || status !== "all";
  const clearFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
    setPage(1);
  };

  const closeDelete = () => {
    deleteUser.reset();
    setDeleteTarget(null);
  };

  const confirmDelete = () =>
    deleteUser.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(t("users.toasts.deleted"));
        closeDelete();
      },
    });

  const roleOptions = [
    { value: "all", label: t("users.filters.allRoles") },
    ...ROLES.map((r) => ({ value: r, label: t(`users.roles.${r}`) })),
  ];
  const statusOptions = [
    { value: "all", label: t("users.filters.allStatuses") },
    ...STATUSES.map((s) => ({ value: s, label: t(`users.statuses.${s}`) })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">
            {t("users.title")}
          </h1>
          <p className="mt-1 text-sm text-muted">{t("users.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setFormTarget("new")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90"
        >
          <Plus size={18} />
          {t("users.addUser")}
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-6">
          <label className="flex h-10 min-w-56 flex-1 items-center gap-2 rounded-lg border border-border px-3 text-muted focus-within:border-primary">
            <Search size={16} className="shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(e) => changeFilter(setSearch)(e.target.value)}
              placeholder={t("users.search")}
              aria-label={t("users.search")}
              className="min-w-0 flex-1 bg-transparent text-sm text-heading outline-none placeholder:text-muted"
            />
          </label>
          <Select
            label={t("users.filters.role")}
            value={role}
            onChange={changeFilter(setRole)}
            options={roleOptions}
            className="w-full sm:w-44"
          />
          <Select
            label={t("users.filters.status")}
            value={status}
            onChange={changeFilter(setStatus)}
            options={statusOptions}
            className="w-full sm:w-44"
          />
        </div>

        {isError ? (
          <div className="border-t border-border p-6">
            <QueryError onRetry={refetch} />
          </div>
        ) : (
          <>
            <UsersTable
              users={data?.items ?? []}
              loading={isPending}
              skeletonRows={Math.min(pageSize, 10)}
              sort={sort}
              onSort={toggleSort}
              onEdit={setFormTarget}
              onDelete={setDeleteTarget}
              onClearFilters={hasFilters ? clearFilters : undefined}
              dimmed={isPlaceholderData}
            />
            <Pagination
              page={data?.page ?? page}
              pageCount={data?.pageCount ?? 1}
              pageSize={pageSize}
              total={data?.total ?? 0}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        )}
      </Card>

      <UserFormModal
        open={formTarget !== null}
        user={formTarget === "new" ? null : formTarget}
        onClose={() => setFormTarget(null)}
        onSaved={() => formTarget === "new" && setPage(1)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title={t("users.delete.title")}
        message={t("users.delete.message", { name: deleteTarget?.name })}
        confirmLabel={t("users.delete.confirm")}
        loadingLabel={t("users.delete.deleting")}
        loading={deleteUser.isPending}
        error={deleteUser.isError ? t("users.delete.error") : null}
      />
    </div>
  );
}
