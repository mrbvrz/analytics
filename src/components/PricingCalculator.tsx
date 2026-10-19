import { useState, useMemo } from "react";
import type { ToolListing } from "../data/report.types";
import { rp, pct } from "../lib/format";
import {
  GlobeAltIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  ShoppingBagIcon,
  CpuChipIcon,
  AcademicCapIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  UserIcon,
  PaintBrushIcon,
  CodeBracketIcon,
  CheckCircleIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

type WebsiteType =
  | "landing_page"
  | "company_profile"
  | "company_corporate"
  | "toko_online"
  | "custom_portal"
  | "sekolah";

type ProviderTier = "software_house_new" | "software_house_est" | "freelance";

interface PricingCalculatorProps {
  listings?: ToolListing[];
  legend?: Record<string, string>;
}

interface TypeOption {
  id: WebsiteType;
  title: string;
  tagKey: string;
  desc: string;
  baseNewAgency: number;
  baseEstAgency: number;
  baseFreelance: number;
  workDays: string;
  designerDays: number;
  devDays: number;
  qaDays: number;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
}

const TYPE_OPTIONS: TypeOption[] = [
  {
    id: "landing_page",
    title: "High-Converting Landing Page (1 Hal)",
    tagKey: "landing_page",
    desc: "1 halaman penjualan/lead magnet, copywriting persuasif, CTA terarah, Pagespeed mobile optimal.",
    baseNewAgency: 5_500_000,
    baseEstAgency: 14_000_000,
    baseFreelance: 2_500_000,
    workDays: "5–7 hari kerja",
    designerDays: 2,
    devDays: 3,
    qaDays: 1,
    icon: GlobeAltIcon,
  },
  {
    id: "company_profile",
    title: "Company Profile Bisnis Standar (4–6 Hal)",
    tagKey: "company_profile",
    desc: "Profil usaha, layanan, galeri portofolio, tentang kami, dan formulir kontak/WhatsApp interaktif.",
    baseNewAgency: 12_500_000,
    baseEstAgency: 28_000_000,
    baseFreelance: 5_500_000,
    workDays: "2–3 minggu kerja",
    designerDays: 4,
    devDays: 7,
    qaDays: 2,
    icon: BriefcaseIcon,
  },
  {
    id: "company_corporate",
    title: "Company Profile Korporat / Multi-Divisi",
    tagKey: "company_profile",
    desc: "Struktur multi-halaman, integrasi karir, investor relations, multi-bahasa, dan brand guideline eksklusif.",
    baseNewAgency: 22_000_000,
    baseEstAgency: 55_000_000,
    baseFreelance: 11_000_000,
    workDays: "3–6 minggu kerja",
    designerDays: 7,
    devDays: 14,
    qaDays: 4,
    icon: BuildingOffice2Icon,
  },
  {
    id: "toko_online",
    title: "Toko Online / E-Commerce Custom",
    tagKey: "toko_online",
    desc: "Katalog produk, manajemen stok, keranjang belanja, integrasi ongkir kurir & payment gateway.",
    baseNewAgency: 25_000_000,
    baseEstAgency: 48_000_000,
    baseFreelance: 12_000_000,
    workDays: "4–6 minggu kerja",
    designerDays: 6,
    devDays: 16,
    qaDays: 5,
    icon: ShoppingBagIcon,
  },
  {
    id: "custom_portal",
    title: "Custom Web App / Portal Sistem",
    tagKey: "custom",
    desc: "Aplikasi web full-stack, autentikasi multi-role, dashboard analitik, database relasional & API.",
    baseNewAgency: 45_000_000,
    baseEstAgency: 95_000_000,
    baseFreelance: 20_000_000,
    workDays: "6–10 minggu kerja",
    designerDays: 10,
    devDays: 25,
    qaDays: 8,
    icon: CpuChipIcon,
  },
  {
    id: "sekolah",
    title: "Website Sekolah / Yayasan / Instansi",
    tagKey: "sekolah",
    desc: "Portal instansi resmi, modul PPDB siswa baru, galeri kegiatan, warta & pengumuman publik.",
    baseNewAgency: 14_000_000,
    baseEstAgency: 32_000_000,
    baseFreelance: 6_500_000,
    workDays: "2–4 minggu kerja",
    designerDays: 4,
    devDays: 9,
    qaDays: 3,
    icon: AcademicCapIcon,
  },
];

export function PricingCalculator({}: PricingCalculatorProps) {
  const [selectedType, setSelectedType] = useState<WebsiteType>("company_profile");
  const [tier, setTier] = useState<ProviderTier>("software_house_new");

  // Fitur Murni Pembuatan Web
  const [incDomainHosting, setIncDomainHosting] = useState<boolean>(true);
  const [incCustomDesign, setIncCustomDesign] = useState<boolean>(true);
  const [incCustomStack, setIncCustomStack] = useState<boolean>(false);
  const [incPaymentGateway, setIncPaymentGateway] = useState<boolean>(false);
  const [incCopywriting, setIncCopywriting] = useState<boolean>(true);
  const [incMaintenance, setIncMaintenance] = useState<boolean>(false);

  // Layanan Tambahan Iklan & Tracking (Add-ons terpisah)
  const [incMetaPixel, setIncMetaPixel] = useState<boolean>(false);
  const [incWhatsappApi, setIncWhatsappApi] = useState<boolean>(false);
  const [incAdsManagement, setIncAdsManagement] = useState<boolean>(false);

  const currentTypeOpt = TYPE_OPTIONS.find((t) => t.id === selectedType) ?? TYPE_OPTIONS[1];

  // Kalkulasi Harga Pembuatan Web Murni & Add-ons
  const calculation = useMemo(() => {
    let base = 0;
    if (tier === "software_house_new") base = currentTypeOpt.baseNewAgency;
    else if (tier === "software_house_est") base = currentTypeOpt.baseEstAgency;
    else base = currentTypeOpt.baseFreelance;

    let cogs = 0;
    let webAddOnPrice = 0;

    // Biaya Pihak Ketiga & Fitur Web Murni
    if (incDomainHosting) {
      cogs += 850_000; // Cloud VPS + Domain .com/.id + SSL
      webAddOnPrice += 1_500_000;
    }

    if (incCustomDesign) {
      // Figma UI/UX eksklusif
      webAddOnPrice += tier === "software_house_est" ? 5_000_000 : 2_500_000;
    }

    if (incCustomStack) {
      // Full-stack kustom React/Next.js/Laravel
      webAddOnPrice += base * 0.35;
    }

    if (incPaymentGateway) {
      // Integrasi Midtrans / Xendit
      webAddOnPrice += 2_500_000;
    }

    if (incCopywriting) {
      // Penulisan naskah profesional
      webAddOnPrice += 1_800_000;
    }

    if (incMaintenance) {
      // Garansi & SLA 1 tahun
      webAddOnPrice += tier === "software_house_est" ? 6_000_000 : 3_000_000;
    }

    // Biaya Pembuatan Web Murni
    const pureWebPrice = Math.round(base + webAddOnPrice);
    const minWebPrice = Math.round(pureWebPrice * 0.88);
    const maxWebPrice = Math.round(pureWebPrice * 1.25);

    // Add-ons Terpisah: Tracking, WhatsApp, Ads Setup
    let marketingAddonTotal = 0;
    if (incMetaPixel) {
      marketingAddonTotal += 2_000_000; // Setup Pixel, CAPI, GTM & GA4
    }
    if (incWhatsappApi) {
      marketingAddonTotal += 3_000_000; // Setup WhatsApp Business Cloud API & Lead Routing
    }
    if (incAdsManagement) {
      marketingAddonTotal += 4_000_000; // Setup & Managemen Awal Iklan Meta/TikTok (bulan 1)
    }

    const grossMarginPct =
      pureWebPrice > cogs ? Math.round(((pureWebPrice - cogs) / pureWebPrice) * 100) : 0;

    return {
      cogs,
      pureWebPrice,
      minWebPrice,
      maxWebPrice,
      marketingAddonTotal,
      grandTotal: pureWebPrice + marketingAddonTotal,
      grossMarginPct,
    };
  }, [
    tier,
    currentTypeOpt,
    incDomainHosting,
    incCustomDesign,
    incCustomStack,
    incPaymentGateway,
    incCopywriting,
    incMaintenance,
    incMetaPixel,
    incWhatsappApi,
    incAdsManagement,
  ]);

  return (
    <div className="calc-card">
      <div className="calc-card__intro">
        <div className="calc-disclaimer-badge">
          <ExclamationTriangleIcon style={{ width: 16, height: 16, marginRight: 6, flexShrink: 0 }} />
          STANDAR PENETAPAN HARGA SOFTWARE HOUSE B2B JAKARTA
        </div>
        <p className="calc-card__desc">
          Simulator ini menghitung <strong>biaya murni rekayasa kode, desain UI/UX Figma, dan peluncuran website profesional</strong>{" "}
          berdasarkan alokasi jam kerja tim software house di DKI Jakarta. Sesuai etika penawaran komersial,{" "}
          <strong>biaya pembuatan web belum termasuk ad spend Meta/TikTok, integrasi Pixel/CAPI, dan WhatsApp API</strong>,{" "}
          yang ditawarkan sebagai modul tambahan (*marketing add-on*) terpisah secara transparan.
        </p>
      </div>

      <div className="calc-layout">
        {/* Kolom Kiri: Kontrol & Opsi */}
        <div className="calc-controls">
          <div className="calc-group">
            <label className="calc-group__label">1. Pilih Jenis Website / Scope Pekerjaan</label>
            <div className="calc-options">
              {TYPE_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`calc-option-btn ${selectedType === opt.id ? "is-active" : ""}`}
                    onClick={() => setSelectedType(opt.id)}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div
                        style={{
                          background: selectedType === opt.id ? "var(--accent)" : "rgba(188, 74, 26, 0.08)",
                          color: selectedType === opt.id ? "#fff" : "var(--accent)",
                          padding: "6px",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <IconComponent style={{ width: 18, height: 18 }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="calc-option-btn__title">{opt.title}</div>
                        <div className="calc-option-btn__desc">{opt.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="calc-group">
            <label className="calc-group__label">2. Profil &amp; Posisi Penyedia Jasa Pembuatan Website</label>
            <div className="calc-tiers">
              <button
                type="button"
                className={`calc-tier-btn ${tier === "software_house_new" ? "is-active" : ""}`}
                onClick={() => setTier("software_house_new")}
              >
                <SparklesIcon style={{ width: 18, height: 18, color: "var(--accent)", margin: "0 auto 6px" }} />
                <div className="calc-tier-btn__name">Software House Baru</div>
                <div className="calc-tier-btn__sub">Tolok ukur penawaran kompetitif Jakarta</div>
              </button>
              <button
                type="button"
                className={`calc-tier-btn ${tier === "software_house_est" ? "is-active" : ""}`}
                onClick={() => setTier("software_house_est")}
              >
                <BuildingOfficeIcon style={{ width: 18, height: 18, color: "var(--accent)", margin: "0 auto 6px" }} />
                <div className="calc-tier-btn__name">Agensi Mapan / Terkemuka</div>
                <div className="calc-tier-btn__sub">Standar Suitmedia, ToffeeDev, Alba Tech</div>
              </button>
              <button
                type="button"
                className={`calc-tier-btn ${tier === "freelance" ? "is-active" : ""}`}
                onClick={() => setTier("freelance")}
              >
                <UserIcon style={{ width: 18, height: 18, color: "var(--accent)", margin: "0 auto 6px" }} />
                <div className="calc-tier-btn__name">Freelancer Profesional</div>
                <div className="calc-tier-btn__sub">Tenaga mandiri tanpa tim PM/QA</div>
              </button>
            </div>
          </div>

          <div className="calc-group">
            <label className="calc-group__label">
              3. Deliverables Murni Pembuatan Website (Core Web Features)
            </label>
            <div className="calc-addons">
              <label className="calc-addon">
                <input
                  type="checkbox"
                  checked={incDomainHosting}
                  onChange={(e) => setIncDomainHosting(e.target.checked)}
                />
                <span className="calc-addon__text">
                  <strong>Domain (.com/.id) &amp; Cloud Server 1 Tahun</strong>
                  <small>Konfigurasi DNS, Cloudflare SSL, dan mailbox bisnis resmi</small>
                </span>
              </label>

              <label className="calc-addon">
                <input
                  type="checkbox"
                  checked={incCustomDesign}
                  onChange={(e) => setIncCustomDesign(e.target.checked)}
                />
                <span className="calc-addon__text">
                  <strong>Desain UI/UX Eksklusif di Figma (Bukan Beli Template)</strong>
                  <small>Wireframing, moodboard, desain responsif desktop &amp; mobile</small>
                </span>
              </label>

              <label className="calc-addon">
                <input
                  type="checkbox"
                  checked={incCopywriting}
                  onChange={(e) => setIncCopywriting(e.target.checked)}
                />
                <span className="calc-addon__text">
                  <strong>Penyusunan Copywriting &amp; Struktur Konten Konversi</strong>
                  <small>Headline persuasif, value proposition, dan alur ajakan bertindak (CTA)</small>
                </span>
              </label>

              <label className="calc-addon">
                <input
                  type="checkbox"
                  checked={incCustomStack}
                  onChange={(e) => setIncCustomStack(e.target.checked)}
                />
                <span className="calc-addon__text">
                  <strong>Arsitektur Full-Stack Modern (Next.js / React / Laravel)</strong>
                  <small>Kecepatan loading sub-2 detik, SEO teknis, dan kode terstruktur</small>
                </span>
              </label>

              <label className="calc-addon">
                <input
                  type="checkbox"
                  checked={incPaymentGateway}
                  onChange={(e) => setIncPaymentGateway(e.target.checked)}
                />
                <span className="calc-addon__text">
                  <strong>Integrasi Pembayaran Otomatis (Midtrans / Xendit)</strong>
                  <small>QRIS, Virtual Account, kartu kredit, dan auto-status callback</small>
                </span>
              </label>

              <label className="calc-addon">
                <input
                  type="checkbox"
                  checked={incMaintenance}
                  onChange={(e) => setIncMaintenance(e.target.checked)}
                />
                <span className="calc-addon__text">
                  <strong>Garansi Teknis &amp; Maintenance SLA 1 Tahun</strong>
                  <small>Backup rutin mingguan, perbaikan bug darurat, update patch keamanan</small>
                </span>
              </label>
            </div>
          </div>

          <div className="calc-group">
            <label className="calc-group__label" style={{ color: "var(--accent)" }}>
              4. Layanan Tambahan Iklan &amp; Tracking (Add-ons Terpisah Wajib Di-charge Ekstra)
            </label>
            <div className="calc-addons">
              <label className="calc-addon" style={{ borderColor: "rgba(247, 129, 102, 0.4)" }}>
                <input
                  type="checkbox"
                  checked={incMetaPixel}
                  onChange={(e) => setIncMetaPixel(e.target.checked)}
                />
                <span className="calc-addon__text">
                  <strong>Setup Server-Side Meta Pixel / CAPI &amp; Google Analytics 4</strong>
                  <small>+ Rp2.000.000 · Server-side event tracking &amp; verifikasi domain</small>
                </span>
              </label>

              <label className="calc-addon" style={{ borderColor: "rgba(247, 129, 102, 0.4)" }}>
                <input
                  type="checkbox"
                  checked={incWhatsappApi}
                  onChange={(e) => setIncWhatsappApi(e.target.checked)}
                />
                <span className="calc-addon__text">
                  <strong>Integrasi WhatsApp Business Cloud API &amp; Lead Router Bot</strong>
                  <small>+ Rp3.000.000 · Auto-greeting, multi-CS distribution (belum termasuk saldo Meta)</small>
                </span>
              </label>

              <label className="calc-addon" style={{ borderColor: "rgba(247, 129, 102, 0.4)" }}>
                <input
                  type="checkbox"
                  checked={incAdsManagement}
                  onChange={(e) => setIncAdsManagement(e.target.checked)}
                />
                <span className="calc-addon__text">
                  <strong>Setup &amp; Manajemen Awal Kampanye Iklan Meta/TikTok (Bulan 1)</strong>
                  <small>+ Rp4.000.000 / bulan · Jasa pengelolaan iklan (di luar budget ad spend klien)</small>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Output Rekomendasi & Breakdown */}
        <div className="calc-summary">
          <div className="calc-summary__header">
            <span className="calc-summary__tag">Estimasi Harga Pembuatan Web Murni</span>
            <div className="calc-summary__main-price">{rp(calculation.pureWebPrice)}</div>
            <div className="calc-summary__price-range">
              Rentang penawaran aman: <b>{rp(calculation.minWebPrice)}</b> hingga <b>{rp(calculation.maxWebPrice)}</b>
            </div>
          </div>

          <div className="calc-summary__metrics">
            <div className="calc-metric">
              <span className="calc-metric__label">Estimasi Pengerjaan</span>
              <span className="calc-metric__val">{currentTypeOpt.workDays}</span>
            </div>
            <div className="calc-metric">
              <span className="calc-metric__label">Biaya Pokok (Server/Domain)</span>
              <span className="calc-metric__val">{calculation.cogs ? rp(calculation.cogs) : "Di luar paket"}</span>
            </div>
            <div className="calc-metric">
              <span className="calc-metric__label">Margin Kotor Operasional</span>
              <span className="calc-metric__val">{pct(calculation.grossMarginPct)}</span>
            </div>
          </div>

          {/* Breakdown Add-ons jika dicentang */}
          {calculation.marketingAddonTotal > 0 ? (
            <div className="calc-addon-breakdown">
              <div className="calc-addon-breakdown__row">
                <span>Harga Pembuatan Web Murni:</span>
                <strong>{rp(calculation.pureWebPrice)}</strong>
              </div>
              <div className="calc-addon-breakdown__row is-addon">
                <span>Layanan Tambahan (Ads &amp; Tracking Setup):</span>
                <strong>+ {rp(calculation.marketingAddonTotal)}</strong>
              </div>
              <div className="calc-addon-breakdown__row is-grand">
                <span>Total Nilai Penawaran Proyek:</span>
                <strong>{rp(calculation.grandTotal)}</strong>
              </div>
            </div>
          ) : null}

          {/* Alokasi Man-Day Tim Pembuatan Website */}
          <div className="calc-benchmark">
            <h4 className="calc-benchmark__title">
              Estimasi Alokasi Hari Kerja Tim ({currentTypeOpt.title.split(" (")[0]})
            </h4>
            <div className="calc-benchmark__grid">
              <div className="calc-benchmark__item">
                <PaintBrushIcon style={{ width: 18, height: 18, color: "var(--accent)", margin: "0 auto 4px" }} />
                <span className="calc-benchmark__val">{currentTypeOpt.designerDays} Hari</span>
                <span className="calc-benchmark__lbl">UI/UX Designer (Figma)</span>
              </div>
              <div className="calc-benchmark__item is-med">
                <CodeBracketIcon style={{ width: 18, height: 18, color: "var(--accent)", margin: "0 auto 4px" }} />
                <span className="calc-benchmark__val">{currentTypeOpt.devDays} Hari</span>
                <span className="calc-benchmark__lbl">Web Developer (Code)</span>
              </div>
              <div className="calc-benchmark__item">
                <CheckCircleIcon style={{ width: 18, height: 18, color: "var(--accent)", margin: "0 auto 4px" }} />
                <span className="calc-benchmark__val">{currentTypeOpt.qaDays} Hari</span>
                <span className="calc-benchmark__lbl">QA &amp; Project Manager</span>
              </div>
            </div>
            <p className="calc-benchmark__footer">
              Nilai penawaran software house Anda (<strong>{rp(calculation.pureWebPrice)}</strong>) didasarkan
              pada jam kerja riil tim profesional. Klien korporat di Jakarta membayar untuk kepastian tanggal rilis,
              keamanan data, dan garansi pasca-peluncuran.
            </p>
          </div>

          {/* Panduan Termin Pembayaran */}
          <div className="calc-payment-terms">
            <h4 className="calc-payment-terms__title">Rekomendasi Skema Termin Pembayaran Aman</h4>
            <div className="calc-payment-terms__steps">
              <div className="calc-term-step">
                <span className="calc-term-step__badge">
                  <BanknotesIcon style={{ width: 13, height: 13, marginRight: 3, verticalAlign: -2, display: "inline-block" }} />
                  50% DP Muka
                </span>
                <div className="calc-term-step__desc">
                  <strong>{rp(calculation.pureWebPrice * 0.5)}</strong> saat penandatanganan SPK / invoice DP
                </div>
              </div>
              <div className="calc-term-step">
                <span className="calc-term-step__badge">
                  <CheckBadgeIcon style={{ width: 13, height: 13, marginRight: 3, verticalAlign: -2, display: "inline-block" }} />
                  30% Demo Staging
                </span>
                <div className="calc-term-step__desc">
                  <strong>{rp(calculation.pureWebPrice * 0.3)}</strong> setelah demo seluruh fitur di server uji disetujui
                </div>
              </div>
              <div className="calc-term-step">
                <span className="calc-term-step__badge">
                  <ShieldCheckIcon style={{ width: 13, height: 13, marginRight: 3, verticalAlign: -2, display: "inline-block" }} />
                  20% Pelunasan
                </span>
                <div className="calc-term-step__desc">
                  <strong>{rp(calculation.pureWebPrice * 0.2)}</strong> sebelum penyerahan kredensial hosting &amp; pointing live
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
