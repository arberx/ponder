# Ponder

[![CI status][ci-badge]][ci-url]
[![Version][version-badge]][version-url]

[![Telegram chat][tg-badge]][tg-url]
[![License][license-badge]][license-url]

Ponder is an open-source framework for blockchain application backends.

## Documentation

Visit [ponder.sh](https://ponder.sh) for documentation, guides, and the API reference.

## Support

Join [Ponder's telegram chat](https://t.me/ponder_sh) for support, feedback, and general chatter.

## Features

✅ &nbsp;Local development server with hot reloading<br/>
✅ &nbsp;`create-ponder` CLI tool to get started from an Etherscan link or Graph Protocol subgraph<br/>
✅ &nbsp;End-to-end type safety using [viem](https://viem.sh) and [ABIType](https://github.com/wagmi-dev/abitype)<br/>
✅ &nbsp;Autogenerated GraphQL API<br/>
✅ &nbsp;Easy to deploy anywhere using Node.js/Docker<br/>
✅ &nbsp;Supports all Ethereum-based blockchains, including test nodes like [Anvil](https://book.getfoundry.sh/anvil)<br/>
✅ &nbsp;Index events from multiple chains in the same app<br/>
✅ &nbsp;Reconciles chain reorganization<br/>
🏗️ &nbsp;Transaction call event handlers<br/>
🏗️ &nbsp;Support for factory contracts like Uniswap V2/V3<br/>

## Quickstart

### 1. Run `create-ponder`

You will be asked for a project name, and if you are using an Etherscan or Graph Protocol [template](https://ponder.sh/api-reference/create-ponder) (recommended).

```bash
npm init ponder@latest
# or
pnpm create ponder
# or
yarn create ponder
```

### 2. Start the development server

The development server automatically reloads your app when you save changes in any project file, and prints `console.log` statements and errors in your code.

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

### 3. Add contracts & networks

Ponder fetches event logs for the contracts added to `ponder.config.ts`, and passes those events to the handler functions you write.

```ts
// ponder.config.ts
import { http } from "viem";

export const config = {
  networks: [
    {
      name: "mainnet",
      chainId: 1,
      transport: http(),
    },
  ],
  contracts: [
    {
      name: "BaseRegistrar",
      network: "mainnet",
      abi: "./abis/BaseRegistrar.json",
      address: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
      startBlock: 9380410,
    },
  ],
};
```

### 4. Define your schema

The `schema.graphql` file specifies the shape of your application's data.

```ts
// schema.graphql

type EnsName @entity {
  id: String!
  name: String!
  owner: String!
  registeredAt: Int!
}
```

### 5. Write event handlers

Use event handler functions to convert raw blockchain events into application data.

```ts
// src/BaseRegistrar.ts

import { ponder } from "@/generated";

ponder.on("BaseRegistrar:NameRegistered", async ({ event, context }) => {
  const { EnsName } = context.entities;
  const { name, owner } = event.params;

  await EnsName.create({
    id: `${name}-${owner}`,
    data: {
      name: name,
      owner: owner,
      registeredAt: event.block.timestamp,
    },
  });
});
```

### 6. Query the GraphQL API

Ponder automatically generates a frontend-ready GraphQL API based on your project's `schema.graphql`. The API will serve the data that you inserted in your event handler functions.

```ts
{
  ensNames(first: 2) {
    name
    owner
    registeredAt
  }
}
```

```json
{
  "ensNames": [
    {
      "name": "vitalik.eth",
      "owner": "0x0904Dac3347eA47d208F3Fd67402D039a3b99859",
      "registeredAt": 1580345271
    },
    {
      "name": "joe.eth",
      "owner": "0x6109DD117AA5486605FC85e040ab00163a75c662",
      "registeredAt": 1580754710
    }
  ]
}
```

That's it! Visit [ponder.sh](https://ponder.sh) for documentation, guides for deploying to production, and the API reference.

## Contributing

If you're interested in contributing to Ponder, please read the [contribution guide](/.github/CONTRIBUTING.md).

## Packages

- `@ponder/core`
- `create-ponder`
- `eslint-config-ponder`

## About

Ponder is MIT-licensed open-source software.

[ci-badge]: https://github.com/0xOlias/ponder/actions/workflows/main.yml/badge.svg
[ci-url]: https://github.com/0xOlias/ponder/actions/workflows/main.yml
[tg-badge]: https://img.shields.io/endpoint?color=neon&logo=telegram&label=Chat&url=https%3A%2F%2Fmogyo.ro%2Fquart-apis%2Ftgmembercount%3Fchat_id%3Dponder_sh
[tg-url]: https://t.me/ponder_sh
[license-badge]: https://img.shields.io/npm/l/@ponder/core?label=License
[license-url]: https://github.com/0xOlias/ponder/blob/main/LICENSE
[version-badge]: https://img.shields.io/npm/v/@ponder/core
[version-url]: https://github.com/0xOlias/ponder/releases
