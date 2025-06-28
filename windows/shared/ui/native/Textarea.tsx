import { cva } from 'class-variance-authority'
import React, { ComponentProps } from 'react'

interface Props extends ComponentProps<'textarea'> {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
}

const selectStyles = cva(
  'border !border-transparent rounded-md py-0 font-text tracking-[-0.1px] text-[14px] bg-input text-contrast  focus:outline-none focus:ring-2 focus:ring-apple-highlight-color disabled:bg-apple-system-gray-4 disabled:text-apple-system-gray-2 shadow-sm transition-colors resize-none w-full placeholder:text-tertiary',
  {
    variants: {
      size: {
        sm: 'text-sm py-1 px-2',
        md: 'text-base py-1.5 px-2',
        lg: 'text-lg py-3 px-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export function Textarea({
  value,
  onChange,
  disabled = false,
  className,
  ...props
}: Props) {
  return (
    <textarea
      className={selectStyles({ className })}
      value={value === undefined ? '' : value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  )
}
