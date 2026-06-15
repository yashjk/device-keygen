import { motion } from 'framer-motion'
import { Fingerprint } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GithubSvgIcon, XSvgIcon } from './icons'
import { APP_VERSION } from '../version'

export const Header = () => {
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setIsLive(p => !p), 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.nav
      className="glass-pill flex items-center justify-between"
      style={{ marginTop: 18, padding: '10px 16px' }}
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="flex items-center justify-center"
          style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--metal-gradient)' }}
          whileHover={{ rotate: 12 }}
        >
          <Fingerprint className="w-5 h-5" style={{ color: 'var(--on-accent)' }} />
        </motion.div>
        <span style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>device-keygen</span>
        <span className="theme-badge" style={{ marginLeft: 4 }}>
          <motion.span
            className="inline-block"
            style={{ width: 7, height: 7, borderRadius: 9999, marginRight: 7, background: isLive ? 'var(--status-live)' : 'rgba(var(--accent-rgb),0.35)' }}
            animate={{ scale: isLive ? 1.25 : 1 }}
            transition={{ duration: 0.3 }}
          />
          {`v${APP_VERSION}`}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <motion.a href="https://www.npmjs.com/package/device-unique-keygen" target="_blank" rel="noreferrer"
          className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 10, color: 'var(--text-muted)' }}
          whileHover={{ scale: 1.12, color: 'var(--accent-bright)' }} whileTap={{ scale: 0.94 }} title="npm">
          <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.02em' }}>npm</span>
        </motion.a>
        <motion.a href="https://github.com/yashjk/device-keygen" target="_blank" rel="noreferrer"
          className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 10 }}
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.94 }} title="GitHub">
          <GithubSvgIcon className="w-5 h-5" style={{ fill: 'var(--text-muted)' }} />
        </motion.a>
        <motion.a href="https://x.com/joshiyash1206" target="_blank" rel="noreferrer"
          className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 10 }}
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.94 }} title="X">
          <XSvgIcon className="w-5 h-5" style={{ fill: 'var(--text-muted)' }} />
        </motion.a>
      </div>
    </motion.nav>
  )
}
