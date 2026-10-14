import { ConcurrencySnapshotCodec } from "./remote-codecs.js";
function strictCodec(typeSymbol, schema) {
    // 0.1 hosts read `schema`. 0.2 hosts call `create()`. Keep both.
    return {
        mode: 'strict',
        typeSymbol,
        schema,
        create: () => schema,
    };
}
const result = strictCodec('dsh-concurrency-meter/types#ConcurrencySnapshot', ConcurrencySnapshotCodec);
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
