import { twMerge } from 'tailwind-merge'

interface Props {
  progress: number // 0 to 1
  small?: boolean

  className?: string
}

export function CircularProgress({
  progress,
  small = false,
  className,
}: Props) {
  const size = small ? 16 : 25
  const normalizedProgress = Math.min(1, Math.max(0, progress))
  const center = size / 2
  const strokeWidth = small ? 1.25 : 2
  const gap = small ? 3 : 4
  const innerRadius = size / 2 - gap
  const outerRadius = size / 2 - strokeWidth / 2

  let pathData: string

  if (normalizedProgress === 1) {
    // Path for a full inner circle
    pathData = `M ${center} ${center - innerRadius}
                A ${innerRadius} ${innerRadius} 0 0 1 ${center} ${
      center + innerRadius
    }
                A ${innerRadius} ${innerRadius} 0 0 1 ${center} ${
      center - innerRadius
    } Z`
  } else {
    // Path for a partial pie segment
    const startAngle = -Math.PI / 2 // Start at 12 o'clock
    const endAngle = startAngle + normalizedProgress * Math.PI * 2

    const startX = center + innerRadius * Math.cos(startAngle)
    const startY = center + innerRadius * Math.sin(startAngle)
    const endX = center + innerRadius * Math.cos(endAngle)
    const endY = center + innerRadius * Math.sin(endAngle)

    const largeArcFlag = normalizedProgress > 0.5 ? '1' : '0'
    pathData = `M ${center} ${center}
                L ${startX} ${startY}
                A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}
                Z`
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={twMerge(className)}
    >
      {/* Border circle */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* Progress pie */}
      <path d={pathData} fill="currentColor" />
    </svg>
  )
}
