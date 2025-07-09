import { machineIdSync } from 'node-machine-id'
import { warn } from '../logger'

export function getComputerId(): string {
  return machineIdSync()
}
