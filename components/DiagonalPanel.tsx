import type { ReactNode } from "react";

/**
 * Photo/colour panel with a slanted edge (md and up; straight edge on phones).
 * side="left"  -> the LEFT edge is cut (use for panels sitting on the right)
 * side="right" -> the RIGHT edge is cut (use for panels sitting on the left)
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
    <div
      className={`diag ${side === "left" ? "diag-left" : "diag-right"} ${className}`}
      style={{ ["--cut" as string]: cut }}
    >
      {children}
    </div>
  );
}
