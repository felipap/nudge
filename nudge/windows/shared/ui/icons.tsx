import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export {
  Bug as BugIcon,
  CalendarRange as CalendarIcon,
  Camera as CameraIcon,
  Goal as GoalIcon,
  Sparkles as SparkleIcon,
  ChevronLeft,
  ChevronRight,
  X as XIcon,
  Minimize as MinimizeIcon,
  Apple as AppleIcon,
  ZoomIn as ZoomInIcon,
} from 'lucide-react'

export function Spinner({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      className={twMerge('animate-spin', className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export function ThumbsUp({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      className={twMerge('', className)}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 16 16"
      height="30px"
      width="30px"
      {...props}
    >
      <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"></path>
    </svg>
  )
}

// react-icons is giving me shit with Vite, so I'm trying to just copy the items
// here. https://react-icons.github.io/react-icons/icons/fa/

export function FaSkull({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      className={twMerge('', className)}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="30px"
      width="30px"
      {...props}
    >
      <path d="M256 0C114.6 0 0 100.3 0 224c0 70.1 36.9 132.6 94.5 173.7 9.6 6.9 15.2 18.1 13.5 29.9l-9.4 66.2c-1.4 9.6 6 18.2 15.7 18.2H192v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h64v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h77.7c9.7 0 17.1-8.6 15.7-18.2l-9.4-66.2c-1.7-11.7 3.8-23 13.5-29.9C475.1 356.6 512 294.1 512 224 512 100.3 397.4 0 256 0zm-96 320c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm192 0c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z"></path>
    </svg>
  )
}

export function FaHandPeace({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      className={twMerge('', className)}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 448 512"
      height="30px"
      width="30px"
      {...props}
    >
      <path d="M408 216c-22.092 0-40 17.909-40 40h-8v-32c0-22.091-17.908-40-40-40s-40 17.909-40 40v32h-8V48c0-26.51-21.49-48-48-48s-48 21.49-48 48v208h-13.572L92.688 78.449C82.994 53.774 55.134 41.63 30.461 51.324 5.787 61.017-6.356 88.877 3.337 113.551l74.765 190.342-31.09 24.872c-15.381 12.306-19.515 33.978-9.741 51.081l64 112A39.998 39.998 0 0 0 136 512h240c18.562 0 34.686-12.77 38.937-30.838l32-136A39.97 39.97 0 0 0 448 336v-80c0-22.091-17.908-40-40-40z"></path>
    </svg>
  )
}

export function KeyboardIcon({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      className={twMerge('', className)}
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="none"
      {...props}
    >
      <path
        d="M9 6.5H9.01M11 10.5H11.01M13 6.5H13.01M15 10.5H15.01M17 6.5H17.01M5 6.5H5.01M6 14.5H16M7 10.5H7.01M3 2.5H19C20.1046 2.5 21 3.39543 21 4.5V16.5C21 17.6046 20.1046 18.5 19 18.5H3C1.89543 18.5 1 17.6046 1 16.5V4.5C1 3.39543 1.89543 2.5 3 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
