import { useEffect, useState } from 'react'
import { checkScreenPermissions } from '../../../../src/lib/screenshot'
import { withBoundary } from '../../../shared/ui/withBoundary'

export const ScreenPermission = withBoundary(() => {
  const { hasPermission } = useScreenPermissionState()

  if (hasPermission) {
    return null
  }

  return (
    <div>
      <h2>Screen permission not granted</h2>
    </div>
  )
})

function useScreenPermissionState() {
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    checkScreenPermissions().then(setHasPermission)
  }, [])

  return { hasPermission }
}
