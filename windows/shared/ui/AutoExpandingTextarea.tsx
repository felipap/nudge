import { forwardRef, useEffect } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const AutoExpandingTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ value, onChange, placeholder, className = '' }, ref) => {
    if (!ref) {
      throw new Error('ref prop is required')
    }

    useEffect(() => {
      const textarea = ref as React.RefObject<HTMLTextAreaElement>
      if (!textarea.current) {
        return
      }

      // Reset height to auto to get the correct scrollHeight
      textarea.current.style.height = 'auto'
      // Calculate minimum height for 2 lines
      const lineHeight = parseInt(getComputedStyle(textarea.current).lineHeight)
      const minHeight = lineHeight * 2
      // Set the height to match the content, but not less than 2 lines
      textarea.current.style.height = `${Math.max(
        textarea.current.scrollHeight,
        minHeight
      )}px`
    }, [value, ref])

    return (
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        rows={2}
      />
    )
  }
)
