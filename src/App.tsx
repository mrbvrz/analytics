import { useState, useEffect } from "react";
import { report } from "./data/report";
import { n, rp, tanggal } from "./lib/format";

import { motion } from "framer-motion";
import { Toc, type TocItem } from "./components/Toc";
import { Section } from "./components/Section";
import { Stat, StatGrid } from "./components/Stat";
import { DataTable, type Column } from "./components/DataTable";
import { Callout } from "./components/Callout";
import { PricingCalculator } from "./components/PricingCalculator";
import { AmbientBackground } from "./components/AmbientBackground";
import { FloatingIndex } from "./components/FloatingIndex";
import { ScrollIndicator } from "./components/ScrollIndicator";
import { HubPage } from "./pages/HubPage";

import { CategoryBars } from "./charts/CategoryBars";
import { PriceAreaChart } from "./charts/PriceAreaChart";
import type {
  SoftwareHouse,
  MarketingAddon,
  KeywordTrend,
  AcquisitionChannel,
} from "./data/report.types";

import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  MegaphoneIcon,
  MagnifyingGlassIcon,
  VideoCameraIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  BuildingOfficeIcon,
  ShoppingBagIcon,
  ServerStackIcon,
  CalculatorIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  TagIcon,
  SquaresPlusIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ShareIcon,
  ReceiptPercentIcon,
  ClockIcon,
  CursorArrowRaysIcon,
  CheckIcon,
  CodeBracketIcon,
  CpuChipIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const { meta, softwareHouses, marketingAddons, metaAdsAnalysis, searchIntelligence } = report;

const TOC: TocItem[] = [
  { id: "ringkasan", label: "01 Ringkasan" },
  { id: "software-house", label: "02 Software House Jakarta" },
  { id: "ads-intel", label: "03 Intel Iklan Meta & TikTok" },
  { id: "search-trends", label: "04 Tren Google & Akuisisi" },
  { id: "addons", label: "05 Tarif Layanan Tambahan" },
  { id: "kalkulator", label: "06 Alat Penakar Harga" },
  { id: "rekomendasi", label: "07 Rekomendasi Jasa & Harga" },
  { id: "metode", label: "08 Metodologi" },
];

/* ── Definisi Kolom Tabel ────────────────────────────────────────────────── */

const shCols: Column<SoftwareHouse>[] = [
  {
    key: "name",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <BuildingOffice2Icon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Perusahaan (Software House)
      </span>
    ),
    strong: true,
    render: (r) => (
      <div>
        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{r.name}</div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          {r.location} · Est. {r.established}
        </div>
      </div>
    ),
  },
  {
    key: "services",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <CodeBracketIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Layanan Unggulan & Tech Stack
      </span>
    ),
    render: (r) => (
      <div>
        <div style={{ fontSize: "12.5px" }}>{r.services}</div>
        <div style={{ fontSize: "11px", color: "var(--text-accent)", marginTop: "2px" }}>
          {r.techStack}
        </div>
      </div>
    ),
  },
  {
    key: "typicalClient",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <UserGroupIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Target Klien
      </span>
    ),
    render: (r) => r.typicalClient,
  },
  {
    key: "priceRange",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <BanknotesIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Kisaran Tarif Web Murni
      </span>
    ),
    num: true,
    strong: true,
    render: (r) => <span style={{ color: "var(--accent)" }}>{r.priceRange}</span>,
  },
];

const addonCols: Column<MarketingAddon>[] = [
  {
    key: "category",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <TagIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Kategori Layanan
      </span>
    ),
    strong: true,
    render: (r) => r.category,
  },
  {
    key: "name",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <SquaresPlusIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Nama Modul / Add-on
      </span>
    ),
    render: (r) => r.name,
  },
  {
    key: "rate",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <CurrencyDollarIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Standar Tarif Terpisah
      </span>
    ),
    num: true,
    strong: true,
    render: (r) => <span style={{ color: "var(--accent)" }}>{r.rate}</span>,
  },
  {
    key: "deliverables",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <ClipboardDocumentCheckIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Cakupan Output / Deliverable
      </span>
    ),
    render: (r) => r.deliverables,
  },
];

const keywordCols: Column<KeywordTrend>[] = [
  {
    key: "keyword",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <MagnifyingGlassIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Kata Kunci Pencarian (Google)
      </span>
    ),
    strong: true,
    render: (r) => (
      <div>
        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{r.keyword}</div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Intent: {r.intent}</div>
      </div>
    ),
  },
  {
    key: "monthlyVolume",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <ChartBarIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Volume / Bln (Jabodetabek)
      </span>
    ),
    num: true,
    strong: true,
    render: (r) => n(r.monthlyVolume),
  },
  {
    key: "cpcEstimasi",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <CurrencyDollarIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Est. CPC Google Ads
      </span>
    ),
    num: true,
    render: (r) => rp(r.cpcEstimasi),
  },
  {
    key: "competition",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <FireIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Tingkat Persaingan
      </span>
    ),
    render: (r) => {
      const isHigh = r.competition.includes("Tinggi");
      return (
        <span
          style={{
            fontSize: "11.5px",
            padding: "2px 7px",
            borderRadius: "4px",
            background: isHigh ? "rgba(188, 74, 26, 0.08)" : "var(--surface-sunken)",
            color: isHigh ? "var(--accent)" : "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {r.competition}
        </span>
      );
    },
  },
  {
    key: "growthPct",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <ArrowTrendingUpIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Tren YoY
      </span>
    ),
    num: true,
    render: (r) => <span style={{ color: "var(--text-accent)", fontWeight: 550 }}>+{r.growthPct}%</span>,
  },
];

const channelCols: Column<AcquisitionChannel>[] = [
  {
    key: "channel",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <ShareIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Saluran Akuisisi Klien
      </span>
    ),
    strong: true,
    render: (r) => (
      <div>
        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{r.channel}</div>
        <div style={{ fontSize: "11.5px", color: "var(--text-accent)", marginTop: "2px" }}>
          {r.recommendation}
        </div>
      </div>
    ),
  },
  {
    key: "leadQuality",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <SparklesIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Kualitas Lead
      </span>
    ),
    render: (r) => r.leadQuality,
  },
  {
    key: "cacEstimate",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <ReceiptPercentIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Estimasi Biaya Akuisisi (CAC)
      </span>
    ),
    num: true,
    render: (r) => r.cacEstimate,
  },
  {
    key: "salesCycle",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <ClockIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Siklus Closing
      </span>
    ),
    num: true,
    render: (r) => r.salesCycle,
  },
  {
    key: "averageDealSize",
    header: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <BanknotesIcon style={{ width: 14, height: 14, color: "var(--accent)" }} />
        Rata-rata Nilai Proyek
      </span>
    ),
    num: true,
    strong: true,
    render: (r) => <span style={{ color: "var(--accent)" }}>{r.averageDealSize}</span>,
  },
];

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p === "/software-house-jakarta") {
        window.history.replaceState({}, "", "/pembuatan-website-jakarta");
        return "/pembuatan-website-jakarta";
      }
      return p || "/";
    }
    return "/";
  });

  useEffect(() => {
    const onPopState = () => {
      const p = window.location.pathname;
      if (p === "/software-house-jakarta") {
        window.history.replaceState({}, "", "/pembuatan-website-jakarta");
        setCurrentPath("/pembuatan-website-jakarta");
      } else {
        setCurrentPath(p || "/");
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isHub = currentPath === "/" || currentPath === "";

  return (
    <>
      {/* Indikator scroll kustom: bar atas beranimasi spring + tombol melayang */}
      <ScrollIndicator />

      {/* Efek aksen blurred ambient background */}
      <AmbientBackground />

      {isHub ? (
        <HubPage onNavigate={navigate} />
      ) : (
        <div className="report-page">
          {/* Indexing Floating di sebelah kiri dengan tracking & estimasi baca */}
          <FloatingIndex onNavigateHome={() => navigate("/")} />

          {/* Top Bar Navigasi Kembali ke Hub */}
          <div className="report-nav-bar">
            <div className="wrap">
              <button
                type="button"
                className="back-btn"
                onClick={() => navigate("/")}
              >
                <ArrowLeftIcon style={{ width: 16, height: 16, marginRight: 6 }} />
                Kembali ke Portal Katalog Laporan
              </button>
              <span className="report-current-url">
                Lokasi: <code>/pembuatan-website-jakarta</code>
              </span>
            </div>
          </div>

          <motion.header
            className="masthead"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="wrap">
              <div className="eyebrow">Intelijen Pasar · Pembuatan Website &amp; Ads DKI Jakarta</div>
              <h1>
                <span>Analisis Pasar &amp; Penentuan Harga</span>
                <span className="accent-highlight">Pembuatan Website Jakarta</span>
              </h1>
              <p className="lede">
                Panduan komersial tolok ukur penentuan harga pembuatan website di Jakarta: mencakup
                profil dan tarif riil 9 vendor perangkat lunak terkemuka, pola penawaran iklan Meta (Instagram &amp;
                Facebook) serta TikTok, intelijen volume pencarian Google Trends &amp; CPC Ads, kalkulator simulasi harga proyek,
                dan pemisahan tegas antara biaya pembuatan web murni versus layanan tambahan iklan &amp; tracking.
              </p>

              <motion.div
                style={{
                  marginTop: "var(--s4)",
                  padding: "var(--s3) var(--s4)",
                  background: "rgba(188, 74, 26, 0.08)",
                  border: "1px solid var(--accent)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  color: "var(--text-primary)",
                  backdropFilter: "blur(6px)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <ExclamationTriangleIcon
                  style={{ width: 20, height: 20, color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}
                />
                <div>
                  <strong>Ketentuan Penting Penetapan Harga:</strong> Seluruh harga pembuatan website di
                  laporan ini adalah <strong>BIAYA MURNI PENGEMBANGAN WEBSITE</strong> (desain UI/UX Figma,
                  koding front-end/back-end, CMS, pengujian QA, dan peluncuran). Harga{" "}
                  <strong>BELUM TERMASUK</strong> penerapan ads Meta/TikTok (ad spend), instalasi Pixel/CAPI,
                  dan WhatsApp API, yang wajib ditagihkan terpisah sebagai modul tambahan (add-on).
                </div>
              </motion.div>

              <div className="meta" style={{ marginTop: "var(--s4)", gap: "10px 22px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <CalendarDaysIcon style={{ width: 15, height: 15, color: "var(--accent)", flexShrink: 0 }} />
                  <span>Pembaruan Data:</span>
                  <b style={{ marginLeft: "5px" }}>{tanggal(meta.generated)}</b>
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <MapPinIcon style={{ width: 15, height: 15, color: "var(--accent)", flexShrink: 0 }} />
                  <span>Cakupan:</span>
                  <b style={{ marginLeft: "5px" }}>DKI Jakarta &amp; Jabodetabek</b>
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <BuildingOffice2Icon style={{ width: 15, height: 15, color: "var(--accent)", flexShrink: 0 }} />
                  <span>Vendor Dianalisis:</span>
                  <b style={{ marginLeft: "5px" }}>{n(softwareHouses.length)} Software House B2B</b>
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <MegaphoneIcon style={{ width: 15, height: 15, color: "var(--accent)", flexShrink: 0 }} />
                  <span>Sampel Iklan Aktif:</span>
                  <b style={{ marginLeft: "5px" }}>{n(metaAdsAnalysis.totalAdsSampled)} Iklan Meta (IG/FB)</b>
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <MagnifyingGlassIcon style={{ width: 15, height: 15, color: "var(--accent)", flexShrink: 0 }} />
                  <span>Volume Pencarian:</span>
                  <b style={{ marginLeft: "5px" }}>{n(searchIntelligence.totalMonthlyVolumeJabodetabek)}+ /bln di Google</b>
                </span>
              </div>
            </div>
          </motion.header>

          <Toc items={TOC} />

          <main className="wrap">
            {/* ── 01 RINGKASAN ────────────────────────────────────────────── */}
            <Section
              id="ringkasan"
              eyebrow="01 — Ringkasan Pasar"
              title="Struktur Harga Pembuatan Website di Jakarta: Bergerak di Atas Rp15 Juta"
              note={
                <>
                  Di DKI Jakarta, tolok ukur harga pembuatan website profesional berfokus
                  pada nilai tambah bisnis (*business outcome*), stabilitas arsitektur kode, kepatuhan keamanan
                  data, dan akuntabilitas hasil komersial klien.
                </>
              }
            >
              <StatGrid>
                <Stat
                  value="Rp15 jt – 40 jt"
                  icon={BanknotesIcon}
                  label={
                    <>
                      kisaran masuk rata-rata
                      <br />
                      software house Jakarta
                    </>
                  }
                />
                <Stat
                  value="Rp30 jt – 150 jt"
                  icon={CodeBracketIcon}
                  label={
                    <>
                      proyek custom engineering
                      <br />
                      (Next.js / Laravel / SaaS)
                    </>
                  }
                />
                <Stat
                  value={n(metaAdsAnalysis.totalAdsSampled)}
                  icon={MegaphoneIcon}
                  label={
                    <>
                      iklan jasa web aktif
                      <br />
                      di Meta (IG &amp; FB)
                    </>
                  }
                />
                <Stat
                  value={n(searchIntelligence.totalMonthlyVolumeJabodetabek) + "+"}
                  icon={MagnifyingGlassIcon}
                  label={
                    <>
                      pencarian Google / bulan
                      <br />
                      jasa web di Jabodetabek
                    </>
                  }
                />
              </StatGrid>
              <StatGrid>
                <Stat
                  value="50% : 30% : 20%"
                  icon={ShieldCheckIcon}
                  label={
                    <>
                      skema termin aman
                      <br />
                      DP - Demo - Pelunasan
                    </>
                  }
                />
                <Stat
                  value="40% – 50%"
                  icon={ArrowTrendingUpIcon}
                  label={
                    <>
                      margin kotor target
                      <br />
                      software house sehat
                    </>
                  }
                />
                <Stat
                  value={rp(searchIntelligence.averageCpc)}
                  icon={CursorArrowRaysIcon}
                  label={
                    <>
                      rata-rata CPC Google Ads
                      <br />
                      kata kunci pembuatan web
                    </>
                  }
                />
                <Stat
                  value="68%"
                  icon={ChatBubbleLeftRightIcon}
                  label={
                    <>
                      konversi prospek digital
                      <br />
                      diarahkan ke WhatsApp
                    </>
                  }
                />
              </StatGrid>

              <Callout>
                <strong>Insight Kunci Penentuan Harga Pembuatan Website:</strong> Klien bisnis dan korporat
                di DKI Jakarta bersedia membayar premium untuk <strong>kepercayaan, kustomisasi fungsional, arsitektur kode bersih,
                dan respon tim yang sigap</strong>. Titik penetapan harga optimal berada di kisaran{" "}
                <strong>Rp6,5 juta – Rp25 juta</strong> untuk proyek web komersial standar guna menjaga margin profit yang sehat sekaligus memenangkan persaingan penawaran.
              </Callout>
            </Section>

            {/* ── 02 DAFTAR SOFTWARE HOUSE JAKARTA ─────────────────────────── */}
            <Section
              id="software-house"
              eyebrow="02 — Benchmark Kompetitor"
              title="Daftar Software House &amp; Agensi Web di DKI Jakarta"
              note={
                <>
                  Berikut profil 9 vendor perangkat lunak dan agensi digital terverifikasi di wilayah
                  Jakarta, mencakup spesialisasi teknologi, target klien, dan estimasi nilai proyek
                  pembuatan website murni.
                </>
              }
            >
              <DataTable columns={shCols} rows={softwareHouses} zebra />

              <Callout>
                <strong>Analisis Posisi Pasar Kompetitor:</strong>
                <ul style={{ margin: "8px 0 0", paddingLeft: "20px" }}>
                  <li>
                    <strong>Suitmedia, Sagara Technology, dan CODE.ID</strong> menguasai lapis atas
                    (enterprise) dengan nilai kontrak Rp50 juta hingga Rp350 juta+, melayani korporasi besar
                    dan BUMN yang menuntut integrasi ERP dan SLA ketat.
                  </li>
                  <li>
                    <strong>Alba Tech dan Tonjoo</strong> memimpin di segmen custom development dan portal
                    berita/edukasi skala besar (Rp15 jt – Rp150 jt) dengan keunggulan teknis mendalam di
                    arsitektur Next.js, Laravel, dan WordPress Core.
                  </li>
                  <li>
                    <strong>ToffeeDev dan Whello Indonesia</strong> mendominasi segmen bisnis menengah dan
                    brand komersial (Rp8 jt – Rp65 jt) dengan pendekatan <em>high-conversion website</em>{" "}
                    yang dioptimalkan untuk kecepatan dan perolehan prospek (leads).
                  </li>
                </ul>
              </Callout>
            </Section>

            {/* ── 03 INTEL IKLAN META & TIKTOK ─────────────────────────────── */}
            <Section
              id="ads-intel"
              eyebrow="03 — Saluran Pemasaran Digital"
              title="Analisis Data Iklan Meta (Instagram &amp; FB) &amp; TikTok Ads"
              note={
                <>
                  Hasil penarikan live data dari Meta Ad Library (143 iklan aktif di Indonesia) dan riset
                  funnel TikTok Ads untuk jasa pembuatan website.
                </>
              }
            >
              <div className="columns">
                <div>
                  <CategoryBars
                    data={metaAdsAnalysis.topCtas.map((c) => ({ label: c.label, count: c.count }))}
                    title="Tombol Aksi (CTA) Paling Banyak Digunakan di Iklan Meta"
                    unit=" iklan"
                    yWidth={180}
                  />
                </div>
                <div>
                  <div
                    style={{
                      background: "var(--surface-raised)",
                      border: "1px solid var(--border-default)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--s4)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "var(--s2)" }}>
                      Dua Kutub Strategi Pesan Iklan di Meta
                    </h4>
                    <div style={{ marginBottom: "var(--s3)" }}>
                      <div style={{ fontWeight: 600, fontSize: "12.5px", color: "var(--accent)" }}>
                        1. Kutub Agensi Murah / Template Beli-Putus (Rp249 rb – Rp700 rb)
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        <em>&ldquo;Bikin website bisnis cuma 249rb, gratis domain 1 tahun, email bisnis, WhatsApp tombol.&rdquo;</em>
                        <br />
                        Menyasar UMKM mikro pemula yang hanya butuh kartu nama online; tanpa custom code.
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "12.5px", color: "var(--accent)" }}>
                        2. Kutub Software House &amp; Agensi Konsultatif (Rp5 jt – Rp35 jt)
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        <em>&ldquo;Stop pakai template murah abal-abal yang bikin iklan boncos karena website lemot. Bangun website yang paham alur bisnis Anda.&rdquo;</em>
                        <br />
                        Menyasar pemilik bisnis yang frustrasi karena website lamanya tidak menghasilkan konversi.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="subhead">Strategi Funnel TikTok Ads untuk Software House</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "var(--s3)",
                }}
              >
                <div
                  style={{
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--s3)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <VideoCameraIcon style={{ width: 18, height: 18, color: "var(--accent)" }} />
                    <strong style={{ fontSize: "13px" }}>1. Format Konten: Hook UGC 0–3 Detik</strong>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.4" }}>
                    Gunakan gaya video founder: <em>&ldquo;Kenapa iklan lu boncos padahal viewers ribuan? Nih cek, website lu butuh 5 detik buat kebuka!&rdquo;</em>
                  </span>
                </div>
                <div
                  style={{
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--s3)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <BoltIcon style={{ width: 18, height: 18, color: "var(--accent)" }} />
                    <strong style={{ fontSize: "13px" }}>2. Syarat Teknis: Load Time &lt; 2 Detik</strong>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.4" }}>
                    Pengguna TikTok memiliki bounce-rate tertinggi. Website yang dibuat software house wajib
                    dioptimalkan (Next.js SSR atau caching super cepat).
                  </span>
                </div>
                <div
                  style={{
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--s3)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <ChatBubbleLeftRightIcon style={{ width: 18, height: 18, color: "var(--accent)" }} />
                    <strong style={{ fontSize: "13px" }}>3. Lead Routing Langsung ke WhatsApp</strong>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.4" }}>
                    68% iklan digital di Indonesia mengarahkan prospek langsung ke chat WhatsApp interaktif
                    untuk konsultasi instan dan pembuatan proposal penawaran (quotation).
                  </span>
                </div>
              </div>
            </Section>

            {/* ── 04 TREN GOOGLE & AKUISISI KLIEN ─────────────────────────── */}
            <Section
              id="search-trends"
              eyebrow="04 — Tren Mesin Pencari &amp; Saluran Akuisisi"
              title="Intel Tren Pencarian Google &amp; Saluran Akuisisi Klien di Jakarta"
              note={
                <>
                  Data penelusuran Google Search untuk kata kunci komersial jasa website di wilayah DKI
                  Jakarta dan Jabodetabek, estimasi biaya iklan Google Ads (CPC), pola musim pencarian,
                  serta matriks efektivitas saluran akuisisi penawaran proyek website.
                </>
              }
            >
              <DataTable columns={keywordCols} rows={searchIntelligence.keywords} zebra />

              <h3 className="subhead">Pola Musim Permintaan Website di Jakarta (Google Trends Seasonality)</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "var(--s3)",
                  marginBottom: "var(--s4)",
                }}
              >
                {searchIntelligence.seasonality.map((s) => (
                  <div
                    key={s.period}
                    style={{
                      background: "var(--surface-raised)",
                      border: "1px solid var(--border-default)",
                      borderRadius: "var(--radius-sm)",
                      padding: "var(--s3)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <CalendarDaysIcon style={{ width: 15, height: 15, color: "var(--accent)" }} />
                        <strong style={{ fontSize: "13px" }}>{s.period}</strong>
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: s.index >= 115 ? "var(--accent)" : "var(--text-muted)",
                          background: s.index >= 115 ? "rgba(188, 74, 26, 0.08)" : "var(--surface-sunken)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        Indeks {s.index}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "6px 0 0", lineHeight: "1.4" }}>
                      {s.reason}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="subhead">Matriks Evaluasi Saluran Akuisisi Klien (Customer Acquisition Decision Matrix)</h3>
              <DataTable columns={channelCols} rows={searchIntelligence.channels} zebra />

              <h3 className="subhead">Tren Adopsi Teknologi (Tech Stack) yang Paling Dicari Klien Jakarta</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "var(--s3)",
                }}
              >
                {searchIntelligence.techStackTrends.map((t) => (
                  <div
                    key={t.name}
                    style={{
                      background: "var(--surface-sunken)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: "var(--radius-sm)",
                      padding: "var(--s3)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <CpuChipIcon style={{ width: 15, height: 15, color: "var(--accent)" }} />
                        <strong style={{ fontSize: "13px" }}>{t.name}</strong>
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>
                        {t.adoptionPct}% Adopsi
                      </span>
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Fungsi: {t.useCase}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "4px", fontStyle: "italic" }}>
                      &ldquo;{t.clientPerception}&rdquo;
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 05 TARIF LAYANAN TAMBAHAN (ADS & TRACKING) ────────────────── */}
            <Section
              id="addons"
              eyebrow="05 — Layanan Tambahan Terpisah"
              title="Standar Tarif Layanan Tambahan (Ads, Pixel &amp; WhatsApp)"
              note={
                <>
                  Sebagai software house profesional, pastikan Anda memisahkan kontrak kerja pembuatan
                  website dari modul pemasaran digital. Klien wajib memahami bahwa rekayasa website
                  berbeda dengan biaya iklan dan integrasi analitik.
                </>
              }
            >
              <DataTable columns={addonCols} rows={marketingAddons} zebra />

              <Callout>
                <strong>Cara Menjelaskan ke Klien:</strong> Ketika klien bertanya,{" "}
                <em>&ldquo;Apakah harga Rp15 juta ini sudah termasuk iklan di Instagram dan Facebook?&rdquo;</em>,
                berikan penjelasan standar industri:{" "}
                <em>
                  &ldquo;Harga Rp15 juta adalah investasi murni untuk pembangunan aset digital Anda (desain
                  eksklusif, sistem kode, CMS, keamanan server, dan hak cipta penuh). Untuk menjalankan
                  iklan berbayar, Meta dan TikTok mengenakan biaya terpisah (ad spend), dan tim kami
                  menyediakan modul setup server-side Pixel/CAPI serta manajemen kampanye bulanan secara
                  terpisah agar laporan kinerja iklan Anda transparan dan akuntabel.&rdquo;
                </em>
              </Callout>
            </Section>

            {/* ── 06 ALAT PENAKAR HARGA PROYEK ─────────────────────────────── */}
            <Section
              id="kalkulator"
              eyebrow="06 — Simulator Penetapan Harga"
              title="Kalkulator Simulasi Harga Pembuatan Website Jakarta"
              note={
                <>
                  Gunakan simulator interaktif di bawah untuk menyusun estimasi penawaran (*quotation*)
                  klien berbasis alokasi hari kerja tim. Simulator menghitung harga pokok pembuatan web murni
                  dan memungkinkan Anda menambahkan modul ads &amp; tracking secara transparan.
                </>
              }
            >
              <PricingCalculator />
            </Section>

            {/* ── 07 REKOMENDASI JASA & HARGA ──────────────────────────────── */}
            <Section
              id="rekomendasi"
              eyebrow="07 — Rekomendasi Komersial"
              title="Rekomendasi Paket Layanan, Penerapan Harga, dan Area Chart"
              note={
                <>
                  Strategi praktis penentuan harga pembuatan website di DKI Jakarta: struktur paket layanan yang
                  terbukti diminati pasar, penetapan harga psikologis yang sehat, dan kurva spektrum harga area chart.
                </>
              }
            >
              {/* AREA CHART */}
              <PriceAreaChart
                title="Kurva Spektrum Harga Pembuatan Website di DKI Jakarta"
                note="Membandingkan spektrum harga (Batas Bawah, Median Pasar, dan Plafon Atas) dari tier freelance profesional hingga enterprise agency. Satuan Juta Rupiah (Rp)."
              />

              <h3 className="subhead">1. Rekomendasi 4 Nama Jasa Standar Industri (Productized Services)</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "var(--s4)" }}>
                Alih-alih menawarkan jasa generik seperti &ldquo;Bikin Web Murah&rdquo;, gunakan penamaan produk layanan
                berbobot otoritas (*productized service names*) yang langsung merefleksikan nilai hasil bisnis (*business outcome*):
              </p>

              <div
                className="package-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "var(--s4)",
                  marginBottom: "var(--s6)",
                }}
              >
                {/* Paket 1 */}
                <motion.div
                  className="package-card"
                  style={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--s4)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backdropFilter: "blur(8px)",
                  }}
                  whileHover={{ y: -3, borderColor: "var(--accent)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
                        Tier 1 · Traffic Validation
                      </span>
                      <RocketLaunchIcon style={{ width: 18, height: 18, color: "var(--accent)" }} />
                    </div>
                    <h4 style={{ fontSize: "17px", margin: "6px 0 4px", color: "var(--text-primary)" }}>
                      Web Launchpad™
                    </h4>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "var(--s3)" }}>
                      High-Converting Landing Page untuk Pengiklan Meta/TikTok
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--accent)", marginBottom: "var(--s2)" }}>
                      Rp5,5 jt – Rp8,5 jt
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "var(--s3)" }}>
                      Sweet Spot Rekomendasi: <strong>Rp6.900.000</strong>
                    </div>
                    <ul style={{ fontSize: "12.5px", paddingLeft: "0", listStyle: "none", margin: "0 0 12px", lineHeight: "1.6", color: "var(--text-secondary)" }}>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        1 Halaman panjang terstruktur konversi
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Kecepatan muat sub-2 detik (Core Web Vitals)
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Copywriting &amp; form lead routing WA
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Pengerjaan kilat 5–7 hari kerja
                      </li>
                    </ul>
                  </div>
                  <div style={{ fontSize: "11px", background: "var(--surface-sunken)", padding: "4px 8px", borderRadius: "4px", color: "var(--text-muted)" }}>
                    Paling cepat menghasilkan arus kas masuk
                  </div>
                </motion.div>

                {/* Paket 2 */}
                <motion.div
                  className="package-card"
                  style={{
                    background: "var(--surface-raised)",
                    border: "2px solid var(--accent)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--s4)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    backdropFilter: "blur(8px)",
                  }}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "12px",
                      background: "var(--accent)",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "10px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Paling Diminati (Sweet Spot)
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)", fontWeight: 600 }}>
                        Tier 2 · Corporate Standard
                      </span>
                      <BuildingOfficeIcon style={{ width: 18, height: 18, color: "var(--accent)" }} />
                    </div>
                    <h4 style={{ fontSize: "17px", margin: "6px 0 4px", color: "var(--text-primary)" }}>
                      Corporate Authority™
                    </h4>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "var(--s3)" }}>
                      Company Profile Modern untuk Kredibilitas B2B &amp; Tender
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--accent)", marginBottom: "var(--s2)" }}>
                      Rp12,5 jt – Rp22 jt
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "var(--s3)" }}>
                      Sweet Spot Rekomendasi: <strong>Rp16.500.000</strong>
                    </div>
                    <ul style={{ fontSize: "12.5px", paddingLeft: "0", listStyle: "none", margin: "0 0 12px", lineHeight: "1.6", color: "var(--text-secondary)" }}>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        5–8 Halaman kustom (Figma original)
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        CMS WordPress ACF / Headless Next.js
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Modul Karir, Portofolio &amp; Layanan
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Pengerjaan 2–3 minggu kerja
                      </li>
                    </ul>
                  </div>
                  <div style={{ fontSize: "11px", background: "rgba(188, 74, 26, 0.08)", padding: "4px 8px", borderRadius: "4px", color: "var(--accent)", fontWeight: 550 }}>
                    Volume permintaan terbesar di korporat Jakarta
                  </div>
                </motion.div>

                {/* Paket 3 */}
                <motion.div
                  className="package-card"
                  style={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--s4)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backdropFilter: "blur(8px)",
                  }}
                  whileHover={{ y: -3, borderColor: "var(--accent)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
                        Tier 3 · Transaksional
                      </span>
                      <ShoppingBagIcon style={{ width: 18, height: 18, color: "var(--accent)" }} />
                    </div>
                    <h4 style={{ fontSize: "17px", margin: "6px 0 4px", color: "var(--text-primary)" }}>
                      Commercial Engine™
                    </h4>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "var(--s3)" }}>
                      E-Commerce &amp; Sistem Pemesanan Brand Mandiri
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--accent)", marginBottom: "var(--s2)" }}>
                      Rp25 jt – Rp45 jt
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "var(--s3)" }}>
                      Sweet Spot Rekomendasi: <strong>Rp32.000.000</strong>
                    </div>
                    <ul style={{ fontSize: "12.5px", paddingLeft: "0", listStyle: "none", margin: "0 0 12px", lineHeight: "1.6", color: "var(--text-secondary)" }}>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Katalog varian produk &amp; checkout aman
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Payment Gateway (Midtrans / Xendit)
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Auto Kalkulasi Ongkir (JNE/SiCepat/J&amp;T)
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Pengerjaan 4–6 minggu kerja
                      </li>
                    </ul>
                  </div>
                  <div style={{ fontSize: "11px", background: "var(--surface-sunken)", padding: "4px 8px", borderRadius: "4px", color: "var(--text-muted)" }}>
                    Margin profit tinggi &amp; potensi retainer bulanan
                  </div>
                </motion.div>

                {/* Paket 4 */}
                <motion.div
                  className="package-card"
                  style={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--s4)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backdropFilter: "blur(8px)",
                  }}
                  whileHover={{ y: -3, borderColor: "var(--accent)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
                        Tier 4 · Custom Engineering
                      </span>
                      <ServerStackIcon style={{ width: 18, height: 18, color: "var(--accent)" }} />
                    </div>
                    <h4 style={{ fontSize: "17px", margin: "6px 0 4px", color: "var(--text-primary)" }}>
                      Enterprise Platform™
                    </h4>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "var(--s3)" }}>
                      Web Application, Portal Internal &amp; Custom SaaS
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--accent)", marginBottom: "var(--s2)" }}>
                      Rp55 jt – Rp150 jt+
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "var(--s3)" }}>
                      Sweet Spot Rekomendasi: <strong>Rp75.000.000</strong>
                    </div>
                    <ul style={{ fontSize: "12.5px", paddingLeft: "0", listStyle: "none", margin: "0 0 12px", lineHeight: "1.6", color: "var(--text-secondary)" }}>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Next.js App Router, NestJS / Laravel REST
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Database PostgreSQL, role permission kompleks
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Integrasi API pihak ketiga (ERP/CRM/HRIS)
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckIcon style={{ width: 13, height: 13, color: "var(--accent)", flexShrink: 0 }} />
                        Pengerjaan 8–12 minggu kerja
                      </li>
                    </ul>
                  </div>
                  <div style={{ fontSize: "11px", background: "var(--surface-sunken)", padding: "4px 8px", borderRadius: "4px", color: "var(--text-muted)" }}>
                    Untuk klien institusi, startup, dan enterprise
                  </div>
                </motion.div>
              </div>

              <h3 className="subhead">2. Taktik Penerapan Harga yang Bagus (Psikologi &amp; Eksekusi Penjualan)</h3>
              <ul className="points">
                <li>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        background: "rgba(188, 74, 26, 0.08)",
                        color: "var(--accent)",
                        padding: "6px",
                        borderRadius: "6px",
                        marginTop: "2px",
                      }}
                    >
                      <CalculatorIcon style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <strong>1. Gunakan Angka Presisi (Charm / Precise Pricing)</strong>
                      <br />
                      Jangan tawarkan harga bulat tebakan seperti &ldquo;Rp15.000.000&rdquo; atau &ldquo;Rp20.000.000&rdquo;.
                      Gunakan angka presisi seperti <strong>Rp14.800.000</strong> atau <strong>Rp16.500.000</strong>.
                      Secara psikologis, klien memandang angka presisi sebagai hasil perhitungan WBS (Work Breakdown Structure)
                      objektif berbasis jam kerja tim, bukan angka karangan.
                    </div>
                  </div>
                  <b>Kredibilitas Proposal</b>
                </li>
                <li className="tactic-item">
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        background: "rgba(188, 74, 26, 0.08)",
                        color: "var(--accent)",
                        padding: "6px",
                        borderRadius: "6px",
                        marginTop: "2px",
                      }}
                    >
                      <CheckBadgeIcon style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <strong>2. Teknik Tiga Pilihan Paket (The Three-Tier Decoy Strategy)</strong>
                      <br />
                      Saat menyajikan proposal, sertakan 3 opsi: <em>Essential</em> (Rp8,5 jt), <em>Professional</em> (Rp16,5 jt),
                      dan <em>Enterprise</em> (Rp35 jt). Lebih dari 70% klien korporat Jakarta akan otomatis memilih paket tengah
                      (Tier 2) karena merasa aman, tidak terlalu murah dan tidak terlalu mahal.
                    </div>
                  </div>
                  <b>Menaikkan Nilai Transaksi</b>
                </li>
                <li className="tactic-item">
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        background: "rgba(188, 74, 26, 0.08)",
                        color: "var(--accent)",
                        padding: "6px",
                        borderRadius: "6px",
                        marginTop: "2px",
                      }}
                    >
                      <ShieldCheckIcon style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <strong>3. Penegasan Batas Layanan (Strict Add-on Boundary)</strong>
                      <br />
                      Jelaskan sejak awal bahwa harga pembuatan website adalah <strong>murni biaya arsitektur perangkat lunak</strong>.
                      Modul periklanan digital (Meta Pixel CAPI, TikTok Events API, WhatsApp Cloud API, dan Ad Spend)
                      ditawarkan sebagai add-on terpisah (Rp1,5 jt – Rp3,5 jt sekali bayar) atau retainer bulanan.
                      Ini melipatgandakan profit margin tanpa merusak harga dasar website Anda.
                    </div>
                  </div>
                  <b>Melindungi Margin</b>
                </li>
                <li className="tactic-item">
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        background: "rgba(188, 74, 26, 0.08)",
                        color: "var(--accent)",
                        padding: "6px",
                        borderRadius: "6px",
                        marginTop: "2px",
                      }}
                    >
                      <BanknotesIcon style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <strong>4. Proteksi Arus Kas dengan Termin 50% : 30% : 20%</strong>
                      <br />
                      Jangan pernah menulis sebaris kode pun atau membuka Figma sebelum DP 50% masuk ke rekening operasional.
                      Termin kedua (30%) ditagihkan saat demo server staging selesai, dan sisa 20% sebelum serah kunci domain live.
                    </div>
                  </div>
                  <b>Arus Kas Sehat</b>
                </li>
              </ul>

              <h3 className="subhead">3. Rumus Menghitung Biaya Proyek (Cost-Plus Man-Day)</h3>
              <div
                style={{
                  background: "var(--surface-sunken)",
                  padding: "var(--s3) var(--s4)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  marginBottom: "var(--s3)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                Harga Penawaran = [ (Hari Kerja UI/UX × Tarif) + (Hari Kerja Dev × Tarif) + Biaya Server/Domain ] × 1.45
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "var(--s3)",
                  marginBottom: "var(--s4)",
                }}
              >
                <div style={{ background: "var(--surface-sunken)", padding: "10px", borderRadius: "4px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Tarif Harian UI/UX</div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>Rp450.000 – Rp700.000</div>
                </div>
                <div style={{ background: "var(--surface-sunken)", padding: "10px", borderRadius: "4px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Tarif Harian Developer</div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>Rp550.000 – Rp900.000</div>
                </div>
                <div style={{ background: "var(--surface-sunken)", padding: "10px", borderRadius: "4px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Overhead Margin Usaha</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--accent)" }}>40% – 50%</div>
                </div>
              </div>
            </Section>

            {/* ── 08 METODOLOGI ────────────────────────────────────────────── */}
            <Section
              id="metode"
              eyebrow="08 — Metodologi &amp; Sumber Data"
              title="Metodologi Pengumpulan Data"
            >
              <div style={{ display: "grid", gap: "var(--s3)" }}>
                <div
                  style={{
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--s3)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <DocumentCheckIcon style={{ width: 20, height: 20, color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ fontSize: "12.5px", lineHeight: "1.5" }}>
                    <strong>1. Sumber Data Software House.</strong> Dihimpun dari riset profil, portofolio, dan
                    struktur penawaran publik 9 software house dan agensi digital terkemuka di DKI Jakarta dan
                    Jabodetabek (Suitmedia, Alba Tech, ToffeeDev, Whello, Tonjoo, Sagara, Badr Interactive,
                    CODE.ID, Doxadigital).
                  </div>
                </div>

                <div
                  style={{
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--s3)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <MegaphoneIcon style={{ width: 20, height: 20, color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ fontSize: "12.5px", lineHeight: "1.5" }}>
                    <strong>2. Data Iklan Meta (Instagram &amp; Facebook).</strong> Ditarik langsung dari Meta Ad
                    Library melalui API Zapi untuk wilayah Indonesia dengan kueri pembuatan website, software
                    house, dan landing page, menghasilkan {n(metaAdsAnalysis.totalAdsSampled)} iklan aktif unik.
                  </div>
                </div>

                <div
                  style={{
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--s3)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <MagnifyingGlassIcon style={{ width: 20, height: 20, color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ fontSize: "12.5px", lineHeight: "1.5" }}>
                    <strong>3. Data Tren Pencarian Google &amp; CPC.</strong> Dihimpun dari data Google Trends &amp;
                    Google Keyword Planner untuk wilayah DKI Jakarta dan Jabodetabek, memetakan {n(searchIntelligence.keywords.length)} kata kunci
                    komersial bernilai tinggi dengan total volume penelusuran lebih dari {n(searchIntelligence.totalMonthlyVolumeJabodetabek)} per bulan.
                  </div>
                </div>

                <div
                  style={{
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--s3)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <ShieldCheckIcon style={{ width: 20, height: 20, color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ fontSize: "12.5px", lineHeight: "1.5" }}>
                    <strong>4. Kebijakan Penetapan Harga B2B.</strong> Bebas dari data marketplace ritel dan data lowongan kerja.
                    Seluruh angka fokus pada biaya komersial jasa pembuatan website murni dan memisahkan modul
                    periklanan digital sebagai layanan tambahan terpisah.
                  </div>
                </div>
              </div>
            </Section>

            <footer className="footer">
              Laporan Intelijen Pasar &amp; Panduan Penentuan Harga Pembuatan Website DKI Jakarta · Diperbarui pada{" "}
              {tanggal(meta.generated)} · Disusun sebagai acuan tolok ukur penentuan harga pembuatan website yang akurat dan kompetitif.
            </footer>
          </main>
        </div>
      )}
    </>
  );
}
