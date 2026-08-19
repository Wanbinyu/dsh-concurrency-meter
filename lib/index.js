var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import z from '@deepseek-ai/schemastery';
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { ConcurrencyMeter } from "./meter.js";
export { ConcurrencyMeter } from "./meter.js";
export const name = 'concurrency-meter';
export const inject = ['llm'];
export const Config = z.object({
    warningThreshold: z.number().min(1).max(100).default(3),
    maxActiveDetails: z.number().min(1).max(100).default(20),
});
let ConcurrencyMeterGateway = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _snapshot_decorators;
    let _reset_decorators;
    return class ConcurrencyMeterGateway extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _snapshot_decorators = [Remote('snapshot')];
            _reset_decorators = [Remote('reset')];
            __esDecorate(this, null, _snapshot_decorators, { kind: "method", name: "snapshot", static: false, private: false, access: { has: obj => "snapshot" in obj, get: obj => obj.snapshot }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _reset_decorators, { kind: "method", name: "reset", static: false, private: false, access: { has: obj => "reset" in obj, get: obj => obj.reset }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        meter = __runInitializers(this, _instanceExtraInitializers);
        constructor(ctx, meter) {
            super(ctx, 'concurrencyMeter');
            this.meter = meter;
        }
        snapshot() {
            return this.meter.snapshot();
        }
        reset() {
            return this.meter.reset();
        }
    };
})();
export { ConcurrencyMeterGateway };
export function apply(ctx, config = { warningThreshold: 3, maxActiveDetails: 20 }) {
    if (!Number.isInteger(config.warningThreshold))
        throw new Error('ConcurrencyMeterConfig: warningThreshold must be an integer');
    if (!Number.isInteger(config.maxActiveDetails))
        throw new Error('ConcurrencyMeterConfig: maxActiveDetails must be an integer');
    const meter = new ConcurrencyMeter(config);
    new ConcurrencyMeterGateway(ctx, meter);
    ctx.on('llm/stream', (options, next) => {
        return meter.wrap(options, next);
    }, { global: true });
}
