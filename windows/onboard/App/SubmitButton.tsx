import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface SubmitButton extends ComponentProps<'button'> {
  color?: 'green' | 'blue' | 'gray' | 'yellow' | 'red'
}

export function SubmitButton({
  color,
  className,
  children,
  disabled,
  ...props
}: SubmitButton) {
  return (
    <button
      className={twMerge(
        `transition text-white shadow-sm text-[17px] px-4 h-[33px] rounded-md font-semibold antialiased track-10p  border-[1px]`,
        color === 'green' &&
          'text-[#004E0C] bg-[#B3EBAA] border-[#33ac4574] not-disabled:hover:bg-[#c6efbf]',
        color === 'yellow' && 'bg-yellow-100 border-yellow-300 text-yellow-900',
        color === 'red' &&
          'bg-[#ffefef] border-[#ff8989] text-red-700 not-disabled:hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300',
        color === 'blue' &&
          'bg-[#c6ecff] not-disabled:hover:bg-[#B2E5FF] border-[#0e2f4a44] text-[#142635] dark:bg-blue-700 dark:border-blue-600 dark:text-white dark:not-disabled:hover:bg-blue-600',
        (!color || color === 'gray') &&
          'bg-[#fff] text-[#444] not-disabled:hover:bg-[#fafafa] border-[#DDD] dark:bg-gray-700/80 dark:text-white  dark:not-disabled:hover:bg-gray-700 dark:border-[#6b7280]',
        disabled && 'opacity-70 !cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
