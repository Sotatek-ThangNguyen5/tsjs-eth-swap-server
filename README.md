# tsjs-eth-swap-server

Chain-swap your wXPX from Proximax Sirius to Ethereum, vice versa. Lowest fee, instantly, securely. No registration, no deposit, no withdrawal

### Built With

This section should list any major frameworks that you built our project using. Leave any add-ons/plugins for the acknowledgements section.

- [Loopback 4](https://loopback.io/doc/en/lb4/)
- [Ethers](https://docs.ethers.io/v5/)

<!-- GETTING STARTED -->

## Getting Started

This is an instruction of how to set up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/proximax-storage/tsjs-eth-swap-server
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your config in `.env`
   ```JS
   KEY = 'ENTER YOUR KEY VALUE';
   ```

<!-- DOCUMENT -->

## Related Documents

- [Swap XPX to WXPX Flow chart](https://docdro.id/9kWDnR3) - Flow chart describe the flow of how to swap to WXPX ERC20 token from XPX
- [Swap wXPX to XPX Flow chart](https://docdro.id/LqPSXKJ)- Flow chart describe the flow of how to swap to Proximax XPX from wXPX Token
- [Expected API From ETH Swap Server](https://documenter.getpostman.com/view/8088351/TWDcGFTH#eb8fdbc4-6c93-4849-942c-72621dea82dd) - Document about expected API from ETH Swap Server. Can be change for integerating in future
- [Expected API From XPX Server](https://documenter.getpostman.com/view/8088351/TWDcGFTL#7ff4980f-1a9b-4d25-ac49-0de9c68cabb7)- Document about expected API from XPX Server. Can be change for integerating in future

# tsjs-eth-swap-server

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```
