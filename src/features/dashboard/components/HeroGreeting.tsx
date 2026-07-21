export interface HeroGreetingProps {
  name: string;
  /** Preformatted date label, e.g. "Saturday · 18 July". */
  dateLabel: string;
}

/**
 * Dashboard hero text block (Dashboard.dc.html lines 119–122). Centered,
 * editorial: a letter-spaced date eyebrow in forest green, a large Canela
 * greeting with the NAME as the single italic accent, and a balanced subtitle.
 */
export function HeroGreeting({ name, dateLabel }: HeroGreetingProps) {
  return (
    <>
      <span className="inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[.28em] text-sage-900">
        {dateLabel}
      </span>
      <h1 className="m-0 font-display text-[clamp(40px,4.6vw,58px)] font-light leading-[1.08] tracking-[-.01em] text-text-primary [text-wrap:balance]">
        Welcome back, <em className="font-light italic">{name}</em>
      </h1>
      <p className="m-0 max-w-[600px] text-[15px] leading-[1.55] text-[#7B7C76] [text-wrap:balance]">
        Here&rsquo;s what&rsquo;s fresh across your projects, inspiration and notes.
      </p>
    </>
  );
}
