import { cva, type VariantProps } from 'class-variance-authority'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { Spinner } from './icons'

const buttonVariants = cva(
  'border-0 font-medium antialiased cursor-pointer whitespace-nowrap rounded-md inline-flex items-center justify-center transition-all gap-2 disabled:opacity-50 disabled:!cursor-default select-none ',
  {
    variants: {
      variant: {
        default: 'bg-[#0071e3] text-white',
        secondary: 'bg-gray-200 text-gray-600',
      },
      size: {
        small: 'py-0.5 px-2 text-sm',
        md: 'py-1.5 px-3.5 text-[13px]',
        lg: 'py-2 px-4 text-lg',
      },
      loading: {
        true: 'cursor-wait opacity-70',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      loading: false,
    },
  }
)

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
}

export const Button = ({
  children,
  onClick,
  className,
  variant,
  size = 'md',
  loading,
  disabled,
  icon,
  ...props
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(buttonVariants({ variant, size, loading }), className)}
      disabled={disabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {!loading && icon && <div className="shrink-0">{icon}</div>}
      {children}
    </button>
  )
}
