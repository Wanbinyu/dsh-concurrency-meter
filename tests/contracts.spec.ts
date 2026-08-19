import { describe, expect, it } from 'vitest'
import { TYPERT_REMOTE } from '../src/remote.ts'
import { ConcurrencySnapshotCodec } from '../src/remote-codecs.ts'
import { ConcurrencySnapshotSchema } from '../src/schemas.ts'
import { TYPERT } from '../src/typert.ts'

const snapshot = {
  active: 1,
  peak: 2,
  totalStarted: 3,
  succeeded: 1,
  failed: 1,
  aborted: 0,
  incomplete: 0,
  warningThreshold: 3,
  activeCalls: [{
    id: 'call-3',
    provider: 'deepseek',
    model: 'deepseek-chat',
    purpose: 'conversation',
    elapsedMs: 120,
  }],
  hiddenActiveCalls: 0,
  providers: [{
    provider: 'deepseek',
    active: 1,
    peak: 2,
    totalStarted: 3,
    succeeded: 1,
    failed: 1,
    aborted: 0,
    incomplete: 0,
  }],
}

describe('Remote contracts', () => {
  it('keeps Host and Client descriptors aligned', () => {
    expect(TYPERT.invocations.map(item => item.id)).toEqual(TYPERT_REMOTE.descriptors.map(item => item.id))
  })

  it('accepts a valid snapshot in both boundary codecs', () => {
    expect(ConcurrencySnapshotSchema.safeParse(snapshot).success).toBe(true)
    expect(ConcurrencySnapshotCodec.parse(snapshot)).toEqual(snapshot)
  })

  it('rejects invalid counts and purposes', () => {
    expect(() => ConcurrencySnapshotCodec.parse({ ...snapshot, active: -1 })).toThrow()
    expect(() => ConcurrencySnapshotCodec.parse({
      ...snapshot,
      activeCalls: [{ ...snapshot.activeCalls[0], purpose: 'other' }],
    })).toThrow()
  })
})

