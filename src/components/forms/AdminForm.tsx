"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, Save, ShieldCheck, User } from "lucide-react";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createAdmin } from "@/actions/admins";
import {
  CREATABLE_ROLES,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  type UserRole,
} from "@/types/user";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "ADMIN" as UserRole,
};

export function AdminForm() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const result = await createAdmin({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setForm(emptyForm);
      router.push("/admins");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 md:grid-cols-3"
    >
      <div className="space-y-6 md:col-span-2">
        <Card className="space-y-5 p-5 sm:p-6">
          <Field label="Name" htmlFor="name">
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g., Jane Doe"
                className={inputWithIconClass}
                required
              />
            </div>
          </Field>

          <Field label="Email" htmlFor="email">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="email"
                type="email"
                autoComplete="off"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="jane@example.com"
                className={inputWithIconClass}
                required
              />
            </div>
          </Field>

          <Field label="Password" htmlFor="password">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="At least 8 characters"
                className={`${inputWithIconClass} pr-10`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </Field>

          <Field label="Confirm Password" htmlFor="confirmPassword">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                placeholder="Repeat the password"
                className={inputWithIconClass}
                required
              />
            </div>
          </Field>

          <Field label="Role" htmlFor="role">
            <select
              id="role"
              value={form.role}
              onChange={(e) => update("role", e.target.value as UserRole)}
              className={inputClass}
            >
              {CREATABLE_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </Field>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent-500" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Permissions
            </span>
          </div>
          <div className="space-y-2">
            {CREATABLE_ROLES.map((role) => (
              <div
                key={role}
                className={`rounded-lg border p-3 transition-colors ${
                  form.role === role
                    ? "border-accent-500/60 bg-accent-50/60 dark:border-accent-500/40 dark:bg-accent-500/10"
                    : "border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50"
                }`}
              >
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {ROLE_LABELS[role]}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {ROLE_DESCRIPTIONS[role]}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            The new admin signs in with the email and password you set here.
          </p>
        </Card>

        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Creating..." : "Create Admin"}
          </Button>
        </div>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-accent-500";

const inputWithIconClass =
  "w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-accent-500";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
