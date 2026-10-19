import { motion, type Variants } from "framer-motion";
import {
  MapPinIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckBadgeIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  MegaphoneIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

interface HubPageProps {
  onNavigate: (path: string) => void;
}

// Variasi animasi entrance bertingkat (stagger)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function HubPage({ onNavigate }: HubPageProps) {
  return (
    <div className="hub-page">
      <motion.header
        className="masthead"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="wrap">
          {/* Eyebrow Chip */}
          <motion.div
            variants={itemVariants}
            className="eyebrow"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatDelay: 2 }}
            >
              <SparklesIcon style={{ width: "16px", height: "16px", color: "var(--accent)" }} />
            </motion.div>
            <span>Portal Riset &amp; Intelijen Pasar Digital</span>
          </motion.div>

          {/* Headline H1 */}
          <motion.h1 variants={itemVariants}>
            <span>Pusat Riset Pasar</span>
            <span className="accent-highlight">&amp; Penentuan Harga Bisnis</span>
          </motion.h1>

          {/* Lede Paragraph */}
          <motion.p variants={itemVariants} className="lede">
            Katalog laporan komersial, struktur harga riil vendor industri teknologi di DKI Jakarta,
            analisis saluran pemasaran digital, dan panduan tolok ukur penentuan harga pembuatan website yang akurat.
          </motion.p>

          {/* Meta Chips */}
          <motion.div variants={itemVariants} className="meta" style={{ marginTop: "var(--s4)", gap: "10px 22px" }}>
            <motion.span
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <CheckBadgeIcon style={{ width: "15px", height: "15px", color: "var(--accent)" }} />
              <span>Status Portal:</span>
              <b style={{ marginLeft: "5px" }}>Aktif &amp; Terverifikasi</b>
            </motion.span>
            <motion.span
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <MapPinIcon style={{ width: "15px", height: "15px", color: "var(--accent)" }} />
              <span>Wilayah Analisis:</span>
              <b style={{ marginLeft: "5px" }}>DKI Jakarta &amp; Jabodetabek</b>
            </motion.span>
            <motion.span
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <BuildingOffice2Icon style={{ width: "15px", height: "15px", color: "var(--accent)" }} />
              <span>Kategori:</span>
              <b style={{ marginLeft: "5px" }}>B2B Technology &amp; Agencies</b>
            </motion.span>
          </motion.div>
        </div>
      </motion.header>

      <main className="wrap" style={{ paddingBottom: "var(--s18)" }}>
        <section className="section" style={{ borderBottom: "none" }}>
          {/* Header Seksi Daftar Laporan */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <div className="section__eyebrow">Laporan Tersedia (1 Laporan Aktif)</div>
            <h2>Daftar Laporan Riset Pasar Terverifikasi</h2>
            <p className="section__note">
              Pilih laporan di bawah untuk mengakses analisis komparasi vendor, data iklan Meta &amp; Google Trends,
              serta simulator penaksir harga komersial.
            </p>
          </motion.div>

          {/* Grid Laporan dengan Micro-Animation */}
          <motion.div
            className="hub-grid"
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Kartu Utama: Software House Jakarta */}
            <motion.div
              className="hub-card hub-card--featured"
              variants={cardVariants}
              whileHover={{
                y: -5,
                borderColor: "var(--accent)",
                boxShadow: "0 18px 42px rgba(188, 74, 26, 0.14)",
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="hub-card__header">
                <div className="hub-card__tags">
                  <motion.span
                    className="badge badge--accent"
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <MapPinIcon style={{ width: "13px", height: "13px" }} />
                    DKI Jakarta
                  </motion.span>
                  <motion.span
                    className="badge"
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <BuildingOffice2Icon style={{ width: "13px", height: "13px" }} />
                    B2B Software House
                  </motion.span>
                  <motion.span
                    className="badge"
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <CurrencyDollarIcon style={{ width: "13px", height: "13px" }} />
                    Harga &amp; Penawaran
                  </motion.span>
                </div>

                {/* Status Laporan dengan Micro-Pulsing Dot */}
                <span
                  className="hub-card__status"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <motion.span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "var(--accent)",
                      display: "inline-block",
                    }}
                    animate={{
                      scale: [1, 1.35, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2,
                      ease: "easeInOut",
                    }}
                  />
                  <span>Laporan Aktif 2026</span>
                </span>
              </div>

              <h3 className="hub-card__title">
                Analisis Pasar &amp; Penentuan Harga Pembuatan Website Jakarta
              </h3>

              <p className="hub-card__desc">
                Panduan praktis tolok ukur penentuan harga pembuatan website di Jakarta.
                Merangkum profil dan tarif 9 vendor terkemuka, data 143 iklan aktif Meta, volume
                pencarian Google, kalkulator penawaran tim, serta pemisahan tegas biaya pembuatan web
                dari modul iklan dan analitik.
              </p>

              {/* Metrik Unggulan dengan Micro-Interactions */}
              <div className="hub-card__metrics">
                <motion.div
                  className="hub-metric"
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span
                    className="hub-metric__val"
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <BanknotesIcon style={{ width: "16px", height: "16px", color: "var(--accent)" }} />
                    Rp15 jt – 40 jt
                  </span>
                  <span className="hub-metric__lbl">Kisaran Masuk Rata-rata</span>
                </motion.div>

                <motion.div
                  className="hub-metric"
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span
                    className="hub-metric__val"
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <MagnifyingGlassIcon style={{ width: "16px", height: "16px", color: "var(--accent)" }} />
                    12.400+ /bln
                  </span>
                  <span className="hub-metric__lbl">Pencarian Google Search</span>
                </motion.div>

                <motion.div
                  className="hub-metric"
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span
                    className="hub-metric__val"
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <BuildingStorefrontIcon style={{ width: "16px", height: "16px", color: "var(--accent)" }} />
                    9 Vendor
                  </span>
                  <span className="hub-metric__lbl">Software House Dianalisis</span>
                </motion.div>

                <motion.div
                  className="hub-metric"
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span
                    className="hub-metric__val"
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <ArrowTrendingUpIcon style={{ width: "16px", height: "16px", color: "var(--accent)" }} />
                    Rp13.800
                  </span>
                  <span className="hub-metric__lbl">Rata-rata CPC Google Ads</span>
                </motion.div>
              </div>

              {/* Footer Kartu & Tombol CTA Animasi */}
              <div className="hub-card__footer">
                <div className="hub-card__url">
                  URL: <code>/pembuatan-website-jakarta</code>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <a
                    href="/downloads/Laporan-Pasar-Pembuatan-Website-Jakarta-2026.pdf"
                    download="Laporan-Pasar-Pembuatan-Website-Jakarta-2026.pdf"
                    className="hub-card__pdf-btn"
                    title="Download Dokumen Laporan Lengkap format PDF"
                  >
                    <ArrowDownTrayIcon style={{ width: 14, height: 14 }} />
                    Download PDF
                  </a>

                  <motion.button
                  type="button"
                  className="hub-card__cta-btn"
                  onClick={() => onNavigate("/pembuatan-website-jakarta")}
                  whileHover={{ scale: 1.03, x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                  <span>Buka Laporan Lengkap</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6,
                      ease: "easeInOut",
                    }}
                    style={{ display: "inline-flex" }}
                  >
                    <ArrowRightIcon style={{ width: "16px", height: "16px" }} />
                  </motion.span>
                </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Kartu Mendatang 1: Mobile App */}
            <motion.div
              className="hub-card hub-card--upcoming"
              variants={cardVariants}
              whileHover={{
                y: -3,
                borderColor: "var(--border-strong)",
                opacity: 0.92,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="hub-card__header">
                <div className="hub-card__tags">
                  <span className="badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <DevicePhoneMobileIcon style={{ width: "13px", height: "13px" }} />
                    Mobile App
                  </span>
                  <span className="badge">Flutter &amp; React Native</span>
                </div>
                <span
                  className="hub-card__status hub-card__status--soon"
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  >
                    <ClockIcon style={{ width: "14px", height: "14px" }} />
                  </motion.div>
                  Segera Hadir
                </span>
              </div>

              <h3 className="hub-card__title" style={{ color: "var(--text-secondary)" }}>
                Analisis Pasar Jasa Pembuatan Mobile App (iOS &amp; Android) Jabodetabek
              </h3>

              <p className="hub-card__desc">
                Riset tarif pengembangan aplikasi mobile kustom, biaya maintenance server backend,
                dan estimasi timeline pengerjaan MVP startup di ekosistem Jabodetabek.
              </p>

              <div className="hub-card__footer">
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <ClockIcon style={{ width: "13px", height: "13px" }} />
                  Dalam tahap pengumpulan data vendor &amp; benchmarking
                </span>
              </div>
            </motion.div>

            {/* Kartu Mendatang 2: Digital Ads */}
            <motion.div
              className="hub-card hub-card--upcoming"
              variants={cardVariants}
              whileHover={{
                y: -3,
                borderColor: "var(--border-strong)",
                opacity: 0.92,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="hub-card__header">
                <div className="hub-card__tags">
                  <span className="badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <MegaphoneIcon style={{ width: "13px", height: "13px" }} />
                    Digital Ads
                  </span>
                  <span className="badge">Retainer Agency</span>
                </div>
                <span
                  className="hub-card__status hub-card__status--soon"
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  >
                    <ClockIcon style={{ width: "14px", height: "14px" }} />
                  </motion.div>
                  Segera Hadir
                </span>
              </div>

              <h3 className="hub-card__title" style={{ color: "var(--text-secondary)" }}>
                Standar Tarif Retainer Performance Marketing &amp; Meta Ads Management Jakarta
              </h3>

              <p className="hub-card__desc">
                Benchmark tarif bulanan pengelolaan iklan berbayar (Meta, Google, TikTok), persentase fee
                berdasarkan ad spend, dan standar pelaporan KPI konversi bisnis B2B.
              </p>

              <div className="hub-card__footer">
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <ClockIcon style={{ width: "13px", height: "13px" }} />
                  Dalam tahap survei agensi &amp; struktur penawaran
                </span>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
