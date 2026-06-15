import { useState } from 'react'
// Use the npm package dependency
import { getCurrentBrowserFingerPrint } from 'device-unique-keygen'
import { Header } from './components/Header'
import { HeroCard } from './components/HeroCard'
import { FeatureIcons } from './components/FeatureIcons'
import { Instructions } from './components/Instructions'

function App() {
  const [fingerprint, setFingerprint] = useState<string | undefined>('')
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateFingerprint = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const fp = await getCurrentBrowserFingerPrint()
      await new Promise((resolve) => {
        setTimeout(() => {
          setFingerprint(String(fp))
          resolve(fp)
        }, 1400)
      })
    } catch (e: any) {
      setError(e?.message || 'Failed to generate fingerprint')
      setFingerprint('')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!fingerprint) return
    try {
      await navigator.clipboard.writeText(fingerprint)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) { /* noop */ }
  }

  return (
    <div className="App relative min-h-screen overflow-hidden">
      {/* Animated aurora background */}
      <div className="aurora" aria-hidden>
        <div className="aurora__blob aurora__blob--a" />
        <div className="aurora__blob aurora__blob--b" />
        <div className="aurora__blob aurora__blob--c" />
        <div className="aurora__grid" />
      </div>

      <div className="relative z-10 mx-auto px-5 sm:px-8" style={{ maxWidth: 920 }}>
        <Header />

        <main className="flex flex-col items-center" style={{ rowGap: 'clamp(16px, 2.5vw, 28px)', paddingTop: 'clamp(20px, 3.5vw, 40px)', paddingBottom: 'clamp(28px, 4vw, 52px)' }}>
          <HeroCard
            fingerprint={fingerprint}
            error={error}
            isGenerating={isGenerating}
            copied={copied}
            onGenerate={generateFingerprint}
            onCopy={copyToClipboard}
          />
          <FeatureIcons />
          <Instructions />
        </main>
      </div>
    </div>
  )
}

export default App
