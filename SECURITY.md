# Security

Please report security issues privately through GitHub Security Advisories.

The plugin observes the `llm/stream` call envelope but does not inspect message
content, prompts, model output, credentials, or session IDs. The Host exposes
only aggregate counters and the provider, model, purpose, and elapsed time of
active calls. Metrics remain in memory and are not written to disk.

Provider and model identifiers may reveal internal route names. Review
screenshots and diagnostic output before publishing them.

