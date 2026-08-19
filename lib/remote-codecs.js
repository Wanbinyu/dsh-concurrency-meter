function invalid(subject) {
    throw new TypeError(`concurrency-meter Remote rejected ${subject}`);
}
function record(value, subject) {
    if (typeof value !== 'object' || value === null || Array.isArray(value))
        return invalid(subject);
    return value;
}
function string(value, subject) {
    if (typeof value !== 'string')
        return invalid(subject);
    return value;
}
function count(value, subject) {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0)
        return invalid(subject);
    return value;
}
function positiveCount(value, subject) {
    const parsed = count(value, subject);
    if (parsed === 0)
        return invalid(subject);
    return parsed;
}
function purpose(value, subject) {
    if (value !== 'conversation' && value !== 'compaction' && value !== 'session-title')
        return invalid(subject);
    return value;
}
function activeCall(value, subject) {
    const item = record(value, subject);
    return {
        id: string(item.id, `${subject}.id`),
        provider: string(item.provider, `${subject}.provider`),
        model: string(item.model, `${subject}.model`),
        purpose: purpose(item.purpose, `${subject}.purpose`),
        elapsedMs: count(item.elapsedMs, `${subject}.elapsedMs`),
    };
}
function provider(value, subject) {
    const item = record(value, subject);
    return {
        provider: string(item.provider, `${subject}.provider`),
        active: count(item.active, `${subject}.active`),
        peak: count(item.peak, `${subject}.peak`),
        totalStarted: count(item.totalStarted, `${subject}.totalStarted`),
        succeeded: count(item.succeeded, `${subject}.succeeded`),
        failed: count(item.failed, `${subject}.failed`),
        aborted: count(item.aborted, `${subject}.aborted`),
        incomplete: count(item.incomplete, `${subject}.incomplete`),
    };
}
export const ConcurrencySnapshotCodec = {
    parse(value) {
        const item = record(value, 'snapshot');
        if (!Array.isArray(item.activeCalls))
            return invalid('snapshot.activeCalls');
        if (!Array.isArray(item.providers))
            return invalid('snapshot.providers');
        return {
            active: count(item.active, 'snapshot.active'),
            peak: count(item.peak, 'snapshot.peak'),
            totalStarted: count(item.totalStarted, 'snapshot.totalStarted'),
            succeeded: count(item.succeeded, 'snapshot.succeeded'),
            failed: count(item.failed, 'snapshot.failed'),
            aborted: count(item.aborted, 'snapshot.aborted'),
            incomplete: count(item.incomplete, 'snapshot.incomplete'),
            warningThreshold: positiveCount(item.warningThreshold, 'snapshot.warningThreshold'),
            activeCalls: item.activeCalls.map((entry, index) => activeCall(entry, `snapshot.activeCalls[${String(index)}]`)),
            hiddenActiveCalls: count(item.hiddenActiveCalls, 'snapshot.hiddenActiveCalls'),
            providers: item.providers.map((entry, index) => provider(entry, `snapshot.providers[${String(index)}]`)),
        };
    },
};
