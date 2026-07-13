# schemas

Static JSON Schema artifacts served under `/schemas/`.

## vaults.schema.json

Vendored from `@agentage/memory-core@0.2.0` (the file shipped at
`schema/vaults.schema.json` in that package's npm tarball).

Served at `https://agentage.io/schemas/vaults.schema.json`. The CLI and the
standalone server scaffold `vaults.json` configs with
`"$schema": "https://agentage.io/schemas/vaults.schema.json"`, so this path
must resolve.

Do not edit by hand. To regenerate on each memory-core schema release, copy
`schema/vaults.schema.json` from the published `@agentage/memory-core` tarball
and bump the version noted above.
