import { motion } from 'framer-motion'
import { Feather, Gauge, Lock, Boxes } from 'lucide-react'
import React from 'react'

const features = [
  { icon: Feather, label: 'Zero deps', desc: 'Tiny bundle, no runtime dependencies', color: 'var(--feat-1)' },
  { icon: Gauge, label: 'Deterministic', desc: 'Same device → same key, every time', color: 'var(--feat-2)' },
  { icon: Lock, label: 'Privacy-first', desc: 'No cookies, no network calls', color: 'var(--feat-3)' },
  { icon: Boxes, label: 'ESM · CJS · IIFE', desc: 'Ships typed, multi-format builds', color: 'var(--feat-4)' },
]

export const FeatureIcons: React.FC = () => (
  <motion.div
    className="grid w-full gap-3"
    style={{ marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
    initial="hidden"
    animate="show"
    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } } }}
  >
    {features.map((f) => (
      <motion.div
        key={f.label}
        className="glass"
        style={{ borderRadius: 22, padding: 22 }}
        variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            className="flex items-center justify-center mb-4"
            style={{ width: 40, height: 40, borderRadius: 12, background: `color-mix(in srgb, ${f.color} 16%, transparent)`, border: `1px solid color-mix(in srgb, ${f.color} 35%, transparent)` }}
          >
            <f.icon className="w-5 h-5" style={{ color: f.color }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{f.label}</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.45 }}>{f.desc}</div>
        </div>
      </motion.div>
    ))}
  </motion.div>
)
