import Link from "next/link";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { PageHeader, Panel } from "@/components/admin/ui";
import { emailConfigured } from "@/lib/email";
import { isDemo } from "@/lib/store";
import { writeConfigured } from "@/sanity/lib/write-client";

export const dynamic = "force-dynamic";

function Row({ ok, label, hint }: { ok: boolean; label: string; hint: string }) {
  return (
    <li className="flex items-start gap-3 py-3">
      {ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" /> : <CircleAlert className="mt-0.5 h-5 w-5 text-amber-500" />}
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">{hint}</p>
      </div>
    </li>
  );
}

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" sub="System status. Change these in your hosting environment variables." />
      <Panel>
        <ul className="divide-y divide-gray-100">
          <Row
            ok={!isDemo}
            label="Sanity project connected"
            hint={
              isDemo
                ? "Not connected: running in demo mode. Set NEXT_PUBLIC_SANITY_PROJECT_ID."
                : "Content is saved to your Sanity dataset."
            }
          />
          <Row
            ok={writeConfigured}
            label="Sanity write token"
            hint={writeConfigured ? "SANITY_API_WRITE_TOKEN is set." : "Needed to save changes and upload photos."}
          />
          <Row
            ok={emailConfigured}
            label="Email notifications (Resend)"
            hint={
              emailConfigured
                ? "Inquiry emails are sent to the workshop."
                : "RESEND_API_KEY / CONTACT_TO_EMAIL not set. Inquiries are still saved here."
            }
          />
        </ul>
      </Panel>
      <p className="mt-4 text-sm text-gray-500">
        Need the raw Sanity editor?{" "}
        <Link href="/studio" className="font-medium text-brand-red hover:underline">
          Open Studio
        </Link>{" "}
        (power users only).
      </p>
    </>
  );
}
