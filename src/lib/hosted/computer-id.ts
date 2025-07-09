import { machineIdSync } from 'node-machine-id'
import { warn } from '../logger'

export function getComputerId(): string {
  try {
    return machineIdSync()
  } catch (error) {
    warn('[computer-id] Error getting machine ID', error)
    // Fallback to a simple hash of hostname
    const os = require('os')
    const crypto = require('crypto')
    const fallback = `${os.hostname()}-${os.userInfo().username}`
    return crypto.createHash('sha256').update(fallback).digest('hex')
  }
}
