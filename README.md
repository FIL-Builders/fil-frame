# FIL-Frame

Welcome to FIL-Frame, a starter repository designed to help developers quickly get started with building decentralized applications (dApps) on the Filecoin network. This repository provides various integration options, including an example template using Lighthouse.

## Table of Contents

- Overview
- Getting Started
  - Prerequisites
  - Installation
  - Configuration
- Using the CLI
- Usage
  - Deploying smart contracts
  - Running the frontend
- Storage Onramp Options
  - Lighthouse integration
  - Storacha integration
- Deal Client Options
  - Akave
- Project Structure
- Contribution guidelines
- License

## Overview

FIL-Frame is a monorepo that includes two main packages:

`hardhat`: Manages the blockchain-related aspects, including smart contract development, deployment, and testing.

`nextjs`: Handles the frontend and API aspects of the project using Next.js.

This repository is designed to be a quickstart for developers new to the Filecoin ecosystem, providing various integration options to suit different needs.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- Yarn
- Hardhat

You can install them by following the instructions on these pages:

- [Node.js](https://nodejs.org/en/download/package-manager)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#installation)

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-repo/fil-frame.git
cd fil-frame 
```

1. Install dependencies

```bash
yarn install
```

or

```bash
npm install
```

### Configuration

1. Copy the sample environment files, and fill in the required values:

```bash
cp packages/hardhat/.env.example packages/hardhat/.env
cp packages/nextjs/.env.example packages/nextjs/.env.local
```

2. Update the environment variables in the `.env` files with your own values.

## Using the CLI

The `create-filecoin-app` CLI tool helps you quickly set up a Filecoin-ready repository. It offers two modes: interactive mode and flag mode.

### Interactive Mode

To use the interactive mode, simply run:

```bash
npx create-filecoin-app
```

You will be prompted to answer a series of questions to configure your new project. This includes your project name, selecting your preferred storage onramp option (Lighthouse, or Storacha), and even selecting your preferred package manager (Yarn, or NPM).

### Flag Mode

If you prefer to skip the prompts, you can use the flag mode to specify your options directly. For example, to initialise a project named `my-app`, with lighthouse as the storage onramp:

```bash
npx create-filecoin-app my-app --lighthouse
```

This command initializes a new repository named `my-app` with Lighthouse as the storage onramp.

The flags available currently include:

- `--lighthouse`: this initializes a project using lighthouse as the storage onramp
- `--storacha`: this initializes a project using storacha as the storage onramp

### Storage Onramp Options

- **Lighthouse**: Decentralized storage solution for NFTs and other data.
- **Storacha**: Another decentralized storage option, formerly known as web3.storage.

After running the CLI, your new project will be set up and ready for development with your chosen storage onramp.

## Usage

### Deploying Smart Contracts

To compile and deploy the smart contracts:

```bash
yarn compile
yarn deploy
```

or

```bash
npm compile
npm deploy
```

### Running the Frontend

To start the Next.js frontend:

```bash
yarn dev
```

or

```bash
npm run dev
```

The application will be available at
[`https://localhost:3000`](https://localhost:3000)

## Integration Options

### Lighthouse

The repository includes an template which makes use of Lighthouse for decentralized storage, and is available in the `lighthouse-nfts` branch.

To use this integration:

1. Ensure you have the Lighthouse API key set in your `.env.local` file:
`LIGHTHOUSE_API_KEY=your_lighthouse_api_key`
2. Run the following command:
`yarn dev` or `npm run dev`
3. Use the provided integration to upload files to Lighthouse

## Project Structure

```
my-app/
├── packages/
│   ├── hardhat/
│   │   │── contracts
│   │   │── deploy
│   │   │── scripts
│   │   │── .env.example
│   │   │── README.md
│   │   │── package.json
│   │   └── ...
│   └── nextjs/
│       │── app
│       │── components
│       │── contracts
│       │── hooks/fil-frame
│       │── utils/fil-frame
│       │── .env.example
│       │── package.json
│       └── ...
│   
├── LICENSE
├── package.json
├── README.md
└── ...
```

## Contributing

We welcome contributions!

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for details.
