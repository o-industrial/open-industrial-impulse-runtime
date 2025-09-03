# Agents Guide — open-industrial-impulse-runtime

Real-time impulse processing runtime (streams, event handling, NATS integration) for Open Industrial.

## Scope
- Process impulses and events; interface with NATS where configured.
- Persist or stage data in Deno KV per config.
- Avoid UI concerns; this is backend processing.

## Project Map
- `src/plugins/*`: Runtime integration points
- `src/logging/*`: Logging
- `configs/eac-runtime.config.ts`: Runtime configuration
- `denokv/*`: Local KV databases (dev only)
- `tests/`: Behavior tests

## Commands
- Dev: `deno task dev`
- Check: `deno task check`
- Test: `deno task test`
- Build: `deno task build`
- Start: `deno task start`
- Docker: `deno task build:docker` → `deno task refresh:docker`
  - Default port: 5414

## Patterns
- Keep processors modular; make transport adapters thin.
- Guard against backpressure; prefer async iteration and batching.
- Feature flags/options live in EaC config.

## PR Checklist
- Type checks, tests, and lint pass.
- No excessive logging; use structured logs.
- Document any new processor and its inputs/outputs.

## Safety
- Do not commit production KV or secrets.
- Avoid destructive replays; gate replay features behind config.

