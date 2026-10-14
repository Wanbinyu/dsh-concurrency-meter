# Changelog

## 0.1.7 - 2026-10-15

- Adapt to Harness 0.2.1-alpha.3. Peer ranges also accept 0.2.0-rc.2, 0.1.5-rc.2, and the 0.1.1-rc.2 baseline.
- Resolve 0.2 Medium icons first and fall back to the 0.1 icon names, so one externalized client bundle loads on both hosts.
- Accept Cordis 4.0.5-alpha alongside ^4.0.1. The invariant companion stays optional because 0.2.1 no longer publishes @deepseek-ai/dsh-invariants.
- Remote codecs keep the 0.1 schema field and add the 0.2 create() factory.

## 0.1.6 - 2026-09-11

- Adapt to Harness 0.1.5-rc.2 while retaining 0.1.1-rc.2 baseline coverage.
- Remove retired client runtime dependencies from Web plugins; preserve official Slot APIs.
- Add explicit compatibility guidance for downloadable archives.

## 0.1.1 - 2026-08-21

- Validate types, tests, builds, and package contents against DeepSeek Harness `0.1.1-rc.1`.
- Retain a peer compatibility branch for DeepSeek Harness `0.1.0-rc.6` through `rc.8`.

## 0.1.0 - 2026-08-19

- Add global read-only monitoring for the DSH `llm/stream` call chain.
- Report current and peak concurrency, outcomes, and per-provider metrics.
- Show active provider, model, purpose, and elapsed time without reading prompts.
- Add configurable warning and active-detail thresholds.
- Add safe in-memory reset behavior and localized Chinese and English UI.
