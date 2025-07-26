import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export function SectionWithHeader({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string | React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <header className="mb-1">
        <h2 className="track-10 text-[15px] text-contrast font-medium antialiased max-w-[550px]">
          {title}
        </h2>
        {subtitle && (
          <p className="track-10 text-[14px]  text-secondary mt-0.5 leading-[1.3]">
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </section>
  )
}

export function Label({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <label
      className={twMerge(
        'text-[14px] text-contrast font-medium antialiased',
        className
      )}
    >
      {children}
    </label>
  )
}

export function Description({ children }: { children: React.ReactNode }) {
  return (
    <p className="track-10 text-[13px] text-secondary leading-[1.4]">
      {children}
    </p>
  )
}

export function LabelStack({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & ComponentProps<'label'>) {
  return (
    <label className={twMerge('flex flex-col gap-0.5', className)} {...props}>
      {children}
    </label>
  )
}

export function Fieldset({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & ComponentProps<'fieldset'>) {
  return (
    <fieldset
      className={twMerge(
        'flex flex-row gap-2 items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </fieldset>
  )
}

export function Hr() {
  return <div className="border-b border-two dark:border-neutral-700" />
}
