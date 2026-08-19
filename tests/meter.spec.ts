import { describe, expect, it } from 'vitest'
import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'
import { ConcurrencyMeter } from '../src/meter.ts'

function request(provider: string, model = 'model', purpose?: GenerateOptions['purpose']): GenerateOptions {
  return { provider, model, messages: [], ...(purpose === undefined ? {} : { purpose }) }
}

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve = (): void => undefined
  const promise = new Promise<void>((done) => { resolve = done })
  return { promise, resolve }
}

function delayedSuccess(gate: Promise<void>): AsyncIterable<StreamChunk> {
  return {
    async *[Symbol.asyncIterator]() {
      await gate
      yield { type: 'finish', reason: { kind: 'stop' } }
    },
  }
}

async function drain(stream: AsyncIterable<StreamChunk>): Promise<void> {
  for await (const _chunk of stream) { /* drain */ }
}

describe('ConcurrencyMeter', () => {
  it('counts only streams that are actually consumed', async () => {
    const meter = new ConcurrencyMeter({ warningThreshold: 3, maxActiveDetails: 20 })
    const stream = meter.wrap(request('deepseek'), () => delayedSuccess(Promise.resolve()))

    expect(meter.snapshot().totalStarted).toBe(0)
    await drain(stream)
    expect(meter.snapshot()).toMatchObject({ active: 0, peak: 1, totalStarted: 1, succeeded: 1 })
  })

  it('tracks concurrent calls globally and per provider', async () => {
    let clock = 100
    const meter = new ConcurrencyMeter({ warningThreshold: 2, maxActiveDetails: 20 }, () => clock)
    const firstGate = deferred()
    const secondGate = deferred()
    const first = drain(meter.wrap(request('deepseek', 'chat'), () => delayedSuccess(firstGate.promise)))
    clock = 120
    const second = drain(meter.wrap(request('deepseek', 'reasoner', 'compaction'), () => delayedSuccess(secondGate.promise)))
    await Promise.resolve()
    clock = 170

    const active = meter.snapshot()
    expect(active).toMatchObject({ active: 2, peak: 2, totalStarted: 2, warningThreshold: 2 })
    expect(active.providers[0]).toMatchObject({ provider: 'deepseek', active: 2, peak: 2, totalStarted: 2 })
    expect(active.activeCalls).toEqual([
      { id: 'call-1', provider: 'deepseek', model: 'chat', purpose: 'conversation', elapsedMs: 70 },
      { id: 'call-2', provider: 'deepseek', model: 'reasoner', purpose: 'compaction', elapsedMs: 50 },
    ])

    firstGate.resolve()
    secondGate.resolve()
    await Promise.all([first, second])
    expect(meter.snapshot()).toMatchObject({ active: 0, peak: 2, succeeded: 2 })
  })

  it('separates provider failures and aborts', async () => {
    const meter = new ConcurrencyMeter({ warningThreshold: 3, maxActiveDetails: 20 })
    const failed = meter.wrap(request('one'), () => ({
      async *[Symbol.asyncIterator]() {
        yield { type: 'finish', reason: { kind: 'error', failure: { code: 'AUTH', message: 'bad key' } } }
      },
    }))
    const aborted = meter.wrap(request('two'), () => ({
      async *[Symbol.asyncIterator]() {
        yield { type: 'finish', reason: { kind: 'aborted', failure: { code: 'ABORTED', message: 'cancelled' } } }
      },
    }))

    await Promise.all([drain(failed), drain(aborted)])
    expect(meter.snapshot()).toMatchObject({ failed: 1, aborted: 1, succeeded: 0 })
  })

  it('counts middleware throws as failures and preserves the error', async () => {
    const meter = new ConcurrencyMeter({ warningThreshold: 3, maxActiveDetails: 20 })
    const expected = new Error('middleware failed')
    const stream = meter.wrap(request('broken'), () => ({
      async *[Symbol.asyncIterator]() {
        throw expected
      },
    }))

    await expect(drain(stream)).rejects.toBe(expected)
    expect(meter.snapshot()).toMatchObject({ active: 0, failed: 1 })
  })

  it('counts consumer-closed streams as incomplete', async () => {
    const meter = new ConcurrencyMeter({ warningThreshold: 3, maxActiveDetails: 20 })
    const stream = meter.wrap(request('partial'), () => ({
      async *[Symbol.asyncIterator]() {
        yield { type: 'block-start', index: 0, blockType: 'text' }
        yield { type: 'finish', reason: { kind: 'stop' } }
      },
    }))
    const iterator = stream[Symbol.asyncIterator]()
    await iterator.next()
    await iterator.return?.()

    expect(meter.snapshot()).toMatchObject({ active: 0, incomplete: 1, succeeded: 0 })
  })

  it('resets history without losing active calls', async () => {
    const meter = new ConcurrencyMeter({ warningThreshold: 3, maxActiveDetails: 20 })
    await drain(meter.wrap(request('old'), () => delayedSuccess(Promise.resolve())))
    const gate = deferred()
    const running = drain(meter.wrap(request('active'), () => delayedSuccess(gate.promise)))
    await Promise.resolve()

    expect(meter.reset()).toMatchObject({ active: 1, peak: 1, totalStarted: 1, succeeded: 0 })
    expect(meter.snapshot().providers.map(item => item.provider)).toEqual(['active'])
    gate.resolve()
    await running
    expect(meter.snapshot()).toMatchObject({ active: 0, totalStarted: 1, succeeded: 1 })
  })
})

