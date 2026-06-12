"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useState } from "react";
import { CircleUserRound } from "lucide-react";
import { AppHeader } from "@/components/layout/appHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithGoogle, registerWithEmail } from "@/features/auth/firebaseAuthActions";
import { registerSchema, type RegisterInput } from "@/validators/auth.schema";

function firstError(errors: unknown[]) {
  return errors[0] ? String(errors[0]) : null;
}

export function RegisterView() {
  const [message, setMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    } satisfies RegisterInput,
    onSubmit: async ({ value }) => {
      const parsed = registerSchema.safeParse(value);

      if (!parsed.success) {
        setMessage("Please complete all required fields.");
        return;
      }

      try {
        await registerWithEmail(parsed.data.name, parsed.data.email, parsed.data.password);
        setMessage("Account created successfully.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not create your account.");
      }
    },
  });

  async function handleGoogleRegister() {
    setIsGoogleLoading(true);
    setMessage(null);

    try {
      await loginWithGoogle();
      setMessage("Account connected with Google.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not continue with Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center px-5 py-10">
        <form
          className="w-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <h1 className="text-2xl font-bold text-slate-950">Create account</h1>
          <div className="mt-5 grid gap-4">
            <form.Field
              name="name"
              validators={{
                onBlur: ({ value }) => {
                  const parsed = registerSchema.shape.name.safeParse(value);
                  return parsed.success ? undefined : "Name must be at least 2 characters.";
                },
              }}
            >
              {(field) => (
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Name
                  <Input
                    autoComplete="name"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    value={field.state.value}
                  />
                  {firstError(field.state.meta.errors) ? (
                    <span className="text-xs font-semibold text-red-600">{firstError(field.state.meta.errors)}</span>
                  ) : null}
                </label>
              )}
            </form.Field>
            <form.Field
              name="email"
              validators={{
                onBlur: ({ value }) => {
                  const parsed = registerSchema.shape.email.safeParse(value);
                  return parsed.success ? undefined : "Enter a valid email address.";
                },
              }}
            >
              {(field) => (
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Email
                  <Input
                    autoComplete="email"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    type="email"
                    value={field.state.value}
                  />
                  {firstError(field.state.meta.errors) ? (
                    <span className="text-xs font-semibold text-red-600">{firstError(field.state.meta.errors)}</span>
                  ) : null}
                </label>
              )}
            </form.Field>
            <form.Field
              name="password"
              validators={{
                onBlur: ({ value }) => {
                  const parsed = registerSchema.shape.password.safeParse(value);
                  return parsed.success ? undefined : "Password must be at least 6 characters.";
                },
              }}
            >
              {(field) => (
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Password
                  <Input
                    autoComplete="new-password"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    type="password"
                    value={field.state.value}
                  />
                  {firstError(field.state.meta.errors) ? (
                    <span className="text-xs font-semibold text-red-600">{firstError(field.state.meta.errors)}</span>
                  ) : null}
                </label>
              )}
            </form.Field>
          </div>
          {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
          <Button className="mt-5 w-full" type="submit">
            Create account
          </Button>
          <Button
            className="mt-3 w-full gap-2"
            disabled={isGoogleLoading}
            onClick={handleGoogleRegister}
            type="button"
            variant="secondary"
          >
            <CircleUserRound aria-hidden className="h-4 w-4" />
            {isGoogleLoading ? "Opening Google..." : "Continue with Google"}
          </Button>
          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-bold text-teal-700" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
