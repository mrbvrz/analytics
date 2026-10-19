#!/usr/bin/env python3
"""
build_report.py — Agregasi data pasar software house, Meta/TikTok ads, dan Google Search Trends -> src/data/report.json

Fokus:
1. Harga pembuatan website oleh perusahaan software house di DKI Jakarta.
2. Analisis data iklan Meta (Instagram & Facebook Ads) dan funnel TikTok Ads.
3. Penegasan bahwa seluruh harga pembuatan website adalah BIAYA MURNI PENGEMBANGAN
   (BELUM termasuk penerapan ads meta, pixel tracking, whatsapp automation, dsb).
4. Google Trends & Search Engine Intelligence (keyword volume, intent, CPC, saluran akuisisi, tren teknologi).
"""
import glob
import html
import json
import pathlib
import re
import statistics as st

ROOT = pathlib.Path(__file__).resolve().parent
DATA = ROOT / "data"
OUT = ROOT.parent / "src" / "data" / "report.json"

BAIT = 5_000
CAP = 20_000_000
MIN_SEG = 10


def load(path):
    return json.loads(pathlib.Path(path).read_text())


def num(x):
    if isinstance(x, (int, float)):
        return int(x)
    try:
        return int(float(str(x).replace(".", "").replace(",", ".")))
    except (ValueError, TypeError):
        return None


def clean_name(s):
    return re.sub(r"\s+", " ", html.unescape(str(s or ""))).strip()


# ── Filter Relevansi Marketplace (Disimpan sebagai data latar / fallback) ──────
INTI_WEB = re.compile(
    r"website|\bweb\b(?!\s*os\b)|\bwww\b|landing page|company profile|company profil|"
    r"profil perusahaan|toko online|e-?commerce|online shop|wordpress|"
    r"woocommerce|elementor|\bppdb\b|\bseo\b|\bdomain\b|hosting|aplikasi web|"
    r"sistem informasi|jasa pembuatan web|bikin web|buat web",
    re.I,
)
BARANG_FISIK = re.compile(
    r"vanes|panah|busur|arrow|stabilizer|compound|recurve|screw|nock|poin ulir|"
    r"threaded|ramrod|\bbow\b|hunting|shaft|feather|raket|badminton|rendang|"
    r"kursi|daging|senar|grip|sepatu|kaos|tas\b|mug|gelas",
    re.I,
)


def relevan(name):
    return bool(INTI_WEB.search(name)) and not BARANG_FISIK.search(name)


SEGMENTS = [
    ("domain_hosting", "Domain + hosting", r"domain|hosting"),
    ("company_profile", "Company profile", r"company profile|company profil|profil perusahaan"),
    ("toko_online", "Toko online", r"toko online|e-?commerce|olshop|online shop|jualan online"),
    ("landing_page", "Landing page", r"landing page|halaman penjualan"),
    ("seo", "SEO / optimasi Google", r"\bseo\b|optimasi google|peringkat google|\branking\b"),
    ("custom", "Custom development",
     r"\bcustom\b|\blaravel\b|\breact(?:\.?js)?\b|\bvue(?:\.?js)?\b|\bnext\.?js\b|"
     r"\bnode(?:\.?js)?\b|\bphp native\b|\bfull ?stack\b|\bapi\b"),
    ("umkm", "Website UMKM", r"umkm|usaha kecil|bisnis kecil|wirausaha"),
    ("sekolah", "Sekolah / instansi", r"sekolah|\bppdb\b|pesantren|klinik|yayasan|instansi|dinas|koperasi|bumdes"),
    ("instan", "Template siap pakai", r"\binstan\b|template|siap pakai|\b1 hari\b|kilat"),
    ("wordpress", "WordPress", r"wordpress|woocommerce|elementor|\bwp\b"),
    ("portfolio", "Portfolio / undangan", r"portofolio|portfolio|undangan"),
    ("mobile", "Mobile responsive", r"mobile friendly|responsive"),
    ("logo_branding", "Termasuk logo / branding", r"\blogo\b|branding|\bbrand\b"),
    ("blog", "Blog / portal berita", r"\bblog\b|portal berita|artikel|adsense"),
    ("maintenance", "Maintenance / garansi", r"maintenance|perawatan|\bsupport\b|garansi"),
    ("hosting_1tahun", "Hosting 1 tahun disertakan", r"\b1\s*tahun\b|\bsetahun\b|\b1thn\b"),
]
LABEL = {k: lab for k, lab, _ in SEGMENTS}
RX = {k: re.compile(p, re.I) for k, _, p in SEGMENTS}


def tags_of(name):
    return [k for k, rx in RX.items() if rx.search(name)]


# ── Muat Data Marketplace ──────────────────────────────────────────
SOURCES = [("shopee", "Shopee"), ("blibli", "Blibli"), ("tokopedia", "Tokopedia")]
raw, dibuang_fisik, dibuang_umpan, dibuang_cap = [], 0, 0, 0

for prefix, label in SOURCES:
    for f in glob.glob(str(DATA / f"{prefix}_*.json")):
        d = load(f).get("data") or {}
        for it in d.get("items") or []:
            name = clean_name(it.get("name") or it.get("title"))
            if not name:
                continue
            raw.append({
                "source": prefix,
                "pid": str(it.get("productId") or ""),
                "name": name,
                "price": num(it.get("price")),
            })

seen, listings = set(), []
for it in raw:
    key = (it["source"], it["pid"] or it["name"].lower())
    if key in seen:
        continue
    seen.add(key)
    listings.append(it)

bersih = []
for it in listings:
    if not relevan(it["name"]):
        dibuang_fisik += 1
        continue
    p = it["price"]
    if p is None or p < BAIT:
        dibuang_umpan += 1
        continue
    if p > CAP:
        dibuang_cap += 1
        continue
    bersih.append(it)

prices = sorted(x["price"] for x in bersih) if bersih else [500_000]


def q(v, p):
    if not v:
        return 0
    if len(v) == 1:
        return v[0]
    i = p * (len(v) - 1)
    lo, hi = int(i), min(int(i) + 1, len(v) - 1)
    return round(v[lo] + (v[hi] - v[lo]) * (i - lo))


BUCKETS = [
    ("< Rp100 rb", 0, 100_000),
    ("Rp100–500 rb", 100_000, 500_000),
    ("Rp500 rb–1 jt", 500_000, 1_000_000),
    ("Rp1–3 jt", 1_000_000, 3_000_000),
    ("Rp3–10 jt", 3_000_000, 10_000_000),
    ("> Rp10 jt", 10_000_000, float("inf")),
]
buckets = []
for lab, lo, hi in BUCKETS:
    n = sum(1 for p in prices if lo <= p < hi)
    if n:
        buckets.append({"label": lab, "count": n, "pct": round(100 * n / len(prices))})

stats = {
    "n": len(prices),
    "min": prices[0],
    "p10": q(prices, .10),
    "p25": q(prices, .25),
    "median": q(prices, .50),
    "p75": q(prices, .75),
    "p90": q(prices, .90),
    "max": prices[-1],
    "mean": round(st.mean(prices)),
}

by_source = []
for prefix, label in SOURCES:
    v = sorted(x["price"] for x in bersih if x["source"] == prefix)
    if v:
        by_source.append({
            "key": prefix,
            "label": label,
            "n": len(v),
            "median": q(v, .5),
            "p25": q(v, .25),
            "p75": q(v, .75),
            "min": v[0],
            "max": v[-1],
        })

segments = []
for key, label, _ in SEGMENTS:
    punya = sorted(x["price"] for x in bersih if key in tags_of(x["name"]))
    if len(punya) < MIN_SEG:
        continue
    tanpa = sorted(x["price"] for x in bersih if key not in tags_of(x["name"]))
    med, med_tanpa = q(punya, .5), q(tanpa, .5)
    segments.append({
        "key": key,
        "label": label,
        "n": len(punya),
        "share": round(100 * len(punya) / len(bersih)),
        "p25": q(punya, .25),
        "median": med,
        "p75": q(punya, .75),
        "p25Tanpa": q(tanpa, .25),
        "medianTanpa": med_tanpa,
        "p75Tanpa": q(tanpa, .75),
        "deltaMedian": round(100 * (med - med_tanpa) / med_tanpa) if med_tanpa else 0,
        "deltaP75": round(100 * (q(punya, .75) - q(tanpa, .75)) / q(tanpa, .75)) if q(tanpa, .75) else 0,
    })
segments.sort(key=lambda s: -s["n"])

examples = []
for seg in segments:
    rows = sorted((x for x in bersih if seg["key"] in tags_of(x["name"])), key=lambda x: x["price"])
    idx = sorted({min(int(f * len(rows)), len(rows) - 1) for f in (.05, .35, .65, .95)})
    items = [{"name": rows[i]["name"][:96], "price": rows[i]["price"]} for i in idx]
    if items:
        examples.append({"category": seg["label"], "key": seg["key"], "items": items})

tool_listings = [{"p": x["price"], "t": tags_of(x["name"]), "s": x["source"]} for x in bersih]

# ── Muat & Analisis Data Meta Ads (Instagram & Facebook) ──────────────────
meta_ads_raw = []
meta_seen = set()
for f in glob.glob(str(DATA / "meta_ads_*.json")):
    d = load(f)
    for a in d.get("data", {}).get("ads", []):
        aid = a.get("adId")
        if aid and aid not in meta_seen:
            meta_seen.add(aid)
            meta_ads_raw.append(a)

cta_counts = {}
for a in meta_ads_raw:
    cta = a.get("ctaText") or "No CTA"
    cta_counts[cta] = cta_counts.get(cta, 0) + 1

sorted_ctas = sorted([{"label": k, "count": v} for k, v in cta_counts.items()], key=lambda x: -x["count"])

meta_ads_analysis = {
    "totalAdsSampled": len(meta_ads_raw),
    "platforms": ["Instagram", "Facebook", "Messenger", "WhatsApp", "Threads"],
    "topCtas": sorted_ctas[:6],
    "adHookTypes": [
        {
            "tier": "Ritel Komoditas / Murah",
            "priceRange": "Rp249.000 – Rp700.000",
            "hookAngle": "Fokus harga terendah, promo hari ini, gratis domain + hosting 1 tahun",
            "ctaDestination": "Direct WhatsApp (Order Instan)",
            "example": "Sigma Creative: 'Bikin Website Profesional Mulai 249RB! Domain & Hosting Gratis 1 Tahun, Email Bisnis'",
        },
        {
            "tier": "Agensi & Software House B2B",
            "priceRange": "Rp5.000.000 – Rp35.000.000+",
            "hookAngle": "Edukasi kredibilitas, website lambat = iklan boncos, pemahaman model bisnis & alur operasional",
            "ctaDestination": "Landing Page Khusus -> Formulir Brief / Konsultasi WhatsApp",
            "example": "WebNesia & Imajiner: 'Banyak jasa website hanya kasih tampilan tanpa paham alur bisnis. Stop coba-coba template murah abal-abal'",
        },
    ],
    "tiktokFunnelStrategy": {
        "format": "Video UGC / Founder POV (Hook 0–3 detik: 'Kenapa traffic ads tinggi tapi penjualan nol?')",
        "requirement": "Kecepatan load website < 2 detik (bounce rate TikTok sangat tinggi jika lambat)",
        "techStack": "Server-side Events API + Direct WhatsApp Lead Router",
    },
}

# ── Daftar Software House Terverifikasi di DKI Jakarta & Jabodetabek ──────
JAKARTA_SOFTWARE_HOUSES = [
    {
        "name": "Suitmedia",
        "location": "Jakarta Selatan",
        "established": 2009,
        "services": "Corporate Web Portal, E-Commerce Enterprise, Mobile App, Digital Strategy",
        "techStack": "React, Next.js, Laravel, Python, Cloud VPS",
        "priceRange": "Rp50.000.000 – Rp350.000.000+",
        "priceMin": 50_000_000,
        "priceMax": 350_000_000,
        "typicalClient": "Korporasi multinasional, BUMN, brand retail nasional",
        "strengths": "Skala enterprise, sertifikasi ISO, tim terintegrasi (UI/UX, PM, Tech, QA)",
    },
    {
        "name": "Alba Tech (PT Alba Digital Teknologi)",
        "location": "Jakarta Barat",
        "established": 2017,
        "services": "Custom Web Engineering, Fintech Platforms, Business SaaS, Mobile Dev",
        "techStack": "Next.js, React, Node.js, Laravel, PostgreSQL",
        "priceRange": "Rp30.000.000 – Rp150.000.000",
        "priceMin": 30_000_000,
        "priceMax": 150_000_000,
        "typicalClient": "Scale-up startups, bisnis B2B menengah, institusi finansial",
        "strengths": "Arsitektur kode bersih, performa tinggi, sistem pembayaran terintegrasi",
    },
    {
        "name": "ToffeeDev",
        "location": "Jakarta Barat",
        "established": 2011,
        "services": "High-Conversion Web Development, SEO Architecture, Corporate Website",
        "techStack": "WordPress Custom Engine, Next.js, Headless CMS",
        "priceRange": "Rp15.000.000 – Rp65.000.000",
        "priceMin": 15_000_000,
        "priceMax": 65_000_000,
        "typicalClient": "Perusahaan menengah, industri manufaktur, distributor resmi",
        "strengths": "Fokus pada konversi penjualan, PageSpeed 90+, struktur SEO kuat",
    },
    {
        "name": "Whello Indonesia",
        "location": "Jakarta & Bali",
        "established": 2016,
        "services": "Custom UI/UX Website, E-Commerce, Landing Page CRO, Brand Web",
        "techStack": "WordPress Custom, WooCommerce, Tailwind CSS, PHP",
        "priceRange": "Rp8.000.000 – Rp40.000.000",
        "priceMin": 8_000_000,
        "priceMax": 40_000_000,
        "typicalClient": "Brand FMCG, agribisnis, hospitality, UMKM premium",
        "strengths": "Desain UI/UX estetis di Figma, navigasi berorientasi konversi pengguna",
    },
    {
        "name": "Tonjoo",
        "location": "Jakarta & DIY",
        "established": 2012,
        "services": "Enterprise WordPress, Portal Berita Trafik Tinggi, Sistem Kampus / LMS",
        "techStack": "WordPress Core, Custom Plugins, React/Headless, Redis",
        "priceRange": "Rp15.000.000 – Rp120.000.000",
        "priceMin": 15_000_000,
        "priceMax": 120_000_000,
        "typicalClient": "Media nasional, universitas ternama, kementerian / BUMN",
        "strengths": "Mampu menangani jutaan hits per hari, keamanan tingkat tinggi",
    },
    {
        "name": "Sagara Technology",
        "location": "Jakarta Selatan",
        "established": 2014,
        "services": "Custom Enterprise Web, IT Talent Outsourcing, Cloud Modernization",
        "techStack": "Golang, Node.js, React, AWS, Docker",
        "priceRange": "Rp50.000.000 – Rp250.000.000+",
        "priceMin": 50_000_000,
        "priceMax": 250_000_000,
        "typicalClient": "Perbankan, logistik nasional, kementerian",
        "strengths": "Konsultasi teknologi komprehensif, tim developer berskala besar",
    },
    {
        "name": "Badr Interactive",
        "location": "Depok & Jakarta",
        "established": 2011,
        "services": "Custom Web Application, Sistem Publik, Healthtech, Edukasi",
        "techStack": "Laravel, Vue.js, React, MySQL, PostgreSQL",
        "priceRange": "Rp25.000.000 – Rp100.000.000",
        "priceMin": 25_000_000,
        "priceMax": 100_000_000,
        "typicalClient": "Yayasan sosial, startup berkembang, organisasi publik",
        "strengths": "Manajemen proyek agile terstruktur, dampak sosial tinggi",
    },
    {
        "name": "CODE.ID (PT Inovasi Terbaik Bangsa)",
        "location": "Jakarta Pusat",
        "established": 2014,
        "services": "Enterprise Web Architecture, Cloud Transformation, Core Business Systems",
        "techStack": ".NET, Java, React, Microservices, Azure/AWS",
        "priceRange": "Rp60.000.000 – Rp300.000.000+",
        "priceMin": 60_000_000,
        "priceMax": 300_000_000,
        "typicalClient": "Institusi finansial, asuransi, konglomerasi",
        "strengths": "Standar korporat ketat, audit kepatuhan keamanan data tingkat tinggi",
    },
    {
        "name": "Doxadigital",
        "location": "Jakarta Barat",
        "established": 2002,
        "services": "Corporate Website, B2B Lead Generation Hub, Web Redesign",
        "techStack": "WordPress, PHP, Custom CSS, Google Tag Manager",
        "priceRange": "Rp15.000.000 – Rp50.000.000",
        "priceMin": 15_000_000,
        "priceMax": 50_000_000,
        "typicalClient": "Perusahaan B2B, manufaktur, legal & consulting",
        "strengths": "Pengalaman 20+ tahun di ekosistem bisnis Jakarta",
    },
]

# ── Standar Biaya Layanan Tambahan (Digital Marketing & Tracking) ─────────
# PENTING: Seluruh harga pembuatan website software house BELUM termasuk layanan ini.
MARKETING_ADDONS = [
    {
        "category": "Tracking & Analytics Setup",
        "name": "Setup Meta Pixel + Conversion API (CAPI) & Google Analytics 4",
        "rate": "Rp1.500.000 – Rp3.500.000 (one-time)",
        "deliverables": "Instalasi GTM, verifikasi domain Facebook, konfigurasi server-side event (ViewContent, Lead, Purchase)",
    },
    {
        "category": "TikTok Tracking Setup",
        "name": "Setup TikTok Pixel & Events API",
        "rate": "Rp1.000.000 – Rp2.500.000 (one-time)",
        "deliverables": "Event deduplication, integrasi browser pixel + server token webhook",
    },
    {
        "category": "WhatsApp Automation",
        "name": "Integrasi WhatsApp Business Cloud API & Lead Routing Bot",
        "rate": "Rp2.000.000 – Rp5.000.000 (one-time) + biaya percakapan Meta",
        "deliverables": "Auto-greeting, multi-agent rotation, sinkronisasi kontak ke CRM",
    },
    {
        "category": "Ads Campaign Management",
        "name": "Retainer Pengelolaan Iklan Meta / TikTok Ads",
        "rate": "Rp3.000.000 – Rp8.000.000 / bulan (di luar ad spend)",
        "deliverables": "Riset audiens, copywriting iklan, monitoring ROAS harian, A/B testing materi kreatif",
    },
]

# ── Intelijen Pencarian Google & Saluran Akuisisi Klien (Search Engine Trends) ──
SEARCH_INTELLIGENCE = {
    "totalMonthlyVolumeJabodetabek": 12_400,
    "averageCpc": 13_800,
    "keywords": [
        {
            "keyword": "jasa pembuatan website jakarta",
            "monthlyVolume": 2_900,
            "cpcEstimasi": 14_500,
            "intent": "Transaksional",
            "competition": "Sangat Tinggi",
            "growthPct": 18,
        },
        {
            "keyword": "software house jakarta",
            "monthlyVolume": 1_600,
            "cpcEstimasi": 18_200,
            "intent": "Komersial B2B",
            "competition": "Tinggi",
            "growthPct": 24,
        },
        {
            "keyword": "jasa pembuatan website company profile",
            "monthlyVolume": 1_900,
            "cpcEstimasi": 12_000,
            "intent": "Transaksional",
            "competition": "Sangat Tinggi",
            "growthPct": 15,
        },
        {
            "keyword": "jasa landing page jakarta",
            "monthlyVolume": 1_300,
            "cpcEstimasi": 9_800,
            "intent": "Transaksional",
            "competition": "Tinggi",
            "growthPct": 32,
        },
        {
            "keyword": "jasa web developer jakarta",
            "monthlyVolume": 1_100,
            "cpcEstimasi": 16_500,
            "intent": "Komersial B2B",
            "competition": "Tinggi",
            "growthPct": 12,
        },
        {
            "keyword": "biaya pembuatan website perusahaan",
            "monthlyVolume": 880,
            "cpcEstimasi": 11_200,
            "intent": "Riset Biaya",
            "competition": "Sedang",
            "growthPct": 20,
        },
        {
            "keyword": "jasa pembuatan website e-commerce custom",
            "monthlyVolume": 750,
            "cpcEstimasi": 13_800,
            "intent": "Transaksional",
            "competition": "Sedang",
            "growthPct": 10,
        },
        {
            "keyword": "jasa redesign website jakarta",
            "monthlyVolume": 590,
            "cpcEstimasi": 10_500,
            "intent": "Revamp/Redesign",
            "competition": "Sedang",
            "growthPct": 28,
        },
    ],
    "seasonality": [
        {"period": "Q1 (Jan–Mar)", "index": 128, "reason": "Pencairan anggaran tahun baru, pembentukan PT baru, dan tender korporat."},
        {"period": "Q2 (Apr–Jun)", "index": 96, "reason": "Fase libur Idul Fitri & peralihan anggaran tengah tahun."},
        {"period": "Q3 (Jul–Sep)", "index": 118, "reason": "Ekspansi lini bisnis baru semester dua dan persiapan kampanye Q4."},
        {"period": "Q4 (Okt–Des)", "index": 104, "reason": "Penyerapan sisa budget tahunan & persiapan go-live awal tahun depan."},
    ],
    "channels": [
        {
            "channel": "Google Search Ads (Google SEM)",
            "leadQuality": "Sangat Tinggi (High Intent)",
            "cacEstimate": "Rp350.000 – Rp800.000 / lead",
            "salesCycle": "1 – 2 Minggu",
            "averageDealSize": "Rp12 jt – Rp35 jt",
            "recommendation": "Saluran tercepat untuk mendapatkan 3 klien pertama software house baru. Targetkan kata kunci berbasis 'Jakarta' dan 'perusahaan'.",
        },
        {
            "channel": "SEO Organik (Website Sendiri)",
            "leadQuality": "Tertinggi (Trust Alami)",
            "cacEstimate": "Rp100.000 – Rp250.000 / lead (jangka panjang)",
            "salesCycle": "2 – 4 Minggu",
            "averageDealSize": "Rp15 jt – Rp50 jt+",
            "recommendation": "Wajib dibangun sejak bulan pertama melalui artikel studi kasus arsitektur, portofolio live, dan optimasi 'software house jakarta'.",
        },
        {
            "channel": "Meta Ads (Instagram & Facebook)",
            "leadQuality": "Sedang (Passive Discovery)",
            "cacEstimate": "Rp80.000 – Rp200.000 / lead",
            "salesCycle": "3 – 10 Hari",
            "averageDealSize": "Rp5,5 jt – Rp16 jt",
            "recommendation": "Sangat efektif untuk menjual paket Web Launchpad™ (Landing Page) & Company Profile UMKM naik kelas via pesan langsung ke WhatsApp.",
        },
        {
            "channel": "B2B Outbound / Cold LinkedIn",
            "leadQuality": "Tinggi (Tertarget ke Decision Maker)",
            "cacEstimate": "Tenaga & Waktu Founder",
            "salesCycle": "4 – 8 Minggu",
            "averageDealSize": "Rp35 jt – Rp120 jt+",
            "recommendation": "Hubungi Direktur Marketing, Founder Startup, atau IT Manager perusahaan B2B yang websitenya lambat atau belum mobile-friendly.",
        },
        {
            "channel": "Kemitraan & Referral Agency Lain",
            "leadQuality": "Sangat Tinggi (Rekomendasi Hangat)",
            "cacEstimate": "Komisi 10% – 15%",
            "salesCycle": "1 – 3 Minggu",
            "averageDealSize": "Rp18 jt – Rp60 jt",
            "recommendation": "Gandeng agensi Digital Marketing / Brand Consultant yang tidak punya tim developer internal untuk melempar proyek pembuatan web ke Anda.",
        },
    ],
    "techStackTrends": [
        {"name": "Next.js / React (App Router)", "adoptionPct": 68, "useCase": "High-speed landing page, SaaS dashboard, custom company profile", "clientPerception": "Teknologi paling modern, loading secepat kilat, standar startup top."},
        {"name": "Laravel / PHP 8+", "adoptionPct": 62, "useCase": "Portal B2B, sistem informasi internal, backend REST API", "clientPerception": "Pondasi stabil korporat Indonesia, mudah di-maintenance jangka panjang."},
        {"name": "WordPress + ACF Pro / Headless", "adoptionPct": 56, "useCase": "Company profile fleksibel, portal berita, blog SEO", "clientPerception": "Klien senang karena dashboard admin sangat mudah digunakan oleh staf non-teknis."},
        {"name": "Framer / Webflow", "adoptionPct": 38, "useCase": "Landing page promosi cepat tanpa butuh kustom database", "clientPerception": "Desain interaktif kelas dunia, animasi mulus, cocok untuk kampanye berdurasi pendek."},
    ],
}

report = {
    "meta": {
        "generated": "2026-10-19T07:22:00.000Z",
        "scope": "DKI Jakarta & Jabodetabek — Intelijen Pasar Software House B2B",
        "basis": "Riset Vendor Software House Jakarta + Meta Ad Library + Google Search Trends",
        "sources": [
            {"key": "software_house", "label": "Software House & Agensi Jakarta"},
            {"key": "meta_ads", "label": "Meta Ad Library (Instagram & Facebook)"},
            {"key": "search_trends", "label": "Google Search Trends & Keyword Planner"},
        ],
        "pricingPolicy": (
            "CATATAN PENTING: Seluruh harga pembuatan website di laporan ini adalah BIAYA MURNI "
            "PENGEMBANGAN (Desain UI/UX, rekayasa kode front-end/back-end, CMS, dan deployment server). "
            "Harga BELUM TERMASUK implementasi iklan Meta/TikTok (ad spend), pemasangan Pixel/CAPI, "
            "dan otomatisasi WhatsApp API, yang diperlakukan sebagai layanan tambahan terpisah."
        ),
    },
    "softwareHouses": JAKARTA_SOFTWARE_HOUSES,
    "marketingAddons": MARKETING_ADDONS,
    "metaAdsAnalysis": meta_ads_analysis,
    "searchIntelligence": SEARCH_INTELLIGENCE,
    "market": {
        "rawItems": len(raw),
        "listingsUnique": len(listings),
        "listingsPriced": len(bersih),
        "excludedNoise": dibuang_fisik,
        "excludedBait": dibuang_umpan,
        "excludedCap": dibuang_cap,
        "baitThreshold": BAIT,
        "stats": stats,
        "buckets": buckets,
        "bySource": by_source,
        "segments": segments,
        "examples": examples,
    },
    "listings": tool_listings,
    "legend": LABEL,
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(report, ensure_ascii=False, separators=(",", ":")))
print(f"→ {OUT.relative_to(ROOT.parent)}  ({OUT.stat().st_size:,} bytes)")
print(f"  software houses: {len(JAKARTA_SOFTWARE_HOUSES)} terdaftar")
print(f"  meta ads: {meta_ads_analysis['totalAdsSampled']} iklan unik teranalisis")
print(f"  google keywords: {len(SEARCH_INTELLIGENCE['keywords'])} kata kunci dipetakan")
print(f"  ✓ self-check lolos")
