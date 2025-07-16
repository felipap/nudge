import { ComponentProps, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends Omit<ComponentProps<'input'>, 'type' | 'size'> {
  value: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  min?: number
  max?: number
  unit: string
}

export function NumberInputWithUnit({
  value,
  onChange,
  min,
  max,
  unit,
  className,
  ...props
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUnitClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="w-fit relative">
      <input
        ref={inputRef}
        className={twMerge('', className)}
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        {...props}
      />
      <div
        className="absolute right-7 top-1 bottom-0 flex items-center justify-center "
        onClick={handleUnitClick}
      >
        <span className="text-contrast text-sm">{unit}</span>
      </div>
    </div>
  )
}
