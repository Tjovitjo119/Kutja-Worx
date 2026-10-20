"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { enquirySchema, type EnquiryInput } from "@/lib/validation";
import { btn } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-md border border-ink-line2 bg-black/50 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red";

/** Contact / vehicle-enquiry form. `endpoint` decides which inquiry source is recorded. */
export default function EnquiryForm({
  endpoint = "/api/contact",
  services,
  defaultService,
  relatedItem,
  defaultMessage,
  title = "Send Us a Message",
  button = "Send Message",
  className,
}: {
  endpoint?: string;
  services?: string[];
  defaultService?: string;
  relatedItem?: string;
  defaultMessage?: string;
  title?: string;
  button?: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { service: defaultService ?? "", message: defaultMessage ?? "", relatedItem },
  });

  async function onSubmit(values: EnquiryInput) {
    setState("idle");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, relatedItem }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Request failed");
      setState("sent");
      reset({ service: defaultService ?? "", message: "", relatedItem });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Request failed");
      setState("error");
    }
  }

  const Err = ({ m }: { m?: string }) =>
    m ? (
      <p role="alert" className="mt-1 text-xs text-brand-red">
        {m}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn("space-y-3", className)}>
      <h2 className="font-display text-xl font-bold uppercase">{title}</h2>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("website")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="sr-only" htmlFor="eq-name">
            Full name
          </label>
          <input id="eq-name" placeholder="Full name" autoComplete="name" className={field} {...register("name")} />
          <Err m={errors.name?.message} />
        </div>
        <div>
          <label className="sr-only" htmlFor="eq-phone">
            Phone number
          </label>
          <input id="eq-phone" type="tel" placeholder="Phone number" autoComplete="tel" className={field} {...register("phone")} />
          <Err m={errors.phone?.message} />
        </div>
      </div>
      <div>
        <label className="sr-only" htmlFor="eq-email">
          Email address
        </label>
        <input id="eq-email" type="email" placeholder="Email address" autoComplete="email" className={field} {...register("email")} />
        <Err m={errors.email?.message} />
      </div>
      {services && (
        <div>
          <label className="sr-only" htmlFor="eq-service">
            Select service
          </label>
          <select id="eq-service" className={field} {...register("service")}>
            <option value="">Select service</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="sr-only" htmlFor="eq-message">
          Your message
        </label>
        <textarea id="eq-message" rows={4} placeholder="Your message" className={field} {...register("message")} />
        <Err m={errors.message?.message} />
      </div>
      <button type="submit" disabled={isSubmitting} className={cn(btn("red"), "w-full disabled:opacity-60")}>
        {isSubmitting ? "Sending…" : button} <ArrowRight className="h-4 w-4" />
      </button>
      {state === "sent" && (
        <p role="status" className="text-sm text-green-400">
          Thanks! We&apos;ll get back to you shortly.
        </p>
      )}
      {state === "error" && (
        <p role="alert" className="text-sm text-brand-red">
          {err}. Please call us instead.
        </p>
      )}
    </form>
  );
}
