import { ConcurrencySnapshotSchema } from "./schemas.js";
const result = {
    mode: 'strict',
    typeSymbol: 'dsh-concurrency-meter/types#ConcurrencySnapshot',
    schema: ConcurrencySnapshotSchema,
};
export const TYPERT = {
    package: 'dsh-concurrency-meter',
    face: 'host',
    schemas: [],
    invocations: [
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
    model: { services: [], events: [], objects: [] },
};
