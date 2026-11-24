import { useEffect, useState } from 'react'
import GameScene from './game/GameScene'

type Controls = { forward: boolean; backward: boolean; left: boolean; right: boolean }
type Direction = keyof Controls

const emptyControls: Controls = { forward: false, backward: false, left: false, right: false }

export default function App() {
  const [controls, setControls] = useState<Controls>(emptyControls)
  const [isRiding, setIsRiding] = useState(false)
  const [canMount, setCanMount] = useState(false)
  const [deliveries, setDeliveries] = useState(0)

  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      w: 'forward', ArrowUp: 'forward',
      s: 'backward', ArrowDown: 'backward',
      a: 'left', ArrowLeft: 'left',
      d: 'right', ArrowRight: 'right',
    }
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = keyMap[event.key]
      if (direction) {
        event.preventDefault()
        setControls((current) => ({ ...current, [direction]: true }))
      }
      if (event.key.toLowerCase() === 'e' && !event.repeat) {
        setIsRiding((riding) => (riding ? false : canMount))
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      const direction = keyMap[event.key]
      if (direction) setControls((current) => ({ ...current, [direction]: false }))
    }
    const releaseAll = () => setControls(emptyControls)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', releaseAll)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', releaseAll)
    }
  }, [canMount])

  const hold = (direction: Direction, pressed: boolean) => {
    setControls((current) => ({ ...current, [direction]: pressed }))
  }

  const toggleRide = () => {
    if (isRiding) {
      setIsRiding(false)
    } else if (canMount) {
      setIsRiding(true)
    }
  }

  const deliver = () => setDeliveries((count) => count + 1)

  return (
    <main className="game-shell">
      <GameScene controls={controls} isRiding={isRiding} onCanMountChange={setCanMount} />
      <header className="top-hud">
        <div className="brand">
          <span className="brand-mark">CL</span>
          <div><strong>COURIER LIFE</strong><small>SIMULATOR 3D · PROTOTYPE 0.3</small></div>
        </div>
        <div className="status-pill"><span className="status-dot" /> SHIFT PAGI</div>
      </header>

      <section className="mission-card">
        <span className="eyebrow">LATIHAN KENDARAAN</span>
        <strong>{isRiding ? 'Mode berkendara aktif' : canMount ? 'Motor siap dinaiki' : 'Dekati motor untuk berkendara'}</strong>
        <p>{isRiding ? 'W/S gas dan rem · A/D belok kiri/kanan. Tekan E untuk turun.' : 'Berjalan dengan W/S/A/D. Dekati motor kuning, lalu tekan E.'}</p>
        <div className="mission-progress"><span style={{ width: isRiding ? '75%' : canMount ? '50%' : '20%' }} /></div>
        <small>{isRiding ? 'Motor memiliki badan fisika terpisah.' : 'Kamera mengikuti karakter dan motor secara otomatis.'}</small>
      </section>

      <div className="bottom-hud">
        <div className="stats-card">
          <span>UANG</span><strong>Rp {(deliveries * 15000).toLocaleString('id-ID')}</strong>
          <span className="divider-line" />
          <span>TERKIRIM</span><strong>{deliveries} paket</strong>
        </div>
        <div className="action-stack">
          <button className="action-button" onClick={toggleRide} disabled={!isRiding && !canMount}>
            {isRiding ? 'TURUN MOTOR' : canMount ? 'NAIK MOTOR' : 'DEKATI MOTOR'} <kbd>E</kbd>
          </button>
          <button className="action-button primary" onClick={deliver}>UJI SERAH PAKET</button>
        </div>
      </div>

      <nav className="touch-controls" aria-label="Kontrol gerakan">
        <div className="d-pad">
          <button className="up" onPointerDown={() => hold('forward', true)} onPointerUp={() => hold('forward', false)} onPointerLeave={() => hold('forward', false)} onPointerCancel={() => hold('forward', false)} onContextMenu={(e) => e.preventDefault()} aria-label="Maju">▲</button>
          <button className="left" onPointerDown={() => hold('left', true)} onPointerUp={() => hold('left', false)} onPointerLeave={() => hold('left', false)} onPointerCancel={() => hold('left', false)} onContextMenu={(e) => e.preventDefault()} aria-label="Kiri">◀</button>
          <button className="down" onPointerDown={() => hold('backward', true)} onPointerUp={() => hold('backward', false)} onPointerLeave={() => hold('backward', false)} onPointerCancel={() => hold('backward', false)} onContextMenu={(e) => e.preventDefault()} aria-label="Mundur">▼</button>
          <button className="right" onPointerDown={() => hold('right', true)} onPointerUp={() => hold('right', false)} onPointerLeave={() => hold('right', false)} onPointerCancel={() => hold('right', false)} onContextMenu={(e) => e.preventDefault()} aria-label="Kanan">▶</button>
        </div>
        <span className="control-hint">TAHAN UNTUK BERGERAK</span>
      </nav>

      <div className="build-label">PROTOTYPE 0.3.0 <span>·</span> MOTOR FISIKA TERPISAH</div>
    </main>
  )
}
