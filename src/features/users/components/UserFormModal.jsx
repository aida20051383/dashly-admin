import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/Modal.jsx";
import Select from "@/components/ui/Select.jsx";
import { useToast } from "@/app/ToastProvider.jsx";
import {
  useCreateUser,
  useUpdateUser,
} from "@/features/users/hooks/useUsers.js";
import { ROLES, STATUSES } from "@/features/users/api/usersApi.js";
import { cn } from "@/lib/cn.js";

const emptyForm = { name: "", email: "", role: "subscriber", status: "active" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "h-11 w-full rounded-lg border bg-transparent px-3 text-heading outline-none transition-colors focus:border-primary";

function Field({ label, error, children }) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-heading">
        {label}
      </span>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** user = null ← افزودن | user = آبجکت ← ویرایش */
export default function UserFormModal({ open, onClose, user, onSaved }) {
  const { t } = useTranslation();
  const toast = useToast();
  const isEdit = Boolean(user);

  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  const create = useCreateUser();
  const update = useUpdateUser();
  const mutation = isEdit ? update : create;

  // هر بار باز شد، فرم با مقدار درست پر بشه و خطاها پاک بشن
  useEffect(() => {
    if (!open) return;
    setForm(
      user
        ? {
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
          }
        : emptyForm,
    );
    setSubmitted(false);
    create.reset();
    update.reset();
    // reset ها ثابتن
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  const setField = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (mutation.isError) mutation.reset(); // با تغییر فرم، خطای قبلی سرور پاک بشه
  };

  const nameInvalid = form.name.trim().length < 2;
  const emailInvalid = !emailPattern.test(form.email.trim());

  const emailTaken = mutation.error?.code === "EMAIL_TAKEN";
  const genericError = mutation.isError && !emailTaken;

  const nameError =
    submitted && nameInvalid ? t("users.form.errors.name") : null;
  const emailError = emailTaken
    ? t("users.form.errors.emailTaken")
    : submitted && emailInvalid
      ? t("users.form.errors.email")
      : null;

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (nameInvalid || emailInvalid) return;

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      status: form.status,
    };
    mutation.mutate(isEdit ? { id: user.id, ...payload } : payload, {
      onSuccess: () => {
        toast.success(
          t(isEdit ? "users.toasts.updated" : "users.toasts.created"),
        );
        onSaved?.();
        onClose();
      },
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t(isEdit ? "users.form.editTitle" : "users.form.addTitle")}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label={t("users.form.name")} error={nameError}>
          <input
            autoFocus
            value={form.name}
            onChange={(e) => setField("name")(e.target.value)}
            aria-label={t("users.form.name")}
            aria-invalid={Boolean(nameError)}
            className={cn(
              inputClass,
              nameError ? "border-danger" : "border-border",
            )}
          />
        </Field>

        <Field label={t("users.form.email")} error={emailError}>
          <input
            type="email"
            dir="ltr"
            value={form.email}
            onChange={(e) => setField("email")(e.target.value)}
            aria-label={t("users.form.email")}
            aria-invalid={Boolean(emailError)}
            className={cn(
              inputClass,
              emailError ? "border-danger" : "border-border",
            )}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("users.form.role")}>
            <Select
              label={t("users.form.role")}
              value={form.role}
              onChange={setField("role")}
              options={ROLES.map((r) => ({
                value: r,
                label: t(`users.roles.${r}`),
              }))}
            />
          </Field>
          <Field label={t("users.form.status")}>
            <Select
              label={t("users.form.status")}
              value={form.status}
              onChange={setField("status")}
              options={STATUSES.map((s) => ({
                value: s,
                label: t(`users.statuses.${s}`),
              }))}
            />
          </Field>
        </div>

        {genericError && (
          <p role="alert" className="text-sm text-danger">
            {t("users.form.errors.generic")}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-hover"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            {mutation.isPending
              ? t("common.saving")
              : t(isEdit ? "users.form.save" : "users.form.create")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
