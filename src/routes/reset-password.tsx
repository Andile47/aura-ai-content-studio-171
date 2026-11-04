import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Aura AI Content Studio" },
      {
        name: "description",
        content: "Choose a new password for your Aura account.",
      },
      { property: "og:title", content: "Reset password — Aura AI Content Studio" },
      { property: "og:description", content: "Choose a new password for your Aura account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [recovery, setRecovery] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setRecovery(window.location.hash.includes("type=recovery"));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Password updated — you're signed in");
      navigate({ to: "/home", replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md py-6">
      <div className="surface-card space-y-5 rounded-3xl p-6 sm:p-8">
        <div className="text-center">
          <h1 className="text-3xl">Choose a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Set a new password for your Aura account.
          </p>
        </div>
        {recovery === false ? (
          <p className="text-center text-sm text-muted-foreground">
            This link isn't valid or has expired.{" "}
            <a href="/auth" className="text-primary underline-offset-4 hover:underline">
              Request a new one
            </a>
            .
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" />}
              Update password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
