import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol';
import type { ConcurrencySnapshot } from './types.ts';
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface TypertRemoteNamespace$636f6e63757272656e63794d65746572 {
        snapshot: () => Promise<RemoteResult<ConcurrencySnapshot>>;
        reset: () => Promise<RemoteResult<ConcurrencySnapshot>>;
    }
    interface TypertRemoteMap {
        'concurrencyMeter/snapshot': () => Promise<RemoteResult<ConcurrencySnapshot>>;
        'concurrencyMeter/reset': () => Promise<RemoteResult<ConcurrencySnapshot>>;
    }
    interface TypertRemoteNamespaceMap {
        concurrencyMeter: TypertRemoteNamespace$636f6e63757272656e63794d65746572;
    }
}
export declare const TYPERT_REMOTE: TypertRemoteContribution;
export default TYPERT_REMOTE;
