import type { ReactNode } from "react";

export type Column<T> = {
  /** Kunci unik kolom, juga dipakai sebagai React key. */
  key: string;
  header: ReactNode;
  /** Rata kanan + angka tabular. Wajib untuk kolom angka. */
  num?: boolean;
  strong?: boolean;
  render: (row: T, index: number) => ReactNode;
};

/**
 * Tabel data. Setiap tabel dibungkus .table-scroll agar aman di layar sempit.
 * Kolom angka wajib diberi `num` supaya angka tabular dan rata kanan konsisten.
 */
export function DataTable<T>({
  columns,
  rows,
  zebra = false,
  caption,
}: {
  columns: Column<T>[];
  rows: T[];
  zebra?: boolean;
  caption?: string;
}) {
  return (
    <div className="table-scroll">
      <table className={`table${zebra ? " table--zebra" : ""}`}>
        {caption ? (
          <caption className="micro" style={{ textAlign: "left", captionSide: "top" }}>
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.num ? "num" : undefined} scope="col">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={[c.num ? "num" : "", c.strong ? "strong" : ""]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {c.render(row, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
