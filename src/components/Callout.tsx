import type { ReactNode } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

/**
 * Sorotan untuk temuan atau peringatan.
 * `quiet` dipakai untuk catatan metodologis, bukan untuk temuan.
 */
export function Callout({
  children,
  quiet = false,
  icon: IconComponent = InformationCircleIcon,
}: {
  children: ReactNode;
  quiet?: boolean;
  icon?: React.ComponentType<{ style?: React.CSSProperties }> | null;
}) {
  return (
    <div className={`callout${quiet ? " callout--quiet" : ""}`}>
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        {IconComponent && (
          <div
            style={{
              background: quiet ? "var(--surface-sunken)" : "rgba(188, 74, 26, 0.1)",
              color: quiet ? "var(--text-muted)" : "var(--accent)",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "2px",
            }}
          >
            <IconComponent style={{ width: 18, height: 18 }} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}
