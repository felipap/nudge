import { execSync } from 'child_process'
import { createHash } from 'crypto'
import { machineIdSync } from 'node-machine-id'
import { warn } from '../logger'

export interface VerificationData {
  computerId: string
  timestamp: number
  signature: string
  hardwareFingerprint: string
  osInfo: {
    platform: string
    arch: string
    version: string
  }
}

export function generateVerificationData(): VerificationData {
  const computerId = machineIdSync()
  const timestamp = Date.now()

  // Create a hardware fingerprint from multiple sources
  const hardwareFingerprint = generateHardwareFingerprint()

  // Create a signature that includes the computer ID and timestamp
  const signature = createSignature(computerId, timestamp, hardwareFingerprint)

  return {
    computerId,
    timestamp,
    signature,
    hardwareFingerprint,
    osInfo: {
      platform: process.platform,
      arch: process.arch,
      version: process.getSystemVersion?.() || 'unknown',
    },
  }
}

function generateHardwareFingerprint(): string {
  const fingerprints: string[] = []

  try {
    // CPU info
    const cpuInfo = execSync('sysctl -n machdep.cpu.brand_string', {
      encoding: 'utf8',
    }).trim()
    fingerprints.push(cpuInfo)
  } catch (e) {
    warn('[verification] Could not get CPU info', e)
  }

  try {
    // Machine serial
    const serial = execSync('ioreg -l | grep IOPlatformSerialNumber', {
      encoding: 'utf8',
    })
    const match = serial.match(/"([^"]+)"/)
    if (match) {
      fingerprints.push(match[1])
    }
  } catch (e) {
    warn('[verification] Could not get serial', e)
  }

  try {
    // MAC address
    const macAddress = execSync(
      "ifconfig en0 | grep ether | awk '{print $2}'",
      { encoding: 'utf8' }
    ).trim()
    fingerprints.push(macAddress)
  } catch (e) {
    warn('[verification] Could not get MAC', e)
  }

  // Combine and hash
  const combined = fingerprints.join('|')
  return createHash('sha256').update(combined).digest('hex')
}

function createSignature(
  computerId: string,
  timestamp: number,
  hardwareFingerprint: string
): string {
  // Create a signature that would be hard to forge
  const data = `${computerId}|${timestamp}|${hardwareFingerprint}|${process.platform}`

  // In a real implementation, you might use a secret key here
  // For now, we'll use a simple hash
  return createHash('sha256').update(data).digest('hex')
}
