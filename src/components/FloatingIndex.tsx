import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  ChevronUpIcon,
  XMarkIcon,
  ChartBarIcon,
  BuildingOffice2Icon,
  MegaphoneIcon,
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  CalculatorIcon,
  LightBulbIcon,
  DocumentCheckIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ListBulletIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export interface FloatingIndexItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
}

export const REPORT_INDEX_ITEMS: FloatingIndexItem[] = [
  { id: "ringkasan", label: "01 Ringkasan Pasar", icon: ChartBarIcon },
  { id: "software-house", label: "02 Benchmark Vendor", icon: BuildingOffice2Icon },
  { id: "ads-intel", label: "03 Intel Meta & TikTok", icon: MegaphoneIcon },
  { id: "search-trends", label: "04 Tren Google & Akuisisi", icon: MagnifyingGlassIcon },
  { id: "addons", label: "05 Tarif Modul Tambahan", icon: WrenchScrewdriverIcon },
  { id: "kalkulator", label: "06 Simulator Harga", icon: CalculatorIcon },
  { id: "rekomendasi", label: "07 Rekomendasi Komersial", icon: LightBulbIcon },
  { id: "metode", label: "08 Metodologi Riset", icon: DocumentCheckIcon },
];

interface FloatingIndexProps {
  items?: FloatingIndexItem[];
  totalWords?: number;
  onNavigateHome?: () => void;
  pdfUrl?: string;
}

export function FloatingIndex({
  items = REPORT_INDEX_ITEMS,
  totalWords = 2450,
  onNavigateHome,
  pdfUrl = "/downloads/Laporan-Pasar-Pembuatan-Website-Jakarta-2026.pdf",
}: FloatingIndexProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  
  // Di desktop, saat di posisi top langsung aktifkan mode expand
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768 && window.scrollY < 80;
    }
    return false;
  });

  const [passedIds, setPassedIds] = useState<Set<string>>(new Set());
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Estimasi kecepatan baca: ~220 kata per menit
  const totalReadMinutes = Math.max(1, Math.ceil(totalWords / 220));
  const remainingMinutes = Math.max(
    1,
    Math.round(totalReadMinutes * (1 - scrollProgress / 100))
  );

  const activeIndex = items.findIndex((it) => it.id === activeId);
  const currentSectionNum = activeIndex >= 0 ? activeIndex + 1 : 1;
  const currentSectionLabel =
    items[activeIndex]?.label.replace(/^\d+\s*/, "") || "Indeks Laporan";

  // Ukuran lingkaran progress SVG mini (diameter 38px, radius 15px)
  const miniRadius = 15;
  const miniCircumference = 2 * Math.PI * miniRadius;
  const miniStrokeDashoffset =
    miniCircumference - (scrollProgress / 100) * miniCircumference;

  useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && window.scrollY < 80) {
        setIsExpanded(true);
      }
    };
    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
      setScrollProgress(progress);
      
      const atTop = scrollY < 80;
      setIsAtTop(atTop);

      // Pada desktop: ketika masuk ke posisi top, langsung expand kan
      if (window.innerWidth >= 768) {
        if (atTop && lastScrollY >= 80) {
          setIsExpanded(true);
        } else if (!atTop && lastScrollY < 80) {
          setIsExpanded(false);
        }
      }
      lastScrollY = scrollY;

      const scrollPos = scrollY + 140;
      let current = items[0]?.id || "";
      const passed = new Set<string>();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            current = item.id;
            passed.add(item.id);
          }
        }
      }

      setActiveId(current);
      setPassedIds(passed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    const target = document.getElementById(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Logika visibilitas mobile:
  // Pada desktop: selalu tampil di kanan bawah.
  // Pada mobile: default disembunyikan, dan hanya tampil jika posisi tab sudah top.
  const shouldHideOnMobile = isMobile && !isAtTop;

  return (
    <div
      className={`floating-index-root ${
        shouldHideOnMobile ? "is-mobile-hidden" : ""
      }`}
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          /* Saat expand: Floating Index Card tampil menggantikan pill mini (pill awal tidak muncul) */
          <motion.aside
            key="expanded-panel"
            className="floating-index-card"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            aria-label="Navigasi indeks laporan dan tracking"
          >
            {/* Header: Estimasi Baca & Progress Tracking */}
            <div className="floating-index-card__header">
              <div className="floating-index-card__row">
                <span className="floating-index-card__title">
                  <ListBulletIcon style={{ width: 15, height: 15, color: "var(--accent)" }} />
                  Indeks Laporan
                </span>
                <button
                  type="button"
                  className="floating-index-card__collapse-btn"
                  onClick={() => setIsExpanded(false)}
                  title="Tutup panel indeks"
                  aria-label="Tutup panel indeks"
                >
                  <XMarkIcon style={{ width: 14, height: 14 }} />
                </button>
              </div>

              {/* Bar Estimasi Baca */}
              <div className="floating-index-readtime">
                <div className="floating-index-readtime__item">
                  <ClockIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
                  <span>
                    Est. Baca: <strong>~{totalReadMinutes} Menit</strong>
                  </span>
                </div>
                <div className="floating-index-readtime__sub">
                  <span>{remainingMinutes} mnt tersisa</span>
                  <span>·</span>
                  <span>{Math.round(scrollProgress)}% selesai</span>
                </div>
              </div>

              {/* Progress Bar Visual */}
              <div className="floating-progress-track">
                <div
                  className="floating-progress-bar"
                  style={{ width: `${Math.round(scrollProgress)}%` }}
                />
              </div>

              {/* Indikator Bagian Saat Ini (Tanpa kata Seksi) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className="floating-current-badge">
                  {currentSectionNum} dari {items.length} bagian
                </span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--accent)" }}>
                  {Math.round(scrollProgress)}%
                </span>
              </div>
            </div>

            {/* List Menu Navigasi Seksi */}
            <nav className="floating-index-nav">
              <ul className="floating-index-list">
                {items.map((it) => {
                  const isActive = activeId === it.id;
                  const isPassed = passedIds.has(it.id) && !isActive;
                  const Icon = it.icon;

                  return (
                    <li key={it.id}>
                      <button
                        type="button"
                        className={`floating-index-item ${isActive ? "is-active" : ""} ${
                          isPassed ? "is-passed" : ""
                        }`}
                        onClick={() => {
                          scrollToSection(it.id);
                          if (isMobile) setIsExpanded(false);
                        }}
                      >
                        <div className="floating-index-item__icon-wrap">
                          {isPassed ? (
                            <CheckCircleIcon
                              style={{ width: 14, height: 14, color: "var(--accent)" }}
                            />
                          ) : (
                            <Icon
                              style={{
                                width: 14,
                                height: 14,
                                color: isActive ? "var(--accent)" : "currentColor",
                              }}
                            />
                          )}
                        </div>

                        <span className="floating-index-item__label">{it.label}</span>

                        {isActive && (
                          <motion.span
                            layoutId="floating-active-indicator"
                            className="floating-item-indicator"
                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer Action Buttons */}
            <div className="floating-index-card__footer">
              <a
                href={pdfUrl}
                download="Laporan-Pasar-Pembuatan-Website-Jakarta-2026.pdf"
                className="floating-footer-btn"
                title="Download laporan lengkap format PDF"
              >
                <ArrowDownTrayIcon style={{ width: 13, height: 13, color: "var(--accent)" }} />
                <span>PDF</span>
              </a>

              <button
                type="button"
                className="floating-footer-btn"
                onClick={scrollToTop}
                title="Gulir ke awal dokumen"
              >
                <ChevronUpIcon style={{ width: 13, height: 13 }} />
                <span>Ke Atas</span>
              </button>

              {onNavigateHome && (
                <button
                  type="button"
                  className="floating-footer-btn"
                  onClick={onNavigateHome}
                  title="Kembali ke portal katalog riset"
                >
                  <ArrowLeftIcon style={{ width: 13, height: 13 }} />
                  <span>Hub</span>
                </button>
              )}
            </div>
          </motion.aside>
        ) : (
          /* Saat sembunyi / collapsed: Mini Floating Pill dengan lebar stabil & transisi halus */
          <motion.button
            key="collapsed-pill"
            type="button"
            className="floating-mini-pill"
            onClick={() => setIsExpanded(true)}
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            whileHover={{ scale: 1.025, y: -2 }}
            whileTap={{ scale: 0.975 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            title={`Indeks & Tracking Laporan (~${remainingMinutes} mnt tersisa, ${Math.round(scrollProgress)}% selesai)`}
            aria-label={`Buka indeks laporan, sisa ${remainingMinutes} menit baca, ${Math.round(scrollProgress)}% selesai`}
          >
            {/* Lingkaran Progress SVG Mini dengan Persentase Ukuran Lebih Kecil */}
            <div className="floating-circle-indicator">
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "rotate(-90deg)",
                  pointerEvents: "none",
                }}
              >
                {/* Latar Belakang Track Lingkaran */}
                <circle
                  cx="19"
                  cy="19"
                  r={miniRadius}
                  fill="none"
                  stroke="var(--surface-sunken)"
                  strokeWidth="2.5"
                />
                {/* Progres Terisi */}
                <circle
                  cx="19"
                  cy="19"
                  r={miniRadius}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={miniCircumference}
                  strokeDashoffset={miniStrokeDashoffset}
                  style={{
                    transition: "stroke-dashoffset 0.15s ease-out",
                  }}
                />
              </svg>

              {/* Persentase di Dalam Lingkaran dengan Ukuran Lebih Kecil */}
              <span className="floating-circle-indicator__percent">
                {Math.round(scrollProgress)}%
              </span>
            </div>

            {/* Konten Detail Waktu Baca & Bagian Aktif dengan Lebar Terkunci & Crossfade Halus */}
            <div className="floating-mini-pill__content">
              <div className="floating-mini-pill__tag">
                <ClockIcon style={{ width: 12, height: 12, color: "var(--accent)" }} />
                <span>~{remainingMinutes} mnt tersisa</span>
              </div>
              <div className="floating-mini-pill__num-wrap">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentSectionNum}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="floating-mini-pill__num"
                  >
                    {currentSectionNum}/{items.length} · {currentSectionLabel}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Ikon Panah Mengindikasikan Bisa Dibuka */}
            <ChevronUpIcon
              style={{
                width: 14,
                height: 14,
                color: "var(--text-muted)",
                flexShrink: 0,
                marginLeft: "auto",
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
