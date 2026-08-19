import { ConcurrencySnapshotCodec } from "./remote-codecs.js";
const result = {
    mode: 'strict',
    typeSymbol: 'dsh-concurrency-meter/types#ConcurrencySnapshot',
    schema: ConcurrencySnapshotCodec,
};
export const TYPERT_REMOTE = {
    package: 'dsh-concurrency-meter',
    descriptors: [
        {
            id: 'dsh-concurrency-meter#concurrencyMeter/snapshot',
            service: 'concurrencyMeter',
            namespace: 'concurrencyMeter',
            method: 'snapshot',
            invocation: { kind: 'direct' },
            parameters: [],
            result,
        },
        {
            id: 'dsh-concurrency-meter#concurrencyMeter/reset',
            service: 'concurrencyMeter',
            namespace: 'concurrencyMeter',
            method: 'reset',
            invocation: { kind: 'direct' },
            parameters: [],
            result,
        },
    ],
};
export default TYPERT_REMOTE;
