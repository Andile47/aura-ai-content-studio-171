import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/lib/use-account";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Aura AI Content Studio" },
      {
        name: "description",
        content: "Sign in or create an account to keep your Aura content across devices.",
      },
      { property: "og:title", content: "Sign in — Aura AI Content Studio" },
      {
        property: "og:description",
        content: "Sign in or create an account to keep your Aura content across devices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const { session, ready } = useAccount();
  const [mode, setMode] = useState<Mode>("signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  useEffect(() => {
    if (ready && session) navigate({ to: "/home", replace: true });
  }, [ready, session, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error(error.message);
          return;
        }
        navigate({ to: "/home", replace: true });
        return;
      }

      if (mode === "signup") {
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name.trim() || undefined },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        if (!data.session) {
          setConfirmationSent(true);
          return;
        }
        navigate({ to: "/home", replace: true });
        return;
      }

      // mode === "forgot"
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Reset link sent — check your email");
      setMode("signin");
    } finally {
      setBusy(false);
    }
  };

  if (confirmationSent) {
    return (
      <AuthCard>
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary">
          <Sparkles className="size-5 text-primary" strokeWidth={1.75} />
        </span>
        <h1 className="text-center text-2xl">Check your email</h1>
        <p className="text-center text-sm leading-relaxed text-muted-foreground">
          We sent a confirmation link to <span className="text-foreground">{email}</span>. Click it
          to finish creating your account.
        </p>
        <Button variant="outline" className="w-full" onClick={() => setMode("signin")}>
          Back to sign in
        </Button>
      </AuthCard>
    );
  }

  const copy: Record<Mode, { title: string; description: string; action: string }> = {
    signin: {
      title: "Welcome back",
      description: "Sign in to keep your content and prompts with you.",
      action: "Sign in",
    },
    signup: {
      title: "Create your account",
      description: "Saving your work across devices takes less than a minute.",
      action: "Create account",
    },
    forgot: {
      title: "Reset your password",
      description: "Enter your email and we'll send you a reset link.",
      action: "Send reset link",
    },
  };

  return (
    <AuthCard>
      <div className="text-center">
        <h1 className="text-3xl">{copy[mode].title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{copy[mode].description}</p>
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-full bg-secondary/60 p-1">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={
              mode === m
                ? "rounded-full bg-card px-4 py-2 text-sm font-medium shadow-sm"
                : "rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {m === "signin" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="auth-name">Your name</Label>
            <Input
              id="auth-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Andile Khoza"
              autoComplete="name"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="auth-email">Email</Label>
          <Input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        {mode !== "forgot" && (
          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>
        )}
        <Button type="submit" className="w-full" size="lg" disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          {copy[mode].action}
        </Button>
      </form>

      {mode === "signin" && (
        <button
          type="button"
          onClick={() => setMode("forgot")}
          className="text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Forgot your password?
        </button>
      )}
      {mode !== "signin" && (
        <button
          type="button"
          onClick={() => setMode("signin")}
          className="mx-auto flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" strokeWidth={1.75} />
          Back to sign in
        </button>
      )}
    </AuthCard>
  );
}

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md py-6">
      <div className="surface-card space-y-5 rounded-3xl p-6 sm:p-8">{children}</div>
    </div>
  );
}
