export interface HeroGreetingProps {
  name: string;
}

/**
 * Dashboard hero greeting. The name is set in Canela italic (`font-display`)
 * as the single accent moment, per the typography rules in docs/DESIGN.md.
 */
export function HeroGreeting({ name }: HeroGreetingProps) {
  const hour = new Date().getHours();
  const partOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  return (
    <div className="flex flex-col gap-1">
      <span className="eyebrow text-text-tertiary">Good {partOfDay}</span>
      <h1 className="text-[36px] font-light leading-tight text-text-primary">
        Welcome back,{" "}
        <span className="font-display font-light italic text-sage-700">{name}</span>
      </h1>
    </div>
  );
}
