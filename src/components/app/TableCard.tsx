// src/components/TableCard.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BrandAirtable } from 'tabler-icons-react'

type Status = 'free' | 'reserved' | 'occupied'

export interface TableCardProps {
  id: string // "001" (el # se agrega en la UI)
  status: Status // 'free' | 'reserved' | 'occupied'
  startTime?: string | Date // cuándo inició (para timer); opcional si 'free'
  amountPEN?: number // monto en soles (PEN)
  managerName?: string // usuario a cargo
  href?: string // link a detalle
  className?: string
}

const STATUS_STYLES: Record<
  Status,
  {
    bg: string
    hover: string
    text: string
    dot: string
    border: string
  }
> = {
  free: {
    bg: 'bg-emerald-50/50',
    hover: 'hover:bg-emerald-100',
    text: 'text-emerald-900',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200',
  },
  reserved: {
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-100',
    text: 'text-amber-900',
    dot: 'bg-amber-500',
    border: 'border-amber-200',
  },
  occupied: {
    bg: 'bg-orange-200',
    hover: 'hover:bg-orange-300',
    text: 'text-orange-900',
    dot: 'bg-orange-500',
    border: 'border-orange-300',
  },
}

function formatDuration(ms: number) {
  if (ms < 0 || !Number.isFinite(ms)) return '--:--:--'
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0')
  const m = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0')
  return `${h}:${m}:${s}`
}

const currencyPEN = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const TableCard: React.FC<TableCardProps> = ({
  id,
  status,
  startTime,
  amountPEN,
  managerName,
  href,
  className = '',
}) => {
  const [now, setNow] = useState<Date>(() => new Date())
  const timerRef = useRef<number | null>(null)

  const startedAt = useMemo(
    () => (startTime ? new Date(startTime) : undefined),
    [startTime]
  )

  // Tick cada 1s solamente si no está 'free'
  useEffect(() => {
    if (status === 'free') {
      if (timerRef.current) window.clearInterval(timerRef.current)
      return
    }
    timerRef.current = window.setInterval(() => setNow(new Date()), 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [status])

  const elapsed = startedAt
    ? formatDuration(now.getTime() - startedAt.getTime())
    : '--:--:--'

  const styles = STATUS_STYLES[status]
  const Wrapper: React.ElementType = href ? 'a' : 'div'
  const wrapperProps = href ? { href } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={[
        'group relative block rounded-lg p-4 shadow-sm border transition',
        styles.bg,
        styles.border,
        styles.hover,
        className,
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/20',
      ].join(' ')}
    >
      {/* Dot de estado */}
      <span
        className={`absolute right-3 top-3 h-3 w-3 rounded-full ring-2 ring-white/70 ${styles.dot}`}
        aria-hidden
      />

      {/* Encabezado: #id + icono */}
      <div className="mb-1 flex items-center justify-between">
        <div className="text-sm font-bold tracking-wide text-black/90">
          #{id}
        </div>
        <BrandAirtable className="h-5 w-5 text-black/50" />
      </div>

      {/* Timer / etiqueta de estado */}
      <div className="mt-1">
        {status === 'free' ? (
          <div className="text-center text-sm font-semibold uppercase tracking-wide text-black/60">
            Free
          </div>
        ) : (
          <div className="text-center text-2xl font-extrabold text-white drop-shadow-sm tabular-nums">
            {elapsed}
          </div>
        )}
      </div>

      {/* Manager */}
      {managerName && (
        <div className="mt-2 text-center text-base font-semibold text-black/80">
          {managerName}
        </div>
      )}

      {/* Monto en Soles */}
      {typeof amountPEN === 'number' && (
        <div className="mt-1 text-center text-lg font-semibold text-black">
          {currencyPEN.format(amountPEN)}
        </div>
      )}
    </Wrapper>
  )
}

export default TableCard
