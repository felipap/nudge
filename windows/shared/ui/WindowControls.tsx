import React from 'react'
import { twMerge } from 'tailwind-merge'

export function CloseSVG({ className }: { className?: string }) {
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

export function MinimizeSVG({ className }: { className?: string }) {
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

export function ZoomSVG({ className }: { className?: string }) {
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

export function WindowControlCircle({
  label,
  icon,
  onClick,
  className,
  title,
  ...props
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
  className?: string
  title?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      aria-label={label}
      title={title}
      className={twMerge(
        'w-[13px] h-[13px] overflow-hidden rounded-full leading-[13px] inline-block border border-black/10 dark:border-white/10 relative cursor-pointer transition-colors',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {icon}
      </span>
    </span>
  )
}

export function WindowCloseButton({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <WindowControlCircle
      onClick={onClick}
      className={className}
      style={{ backgroundColor: '#ff5f56' }}
      label="Close"
      icon={<CloseSVG className="w-[1000px] h-[1000px] text-black/80" />}
    />
  )
}

export function WindowControls({
  onClose,
  onMinimize,
  onZoom,
  className,
}: {
  onClose: () => void
  onMinimize: () => void
  onZoom: () => void
  className?: string
}) {
  return (
    <div
      className={twMerge(
        'flex gap-2 items-center select-none group',
        className
      )}
    >
      <WindowCloseButton onClick={onClose} />
      <WindowControlCircle
        onClick={onMinimize}
        style={{ backgroundColor: '#ffbd2e' }}
        label="Minimize"
        icon={<MinimizeSVG className="w-[9px] h-[9px] text-black/60" />}
      />
      <WindowControlCircle
        onClick={onZoom}
        style={{ backgroundColor: '#27c93f' }}
        label="Zoom"
        icon={<ZoomSVG className="w-[9px] h-[9px] text-black/60" />}
      />
    </div>
  )
}
