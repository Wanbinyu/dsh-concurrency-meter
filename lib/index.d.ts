import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { ConcurrencyMeter } from './meter.ts';
import type { ConcurrencyMeterConfig, ConcurrencySnapshot } from './types.ts';
export type * from './types.ts';
export { ConcurrencyMeter } from './meter.ts';
export declare const name = "concurrency-meter";
export declare const inject: string[];
export declare const Config: z<ConcurrencyMeterConfig>;
export declare class ConcurrencyMeterGateway extends TypertRemoteService {
    private readonly meter;
    constructor(ctx: Context, meter: ConcurrencyMeter);
    snapshot(): ConcurrencySnapshot;
    reset(): ConcurrencySnapshot;
}
export declare function apply(ctx: Context, config?: ConcurrencyMeterConfig): void;
