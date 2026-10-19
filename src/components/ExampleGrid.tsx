import { rp } from "../lib/format";

export type ExampleSet = {
  category: string;
  items: { name: string; price: number }[];
};

/** Contoh listing nyata per kategori — bukti di balik angka. */
export function ExampleGrid({ sets }: { sets: ExampleSet[] }) {
  return (
    <div className="examples">
      {sets.map((set) => (
        <div className="examples__cell" key={set.category}>
          <h4 className="examples__title">{set.category}</h4>
          <ul className="examples__list">
            {set.items.map((it) => (
              <li key={it.name}>
                <span className="examples__name">{it.name}</span>
                <span className="examples__price">{rp(it.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
