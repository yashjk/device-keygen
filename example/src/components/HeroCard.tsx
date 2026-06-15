import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Fingerprint, Copy, CheckCircle, Loader2, AlertTriangle, Sparkles, Terminal } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

interface HeroCardProps {
  fingerprint?: string
  error?: string | null
  isGenerating: boolean
  copied: boolean
  onGenerate(): void
  onCopy(): void
}

export const HeroCard: React.FC<HeroCardProps> = ({
  fingerprint,
  error,
  isGenerating,
  copied,
  onGenerate,
  onCopy,
}) => {
  // Bold, dynamic 3D tilt that follows the cursor.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 18 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => { mx.set(0); my.set(0) }

  return (
    <motion.div
      className="w-full"
      style={{ perspective: 1200, marginTop: 8 }}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.1 }}
    >
      <motion.div
        className="glass"
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', padding: 'clamp(28px, 4.5vw, 56px)' }}
      >
        <div style={{ position: 'relative', zIndex: 2, transform: 'translateZ(40px)' }}>
          {/* eyebrow */}
          <motion.div
            className="flex justify-center"
            style={{ marginBottom: 20 }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          >
            <span className="theme-badge">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              ZERO-DEPENDENCY · CANVAS · AUDIO · WEBGL
            </span>
          </motion.div>

          {/* title */}
          <motion.h1
            className="shimmer-text text-center font-extrabold leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 4.6rem)', margin: 0 }}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            Device Keygen
          </motion.h1>

          <motion.p
            className="text-center mx-auto"
            style={{ maxWidth: 580, marginTop: 16, color: 'var(--text-muted)', fontSize: 'clamp(15px, 1.6vw, 18px)', lineHeight: 1.6 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          >
            A unique, deterministic key for every device — distilled from canvas, audio
            and WebGL browser signals into one compact hash. No cookies, no tracking SDKs.
          </motion.p>

          {/* readout */}
          <motion.div
            className="glow-pulse font-mono relative overflow-hidden"
            style={{
              marginTop: 26,
              padding: '22px 24px',
              minHeight: 78,
              borderRadius: 18,
              background: 'var(--glass-inset)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isGenerating ? (
                <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-3" style={{ color: 'var(--accent)' }}>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader2 className="w-6 h-6" />
                  </motion.span>
                  <span style={{ fontSize: 15 }}>Analyzing browser signature…</span>
                </motion.div>
              ) : error ? (
                <motion.div key="err" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  className="flex items-center gap-3" style={{ color: 'var(--danger)', fontSize: 15 }}>
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span style={{ wordBreak: 'break-word' }}>{error}</span>
                </motion.div>
              ) : fingerprint ? (
                <motion.div key="fp" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  style={{ color: 'var(--fp-value)', fontSize: 'clamp(20px, 3vw, 28px)', wordBreak: 'break-all', fontWeight: 600, letterSpacing: '0.02em' }}>
                  {fingerprint}
                </motion.div>
              ) : (
                <motion.span key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ color: 'var(--text-placeholder)', fontSize: 15 }}>
                  Click Generate to produce this device’s unique key
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* actions */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3"
            style={{ marginTop: 22 }}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          >
            <Button size="lg" disabled={isGenerating} onClick={onGenerate}>
              <Fingerprint className="w-5 h-5" />
              {isGenerating ? 'Generating…' : fingerprint ? 'Regenerate Key' : 'Generate Device Key'}
            </Button>
            <motion.div whileHover={{ scale: fingerprint ? 1.03 : 1 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" size="lg" disabled={!fingerprint} onClick={onCopy}>
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </motion.div>
          </motion.div>

          {/* install command */}
          <motion.div
            className="flex justify-center"
            style={{ marginTop: 20 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          >
            <span
              className="glass-pill font-mono inline-flex items-center gap-2"
              style={{ padding: '8px 16px', fontSize: 13.5, color: 'var(--text-muted)' }}
            >
              <Terminal className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              npm i device-unique-keygen
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
