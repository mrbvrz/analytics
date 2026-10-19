#!/bin/bash
# ponytail: tiny curl wrapper, no framework needed
# Selalu jalan relatif terhadap folder skrip ini, bukan folder pemanggil,
# supaya output mendarat di pipeline/data/ dari direktori mana pun.
cd "$(dirname "$0")" || exit 1

# Kunci API tidak disimpan di repo. Set ZAPI_KEY, atau taruh di pipeline/.zapi_key
# (berkas itu ada di .gitignore).
K="${ZAPI_KEY:-$(cat .zapi_key 2>/dev/null)}"
if [ -z "$K" ]; then
  echo "ZAPI_KEY belum diset. Jalankan: export ZAPI_KEY=... atau tulis ke pipeline/.zapi_key" >&2
  exit 1
fi

B="https://api.zapi.ink/v1"
mkdir -p data
get(){
  local n="$1"; shift; local url="$1"; shift
  local code
  code=$(curl -s -m 60 -w "%{http_code}" -H "x-api-key: $K" -G "$url" "$@" -o "data/$n.json")
  printf "%-30s http=%s bytes=%s\n" "$n" "$code" "$(wc -c < "data/$n.json" | tr -d ' ')"
  sleep 0.4
}

# ── PENTING: nama parameter BERBEDA antar sumber ──────────────────────
# Shopee dan Blibli memakai `query`; Tokopedia memakai `q`.
# Salah nama parameter tidak selalu menghasilkan error yang jelas:
# Tokopedia membalas {"message":"Invalid params"}, tetapi sumber lain
# bisa diam-diam mengabaikannya dan mengembalikan hasil yang tidak
# berhubungan dengan kueri. Gejala itu pernah membuat data "Bing"
# berisi hasil tentang pizza, Bali, dan konverter mata uang.
#
# Sumber yang SUDAH DICOBA dan TIDAK BISA DIPAKAI — jangan diulang:
#   search-tools:bing, search-tools:brave  -> mengabaikan kueri, hasil acak
#   search-tools:google                    -> "does not match scraper category"
#   marketplace:lazada                     -> totalData 0
#   marketplace:sribu|fastwork|projects|bukalapak|tiktokshop -> tidak ada
#   jobs:glints                            -> total null
#   jobs:dealls                            -> ~1 item
#
# Karena itu SEMUA data yang tersedia adalah marketplace ritel, yaitu
# segmen bawah pasar. Tidak ada sumber harga agensi/software house.
# Laporan harus jujur soal batas ini.

QUERIES=(
  "website|jasa pembuatan website"
  "website_jkt|jasa pembuatan website jakarta"
  "buat_website|jasa buat website"
  "company_profile|jasa pembuatan website company profile"
  "toko_online|jasa pembuatan toko online"
  "landing_page|jasa pembuatan landing page"
  "redesign|jasa redesign website"
  "seo|jasa seo website"
  "web_umkm|jasa website umkm"
  "wordpress|jasa pembuatan website wordpress"
  "sekolah|jasa pembuatan website sekolah"
  "custom|jasa pembuatan website custom"
  "harga|harga jasa pembuatan website"
  "paket|paket jasa pembuatan website"
)

for q in "${QUERIES[@]}"; do
  name="${q%%|*}"; text="${q#*|}"
  get "shopee_$name"    "$B/marketplace:shopee/search"    --data-urlencode "query=$text"
  get "blibli_$name"    "$B/marketplace:blibli/search"    --data-urlencode "query=$text"
  get "tokopedia_$name" "$B/marketplace:tokopedia/search" --data-urlencode "q=$text"
done
