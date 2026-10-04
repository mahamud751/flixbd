"use client";

import type { Faq } from "@/data/content";
import { useState } from "react";

export function FaqList({ items, bilingual = false }: { items: Faq[]; bilingual?: boolean }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const expanded = open === index;
        const question = bilingual && item.questionBn ? item.questionBn : item.question;
        const answer = bilingual && item.answerBn ? item.answerBn : item.answer;
        return (
          <div key={item.question}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className={bilingual ? "font-bn text-lg" : "text-lg"}>{question}</span>
              <span className="text-gold">{expanded ? "–" : "+"}</span>
            </button>
            {expanded ? <p className={bilingual ? "font-bn pb-4 leading-7 text-muted" : "pb-4 leading-7 text-muted"}>{answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
