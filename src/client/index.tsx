import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-api-gateway/client'
import type { TypertRemoteNamespace } from '@deepseek-ai/dsh-typert-protocol'
import concurrencyMeterRemote from '../remote.ts'
import { ConcurrencyMeterSection, type ConcurrencyMeterSectionInjected } from './ConcurrencyMeterSection.tsx'
import { NS, en, zh, type ConcurrencyMeterKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'concurrency-meter': ConcurrencyMeterKey
  }
}

export const inject = ['slots', 'locale', 'remote']

export async function apply(ctx: ClientContext): Promise<void> {
  await ctx.remote.$mount(concurrencyMeterRemote)
  const remote = ctx.get('remote.concurrencyMeter') as TypertRemoteNamespace<'concurrencyMeter'> | undefined
  if (remote === undefined) throw new Error('concurrency-meter: mounted Remote namespace is unavailable')
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'concurrency-meter: dictionaries')

  const t = ctx.locale.bind(NS)
  const call = async (method: 'snapshot' | 'reset') => {
    const result = await remote[method]()
    if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`)
    return result.value
  }
  const injected = (): ConcurrencyMeterSectionInjected => ({
    snapshot: () => call('snapshot'),
    reset: () => call('reset'),
  })

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'concurrency-meter',
    order: 26,
    label: () => t('nav'),
    locale: NS,
    inject: injected,
  }, ConcurrencyMeterSection))
}

