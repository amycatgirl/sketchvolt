# Revite Plugin Boilerplate

> ## Beware that plugins *will* break whenever the [client rewrite](https://github.com/revoltchat/frontend) is generaly available.
> Alongside the client rewrite, plugins will probably have a different format, as opposed to json. A discussion related to the
> topic is available [here.](https://github.com/revoltchat/frontend/issues/252)

Boilerplate for manifest V1 revite plugins. Originally [revite-ts-plugin-boilerplate](https://github.com/sussycatgirl/revite-ts-plugin-boilerplate),
adapted for Vanilla JS.

## Instructions

A nix shell is available with this repo, to use it, run `nix-shell`, the shell comes with all the things necesary for development.

If you don't want to use `nix`, you need to have `node` and `pnpm ` installed. Instalation through `corepack` is highly recommended.

## Building

To build, use the following command.


```bash

pnpm build

# Or if you want an unminified build
# pnpm build:dev
  
```
