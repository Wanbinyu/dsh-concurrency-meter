# dsh-concurrency-meter

English | [简体中文](README.md)

> Unofficial community plugin. It is not affiliated with or endorsed by DeepSeek.

Read-only model-request concurrency monitoring for DeepSeek Harness Web. The plugin observes DSH's official `llm/stream` chain and reports active requests, peak concurrency, outcomes, and per-provider metrics without intercepting, queueing, or modifying requests.

![dsh-concurrency-meter concurrency page](https://raw.githubusercontent.com/Wanbinyu/dsh-concurrency-meter/main/docs/images/dsh-concurrency-meter.png)

## Features

- Shows active requests, peak concurrency, total starts, and failures;
- Breaks down succeeded, failed, aborted, and incompletely consumed streams by provider;
- Lists each active request's provider, model, purpose, and elapsed time;
- Shows a warning when concurrency reaches 3 by default, with a configurable threshold;
- Refreshes once per second only while its Settings page is mounted;
- Resets in-memory metrics without cancelling active requests;
- Never reads messages, prompts, model output, credentials, or session IDs;
- Observes the call chain only: it does not rate-limit, queue, or change request results.

## Install

Requires Node.js `>=22.19` and DeepSeek Harness `0.1.0-rc.6` or later.
`v0.1.4` is type-checked, tested, built, and package-validated against DeepSeek Harness `0.1.2-rc.1` while retaining compatibility with `0.1.0-rc.6` through `rc.8` and `0.1.1-rc.1` through `rc.2`. It refreshes every second while requests are active and backs off to every five seconds when idle.

```bash
dsh plugin --profile web add https://github.com/Wanbinyu/dsh-concurrency-meter/releases/download/v0.1.4/dsh-concurrency-meter-0.1.4.tgz
```

Restart after installation or update:

```bash
dsh web
```

Open **Settings -> Concurrency** to view the metrics.

Uninstall:

```bash
dsh plugin --profile web remove dsh-concurrency-meter
```

## Configuration

```yaml
- insert:
    - id: concurrency-meter
      name: dsh-concurrency-meter
      config:
        warningThreshold: 3
        maxActiveDetails: 20
```

| Option | Default | Description |
| --- | ---: | --- |
| `warningThreshold` | `3` | Warning threshold from 1 to 100; it never limits requests |
| `maxActiveDetails` | `20` | Expanded active rows from 1 to 100; aggregate counts remain complete |

## Metric semantics

- `Succeeded`: the stream completed with a normal finish reason;
- `Failed`: the stream returned an error finish reason or the call chain threw;
- `Aborted`: the stream explicitly returned an aborted finish reason;
- `Not fully consumed`: the consumer closed early or the stream ended without a finish event;
- Lazy streams that are never consumed are not counted as started;
- All metrics live only in the current DSH Host process and reset on restart.

Provider and model IDs identify the source of concurrency and are not prompt content. The plugin does not persist metrics and does not provide historical trends, rate limiting, or request queues.

## Development

```bash
npm install
npm run verify
```

`verify` runs Host/Web type checks, unit tests, the client build, and package-content validation. The browser bundle uses lightweight Remote boundary codecs and is about 21 KB (about 5.4 KB gzip) instead of embedding another full copy of Zod.

## Feedback

Please use [GitHub Issues](https://github.com/Wanbinyu/dsh-concurrency-meter/issues).

## License

[MIT](LICENSE)
