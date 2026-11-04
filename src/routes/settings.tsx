import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/lib/use-account";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Aura AI Content Studio" },
      {
        name: "description",
        content: "Manage your Aura account, profile and sign-in details.",
      },
      { property: "og:title", content: "Settings — Aura AI Content Studio" },
      { property: "og:description", content: "Manage your Aura account, profile and sign-in details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { ready, session, user, profile, refreshProfile } = useAccount();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setUsername(profile.username ?? "");
    }
  }, [profile]);

  if (!ready) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !user) {
    return (
      <>
        <PageHeader
          eyebrow="Settings"
          title="Account & profile"
          description="Sign in to keep your content, prompts and preferences with you."
        />
        <div className="surface-card mt-6 space-y-4 rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground">
            You're browsing Aura without an account. Create one to save your work across devices.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href="/auth">Sign in or create account</a>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const initials = (profile?.display_name || user.email || "A")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const cleanUsername = username.trim() || null;
      if (cleanUsername && !/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
        toast.error("Usernames can use 3–20 letters, numbers or underscores");
        return;
      }
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || null,
          username: cleanUsername,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) {
        toast.error(
          error.code === "23505" ? "That username is already taken" : "Could not save your profile",
        );
        return;
      }
      await refreshProfile();
      toast.success("Profile saved");
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (uploading) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Choose an image under 2 MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) {
        toast.error("Could not upload that image");
        return;
      }
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (updateError) {
        toast.error("Could not save your new picture");
        return;
      }
      await refreshProfile();
      toast.success("Profile picture updated");
    } finally {
      setUploading(false);
    }
  };

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      navigate({ to: "/home", replace: true });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Account & profile"
        description="Your details appear next to your work inside Aura."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <section className="surface-card flex flex-col items-center gap-4 rounded-2xl p-6 text-center">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Your profile"
              className="size-24 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-24 items-center justify-center rounded-full bg-secondary font-display text-2xl text-primary">
              {initials}
            </span>
          )}
          <div>
            <p className="font-display text-lg">
              {profile?.display_name || user.email}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadAvatar(file);
              event.target.value = "";
            }}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" strokeWidth={1.75} />
            )}
            {profile?.avatar_url ? "Change picture" : "Add picture"}
          </Button>
        </section>

        <div className="space-y-6">
          <form onSubmit={saveProfile} className="surface-card space-y-5 rounded-2xl p-6">
            <h2 className="font-display text-xl">Profile details</h2>
            <div className="space-y-2">
              <Label htmlFor="settings-name">Display name</Label>
              <Input
                id="settings-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Andile Khoza"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-username">Username</Label>
              <Input
                id="settings-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="andile_k"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                3–20 letters, numbers or underscores. Shown on your profile.
              </p>
            </div>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Save changes
            </Button>
          </form>

          <section className="surface-card space-y-4 rounded-2xl p-6">
            <div>
              <h2 className="font-display text-xl">Sign-in details</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You sign in with {user.email} and your password.
              </p>
            </div>
            <Button variant="outline" disabled={signingOut} onClick={signOut}>
              {signingOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" strokeWidth={1.75} />
              )}
              Sign out
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
