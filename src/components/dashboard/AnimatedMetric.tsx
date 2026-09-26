import { useState, useEffect } from 'react'

export function AnimatedMetric({ value }: { value: string }) {
  const numeric = Number.parseInt(value, 10)
  const suffix = value.replace(String(numeric), '')
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let frame = 0
    const started = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - started) / 420, 1)
      setDisplay(Math.round(numeric * (1 - Math.pow(1 - progress, 3))))

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [numeric])

  return (
    <>
      {display}
      {suffix}
    </>
  )
}
