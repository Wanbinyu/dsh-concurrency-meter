export declare const TYPERT: {
    package: string;
    face: string;
    schemas: never[];
    invocations: {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: string;
        };
        parameters: never[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: import("zod").ZodObject<{
                active: import("zod").ZodNumber;
                peak: import("zod").ZodNumber;
                totalStarted: import("zod").ZodNumber;
                succeeded: import("zod").ZodNumber;
                failed: import("zod").ZodNumber;
                aborted: import("zod").ZodNumber;
                incomplete: import("zod").ZodNumber;
                warningThreshold: import("zod").ZodNumber;
                activeCalls: import("zod").ZodArray<import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    provider: import("zod").ZodString;
                    model: import("zod").ZodString;
                    purpose: import("zod").ZodEnum<{
                        conversation: "conversation";
                        compaction: "compaction";
                        "session-title": "session-title";
                    }>;
                    elapsedMs: import("zod").ZodNumber;
                }, import("zod/v4/core").$strip>>;
                hiddenActiveCalls: import("zod").ZodNumber;
                providers: import("zod").ZodArray<import("zod").ZodObject<{
                    provider: import("zod").ZodString;
                    active: import("zod").ZodNumber;
                    peak: import("zod").ZodNumber;
                    totalStarted: import("zod").ZodNumber;
                    succeeded: import("zod").ZodNumber;
                    failed: import("zod").ZodNumber;
                    aborted: import("zod").ZodNumber;
                    incomplete: import("zod").ZodNumber;
                }, import("zod/v4/core").$strip>>;
            }, import("zod/v4/core").$strip>;
        };
    }[];
    model: {
        services: never[];
        events: never[];
        objects: never[];
    };
};
