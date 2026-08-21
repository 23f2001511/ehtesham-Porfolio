import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  gradient?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  gradient = false
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <span className={cn("eyebrow", align === "center" && "justify-center")}>{eyebrow}</span>
      <h2
        className={cn(
          "font-display mt-4 text-balance text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          gradient ? "text-gradient-flow" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
