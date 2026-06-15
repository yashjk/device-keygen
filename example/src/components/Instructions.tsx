import { motion } from 'framer-motion'
import React from 'react'

export const Instructions: React.FC = () => (
  <motion.p
    className="text-center mx-auto"
    style={{ marginTop: 4, maxWidth: 520, fontSize: 13, lineHeight: 1.6, color: 'var(--text-dim)' }}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}
  >
    Tip: open this in incognito or behind a VPN — the key stays stable, because it’s
    derived from device characteristics, not your IP or cookies.
  </motion.p>
)
