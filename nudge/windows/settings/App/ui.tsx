import { twMerge } from 'tailwind-merge'

export function SectionWithHeader({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <header className="max-w-[450px]">
        <h2 className="font-display-3p text-[16px] text-black font-medium antialiased">
          {title}
        </h2>
        {subtitle && (
          <p className="font-display-3p text-[14px] text-[#AAA] mt-0.5 leading-[1.4]">
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
        'font-display-3p text-[14px] text-black font-medium antialiased',
        className
      )}
    >
      {children}
    </label>
  )
}

export function Description({ children }: { children: React.ReactNode }) {
  return <p className="font-display-3p text-[14px] text-[#888]">{children}</p>
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
  return <div className="border-b border-[#E0E0E0]" />
}
