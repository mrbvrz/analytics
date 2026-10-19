import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollIndicatorProps {
  /** Menampilkan bar indikator di paling atas layar */
  showTopBar?: boolean;
}

export function ScrollIndicator({
  showTopBar = true,
}: ScrollIndicatorProps) {
  const { scrollYProgress } = useScroll();

  // Animasi spring agar pergerakan bar sangat mulus tanpa patah-patah
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 35,
    restDelta: 0.001,
  });

  return (
    <>
      {/* 1. Bar Indikator Scroll di Atas Layar (Top Edge-to-Edge) */}
      {showTopBar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "3.5px",
            zIndex: 9999,
            pointerEvents: "none",
            background: "rgba(0, 0, 0, 0.04)",
          }}
        >
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              scaleX,
              transformOrigin: "0%",
              background:
                "linear-gradient(90deg, var(--accent) 0%, #e05d26 50%, var(--accent-hover) 100%)",
              boxShadow: "0 0 10px rgba(188, 74, 26, 0.5)",
            }}
          />
        </div>
      )}
    </>
  );
}
