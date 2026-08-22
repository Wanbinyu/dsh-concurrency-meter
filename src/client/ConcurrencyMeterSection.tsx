import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { ConcurrencySnapshot, MeterCallPurpose } from '../client.ts'
import { IconRefreshOutline16, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { ConcurrencyMeterKey } from './locales.ts'
import css from './ConcurrencyMeterSection.module.css'

export interface ConcurrencyMeterSectionInjected {
  snapshot: () => Promise<ConcurrencySnapshot>
  reset: () => Promise<ConcurrencySnapshot>
}

export type ConcurrencyMeterSectionProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<'concurrency-meter'>
  & InjectFace<ConcurrencyMeterSectionInjected>

type ViewState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; value: ConcurrencySnapshot }

const ACTIVE_REFRESH_MS = 1000
const IDLE_REFRESH_MS = 5000

function purposeKey(purpose: MeterCallPurpose): ConcurrencyMeterKey {
  return `purpose.${purpose}` as ConcurrencyMeterKey
}

function duration(ms: number, t: ConcurrencyMeterSectionProps['t']): string {
  return ms < 1000
    ? t('milliseconds', { value: ms })
    : t('seconds', { value: (ms / 1000).toFixed(1) })
}

export function ConcurrencyMeterSection({ snapshot, reset, t }: ConcurrencyMeterSectionProps): ReactNode {
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState<ViewState>({ status: 'loading' })
  const [resetting, setResetting] = useState(false)

  const reload = useCallback(() => {
    setState({ status: 'loading' })
    setRevision(value => value + 1)
  }, [])

  useEffect(() => {
    let current = true
    let timer: ReturnType<typeof setTimeout> | undefined
    const tick = async (): Promise<void> => {
      let refreshMs = IDLE_REFRESH_MS
      try {
        const value = await snapshot()
        refreshMs = value.active > 0 ? ACTIVE_REFRESH_MS : IDLE_REFRESH_MS
        if (current) setState({ status: 'ready', value })
      } catch {
        if (current) setState({ status: 'error' })
      }
      if (current) timer = setTimeout(() => { void tick() }, refreshMs)
    }
    void tick()
    return () => {
      current = false
      if (timer !== undefined) clearTimeout(timer)
    }
  }, [revision, snapshot])

  const resetMetrics = async (): Promise<void> => {
    if (resetting) return
    setResetting(true)
    try {
      setState({ status: 'ready', value: await reset() })
    } catch {
      setState({ status: 'error' })
    } finally {
      setResetting(false)
    }
  }

  const value = state.status === 'ready' ? state.value : undefined
  const warning = value !== undefined && value.active >= value.warningThreshold

  return (
    <section className={css.section} data-concurrency-meter aria-busy={state.status === 'loading'}>
      <header className={css.header}>
        <h2>{t('title')}</h2>
        <div className={css.headerActions}>
          <button type="button" className={css.resetButton} disabled={resetting || value === undefined} onClick={() => { void resetMetrics() }}>
            {t('reset')}
          </button>
          <Tooltip label={t('reload')} side="bottom">
            <button type="button" className={css.iconButton} aria-label={t('reload')} onClick={reload}>
              <IconRefreshOutline16 size={16} />
            </button>
          </Tooltip>
        </div>
      </header>

      {state.status === 'loading' ? <p className={css.muted}>{t('loading')}</p> : null}
      {state.status === 'error' ? (
        <div className={css.loadFailure} role="alert">
          <span>{t('loadError')}</span>
          <button type="button" onClick={reload}>{t('retry')}</button>
        </div>
      ) : null}

      {value !== undefined ? (
        <>
          <div className={css.statusLine} data-warning={warning ? 'true' : undefined} role="status">
            <span className={css.statusDot} aria-hidden="true" />
            <span>{value.active === 0 ? t('idle') : warning ? t('warning', { threshold: value.warningThreshold }) : t('healthy')}</span>
          </div>

          <dl className={css.summary}>
            <div><dt>{t('active')}</dt><dd>{value.active}</dd></div>
            <div><dt>{t('peak')}</dt><dd>{value.peak}</dd></div>
            <div><dt>{t('totalStarted')}</dt><dd>{value.totalStarted}</dd></div>
            <div><dt>{t('failed')}</dt><dd>{value.failed}</dd></div>
          </dl>

          {value.activeCalls.length > 0 ? (
            <div className={css.group}>
              <h3>{t('activeCalls')}</h3>
              <ul className={css.activeList}>
                {value.activeCalls.map(call => (
                  <li key={call.id}>
                    <div className={css.route}>
                      <strong>{call.provider}</strong>
                      <code>{call.model}</code>
                    </div>
                    <span>{t(purposeKey(call.purpose))}</span>
                    <span>{duration(call.elapsedMs, t)}</span>
                  </li>
                ))}
              </ul>
              {value.hiddenActiveCalls > 0 ? <p className={css.muted}>{t('moreActive', { count: value.hiddenActiveCalls })}</p> : null}
            </div>
          ) : null}

          <div className={css.group}>
            <h3>{t('providers')}</h3>
            {value.providers.length === 0 ? <p className={css.muted}>{t('noHistory')}</p> : (
              <ul className={css.providerList}>
                {value.providers.map(provider => (
                  <li key={provider.provider}>
                    <div className={css.providerName}>
                      <strong>{provider.provider}</strong>
                      <span data-active={provider.active > 0 ? 'true' : undefined}>{provider.active} {t('active')}</span>
                    </div>
                    <dl>
                      <div><dt>{t('peak')}</dt><dd>{provider.peak}</dd></div>
                      <div><dt>{t('totalStarted')}</dt><dd>{provider.totalStarted}</dd></div>
                      <div><dt>{t('succeeded')}</dt><dd>{provider.succeeded}</dd></div>
                      <div><dt>{t('failed')}</dt><dd>{provider.failed}</dd></div>
                      <div><dt>{t('aborted')}</dt><dd>{provider.aborted}</dd></div>
                      <div><dt>{t('incomplete')}</dt><dd>{provider.incomplete}</dd></div>
                    </dl>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : null}
    </section>
  )
}
