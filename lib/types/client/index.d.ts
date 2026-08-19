import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type ConcurrencyMeterKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'concurrency-meter': ConcurrencyMeterKey;
    }
}
export declare const inject: string[];
export declare function apply(ctx: ClientContext): Promise<void>;
