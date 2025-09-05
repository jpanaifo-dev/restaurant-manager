// src/components/DateTimeClock.tsx
import React, { useEffect, useMemo, useState } from 'react'

type Props = {
  /** p.ej. 'es-PE', 'en-US' */
  locale?: string
  /** p.ej. 'America/Lima' (opcional; usa la del navegador si no se pasa) */
  timeZone?: string
  /** Mostrar segundos en la hora */
  showSeconds?: boolean
  /** Formato 12h (true) o 24h (false) */
  hour12?: boolean
  /** Presentación: en una línea o apilado */
  variant?: 'inline' | 'stacked'
  /** Clases extra (Tailwind) */
  className?: string
  /** Personalización opcional */
  dateOptions?: Intl.DateTimeFormatOptions
  timeOptions?: Intl.DateTimeFormatOptions
  /** Intervalo de actualización en ms */
  tickMs?: number
}

const DateTimeClock: React.FC<Props> = ({
  locale = 'es-PE',
  timeZone,
  showSeconds = true,
  hour12 = false,
  variant = 'inline',
  className = '',
  dateOptions,
  timeOptions,
  tickMs = 1000,
}) => {
  const [now, setNow] = useState<Date>(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), tickMs)
    return () => clearInterval(id)
  }, [tickMs])

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        timeZone,
        ...dateOptions,
      }),
    [locale, timeZone, dateOptions]
  )

  const timeFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: showSeconds ? '2-digit' : undefined,
        hour12,
        timeZone,
        ...timeOptions,
      }),
    [locale, timeZone, showSeconds, hour12, timeOptions]
  )

  const dateStr = dateFmt.format(now)
  const timeStr = timeFmt.format(now)

  return variant === 'inline' ? (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-semibold">{timeStr}</span>
      <span className="opacity-60">|</span>
      <span className="capitalize opacity-80">{dateStr}</span>
    </div>
  ) : (
    <div className={`leading-tight ${className}`}>
      <div className="font-semibold">{timeStr}</div>
      <div className="text-xs capitalize opacity-80">{dateStr}</div>
    </div>
  )
}

export default DateTimeClock
