import { useAuth } from '@/auth/AuthContext';

export function HomePage() {
  const { logout } = useAuth();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-10">
      <header className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
            Auth
          </p>
          <h1 className="text-3xl font-semibold">Home</h1>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
        >
          Log out
        </button>
      </header>

      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h2 className="text-xl font-medium">You are signed in</h2>
        <p className="mt-3 max-w-2xl text-slate-400">
          This is the authenticated home page scaffold. Wire it up to the server
          auth API when registration and login endpoints are ready.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm text-slate-500">Server health</p>
            <p className="mt-2 font-medium">GET /api/health</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm text-slate-500">Next step</p>
            <p className="mt-2 font-medium">Add register / login routes</p>
          </div>
        </div>
      </section>
    </main>
  );
}
