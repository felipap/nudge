import { ReactNode, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface TooltipProps {
  children: ReactNode
  content: string | null
  className?: string
}

export function WidgetTooltip({ children, content, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  if (!content) {
    return children
  }

  return (
    <div
      className=""
      onMouseEnter={() => {
        setIsVisible(true)
      }}
      onMouseLeave={() => {
        setIsVisible(false)
      }}
    >
      {children}
      {isVisible && (
        <div
          className={twMerge(
            'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg ',
            'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
            'after:content-[""] after:absolute after:top-full after:left-1/2 after:transform after:-translate-x-1/2',
            'after:border-4 after:border-transparent after:border-t-gray-900',
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
