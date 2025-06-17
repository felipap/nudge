import { cva } from 'class-variance-authority'
import React, { ComponentProps } from 'react'

interface Props extends ComponentProps<'input'> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const selectStyles = cva(
  'border !border-transparent rounded-md py-0 font-display-3p text-[13px] bg-btn text-contrast focus:outline-none focus:ring-2 focus:ring-apple-highlight-color disabled:bg-apple-system-gray-5 disabled:text-apple-system-gray-2 shadow-sm',
  {
    variants: {
      size: {
        sm: 'text-sm px-2',
        md: 'text-base h-[32px] px-3',
        lg: 'text-lg px-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export function Input({
  value,
  onChange,
  disabled = false,
  className,
  ...props
}: Props) {
  return (
    <input
      className={selectStyles({ className })}
      value={value === undefined ? '' : value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  )
}
