import { machineIdSync } from 'node-machine-id'

export function getComputerId(): string {
  return machineIdSync()
}

export interface SignedFingerPrint {
  computerId: string
  // timestamp: number
  // signature: string
  // hardwareHash: string
  osInfo: {
    platform: string
    arch: string
    version: string
  }
}

/**
 * Used in requests to the the hosted Nudge endpoint.
 */
export function genSignedFingerprint(): SignedFingerPrint {
  const computerId = machineIdSync()
  // const timestamp = Date.now()

  // Create a hardware fingerprint from multiple sources
  // const hardwareHash = genHardwareHash()

  // Create a signature that includes the computer ID and timestamp
  // const signature = createSignature(computerId, timestamp, hardwareHash)

  return {
    computerId,
    // timestamp,
    // signature,
    // hardwareHash,
    osInfo: {
      platform: process.platform,
      arch: process.arch,
      version: process.getSystemVersion?.() || 'unknown',
    },
  }
}

// function genHardwareHash(): string {
//   const fingerprints: string[] = []

//   try {
//     // CPU info
//     const cpuInfo = execSync('sysctl -n machdep.cpu.brand_string', {
//       encoding: 'utf8',
//     }).trim()
//     fingerprints.push(cpuInfo)
//   } catch (e) {
//     warn('[verification] Could not get CPU info', e)
//   }

//   try {
//     // Machine serial
//     const serial = execSync('ioreg -l | grep IOPlatformSerialNumber', {
//       encoding: 'utf8',
//     })
//     const match = serial.match(/"([^"]+)"/)
//     if (match) {
//       fingerprints.push(match[1])
//     }
//   } catch (e) {
//     warn('[verification] Could not get serial', e)
//   }

//   try {
//     // MAC address
//     const macAddress = execSync(
//       "ifconfig en0 | grep ether | awk '{print $2}'",
//       { encoding: 'utf8' }
//     ).trim()
//     fingerprints.push(macAddress)
//   } catch (e) {
//     warn('[verification] Could not get MAC', e)
//   }

//   // Combine and hash
//   const combined = fingerprints.join('|')
//   return createHash('sha256').update(combined).digest('hex')
// }

// function createSignature(
//   computerId: string,
//   timestamp: number,
//   hardwareHash: string
// ): string {
//   // Create a signature that would be hard to forge
//   const data = `${computerId}|${timestamp}|${hardwareHash}|${process.platform}`

//   // In a real implementation, you might use a secret key here
//   // For now, we'll use a simple hash
//   return createHash('sha256').update(data).digest('hex')
// }
