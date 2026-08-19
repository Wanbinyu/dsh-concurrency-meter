import { z } from 'zod'

export const ActiveCallSchema = z.object({
  id: z.string(),
  provider: z.string(),
  model: z.string(),
  purpose: z.enum(['conversation', 'compaction', 'session-title']),
  elapsedMs: z.number().nonnegative(),
})

export const ProviderMeterSchema = z.object({
  provider: z.string(),
  active: z.number().int().nonnegative(),
  peak: z.number().int().nonnegative(),
  totalStarted: z.number().int().nonnegative(),
  succeeded: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  aborted: z.number().int().nonnegative(),
  incomplete: z.number().int().nonnegative(),
})

export const ConcurrencySnapshotSchema = z.object({
  active: z.number().int().nonnegative(),
  peak: z.number().int().nonnegative(),
  totalStarted: z.number().int().nonnegative(),
  succeeded: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  aborted: z.number().int().nonnegative(),
  incomplete: z.number().int().nonnegative(),
  warningThreshold: z.number().int().positive(),
  activeCalls: z.array(ActiveCallSchema),
  hiddenActiveCalls: z.number().int().nonnegative(),
  providers: z.array(ProviderMeterSchema),
})

