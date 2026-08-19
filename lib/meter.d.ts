import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm';
import type { ConcurrencyMeterConfig, ConcurrencySnapshot } from './types.ts';
export declare class ConcurrencyMeter {
    private readonly config;
    private readonly now;
    private nextId;
    private activeCalls;
    private providers;
    private peak;
    private totalStarted;
    private succeeded;
    private failed;
    private aborted;
    private incomplete;
    constructor(config: ConcurrencyMeterConfig, now?: () => number);
    wrap(options: GenerateOptions, next: () => AsyncIterable<StreamChunk>): AsyncIterable<StreamChunk>;
    snapshot(): ConcurrencySnapshot;
    reset(): ConcurrencySnapshot;
    private begin;
    private finish;
}
