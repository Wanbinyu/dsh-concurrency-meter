import concurrencyMeterRemote from "../remote.js";
import { ConcurrencyMeterSection } from "./ConcurrencyMeterSection.js";
import { NS, en, zh } from "./locales.js";
export const inject = ['slots', 'locale', 'remote'];
export async function apply(ctx) {
    await ctx.remote.$mount(concurrencyMeterRemote);
    const remote = ctx.get('remote.concurrencyMeter');
    if (remote === undefined)
        throw new Error('concurrency-meter: mounted Remote namespace is unavailable');
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'concurrency-meter: dictionaries');
    const t = ctx.locale.bind(NS);
    const call = async (method) => {
        const result = await remote[method]();
        if (!result.ok)
            throw new Error(`${result.error.code}: ${result.error.message}`);
        return result.value;
    };
    const injected = () => ({
        snapshot: () => call('snapshot'),
        reset: () => call('reset'),
    });
    ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'concurrency-meter',
        order: 26,
        label: () => t('nav'),
        locale: NS,
        inject: injected,
    }, ConcurrencyMeterSection));
}
