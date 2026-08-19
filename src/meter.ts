import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'
import type {
  ActiveCallView,
  ConcurrencyMeterConfig,
  ConcurrencySnapshot,
  MeterCallPurpose,
  ProviderMeterView,
} from './types.ts'

type CallOutcome = 'success' | 'failure' | 'aborted' | 'incomplete'

interface ActiveCall {
  id: number
  provider: string
  model: string
  purpose: MeterCallPurpose
  startedAt: number
}

interface ProviderStats {
  provider: string
  active: number
  peak: number
  totalStarted: number
  succeeded: number
  failed: number
  aborted: number
  incomplete: number
}

function initialProvider(provider: string): ProviderStats {
  return {
    provider,
    active: 0,
    peak: 0,
    totalStarted: 0,
    succeeded: 0,
    failed: 0,
    aborted: 0,
    incomplete: 0,
  }
}

function purposeOf(options: GenerateOptions): MeterCallPurpose {
  return options.purpose ?? 'conversation'
}

export class ConcurrencyMeter {
  private nextId = 1
  private activeCalls = new Map<number, ActiveCall>()
  private providers = new Map<string, ProviderStats>()
  private peak = 0
  private totalStarted = 0
  private succeeded = 0
  private failed = 0
  private aborted = 0
  private incomplete = 0

  constructor(
    private readonly config: ConcurrencyMeterConfig,
    private readonly now: () => number = () => performance.now(),
  ) {}

  wrap(options: GenerateOptions, next: () => AsyncIterable<StreamChunk>): AsyncIterable<StreamChunk> {
    const meter = this
    return (async function* () {
      const call = meter.begin(options)
      let outcome: CallOutcome = 'incomplete'
      try {
        for await (const chunk of next()) {
          if (chunk.type === 'finish') {
            outcome = chunk.reason.kind === 'error'
              ? 'failure'
              : chunk.reason.kind === 'aborted'
                ? 'aborted'
                : 'success'
          }
          yield chunk
        }
      } catch (error) {
        outcome = 'failure'
        throw error
      } finally {
        meter.finish(call, outcome)
      }
    })()
  }

  snapshot(): ConcurrencySnapshot {
    const now = this.now()
    const activeCalls: ActiveCallView[] = [...this.activeCalls.values()]
      .sort((left, right) => left.startedAt - right.startedAt)
      .slice(0, this.config.maxActiveDetails)
      .map(call => ({
        id: `call-${String(call.id)}`,
        provider: call.provider,
        model: call.model,
        purpose: call.purpose,
        elapsedMs: Math.max(0, Math.round(now - call.startedAt)),
      }))
    const providers: ProviderMeterView[] = [...this.providers.values()]
      .sort((left, right) => right.active - left.active || right.totalStarted - left.totalStarted || left.provider.localeCompare(right.provider))
      .map(stats => ({ ...stats }))
    return {
      active: this.activeCalls.size,
      peak: this.peak,
      totalStarted: this.totalStarted,
      succeeded: this.succeeded,
      failed: this.failed,
      aborted: this.aborted,
      incomplete: this.incomplete,
      warningThreshold: this.config.warningThreshold,
      activeCalls,
      hiddenActiveCalls: Math.max(0, this.activeCalls.size - activeCalls.length),
      providers,
    }
  }

  reset(): ConcurrencySnapshot {
    this.peak = this.activeCalls.size
    this.totalStarted = this.activeCalls.size
    this.succeeded = 0
    this.failed = 0
    this.aborted = 0
    this.incomplete = 0
    for (const [provider, stats] of this.providers) {
      if (stats.active === 0) {
        this.providers.delete(provider)
        continue
      }
      stats.peak = stats.active
      stats.totalStarted = stats.active
      stats.succeeded = 0
      stats.failed = 0
      stats.aborted = 0
      stats.incomplete = 0
    }
    return this.snapshot()
  }

  private begin(options: GenerateOptions): ActiveCall {
    const call: ActiveCall = {
      id: this.nextId++,
      provider: options.provider,
      model: options.model,
      purpose: purposeOf(options),
      startedAt: this.now(),
    }
    this.activeCalls.set(call.id, call)
    this.totalStarted += 1
    this.peak = Math.max(this.peak, this.activeCalls.size)
    const stats = this.providers.get(call.provider) ?? initialProvider(call.provider)
    this.providers.set(call.provider, stats)
    stats.active += 1
    stats.totalStarted += 1
    stats.peak = Math.max(stats.peak, stats.active)
    return call
  }

  private finish(call: ActiveCall, outcome: CallOutcome): void {
    if (!this.activeCalls.delete(call.id)) return
    const stats = this.providers.get(call.provider)
    if (stats !== undefined) stats.active = Math.max(0, stats.active - 1)
    switch (outcome) {
      case 'success':
        this.succeeded += 1
        if (stats !== undefined) stats.succeeded += 1
        break
      case 'failure':
        this.failed += 1
        if (stats !== undefined) stats.failed += 1
        break
      case 'aborted':
        this.aborted += 1
        if (stats !== undefined) stats.aborted += 1
        break
      case 'incomplete':
        this.incomplete += 1
        if (stats !== undefined) stats.incomplete += 1
        break
    }
  }
}
