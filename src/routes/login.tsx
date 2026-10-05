import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-md px-4 py-16">
        <p className="text-xs tracking-[0.18em] text-primary uppercase">Sign in</p>
        <h1 className="mt-2 text-5xl">Come in as yourself.</h1>
        <p className="mt-3 text-sm text-muted">
          Continuing means you have read the <Link to="/guidelines" className="text-primary">community guidelines</Link> and the <Link to="/privacy" className="text-primary">privacy policy</Link>.
        </p>
        <div className="mt-6 space-y-3">
          {authEnabled ? (
            GROK_PROVIDERS.map((provider) => (
              <button
                key={provider.providerId}
                type="button"
                onClick={() => signIn(provider.providerId, { callbackURL: "/profile" })}
                className="h-12 w-full rounded-full border border-line bg-surface text-sm"
              >
                Continue with {provider.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
      </div>
    </Shell>
  );
}
