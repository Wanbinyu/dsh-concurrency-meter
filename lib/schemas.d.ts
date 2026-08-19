import { z } from 'zod';
export declare const ActiveCallSchema: z.ZodObject<{
    id: z.ZodString;
    provider: z.ZodString;
    model: z.ZodString;
    purpose: z.ZodEnum<{
        conversation: "conversation";
        compaction: "compaction";
        "session-title": "session-title";
    }>;
    elapsedMs: z.ZodNumber;
}, z.core.$strip>;
export declare const ProviderMeterSchema: z.ZodObject<{
    provider: z.ZodString;
    active: z.ZodNumber;
    peak: z.ZodNumber;
    totalStarted: z.ZodNumber;
    succeeded: z.ZodNumber;
    failed: z.ZodNumber;
    aborted: z.ZodNumber;
    incomplete: z.ZodNumber;
}, z.core.$strip>;
export declare const ConcurrencySnapshotSchema: z.ZodObject<{
    active: z.ZodNumber;
    peak: z.ZodNumber;
    totalStarted: z.ZodNumber;
    succeeded: z.ZodNumber;
    failed: z.ZodNumber;
    aborted: z.ZodNumber;
    incomplete: z.ZodNumber;
    warningThreshold: z.ZodNumber;
    activeCalls: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        provider: z.ZodString;
        model: z.ZodString;
        purpose: z.ZodEnum<{
            conversation: "conversation";
            compaction: "compaction";
            "session-title": "session-title";
        }>;
        elapsedMs: z.ZodNumber;
    }, z.core.$strip>>;
    hiddenActiveCalls: z.ZodNumber;
    providers: z.ZodArray<z.ZodObject<{
        provider: z.ZodString;
        active: z.ZodNumber;
        peak: z.ZodNumber;
        totalStarted: z.ZodNumber;
        succeeded: z.ZodNumber;
        failed: z.ZodNumber;
        aborted: z.ZodNumber;
        incomplete: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
