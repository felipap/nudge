import React from 'react'

function CloseSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <line
        x1="3"
        y1="3"
        x2="9"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="3"
        x2="3"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MinimizeSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <line
        x1="3"
        y1="6"
        x2="9"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ZoomSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function WindowControlCircle({
  color,
  label,
  icon,
  onClick,
}: {
  color: string
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <span
      aria-label={label}
      className="w-[13px] h-[13px] rounded-full inline-block border border-black/10 dark:border-white/10 relative transition-colors group-hover:duration-100 group-hover:[background-color:var(--hover-color)]"
      style={{ ['--hover-color' as any]: color }}
      onClick={onClick}
    >
      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {icon}
      </span>
    </span>
  )
}

export function WindowControls({
  onClose,
  onMinimize,
  onZoom,
}: {
  onClose: () => void
  onMinimize: () => void
  onZoom: () => void
}) {
  return (
    <div className="flex gap-2 items-center select-none group">
      <WindowControlCircle
        onClick={onClose}
        color="#ff5f56"
        label="Close"
        icon={
          <CloseSVG className="w-[9px] h-[9px] text-black/70 dark:text-white/80" />
        }
      />
      <WindowControlCircle
        onClick={onMinimize}
        color="#ffbd2e"
        label="Minimize"
        icon={
          <MinimizeSVG className="w-[9px] h-[9px] text-black/70 dark:text-white/80" />
        }
      />
      <WindowControlCircle
        onClick={onZoom}
        color="#27c93f"
        label="Zoom"
        icon={
          <ZoomSVG className="w-[9px] h-[9px] text-black/70 dark:text-white/80" />
        }
      />
    </div>
  )
}
