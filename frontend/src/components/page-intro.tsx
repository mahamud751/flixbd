export function PageIntro({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="mb-8 max-w-3xl">
      {eyebrow ? <p className="text-xs tracking-[0.22em] text-gold uppercase">{eyebrow}</p> : null}
      <h1 className="mt-2 font-display text-4xl leading-[0.95] tracking-tight text-balance sm:text-6xl">{title}</h1>
      {lede ? <p className="mt-4 text-lg text-muted">{lede}</p> : null}
    </header>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6">{children}</div>;
}
