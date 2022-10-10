<!-- markdownlint-disable MD030 -->

# Outerbridge - Automate Web3 and Web2 applications

Outerbridge is a low code/no code workflow automation application, focusing on integrating both on-chain and off-chain applications. The project is licensed under [Apache License Version 2.0](LICENSE.md), source available and free to self-host.

![Outerbridge](./assets/outerbridge_brand.png)

![Outerbridge Screenshot](./assets/screenshot_outerbridge.jpg)

## Why another workflow automation tool?

There are many awesome automation tools out there, however there isn't one that has the built-in logic of interacting/consuming information from blockchains. Hence, Outerbridge is created to allow people building workflows involving on-chain and off-chain applications, with simple drag and drop interface.

## Demo

Here is the [demo](https://demo.outerbridge.io) version of Outerbridge hosted using AWS t2-micro.

Detail [documentation](https://gist.github.com/HenryHengZJ/f8fb7dae0300d18a104cc4a29ec51a7a) on how to setup using AWS t2-micro with your custom domain name.

Watch [Outerbridge Quickstart Demo](https://www.youtube.com/watch?v=x-AfrkKvZ4M) on Youtube (4mins)

## Quick Start

1. Install MongoDB from [here](https://www.mongodb.com/try/download/community?tck=docs_server).
2. `npm install -g outerbridge`
3. `npx outerbridge start`
4. Open http://localhost:3000

## Docker

1. Go to `docker` folder at the root of the project
2. `docker-compose up -d`
3. This will automatically spins up mongodb and outerbridge containers
4. Open http://localhost:3000
5. You can bring the containers down by `docker-compose stop`

## Developers

### Prerequisite

Lerna, MongoDB and Yarn have to be installed before setting up the project.

### Lerna

Outerbridge has 3 different modules in a single mono repository.

-   `server`: Node backend to serve API logics
-   `ui`: React frontend
-   `components`: Nodes and Credentials of applications

Lerna is used to link these modules together.

### MongoDB

Outerbridge uses MongoDB as database. Download and install one [here](https://www.mongodb.com/try/download/community?tck=docs_server).

### Yarn

```bash
npm i -g yarn
```

### Setup

1. Clone the repository

    ```bash
        git clone https://github.com/Outerbridgeio/Outerbridge.git
    ```

2. Go into repository folder

    ```bash
    cd Outerbridge
    ```

3. Install `lerna`, `husky` and `rimraf` :

    ```bash
    yarn setup
    ```

4. Install all dependencies of all modules and link them together:

    ```bash
    yarn bootstrap
    ```

5. Build all the code:

    ```bash
    yarn build
    ```

6. Start the app:

    ```bash
    yarn start
    ```

    You can now access the app on [http://localhost:3000](http://localhost:3000)

7. For development build:

    ```bash
    yarn dev
    ```

    Any code changes will reload the app automatically on [http://localhost:8080](http://localhost:8080)

## Documentation

Official Outerbridge docs can be found under: [https://docs.outerbridge.io](https://docs.outerbridge.io)

## Support

Feel free to ask any questions, raise problems, and request new features in [discussion](https://github.com/Outerbridgeio/Outerbridge/discussions)

## Contributing

See [contributing guide](CONTRIBUTING.md). Reach out to us at [Discord](https://discord.gg/Y9VE4ykPDJ) if you have any questions or issues.

## License

Source code in this repository is made available under the [Apache License Version 2.0](LICENSE.md).
