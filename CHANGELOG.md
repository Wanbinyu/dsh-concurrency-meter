# Changelog

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
