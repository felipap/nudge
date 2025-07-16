import React, { ComponentProps } from 'react'

interface Props extends Omit<ComponentProps<'input'>, 'type' | 'size'> {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const sizeMap = {
  sm: {
    track: { width: 32, height: 16 }, // 32px x 16px
    thumb: { width: 14, height: 14 }, // 14px x 14px
    translate: 16, // px
  },
  md: {
    track: { width: 38, height: 20 }, // 40px x 20px
    thumb: { width: 16, height: 16 }, // 16px x 16px
    translate: 20, // px
  },
  lg: {
    track: { width: 48, height: 24 }, // 48px x 24px
    thumb: { width: 20, height: 20 }, // 20px x 20px
    translate: 24, // px
  },
}

export function Switch({
  label,
  checked,
  onChange,
  disabled = false,
  className,
  size = 'md',
  ...props
}: Props) {
  const s = sizeMap[size] || sizeMap.md
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span
        className="relative inline-block align-middle"
        style={{ width: s.track.width, height: s.track.height }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <span
          className={`block rounded-full transition-colors duration-200 bg-apple-system-gray-4 peer-checked:bg-apple-highlight-color peer-disabled:bg-apple-system-gray-3`}
          style={{ width: s.track.width, height: s.track.height }}
        />
        <span
          className={`absolute top-1 left-0 bg-white border border-apple-system-gray-3 rounded-full transition-all duration-200 shadow peer-checked:border-apple-highlight-color peer-disabled:bg-apple-system-gray-2 peer-disabled:border-apple-system-gray-3`}
          style={{
            width: s.thumb.width,
            height: s.thumb.height,
            top: (s.track.height - s.thumb.height) / 2,
            left: checked ? s.translate : 4,
          }}
        />
      </span>
      {label && (
        <span
          className={`text-contrast text-[14px] tracking-[-0.2px] ${
            disabled ? 'text-apple-system-gray-2' : ''
          }`}
        >
          {label}
        </span>
      )}
    </label>
  )
}
