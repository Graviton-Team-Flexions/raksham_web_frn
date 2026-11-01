import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'

const AUTO_MS = 4200
const TWEEN_MS = 700
const MIN_SLOTS = 6 // a ring needs enough faces to look like a ring, so short lists repeat
const GAP = 28 // extra radius between neighbouring faces
const DRAG_DEG_PER_PX = 0.3
const FRONT_DEG = 28 // faces within this angle of the front can be used with keyboard and pointer

const mod = (a, n) => ((a % n) + n) % n
const wrap180 = (deg) => mod(deg + 180, 360) - 180
const ease = (p) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2)
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A 360-degree ring of cards. Cards sit around a cylinder that turns by itself, can be dragged, and
// has arrows and a pause button. The loop never ends. Faces turned away are hidden.
// `renderItem(item)` returns the card (not wrapped in an <li>).
function RingCarousel({ items, label, renderItem }) {
  const { t } = useTranslation()
  const total = items.length
  const slots = useMemo(() => {
    const copies = Math.max(1, Math.ceil(MIN_SLOTS / total))
    return Array.from({ length: total * copies }, (_, index) => ({ index, item: items[index % total] }))
  }, [items, total])
  const count = slots.length
  const step = 360 / count

  const stage = useRef(null)
  const ring = useRef(null)
  const faces = useRef([])
  const angle = useRef(0)
  const radius = useRef(0)
  const frame = useRef(0)
  const hold = useRef({ hover: false, focus: false, drag: false })
  const gesture = useRef({ down: false, x: 0, from: 0, moved: false, blockClick: false })
  const [front, setFront] = useState(0)
  const [playing, setPlaying] = useState(() => typeof window !== 'undefined' && !prefersReducedMotion())

  // Puts the ring at its current angle, fades faces that turn away, and reports which one is in front.
  const paint = useCallback(() => {
    const a = angle.current
    if (ring.current) ring.current.style.transform = `translateZ(${-radius.current}px) rotateY(${a}deg)`
    faces.current.forEach((face, index) => {
      if (!face) return
      const away = Math.abs(wrap180(index * step + a))
      face.style.opacity = String(0.25 + 0.75 * Math.max(0, Math.cos((away * Math.PI) / 180)))
      face.inert = away > FRONT_DEG
    })
    const frontSlot = mod(Math.round(-a / step), count)
    setFront((current) => (current === frontSlot % total ? current : frontSlot % total))
  }, [count, step, total])

  const turnTo = useCallback((target) => {
    cancelAnimationFrame(frame.current)
    if (prefersReducedMotion()) {
      angle.current = target
      paint()
      return
    }
    const from = angle.current
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / TWEEN_MS)
      angle.current = from + (target - from) * ease(progress)
      paint()
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }, [paint])

  const turn = useCallback((direction) => {
    turnTo(Math.round(angle.current / step) * step - direction * step)
  }, [step, turnTo])

  // The ring's radius follows the card width, so it fits phones and desktops alike.
  useEffect(() => {
    const el = stage.current
    if (!el) return undefined
    const observer = new ResizeObserver(() => {
      const width = faces.current[0]?.offsetWidth ?? 0
      if (!width) return
      radius.current = width / 2 / Math.tan(Math.PI / count) + GAP
      ring.current.style.setProperty('--ring-r', `${radius.current}px`)
      paint()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [count, paint])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  // Turns one card at a time, unless the person is hovering, focused, dragging, or the tab is hidden.
  useEffect(() => {
    if (!playing) return undefined
    const id = setInterval(() => {
      const { hover, focus, drag } = hold.current
      if (!hover && !focus && !drag && !document.hidden) turn(1)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [playing, turn])

  const onPointerDown = (event) => {
    if (event.button > 0) return
    gesture.current = { down: true, x: event.clientX, from: angle.current, moved: false, blockClick: false }
  }
  const onPointerMove = (event) => {
    const g = gesture.current
    if (!g.down) return
    const dx = event.clientX - g.x
    if (!g.moved && Math.abs(dx) > 6) {
      g.moved = true
      hold.current.drag = true
      cancelAnimationFrame(frame.current)
      stage.current.setPointerCapture(event.pointerId)
    }
    if (g.moved) {
      angle.current = g.from + dx * DRAG_DEG_PER_PX
      paint()
    }
  }
  const endGesture = () => {
    const g = gesture.current
    if (!g.down) return
    g.down = false
    hold.current.drag = false
    if (g.moved) {
      g.blockClick = true
      setTimeout(() => { g.blockClick = false }, 0)
      turnTo(Math.round(angle.current / step) * step)
    }
  }
  const swallowDragClick = (event) => {
    if (gesture.current.blockClick) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  return (
    <div className="rcar" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        className="rcar__stage"
        ref={stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onPointerEnter={() => { hold.current.hover = true }}
        onPointerLeave={() => { hold.current.hover = false; endGesture() }}
        onFocus={() => { hold.current.focus = true }}
        onBlur={() => { hold.current.focus = false }}
        onClickCapture={swallowDragClick}
      >
        <ul className="rcar__body" ref={ring} style={{ '--step': `${step}deg` }}>
          {slots.map((slot) => (
            <li
              key={slot.index}
              className="rcar__face"
              ref={(node) => { faces.current[slot.index] = node }}
              style={{ transform: `rotateY(${slot.index * step}deg) translateZ(var(--ring-r, 0px))` }}
            >
              {renderItem(slot.item)}
            </li>
          ))}
        </ul>
      </div>

      <div className="hscroll__bar">
        <div className="hscroll__rail" aria-hidden="true">
          <span style={{ width: `${((front + 1) / total) * 100}%`, left: 0 }} />
        </div>
        <span className="hscroll__count" aria-live="off">{t('advocates.position', { current: front + 1, total })}</span>
        <button type="button" className="hscroll__arrow" onClick={() => setPlaying((value) => !value)} aria-label={playing ? t('advocates.pause') : t('advocates.play')}>
          {playing ? <Pause aria-hidden="true" strokeWidth={2} /> : <Play aria-hidden="true" strokeWidth={2} />}
        </button>
        <button type="button" className="hscroll__arrow" onClick={() => turn(-1)} aria-label={t('advocates.previous')}>
          <ArrowLeft aria-hidden="true" strokeWidth={2} />
        </button>
        <button type="button" className="hscroll__arrow" onClick={() => turn(1)} aria-label={t('advocates.next')}>
          <ArrowRight aria-hidden="true" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

export default RingCarousel
