import { ComponentProps, forwardRef, useEffect } from 'react'

type Props = Omit<ComponentProps<'textarea'>, 'onChange'> & {
  onChange: (value: string) => void
}

export const AutoExpandingTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ value, onChange, className = '', ...props }, ref) => {
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
      const minHeight = lineHeight * 4
      // Set the height to match the content, but not less than 2 lines
      textarea.current.style.height = `${Math.max(
        textarea.current.scrollHeight,
        minHeight
      )}px`
      textarea.current.style.minHeight = `${minHeight}px`
    }, [value, ref])

    return (
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        rows={2}
        {...props}
      />
    )
  }
)
