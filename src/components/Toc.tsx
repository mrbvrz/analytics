import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  BuildingOffice2Icon,
  MegaphoneIcon,
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  CalculatorIcon,
  LightBulbIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";

export type TocItem = { id: string; label: string };

const TOC_ICONS: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  ringkasan: ChartBarIcon,
  "software-house": BuildingOffice2Icon,
  "ads-intel": MegaphoneIcon,
  "search-trends": MagnifyingGlassIcon,
  addons: WrenchScrewdriverIcon,
  kalkulator: CalculatorIcon,
  rekomendasi: LightBulbIcon,
  metode: DocumentCheckIcon,
};

/**
 * Daftar isi lengket dengan active indicator animasi framer-motion,
 * ikon Heroicons tematik, dan auto-detect posisi scroll via IntersectionObserver.
 */
export function Toc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");

  useEffect(() => {
    const handleScroll = () => {
      // Menemukan section yang sedang berada di viewport
      const scrollPos = window.scrollY + 120;
      let current = items[0]?.id || "";

      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            current = item.id;
          }
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    const target = document.getElementById(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className="toc" aria-label="Daftar isi">
      <div className="wrap">
        {items.map((it) => {
          const isActive = activeId === it.id;
          const Icon = TOC_ICONS[it.id];
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={isActive ? "active" : ""}
              onClick={(e) => handleClick(e, it.id)}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                {Icon && (
                  <Icon
                    style={{
                      width: "14px",
                      height: "14px",
                      color: isActive ? "var(--accent)" : "inherit",
                    }}
                  />
                )}
                <span>{it.label}</span>
              </span>
              {isActive && (
                <motion.span
                  layoutId="toc-active-indicator"
                  className="toc-indicator"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
