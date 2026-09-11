import { useState } from 'react'
import { ArrowLeft, Check, Copy, Heart, Smartphone } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Header } from './Header'
import './SupportPage.css'

const UPI_ID = 'yash-joshi-1@yescred'
const UPI_URL = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent('Yash Joshi')}&cu=INR`

export const SupportPage = () => {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  const copyUpiId = async () => {
    if (isCopying) return
    setIsCopying(true)
    setCopyError(false)
    try {
      await navigator.clipboard.writeText(UPI_ID)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
      setCopyError(true)
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="App support-page relative min-h-screen overflow-hidden">
      <div className="aurora" aria-hidden>
        <div className="aurora__blob aurora__blob--a" />
        <div className="aurora__blob aurora__blob--b" />
        <div className="aurora__blob aurora__blob--c" />
        <div className="aurora__grid" />
      </div>

      <div className="support-shell relative z-10 mx-auto px-5 sm:px-8">
        <Header />
        <main className="support-content">
          <a className="support-back" href="/">
            <ArrowLeft aria-hidden size={18} />
            Back to demo
          </a>

          <section className="support-layout">
            <div className="support-intro">
              <span className="support-kicker"><Heart aria-hidden size={16} /> Support open source</span>
              <h1>Help maintain Device Keygen.</h1>
              <p>
                Contributions support ongoing maintenance, browser compatibility testing,
                documentation, and future releases.
              </p>
              <p className="support-note">
                Support is entirely optional. The package remains free and open source,
                and contributing does not affect access or support.
              </p>
            </div>

            <div className="glass support-tool">
              <div className="support-qr" aria-label="UPI payment QR code">
                <QRCodeSVG value={UPI_URL} size={210} level="M" marginSize={2} />
              </div>
              <div className="support-payment">
                <span className="support-payment-label">UPI ID</span>
                <strong>{UPI_ID}</strong>
              </div>
              <div className="support-actions">
                <button className="theme-btn theme-btn--outline support-button" onClick={copyUpiId} type="button" disabled={isCopying}>
                  {copied ? <Check aria-hidden size={18} /> : <Copy aria-hidden size={18} />}
                  {isCopying ? 'Copying...' : copied ? 'Copied' : 'Copy UPI ID'}
                </button>
                <a className="theme-btn theme-btn--default support-button" href={UPI_URL}>
                  <Smartphone aria-hidden size={18} />
                  Pay with UPI
                </a>
              </div>
              <p className="support-copy-status" role={copyError ? 'alert' : 'status'} aria-live="polite">
                {copyError ? 'Copy failed. Select the UPI ID above and copy it manually.' : copied ? 'UPI ID copied to clipboard.' : ''}
              </p>
              <p className="support-mobile-hint">Scan the QR code or open this page on a UPI-enabled device.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
