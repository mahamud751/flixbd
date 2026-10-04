"use client";

import { site, whatsappHref } from "@/lib/site";
import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    const text = `Hi ${site.name}, I am ${form.name.trim()} (${form.phone.trim() || "no phone"}). ${form.message.trim()}`;
    setSent(true);
    window.open(whatsappHref(text), "_blank", "noopener,noreferrer");
  }

  if (sent) {
    return (
      <p className="rounded-[1.4rem] border border-line p-6">
        WhatsApp should be open with your message. If it did not, write {site.phoneDisplay} or email {site.email}.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" className="w-full rounded-2xl border border-line bg-black/[0.04] px-4 py-3 outline-none" />
      <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Mobile" className="w-full rounded-2xl border border-line bg-black/[0.04] px-4 py-3 outline-none" />
      <textarea required rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="How can we help?" className="w-full rounded-2xl border border-line bg-black/[0.04] px-4 py-3 outline-none" />
      <button type="submit" className="rounded-full bg-ember text-white px-5 py-3 text-sm font-semibold">Send on WhatsApp</button>
    </form>
  );
}
