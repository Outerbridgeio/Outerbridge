<!-- markdownlint-disable MD030 -->

# Outerbridge - Automate Web3 and Web2 applications

Outerbridge is a low code/no code workflow automation application, focusing on integrating both on-chain and off-chain applications. The project is licensed under [Apache License Version 2.0](https://github.com/Outerbridgeio/Outerbridge/blob/master/LICENSE.md), source available and free to self-host.

![Outerbridge](https://raw.githubusercontent.com/Outerbridgeio/Outerbridge/master/assets/outerbridge_brand.png)

## ⚡Quick Start

1. Install MongoDB [locally](https://www.mongodb.com/docs/manual/administration/install-community/) OR follow the guide of using MongoDB Atlas [here](https://docs.outerbridge.io/get-started#mongodb-atlas)
2. Install Outerbridge
    ```bash
    npm install -g outerbridge
    ```
3. Start Outerbridge

    ```bash
    npx outerbridge start
    ```

    If using MongoDB Atlas

    ```bash
    npx outerbridge start --mongourl=mongodb+srv://<user>:<password>@<your-cluster>.mongodb.net/outerbridge?retryWrites=true&w=majority
    ```

4. Open [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

Official Outerbridge docs can be found under: [https://docs.outerbridge.io](https://docs.outerbridge.io)

## 🌐 Host

-   Digital Ocean Droplet: [Setup guide](https://gist.github.com/HenryHengZJ/93210d43d655b4172ee50794ce473b62)
-   AWS EC2: [Setup guide](https://gist.github.com/HenryHengZJ/627cec19671664a88754c7e383232dc8)

## 🙋 Support

Feel free to ask any questions, raise problems, and request new features in [discussion](https://github.com/Outerbridgeio/Outerbridge/discussions)

## 🙌 Contributing

See [contributing guide](https://github.com/Outerbridgeio/Outerbridge/blob/master/CONTRIBUTING.md). Reach out to us at [Discord](https://discord.gg/Y9VE4ykPDJ) if you have any questions or issues.

## 📄 License

Source code in this repository is made available under the [Apache License Version 2.0](https://github.com/Outerbridgeio/Outerbridge/blob/master/LICENSE.md).
