import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function Section({
  id,
  eyebrow,
  title,
  note,
  children,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.section
      className="section"
      id={id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="section__eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {note ? <p className="section__note">{note}</p> : null}
      {children}
    </motion.section>
  );
}
