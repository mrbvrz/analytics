import raw from "./report.json";
import type { Report } from "./report.types";

/**
 * Satu-satunya pintu masuk data laporan.
 * Jangan pernah menulis angka laporan secara langsung di komponen —
 * semuanya harus lewat sini agar bisa diperbarui dengan `npm run data`.
 */
export const report = raw as Report;
