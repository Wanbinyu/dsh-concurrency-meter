import type {
  RemoteResult,
  TypertRemoteContribution,
} from '@deepseek-ai/dsh-typert-protocol'
import { ConcurrencySnapshotCodec } from './remote-codecs.ts'
import type { ConcurrencySnapshot } from './types.ts'

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespace$636f6e63757272656e63794d65746572 {
    snapshot: () => Promise<RemoteResult<ConcurrencySnapshot>>
    reset: () => Promise<RemoteResult<ConcurrencySnapshot>>
  }
  interface TypertRemoteMap {
    'concurrencyMeter/snapshot': () => Promise<RemoteResult<ConcurrencySnapshot>>
    'concurrencyMeter/reset': () => Promise<RemoteResult<ConcurrencySnapshot>>
  }
  interface TypertRemoteNamespaceMap {
    concurrencyMeter: TypertRemoteNamespace$636f6e63757272656e63794d65746572
  }
}

const result = {
  mode: 'strict' as const,
  typeSymbol: 'dsh-concurrency-meter/types#ConcurrencySnapshot',
  schema: ConcurrencySnapshotCodec,
}

export const TYPERT_REMOTE: TypertRemoteContribution = {
  package: 'dsh-concurrency-meter',
  descriptors: [
    {
      id: 'dsh-concurrency-meter#concurrencyMeter/snapshot',
      service: 'concurrencyMeter',
      namespace: 'concurrencyMeter',
      method: 'snapshot',
      invocation: { kind: 'direct' },
      parameters: [],
      result,
    },
    {
      id: 'dsh-concurrency-meter#concurrencyMeter/reset',
      service: 'concurrencyMeter',
      namespace: 'concurrencyMeter',
      method: 'reset',
      invocation: { kind: 'direct' },
      parameters: [],
      result,
    },
  ],
}

export default TYPERT_REMOTE

