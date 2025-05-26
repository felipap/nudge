import { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { Spinner } from './icons'

const buttonVariants = cva(
  'border-none py-1 px-3.5 text-md font-medium antialiased cursor-pointer rounded-sm inline-flex items-center justify-center transition-all gap-2 disabled:opacity-50 disabled:!cursor-default select-none',
  {
    variants: {
      variant: {
        default:
          'bg-[#0071e3] text-white focus:bg-[#0056b3] hover:bg-[#0056b3]',
        secondary: 'bg-gray-200 text-gray-600',
      },
      loading: {
        true: 'cursor-wait opacity-70',
      },
    },
    defaultVariants: {
      variant: 'default',
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
  loading,
  disabled,
  icon,
  ...props
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(buttonVariants({ variant, loading }), className)}
      disabled={disabled}
      {...props}
    >
      {loading && <Spinner />}
      {icon}
      {children}
    </button>
  )
}
