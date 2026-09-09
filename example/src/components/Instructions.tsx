import { motion } from 'framer-motion'
import React from 'react'

export const Instructions: React.FC = () => (
  <motion.p
    className="text-center mx-auto"
    style={{ marginTop: 4, maxWidth: 520, fontSize: 13, lineHeight: 1.6, color: 'var(--text-dim)' }}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}
  >
    The identifier can change when browser, display, language, hardware or privacy
    settings change. It is not an authentication credential.
  </motion.p>
)
