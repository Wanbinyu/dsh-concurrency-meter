import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import { IconRefreshOutline16, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './ConcurrencyMeterSection.module.css';
const ACTIVE_REFRESH_MS = 1000;
const IDLE_REFRESH_MS = 5000;
function purposeKey(purpose) {
    return `purpose.${purpose}`;
}
function duration(ms, t) {
    return ms < 1000
        ? t('milliseconds', { value: ms })
        : t('seconds', { value: (ms / 1000).toFixed(1) });
}
export function ConcurrencyMeterSection({ snapshot, reset, t }) {
    const [revision, setRevision] = useState(0);
    const [state, setState] = useState({ status: 'loading' });
    const [resetting, setResetting] = useState(false);
    const reload = useCallback(() => {
        setState({ status: 'loading' });
        setRevision(value => value + 1);
    }, []);
    useEffect(() => {
        let current = true;
        let timer;
        const tick = async () => {
            let refreshMs = IDLE_REFRESH_MS;
            try {
                const value = await snapshot();
                refreshMs = value.active > 0 ? ACTIVE_REFRESH_MS : IDLE_REFRESH_MS;
                if (current)
                    setState({ status: 'ready', value });
            }
            catch {
                if (current)
                    setState({ status: 'error' });
            }
            if (current)
                timer = setTimeout(() => { void tick(); }, refreshMs);
        };
        void tick();
        return () => {
            current = false;
            if (timer !== undefined)
                clearTimeout(timer);
        };
    }, [revision, snapshot]);
    const resetMetrics = async () => {
        if (resetting)
            return;
        setResetting(true);
        try {
            setState({ status: 'ready', value: await reset() });
        }
        catch {
            setState({ status: 'error' });
        }
        finally {
            setResetting(false);
        }
    };
    const value = state.status === 'ready' ? state.value : undefined;
    const warning = value !== undefined && value.active >= value.warningThreshold;
    return (_jsxs("section", { className: css.section, "data-concurrency-meter": true, "aria-busy": state.status === 'loading', children: [_jsxs("header", { className: css.header, children: [_jsx("h2", { children: t('title') }), _jsxs("div", { className: css.headerActions, children: [_jsx("button", { type: "button", className: css.resetButton, disabled: resetting || value === undefined, onClick: () => { void resetMetrics(); }, children: t('reset') }), _jsx(Tooltip, { label: t('reload'), side: "bottom", children: _jsx("button", { type: "button", className: css.iconButton, "aria-label": t('reload'), onClick: reload, children: _jsx(IconRefreshOutline16, { size: 16 }) }) })] })] }), state.status === 'loading' ? _jsx("p", { className: css.muted, children: t('loading') }) : null, state.status === 'error' ? (_jsxs("div", { className: css.loadFailure, role: "alert", children: [_jsx("span", { children: t('loadError') }), _jsx("button", { type: "button", onClick: reload, children: t('retry') })] })) : null, value !== undefined ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: css.statusLine, "data-warning": warning ? 'true' : undefined, role: "status", children: [_jsx("span", { className: css.statusDot, "aria-hidden": "true" }), _jsx("span", { children: value.active === 0 ? t('idle') : warning ? t('warning', { threshold: value.warningThreshold }) : t('healthy') })] }), _jsxs("dl", { className: css.summary, children: [_jsxs("div", { children: [_jsx("dt", { children: t('active') }), _jsx("dd", { children: value.active })] }), _jsxs("div", { children: [_jsx("dt", { children: t('peak') }), _jsx("dd", { children: value.peak })] }), _jsxs("div", { children: [_jsx("dt", { children: t('totalStarted') }), _jsx("dd", { children: value.totalStarted })] }), _jsxs("div", { children: [_jsx("dt", { children: t('failed') }), _jsx("dd", { children: value.failed })] })] }), value.activeCalls.length > 0 ? (_jsxs("div", { className: css.group, children: [_jsx("h3", { children: t('activeCalls') }), _jsx("ul", { className: css.activeList, children: value.activeCalls.map(call => (_jsxs("li", { children: [_jsxs("div", { className: css.route, children: [_jsx("strong", { children: call.provider }), _jsx("code", { children: call.model })] }), _jsx("span", { children: t(purposeKey(call.purpose)) }), _jsx("span", { children: duration(call.elapsedMs, t) })] }, call.id))) }), value.hiddenActiveCalls > 0 ? _jsx("p", { className: css.muted, children: t('moreActive', { count: value.hiddenActiveCalls }) }) : null] })) : null, _jsxs("div", { className: css.group, children: [_jsx("h3", { children: t('providers') }), value.providers.length === 0 ? _jsx("p", { className: css.muted, children: t('noHistory') }) : (_jsx("ul", { className: css.providerList, children: value.providers.map(provider => (_jsxs("li", { children: [_jsxs("div", { className: css.providerName, children: [_jsx("strong", { children: provider.provider }), _jsxs("span", { "data-active": provider.active > 0 ? 'true' : undefined, children: [provider.active, " ", t('active')] })] }), _jsxs("dl", { children: [_jsxs("div", { children: [_jsx("dt", { children: t('peak') }), _jsx("dd", { children: provider.peak })] }), _jsxs("div", { children: [_jsx("dt", { children: t('totalStarted') }), _jsx("dd", { children: provider.totalStarted })] }), _jsxs("div", { children: [_jsx("dt", { children: t('succeeded') }), _jsx("dd", { children: provider.succeeded })] }), _jsxs("div", { children: [_jsx("dt", { children: t('failed') }), _jsx("dd", { children: provider.failed })] }), _jsxs("div", { children: [_jsx("dt", { children: t('aborted') }), _jsx("dd", { children: provider.aborted })] }), _jsxs("div", { children: [_jsx("dt", { children: t('incomplete') }), _jsx("dd", { children: provider.incomplete })] })] })] }, provider.provider))) }))] })] })) : null] }));
}
