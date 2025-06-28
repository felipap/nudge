import { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { Spinner } from './icons'

const buttonVariants = cva(
  'border-none py-0 px-3.5 text-md font-medium antialiased cursor-pointer rounded-md inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:!cursor-default select-none transition-all duration-150',
  {
    variants: {
      variant: {
        default: [
          'bg-gradient-to-b from-[#0071e3] to-[#0056b3]',
          'text-white',
          'hover:from-[#0077ed] hover:to-[#005cbd]',
          'active:from-[#0056b3] active:to-[#004999]',
          'shadow-sm',
        ].join(' '),
        secondary: [
          'bg-gradient-to-b from-gray-100 to-gray-200',
          'text-gray-700',
          'hover:from-gray-200 hover:to-gray-300',
          'active:from-gray-300 active:to-gray-400',
          'shadow-sm',
        ].join(' '),
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

export const MacButton = ({
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
