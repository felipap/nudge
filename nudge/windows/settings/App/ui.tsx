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
        <h2 className="font-display-3p text-[16px] text-contrast font-medium antialiased max-w-[550px]">
          {title}
        </h2>
        {subtitle && (
          <p className="font-display-3p text-[14px]  text-secondary mt-0.5 leading-[1.3]">
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
        'font-display-3p text-[14px] text-contrast font-medium antialiased',
        className
      )}
    >
      {children}
    </label>
  )
}

export function Description({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display-3p text-[14px] text-secondary">{children}</p>
  )
}

export function LabelStack({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-0">{children}</div>
}

export function Fieldset({
  children,
  ...props
}: {
  children: React.ReactNode
}) {
  return (
    <fieldset
      className="flex flex-row gap-2 items-center justify-between"
      {...props}
    >
      {children}
    </fieldset>
  )
}

export function Hr() {
  return <div className="border-b border-two" />
}
