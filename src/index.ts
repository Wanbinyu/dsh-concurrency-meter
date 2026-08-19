import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'
import { ConcurrencyMeter } from './meter.ts'
import type { ConcurrencyMeterConfig, ConcurrencySnapshot } from './types.ts'

export type * from './types.ts'
export { ConcurrencyMeter } from './meter.ts'

export const name = 'concurrency-meter'
export const inject = ['llm']

export const Config: z<ConcurrencyMeterConfig> = z.object({
  warningThreshold: z.number().min(1).max(100).default(3),
  maxActiveDetails: z.number().min(1).max(100).default(20),
})

export class ConcurrencyMeterGateway extends TypertRemoteService {
  constructor(ctx: Context, private readonly meter: ConcurrencyMeter) {
    super(ctx, 'concurrencyMeter')
  }

  @Remote('snapshot')
  snapshot(): ConcurrencySnapshot {
    return this.meter.snapshot()
  }

  @Remote('reset')
  reset(): ConcurrencySnapshot {
    return this.meter.reset()
  }
}

export function apply(
  ctx: Context,
  config: ConcurrencyMeterConfig = { warningThreshold: 3, maxActiveDetails: 20 },
): void {
  if (!Number.isInteger(config.warningThreshold)) throw new Error('ConcurrencyMeterConfig: warningThreshold must be an integer')
  if (!Number.isInteger(config.maxActiveDetails)) throw new Error('ConcurrencyMeterConfig: maxActiveDetails must be an integer')
  const meter = new ConcurrencyMeter(config)
  new ConcurrencyMeterGateway(ctx, meter)
  ctx.on('llm/stream', (options: GenerateOptions, next: () => AsyncIterable<StreamChunk>) => {
    return meter.wrap(options, next)
  }, { global: true })
}

