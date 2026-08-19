export interface ConcurrencyMeterConfig {
    warningThreshold: number;
    maxActiveDetails: number;
}
export type MeterCallPurpose = 'conversation' | 'compaction' | 'session-title';
export interface ActiveCallView {
    id: string;
    provider: string;
    model: string;
    purpose: MeterCallPurpose;
    elapsedMs: number;
}
export interface ProviderMeterView {
    provider: string;
    active: number;
    peak: number;
    totalStarted: number;
    succeeded: number;
    failed: number;
    aborted: number;
    incomplete: number;
}
export interface ConcurrencySnapshot {
    active: number;
    peak: number;
    totalStarted: number;
    succeeded: number;
    failed: number;
    aborted: number;
    incomplete: number;
    warningThreshold: number;
    activeCalls: ActiveCallView[];
    hiddenActiveCalls: number;
    providers: ProviderMeterView[];
}
