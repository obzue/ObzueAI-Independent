import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { acceptGuidelines, askProfileAi, getMyProfile, saveProfile, type Profile } from "@/lib/market.functions";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const KINDS = [
  ["bio", "Rewrite bio"],
  ["pitch", "Release pitch"],
  ["reply", "Fan reply"],
  ["merch", "Merch copy"],
  ["check", "Guidelines check"],
  ["chat", "Ask anything"],
] as const;

function ProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const load = useServerFn(getMyProfile);
  const save = useServerFn(saveProfile);
  const accept = useServerFn(acceptGuidelines);
  const ask = useServerFn(askProfileAi);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ library: 0, following: 0 });
  const [notes, setNotes] = useState<{ id: number; kind: string; prompt: string; result: string }[]>([]);
  const [reports, setReports] = useState<{ id: number; target: string; reason: string }[]>([]);
  const [kind, setKind] = useState<(typeof KINDS)[number][0]>("bio");
  const [prompt, setPrompt] = useState("Rewrite my bio so a stranger knows what I make and why the price is fair.");
  const [answer, setAnswer] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  function refresh() {
    return load().then((res) => {
      setProfile(res.profile);
      setStats(res.stats);
      setNotes(res.notes);
      setReports(res.reports);
    });
  }

  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    void refresh().catch((err: unknown) => setNote(err instanceof Error ? err.message : "Could not load profile."));
  }, [userId]);

  if (isPending) {
    return <Shell><div className="mx-auto max-w-6xl px-4 py-16"><div className="h-10 w-48 animate-pulse rounded-full bg-line motion-safe" /></div></Shell>;
  }
  if (!user) {
    return (
      <Shell>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl">A profile, and an assistant that is only yours.</h1>
          <p className="mt-3 max-w-lg text-muted">Sign in to keep a stall, a library, and a private assistant. It does not read anyone else's notes.</p>
          <Link to="/login" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-5 text-sm text-bg">Sign in</Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_1fr]">
        <section>
          <p className="text-xs tracking-[0.18em] text-primary uppercase">Your profile</p>
          <h1 className="mt-2 text-5xl">{profile?.displayName ?? "Member"}</h1>
          <p className="mt-2 text-sm text-muted">
            {stats.library} in library · {stats.following} following
            {user.primaryEmail ? ` · ${user.primaryEmail}` : ""}
          </p>
          {profile && !profile.guidelinesAccepted ? (
            <div className="mt-4 rounded-card border border-line bg-surface p-4">
              <p className="text-sm">Read the hall rules before you sell or message.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to="/guidelines" className="inline-flex h-11 items-center rounded-full border border-line px-4 text-sm">Read guidelines</Link>
                <button
                  type="button"
                  className="h-11 rounded-full bg-ink px-4 text-sm text-bg"
                  onClick={() => {
                    void accept().then(() => refresh());
                  }}
                >
                  I agree
                </button>
              </div>
            </div>
          ) : null}
          {profile ? (
            <form
              className="mt-6 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                void save({
                  data: {
                    displayName: String(form.get("displayName") ?? ""),
                    handle: String(form.get("handle") ?? ""),
                    city: String(form.get("city") ?? ""),
                    genres: String(form.get("genres") ?? ""),
                    bio: String(form.get("bio") ?? ""),
                    statement: String(form.get("statement") ?? ""),
                    plan: String(form.get("plan") ?? "listener"),
                    aiVoice: String(form.get("aiVoice") ?? ""),
                    role: String(form.get("role") ?? "fan"),
                  },
                })
                  .then(() => {
                    setNote("Profile saved.");
                    return refresh();
                  })
                  .catch((err: unknown) => setNote(err instanceof Error ? err.message : "Could not save."));
              }}
            >
              <label className="block text-sm">Name
                <input name="displayName" defaultValue={profile.displayName} className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3" />
              </label>
              <label className="block text-sm">Handle
                <input name="handle" defaultValue={profile.handle} className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3" />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-sm">City
                  <input name="city" defaultValue={profile.city} className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3" />
                </label>
                <label className="block text-sm">Genres
                  <input name="genres" defaultValue={profile.genres} className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3" />
                </label>
              </div>
              <label className="block text-sm">Role
                <select name="role" defaultValue={profile.role} className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3">
                  <option value="fan">Fan</option>
                  <option value="artist">Artist — open a stall</option>
                </select>
              </label>
              <label className="block text-sm">Plan
                <select name="plan" defaultValue={profile.plan} className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3">
                  <option value="listener">Listener</option>
                  <option value="stall">Stall · 8% hall share</option>
                  <option value="resident">Resident · 5% hall share</option>
                </select>
              </label>
              <label className="block text-sm">Public bio
                <textarea name="bio" defaultValue={profile.bio} rows={4} className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2" />
              </label>
              <label className="block text-sm">Private statement (only your assistant sees this)
                <textarea name="statement" defaultValue={profile.statement} rows={3} className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2" />
              </label>
              <label className="block text-sm">How the assistant should sound
                <input name="aiVoice" defaultValue={profile.aiVoice} placeholder="Plain, dry, no hype" className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3" />
              </label>
              <button type="submit" className="h-11 rounded-full bg-ink px-5 text-sm text-bg">Save profile</button>
            </form>
          ) : null}
          {profile?.role === "artist" ? (
            <Link to="/artists/$handle" params={{ handle: profile.handle }} className="mt-4 inline-block text-sm text-primary">View public stall</Link>
          ) : null}
          {note ? <p className="mt-3 text-sm">{note}</p> : null}
          <h2 className="mt-8 text-2xl">Reports you filed</h2>
          <ul className="mt-2 text-sm text-muted">
            {reports.length === 0 ? <li>None yet.</li> : null}
            {reports.map((item) => (
              <li key={item.id}>{item.reason} · {item.target}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-card border border-line bg-surface p-5">
          <h2 className="text-3xl">Profile assistant</h2>
          <p className="mt-2 text-sm text-muted">
            Built for this account only. It can draft a bio, a pitch, merch copy, a fan reply, or check a caption against the hall rules. It does not post for you, and it does not see other members.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {KINDS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setKind(id)}
                className={`h-10 rounded-full px-3 text-sm ${kind === id ? "bg-primary text-on-primary" : "border border-line"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={5} className="mt-4 w-full rounded-xl border border-line px-3 py-2" />
          <button
            type="button"
            disabled={busy}
            className="mt-3 h-11 rounded-full bg-primary px-5 text-sm text-on-primary disabled:opacity-40"
            onClick={() => {
              setBusy(true);
              void ask({ data: { kind, prompt } })
                .then((res) => {
                  if (!res.ok) {
                    setAnswer(res.error);
                    return;
                  }
                  setAnswer(res.text);
                  return refresh();
                })
                .catch((err: unknown) => setAnswer(err instanceof Error ? err.message : "Assistant failed."))
                .finally(() => setBusy(false));
            }}
          >
            {busy ? "Thinking…" : "Ask your assistant"}
          </button>
          {answer ? <p className="mt-4 whitespace-pre-wrap text-sm">{answer}</p> : null}
          <h3 className="mt-8 text-xl">Notes kept on this profile</h3>
          <ul className="mt-3 space-y-3">
            {notes.length === 0 ? <li className="text-sm text-muted">Nothing saved yet.</li> : null}
            {notes.map((item) => (
              <li key={item.id} className="rounded-xl border border-line p-3">
                <p className="text-xs tracking-wide text-primary uppercase">{item.kind}</p>
                <p className="mt-1 text-sm text-muted">{item.prompt}</p>
                <p className="mt-2 text-sm whitespace-pre-wrap">{item.result}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
