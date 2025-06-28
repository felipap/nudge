// I need to work on the design for Nudge until 4pm. This means mostly Figma, maybe some Cursor. It's ok if I use Spotify and Youtube if it's for music.

import { useWindowHeight } from '../../../shared/lib'
import { withBoundary } from '../../../shared/ui/withBoundary'

export const EnterKeyScreen = withBoundary(() => {
  useWindowHeight(250)

  return (
    <div className="p-4 flex flex-col gap-1">
      {/* <img src={'images/original.png'} alt="Nudge" className="w-10 h-10" /> */}

      <h2 className="text-[16px] font-display-3p font-medium">
        Welcome to Nudge
      </h2>
      <p className="text-[15px]">
        Click on the "👉" tray icon and then "Enter your OpenAI key".
      </p>
      <p>
        Issues? Email{' '}
        <strong className="font-medium">faragaop@gmail.com</strong>
      </p>
    </div>
  )
})
