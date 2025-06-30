import { useEffect, useState } from 'react'
import {
  tryAskForScrenPermissions,
  checkScreenPermissions,
} from '../../../shared/ipc'
import { MacButton } from '../../../shared/ui/native/MacButton'
import { withBoundary } from '../../../shared/ui/withBoundary'

export const ScreenPermission = withBoundary(() => {
  const { hasPermission } = useScreenPermissionState()

  if (hasPermission) {
    return null
  }

  async function onClickGrant() {
    await tryAskForScrenPermissions()
  }

  return (
    <div className="bg-btn rounded-md p-2 px-3 pb-3 shadow-sm flex flex-row items-center justify-between gap-2">
      <div className="flex flex-col gap-1">
        <h2 className="font-medium font-display-3p text-[14px]">
          Screen permission not granted
        </h2>
        {/* <p className="text-secondary">
          Go to System Preferences &gt; Security & Privacy &gt; Privacy &gt;
          Screen Recording
        </p> */}
      </div>
      <MacButton onClick={onClickGrant} className="self-start">
        Grant
      </MacButton>
    </div>
  )
})

export function useScreenPermissionState() {
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    async function check() {
      const hasPermission = await checkScreenPermissions()
      setHasPermission(hasPermission)
    }
    check()
  }, [])

  return { hasPermission }
}
