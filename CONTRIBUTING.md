<!-- markdownlint-disable MD030 -->

# Contributing to Outerbridge

As the old chinese saying goes: 礼轻情意重 (It's the thought that counts), we appreciate any form of contributions.

## ⭐ Star

Star and share the [Github Repo](https://github.com/Outerbridgeio/Outerbridge).

## 🙋 Q&A

Search up for any questions in [Q&A section](https://github.com/Outerbridgeio/Outerbridge/discussions/categories/q-a), if you can't find one, don't hesitate to create one. It might helps others that have similar question.

## 🙌 Share Workflow

Yes! Sharing how you use Outerbridge is a way of contribution. Export your workflow as JSON, attach a screenshot and share it in [Show and Tell section](https://github.com/Outerbridgeio/Outerbridge/discussions/categories/show-and-tell).

## 💡 Ideas

Ideas are welcome such as new feature, apps integration, and blockchain networks. Submit in [Ideas section](https://github.com/Outerbridgeio/Outerbridge/discussions/categories/ideas).

## 🐞 Report Bugs

Found an issue? [Report it](https://github.com/Outerbridgeio/Outerbridge/issues/new/choose).

## 👨‍💻 Contribute to Code

Not sure what to contribute? Some ideas:

-   Create new node/credential component
-   Update existing components such as extending functionality, fixing bugs
-   Add new blockchain network to support
-   Unit tests and E2E tests

### Developers

Outerbridge has 3 different modules in a single mono repository.

-   `server`: Node backend to serve API logics
-   `ui`: React frontend
-   `components`: Nodes and Credentials of applications

#### Prerequisite

-   Install MongoDB [here](https://www.mongodb.com/try/download/community?tck=docs_server)
-   Install Yarn
    ```bash
    npm i -g yarn
    ```

#### Step by step

1. Fork the official [Outerbridge Github Repository](https://github.com/Outerbridgeio/Outerbridge).

2. Clone your forked repository.

3. Create a new branch, see [guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository). Naming conventions:

    - For feature branch: `feature/<Your New Feature>`
    - For bug fix branch: `bugfix/<Your New Bugfix>`.

4. Switch to the newly created branch.

5. Go into repository folder

    ```bash
    cd Outerbridge
    ```

6. Install `lerna`, `husky` and `rimraf` :

    ```bash
    yarn setup
    ```

7. Install all dependencies of all modules and link them together:

    ```bash
    yarn bootstrap
    ```

8. Build all the code:

    ```bash
    yarn build
    ```

9. Start the app on [http://localhost:3000](http://localhost:3000)

    ```bash
    yarn start
    ```

10. For development, run

    ```bash
    yarn dev
    ```

    Any changes made in `packages/ui` or `packages/server` will be reflected on [http://localhost:8080](http://localhost:8080)

    For changes made in `packages/components`, run `yarn build` again to pickup the changes.

11. After making all the changes, run

    ```bash
    yarn build
    ```

    and

    ```bash
    yarn start
    ```

    to make sure everything works fine in production.

12. Commit code and submit Pull Request from forked branch pointing to [Outerbridge master](https://github.com/Outerbridgeio/Outerbridge/tree/master). Example [PR](https://github.com/Outerbridgeio/Outerbridge/pull/50).

## 📖 Contribute to Docs

Contribute to Outerbridge [docs](https://github.com/Outerbridgeio/outerbridge-docs) if there is any mistake, confusion or grap.

## 🏷️ Pull Request process

A member of the Outerbridge team will automatically be notified/assigned when you open a pull request. You can also reach out to us on [Discord](https://discord.gg/Y9VE4ykPDJ).

## 📃 Contributor License Agreement

Before we can merge your contribution you have to sign our [Contributor License Agreement (CLA)](https://cla-assistant.io/OuterbridgeIO/Outerbridge). The CLA contains the terms and conditions under which the contribution is submitted. You need to do this only once for your first pull request. Keep in mind that without a signed CLA we cannot merge your contribution.

## 📜 Code of Conduct

This project and everyone participating in it are governed by the Code of Conduct which can be found in the [file](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to henryheng@outerbridge.io or hello@outerbridge.io.
