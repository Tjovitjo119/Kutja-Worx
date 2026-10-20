import type { CSSProperties, ReactNode } from "react";

/**
 * Photo/colour panel with a slanted edge on md+ screens (straight edge on phones).
 * side="left"  -> the LEFT edge is cut (panel sits on the right of its section)
 * side="right" -> the RIGHT edge is cut (panel sits on the left)
 * `cut` is the horizontal size of the slant, e.g. "14%" or "120px".
 */
export default function DiagonalPanel({
  side = "left",
  cut = "14%",
  className = "",
  children,
}: {
  side?: "left" | "right";
  cut?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`${side === "left" ? "diag-left" : "diag-right"} ${className}`} style={{ "--cut": cut } as CSSProperties}>
      {children}
    </div>
  );
}
