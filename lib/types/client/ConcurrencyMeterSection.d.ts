import { type ReactNode } from 'react';
import type { ConcurrencySnapshot } from '../client.ts';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
export interface ConcurrencyMeterSectionInjected {
    snapshot: () => Promise<ConcurrencySnapshot>;
    reset: () => Promise<ConcurrencySnapshot>;
}
export type ConcurrencyMeterSectionProps = PropsRuntime<'settings.section'> & PropsLocale<'concurrency-meter'> & InjectFace<ConcurrencyMeterSectionInjected>;
export declare function ConcurrencyMeterSection({ snapshot, reset, t }: ConcurrencyMeterSectionProps): ReactNode;
