<!-- markdownlint-disable MD030 -->

# Outerbridge - Automate Web3 and Web2 applications

Outerbridge is a low code/no code workflow automation application, focusing on integrating both on-chain and off-chain applications. The project is licensed under [Apache License Version 2.0](../../LICENSE.md), source available and free to self-host.

![Outerbridge](../../assets/outerbridge_brand.png)

## Environment Setup

Lerna and MongoDB have to be installed before setting up the project.

### Lerna

Outerbridge has 3 different modules in a single mono repository.

-   `server`: Node backend to serve API logics
-   `ui`: React frontend
-   `components`: Nodes and Credentials of applications

Lerna is used to link these modules together.

```bash
npm i -g lerna
```

### MongoDB

Outerbridge uses MongoDB as database. Download and install one [here](https://www.mongodb.com/try/download/community?tck=docs_server).

## Quick Start

1. npm install -g outerbridge
2. npx outerbridge start
3. open [http://localhost:3000](http://localhost:3000)

## Demo

Watch [demo](https://www.youtube.com/watch?v=x-AfrkKvZ4M) on Youtube (4mins)

## Documentation

Official Outerbridge docs can be found under: [https://docs.outerbridge.io](https://docs.outerbridge.io)

## Support

Feel free to ask any questions, raise problems, and request new features in [discussion](https://github.com/Outerbridgeio/Outerbridge/discussions)

## Contributing

See [contributing guide](../../CONTRIBUTING.md). Reach out to us at [Discord](https://discord.gg/Y9VE4ykPDJ) if you have any questions or issues.

## License

Source code in this repository is made available under the [Apache License Version 2.0](../../LICENSE.md).
