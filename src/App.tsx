import { useCallback, useEffect, useState } from 'react'
import GameScene from './game/GameScene'

type Direction = 'forward' | 'backward' | 'left' | 'right'

export default function App() {
  const [position, setPosition] = useState<[number, number]>([0, 0])
  const [isRiding, setIsRiding] = useState(false)
  const [deliveries, setDeliveries] = useState(0)

  const move = useCallback((direction: Direction) => {
    const step = isRiding ? 0.8 : 0.35
    setPosition(([x, z]) => {
      switch (direction) {
        case 'forward': return [x, z - step]
        case 'backward': return [x, z + step]
        case 'left': return [x - step, z]
        case 'right': return [x + step, z]
      }
    })
  }, [isRiding])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keys: Record<string, Direction> = {
        w: 'forward', ArrowUp: 'forward',
        s: 'backward', ArrowDown: 'backward',
        a: 'left', ArrowLeft: 'left',
        d: 'right', ArrowRight: 'right',
      }
      const direction = keys[event.key]
      if (direction) {
        event.preventDefault()
        move(direction)
      }
      if (event.key.toLowerCase() === 'e') setIsRiding((value) => !value)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [move])

  const deliver = () => {
    setDeliveries((count) => count + 1)
    setPosition([0, 0])
  }

  return (
    <main className="game-shell">
      <GameScene playerPosition={position} isRiding={isRiding} />
      <header className="top-hud">
        <div className="brand">
          <span className="brand-mark">CL</span>
          <div><strong>COURIER LIFE</strong><small>SIMULATOR 3D · EARLY BUILD</small></div>
        </div>
        <div className="status-pill"><span className="status-dot" /> SHIFT PAGI</div>
      </header>

      <section className="mission-card">
        <span className="eyebrow">TUGAS AKTIF</span>
        <strong>Antarkan paket pertama</strong>
        <p>Keluar dari gudang dan jelajahi area sekitar.</p>
        <div className="mission-progress"><span style={{ width: deliveries > 0 ? '100%' : '12%' }} /></div>
        <small>{deliveries > 0 ? 'Paket berhasil diserahkan!' : 'Tujuan: Area penerimaan paket'}</small>
      </section>

      <div className="bottom-hud">
        <div className="stats-card">
          <span>UANG</span><strong>Rp { (deliveries * 15000).toLocaleString('id-ID') }</strong>
          <span className="divider-line" />
          <span>TERKIRIM</span><strong>{deliveries} paket</strong>
        </div>
        <div className="action-stack">
          <button className="action-button" onClick={() => setIsRiding((value) => !value)}>
            {isRiding ? 'TURUN' : 'NAIK MOTOR'} <kbd>E</kbd>
          </button>
          <button className="action-button primary" onClick={deliver}>SERAHKAN PAKET</button>
        </div>
      </div>

      <nav className="touch-controls" aria-label="Kontrol gerakan">
        <div className="d-pad">
          <button className="up" onClick={() => move('forward')} aria-label="Maju">▲</button>
          <button className="left" onClick={() => move('left')} aria-label="Kiri">◀</button>
          <button className="down" onClick={() => move('backward')} aria-label="Mundur">▼</button>
          <button className="right" onClick={() => move('right')} aria-label="Kanan">▶</button>
        </div>
        <span className="control-hint">GERAK</span>
      </nav>

      <div className="build-label">PROTOTYPE 0.1.0 <span>·</span> AREA GUDANG</div>
    </main>
  )
}
