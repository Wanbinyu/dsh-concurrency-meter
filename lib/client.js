window.__ModuleLoader__.load({ id: "dsh-concurrency-meter", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
let react_jsx_runtime = require("react/jsx-runtime");
let react = require("react");
let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

//#region lib/types/remote-codecs.js
function invalid(subject) {
	throw new TypeError(`concurrency-meter Remote rejected ${subject}`);
}
function record(value, subject) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return invalid(subject);
	return value;
}
function string(value, subject) {
	if (typeof value !== "string") return invalid(subject);
	return value;
}
function count(value, subject) {
	if (typeof value !== "number" || !Number.isInteger(value) || value < 0) return invalid(subject);
	return value;
}
function positiveCount(value, subject) {
	const parsed = count(value, subject);
	if (parsed === 0) return invalid(subject);
	return parsed;
}
function purpose(value, subject) {
	if (value !== "conversation" && value !== "compaction" && value !== "session-title") return invalid(subject);
	return value;
}
function activeCall(value, subject) {
	const item = record(value, subject);
	return {
		id: string(item.id, `${subject}.id`),
		provider: string(item.provider, `${subject}.provider`),
		model: string(item.model, `${subject}.model`),
		purpose: purpose(item.purpose, `${subject}.purpose`),
		elapsedMs: count(item.elapsedMs, `${subject}.elapsedMs`)
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
		incomplete: count(item.incomplete, `${subject}.incomplete`)
	};
}
const ConcurrencySnapshotCodec = { parse(value) {
	const item = record(value, "snapshot");
	if (!Array.isArray(item.activeCalls)) return invalid("snapshot.activeCalls");
	if (!Array.isArray(item.providers)) return invalid("snapshot.providers");
	return {
		active: count(item.active, "snapshot.active"),
		peak: count(item.peak, "snapshot.peak"),
		totalStarted: count(item.totalStarted, "snapshot.totalStarted"),
		succeeded: count(item.succeeded, "snapshot.succeeded"),
		failed: count(item.failed, "snapshot.failed"),
		aborted: count(item.aborted, "snapshot.aborted"),
		incomplete: count(item.incomplete, "snapshot.incomplete"),
		warningThreshold: positiveCount(item.warningThreshold, "snapshot.warningThreshold"),
		activeCalls: item.activeCalls.map((entry, index) => activeCall(entry, `snapshot.activeCalls[${String(index)}]`)),
		hiddenActiveCalls: count(item.hiddenActiveCalls, "snapshot.hiddenActiveCalls"),
		providers: item.providers.map((entry, index) => provider(entry, `snapshot.providers[${String(index)}]`))
	};
} };

//#endregion
//#region lib/types/remote.js
const result = {
	mode: "strict",
	typeSymbol: "dsh-concurrency-meter/types#ConcurrencySnapshot",
	schema: ConcurrencySnapshotCodec
};
const TYPERT_REMOTE = {
	package: "dsh-concurrency-meter",
	descriptors: [{
		id: "dsh-concurrency-meter#concurrencyMeter/snapshot",
		service: "concurrencyMeter",
		namespace: "concurrencyMeter",
		method: "snapshot",
		invocation: { kind: "direct" },
		parameters: [],
		result
	}, {
		id: "dsh-concurrency-meter#concurrencyMeter/reset",
		service: "concurrencyMeter",
		namespace: "concurrencyMeter",
		method: "reset",
		invocation: { kind: "direct" },
		parameters: [],
		result
	}]
};

//#endregion
//#region \0dsh-css:dsh-concurrency-meter/ConcurrencyMeterSection.module.css.mjs
const css = ".Bf03Ba_section{width:100%;max-width:720px;color:var(--dsw-alias-label-primary);flex-direction:column;gap:14px;display:flex}.Bf03Ba_header,.Bf03Ba_headerActions,.Bf03Ba_statusLine,.Bf03Ba_providerName{align-items:center;display:flex}.Bf03Ba_header{justify-content:space-between;gap:12px}.Bf03Ba_headerActions{gap:6px}.Bf03Ba_header h2,.Bf03Ba_muted,.Bf03Ba_group h3{margin:0}.Bf03Ba_header h2{font-size:16px;font-weight:500;line-height:24px}.Bf03Ba_iconButton,.Bf03Ba_resetButton,.Bf03Ba_loadFailure button{box-sizing:border-box;color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:0 0;border:0}.Bf03Ba_iconButton{width:32px;height:32px;color:var(--dsw-alias-label-tertiary);border-radius:6px;justify-content:center;align-items:center;display:inline-flex}.Bf03Ba_resetButton,.Bf03Ba_loadFailure button{border:1px solid var(--dsw-alias-border-l2);border-radius:6px;height:30px;padding:0 10px;font-size:12px}.Bf03Ba_iconButton:hover,.Bf03Ba_resetButton:hover:not(:disabled),.Bf03Ba_loadFailure button:hover{background:var(--dsw-alias-interactive-bg-hover)}.Bf03Ba_iconButton:focus-visible,.Bf03Ba_resetButton:focus-visible,.Bf03Ba_loadFailure button:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}.Bf03Ba_resetButton:disabled{opacity:.4;cursor:default}.Bf03Ba_muted{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}.Bf03Ba_loadFailure{color:var(--dsw-alias-state-error-primary);align-items:center;gap:10px;font-size:13px;line-height:20px;display:flex}.Bf03Ba_statusLine{border-left:3px solid var(--dsw-alias-state-success-primary);background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 7%, transparent);min-height:34px;color:var(--dsw-alias-label-secondary);gap:8px;padding:5px 10px;font-size:12px;line-height:18px}.Bf03Ba_statusLine[data-warning=true]{border-left-color:var(--dsw-alias-state-warn-label);background:color-mix(in srgb, var(--dsw-alias-state-warn-label) 8%, transparent)}.Bf03Ba_statusDot{background:var(--dsw-alias-state-success-primary);border-radius:50%;flex:none;width:7px;height:7px}.Bf03Ba_statusLine[data-warning=true] .Bf03Ba_statusDot{background:var(--dsw-alias-state-warn-label)}.Bf03Ba_summary{border-top:1px solid var(--dsw-alias-border-l2);border-bottom:1px solid var(--dsw-alias-border-l2);grid-template-columns:repeat(4,minmax(0,1fr));margin:0;display:grid}.Bf03Ba_summary>div{min-width:0;padding:11px 12px}.Bf03Ba_summary>div+div{border-left:1px solid var(--dsw-alias-border-l2)}.Bf03Ba_summary dt,.Bf03Ba_providerList dt{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:17px}.Bf03Ba_summary dd{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;margin:2px 0 0;font-size:20px;font-weight:600;line-height:26px}.Bf03Ba_group{flex-direction:column;gap:8px;display:flex}.Bf03Ba_group h3{font-size:13px;font-weight:600;line-height:20px}.Bf03Ba_activeList,.Bf03Ba_providerList{flex-direction:column;gap:8px;margin:0;padding:0;list-style:none;display:flex}.Bf03Ba_activeList>li,.Bf03Ba_providerList>li{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;min-width:0}.Bf03Ba_activeList>li{color:var(--dsw-alias-label-secondary);grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:12px;padding:10px 12px;font-size:12px;line-height:18px;display:grid}.Bf03Ba_route{flex-direction:column;min-width:0;display:flex}.Bf03Ba_route strong,.Bf03Ba_providerName strong{overflow-wrap:anywhere;font-size:13px;font-weight:600;line-height:19px}.Bf03Ba_route code{color:var(--dsw-alias-label-tertiary);font-family:var(--ds-font-family-code);text-overflow:ellipsis;white-space:nowrap;font-size:11px;line-height:17px;overflow:hidden}.Bf03Ba_providerList>li{padding:10px 12px}.Bf03Ba_providerName{justify-content:space-between;gap:12px}.Bf03Ba_providerName span{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-tertiary);border-radius:5px;flex:none;padding:1px 6px;font-size:11px;line-height:17px}.Bf03Ba_providerName span[data-active=true]{background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent);color:var(--dsw-alias-state-success-primary)}.Bf03Ba_providerList dl{border-top:1px solid var(--dsw-alias-border-l2);grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;margin:10px 0 0;padding-top:9px;display:grid}.Bf03Ba_providerList dd{font-variant-numeric:tabular-nums;margin:1px 0 0;font-size:13px;line-height:19px}@media (width<=620px){.Bf03Ba_summary{grid-template-columns:repeat(2,minmax(0,1fr))}.Bf03Ba_summary>div:nth-child(3){border-left:0;border-top:1px solid var(--dsw-alias-border-l2)}.Bf03Ba_summary>div:nth-child(4){border-top:1px solid var(--dsw-alias-border-l2)}.Bf03Ba_activeList>li{grid-template-columns:minmax(0,1fr);gap:5px}.Bf03Ba_providerList dl{grid-template-columns:repeat(2,minmax(0,1fr))}}";
const tagId = "dsh-concurrency-meter/ConcurrencyMeterSection.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-concurrency-meter";
	tag.dataset.pluginCss = tagId;
	tag.textContent = css;
	document.head.appendChild(tag);
}
var ConcurrencyMeterSection_module_css_default = {
	"activeList": "Bf03Ba_activeList",
	"group": "Bf03Ba_group",
	"header": "Bf03Ba_header",
	"headerActions": "Bf03Ba_headerActions",
	"iconButton": "Bf03Ba_iconButton",
	"loadFailure": "Bf03Ba_loadFailure",
	"muted": "Bf03Ba_muted",
	"providerList": "Bf03Ba_providerList",
	"providerName": "Bf03Ba_providerName",
	"resetButton": "Bf03Ba_resetButton",
	"route": "Bf03Ba_route",
	"section": "Bf03Ba_section",
	"statusDot": "Bf03Ba_statusDot",
	"statusLine": "Bf03Ba_statusLine",
	"summary": "Bf03Ba_summary"
};

//#endregion
//#region lib/types/client/ConcurrencyMeterSection.js
const ACTIVE_REFRESH_MS = 1e3;
const IDLE_REFRESH_MS = 5e3;
function purposeKey(purpose) {
	return `purpose.${purpose}`;
}
function duration(ms, t) {
	return ms < 1e3 ? t("milliseconds", { value: ms }) : t("seconds", { value: (ms / 1e3).toFixed(1) });
}
function ConcurrencyMeterSection({ snapshot, reset, t }) {
	const [revision, setRevision] = (0, react.useState)(0);
	const [state, setState] = (0, react.useState)({ status: "loading" });
	const [resetting, setResetting] = (0, react.useState)(false);
	const reload = (0, react.useCallback)(() => {
		setState({ status: "loading" });
		setRevision((value) => value + 1);
	}, []);
	(0, react.useEffect)(() => {
		let current = true;
		let timer;
		const tick = async () => {
			let refreshMs = IDLE_REFRESH_MS;
			try {
				const value = await snapshot();
				refreshMs = value.active > 0 ? ACTIVE_REFRESH_MS : IDLE_REFRESH_MS;
				if (current) setState({
					status: "ready",
					value
				});
			} catch {
				if (current) setState({ status: "error" });
			}
			if (current) timer = setTimeout(() => {
				tick();
			}, refreshMs);
		};
		tick();
		return () => {
			current = false;
			if (timer !== void 0) clearTimeout(timer);
		};
	}, [revision, snapshot]);
	const resetMetrics = async () => {
		if (resetting) return;
		setResetting(true);
		try {
			setState({
				status: "ready",
				value: await reset()
			});
		} catch {
			setState({ status: "error" });
		} finally {
			setResetting(false);
		}
	};
	const value = state.status === "ready" ? state.value : void 0;
	const warning = value !== void 0 && value.active >= value.warningThreshold;
	return (0, react_jsx_runtime.jsxs)("section", {
		className: ConcurrencyMeterSection_module_css_default.section,
		"data-concurrency-meter": true,
		"aria-busy": state.status === "loading",
		children: [
			(0, react_jsx_runtime.jsxs)("header", {
				className: ConcurrencyMeterSection_module_css_default.header,
				children: [(0, react_jsx_runtime.jsx)("h2", { children: t("title") }), (0, react_jsx_runtime.jsxs)("div", {
					className: ConcurrencyMeterSection_module_css_default.headerActions,
					children: [(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: ConcurrencyMeterSection_module_css_default.resetButton,
						disabled: resetting || value === void 0,
						onClick: () => {
							resetMetrics();
						},
						children: t("reset")
					}), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label: t("reload"),
						side: "bottom",
						children: (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: ConcurrencyMeterSection_module_css_default.iconButton,
							"aria-label": t("reload"),
							onClick: reload,
							children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, { size: 16 })
						})
					})]
				})]
			}),
			state.status === "loading" ? (0, react_jsx_runtime.jsx)("p", {
				className: ConcurrencyMeterSection_module_css_default.muted,
				children: t("loading")
			}) : null,
			state.status === "error" ? (0, react_jsx_runtime.jsxs)("div", {
				className: ConcurrencyMeterSection_module_css_default.loadFailure,
				role: "alert",
				children: [(0, react_jsx_runtime.jsx)("span", { children: t("loadError") }), (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: reload,
					children: t("retry")
				})]
			}) : null,
			value !== void 0 ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				(0, react_jsx_runtime.jsxs)("div", {
					className: ConcurrencyMeterSection_module_css_default.statusLine,
					"data-warning": warning ? "true" : void 0,
					role: "status",
					children: [(0, react_jsx_runtime.jsx)("span", {
						className: ConcurrencyMeterSection_module_css_default.statusDot,
						"aria-hidden": "true"
					}), (0, react_jsx_runtime.jsx)("span", { children: value.active === 0 ? t("idle") : warning ? t("warning", { threshold: value.warningThreshold }) : t("healthy") })]
				}),
				(0, react_jsx_runtime.jsxs)("dl", {
					className: ConcurrencyMeterSection_module_css_default.summary,
					children: [
						(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("active") }), (0, react_jsx_runtime.jsx)("dd", { children: value.active })] }),
						(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("peak") }), (0, react_jsx_runtime.jsx)("dd", { children: value.peak })] }),
						(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("totalStarted") }), (0, react_jsx_runtime.jsx)("dd", { children: value.totalStarted })] }),
						(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("failed") }), (0, react_jsx_runtime.jsx)("dd", { children: value.failed })] })
					]
				}),
				value.activeCalls.length > 0 ? (0, react_jsx_runtime.jsxs)("div", {
					className: ConcurrencyMeterSection_module_css_default.group,
					children: [
						(0, react_jsx_runtime.jsx)("h3", { children: t("activeCalls") }),
						(0, react_jsx_runtime.jsx)("ul", {
							className: ConcurrencyMeterSection_module_css_default.activeList,
							children: value.activeCalls.map((call) => (0, react_jsx_runtime.jsxs)("li", { children: [
								(0, react_jsx_runtime.jsxs)("div", {
									className: ConcurrencyMeterSection_module_css_default.route,
									children: [(0, react_jsx_runtime.jsx)("strong", { children: call.provider }), (0, react_jsx_runtime.jsx)("code", { children: call.model })]
								}),
								(0, react_jsx_runtime.jsx)("span", { children: t(purposeKey(call.purpose)) }),
								(0, react_jsx_runtime.jsx)("span", { children: duration(call.elapsedMs, t) })
							] }, call.id))
						}),
						value.hiddenActiveCalls > 0 ? (0, react_jsx_runtime.jsx)("p", {
							className: ConcurrencyMeterSection_module_css_default.muted,
							children: t("moreActive", { count: value.hiddenActiveCalls })
						}) : null
					]
				}) : null,
				(0, react_jsx_runtime.jsxs)("div", {
					className: ConcurrencyMeterSection_module_css_default.group,
					children: [(0, react_jsx_runtime.jsx)("h3", { children: t("providers") }), value.providers.length === 0 ? (0, react_jsx_runtime.jsx)("p", {
						className: ConcurrencyMeterSection_module_css_default.muted,
						children: t("noHistory")
					}) : (0, react_jsx_runtime.jsx)("ul", {
						className: ConcurrencyMeterSection_module_css_default.providerList,
						children: value.providers.map((provider) => (0, react_jsx_runtime.jsxs)("li", { children: [(0, react_jsx_runtime.jsxs)("div", {
							className: ConcurrencyMeterSection_module_css_default.providerName,
							children: [(0, react_jsx_runtime.jsx)("strong", { children: provider.provider }), (0, react_jsx_runtime.jsxs)("span", {
								"data-active": provider.active > 0 ? "true" : void 0,
								children: [
									provider.active,
									" ",
									t("active")
								]
							})]
						}), (0, react_jsx_runtime.jsxs)("dl", { children: [
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("peak") }), (0, react_jsx_runtime.jsx)("dd", { children: provider.peak })] }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("totalStarted") }), (0, react_jsx_runtime.jsx)("dd", { children: provider.totalStarted })] }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("succeeded") }), (0, react_jsx_runtime.jsx)("dd", { children: provider.succeeded })] }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("failed") }), (0, react_jsx_runtime.jsx)("dd", { children: provider.failed })] }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("aborted") }), (0, react_jsx_runtime.jsx)("dd", { children: provider.aborted })] }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("incomplete") }), (0, react_jsx_runtime.jsx)("dd", { children: provider.incomplete })] })
						] })] }, provider.provider))
					})]
				})
			] }) : null
		]
	});
}

//#endregion
//#region lib/types/client/locales.js
const NS = "concurrency-meter";
const zh = {
	nav: "并发监控",
	title: "并发监控",
	reload: "刷新统计",
	reset: "重置统计",
	loading: "正在读取并发统计...",
	loadError: "无法读取并发统计",
	retry: "重新加载",
	active: "当前活动",
	peak: "峰值并发",
	totalStarted: "已启动",
	failed: "失败",
	idle: "当前没有模型请求",
	healthy: "并发低于提醒阈值",
	warning: "当前并发已达到提醒阈值 {threshold}",
	activeCalls: "活动请求",
	providers: "供应商统计",
	noHistory: "重启或重置后还没有模型请求。",
	purpose: "用途",
	elapsed: "已运行",
	succeeded: "成功",
	aborted: "中止",
	incomplete: "未完整消费",
	moreActive: "另有 {count} 个活动请求未展开",
	milliseconds: "{value} 毫秒",
	seconds: "{value} 秒",
	"purpose.conversation": "对话",
	"purpose.compaction": "上下文压缩",
	"purpose.session-title": "会话标题"
};
const en = {
	nav: "Concurrency",
	title: "Concurrency",
	reload: "Refresh metrics",
	reset: "Reset metrics",
	loading: "Reading concurrency metrics...",
	loadError: "Could not load concurrency metrics",
	retry: "Reload",
	active: "Active now",
	peak: "Peak concurrency",
	totalStarted: "Started",
	failed: "Failed",
	idle: "No model requests are active",
	healthy: "Concurrency is below the warning threshold",
	warning: "Concurrency has reached the warning threshold of {threshold}",
	activeCalls: "Active requests",
	providers: "Provider metrics",
	noHistory: "No model requests have run since restart or reset.",
	purpose: "Purpose",
	elapsed: "Elapsed",
	succeeded: "Succeeded",
	aborted: "Aborted",
	incomplete: "Not fully consumed",
	moreActive: "{count} additional active requests are not expanded",
	milliseconds: "{value} ms",
	seconds: "{value} s",
	"purpose.conversation": "Conversation",
	"purpose.compaction": "Compaction",
	"purpose.session-title": "Session title"
};

//#endregion
//#region lib/types/client/index.js
const inject = [
	"slots",
	"locale",
	"remote"
];
async function apply(ctx) {
	await ctx.remote.$mount(TYPERT_REMOTE);
	const remote = ctx.get("remote.concurrencyMeter");
	if (remote === void 0) throw new Error("concurrency-meter: mounted Remote namespace is unavailable");
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "concurrency-meter: dictionaries");
	const t = ctx.locale.bind(NS);
	const call = async (method) => {
		const result = await remote[method]();
		if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
		return result.value;
	};
	const injected = () => ({
		snapshot: () => call("snapshot"),
		reset: () => call("reset")
	});
	ctx.slots.inject("settings.section", () => ctx.slots.register({
		name: "settings.section",
		id: "concurrency-meter",
		order: 26,
		label: () => t("nav"),
		locale: NS,
		inject: injected
	}, ConcurrencyMeterSection));
}

//#endregion
exports.apply = apply;
exports.inject = inject;
return module.exports; } });
//# sourceMappingURL=client.js.map