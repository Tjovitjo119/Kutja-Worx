import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import LoginForm from "@/components/admin/LoginForm";
import { GearIcon } from "@/components/Logo";
import { Photo } from "@/components/ui/primitives";
import { DEMO_LOGIN, authOptions, demoLoginEnabled } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect(session.user.role === "reception" ? "/admin/reception" : "/admin");
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-10">
      {/* Full-bleed car photo behind everything, darkened so the form stays readable */}
      <div className="absolute inset-0">
        <Photo src="/cars/bmw-e30-325i.webp" sizes="100vw" priority className="object-cover object-center" />
      </div>
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15),rgba(0,0,0,0.85))]" />

      <Link href="/" className="absolute left-4 top-4 z-10 flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white">
        <ChevronLeft className="h-4 w-4" /> Home
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-black/60 text-brand-red shadow-lg backdrop-blur">
          <GearIcon className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-semibold tracking-tight text-white">Log in to Kutja Worx</h1>
        <p className="mb-8 mt-2 text-center text-sm text-white/70">Staff sign in to manage the website.</p>
        <LoginForm demo={demoLoginEnabled ? DEMO_LOGIN : undefined} />
        {demoLoginEnabled && (
          <p className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Demo mode (Sanity not connected): the demo login is pre-filled. It is disabled in production and once a Sanity project is
            connected.
          </p>
        )}
        <p className="mt-8 text-center text-xs text-white/50">Authorised staff only. Need access? Ask the workshop owner.</p>
      </div>
    </main>
  );
}
