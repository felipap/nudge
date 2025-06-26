import { cva } from 'class-variance-authority'
import React, { ComponentProps } from 'react'

interface Props extends Omit<ComponentProps<'input'>, 'type' | 'size'> {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const checkboxStyles = cva(
  'appearance-none w-4 h-4 border rounded-sm bg-white border-apple-system-gray-3 checked:bg-apple-highlight-color checked:border-apple-highlight-color disabled:bg-apple-system-gray-4 disabled:border-apple-system-gray-3 disabled:checked:bg-apple-system-gray-3 disabled:checked:border-apple-system-gray-3 transition-colors cursor-pointer',
  {
    variants: {
      size: {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const labelStyles = cva(
  'text-contrast text-[14px] tracking-[-0.2px] select-none',
  {
    variants: {
      disabled: {
        true: 'text-apple-system-gray-2',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
)

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  className,
  size,
  ...props
}: Props) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={checkboxStyles({ className, size })}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {label && <span className={labelStyles({ disabled })}>{label}</span>}
    </label>
  )
}
