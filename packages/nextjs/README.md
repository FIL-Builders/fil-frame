# fil-frame (Storacha)

Quickstart your Filecoin dApp using this open source dev stack.

Get started with Storacha Delegations [docs](https://web3.storage/docs/how-to/upload/#bring-your-own-delegations)

# w3cli Quickstart Guide

This guide will help you quickly set up and use the `w3cli` tool to manage your Filecoin dApp and create a Space for organizing your stored data.

## Table of Contents

1. [Using the CLI](#using-the-cli)
2. [How to Create a Space](#how-to-create-a-space)
3. [Setting Up Environment Variables](#setting-up-environment-variables)

## Using the CLI

The easiest way to create an account is by using `w3cli`.

### Step-by-Step Guide

1. **Install the CLI**: Open your command line interface and install the CLI from npm by running the following command:

   ```bash
   npm install -g @web3-storage/w3cli
   ```

2. **Login with Your Email**: Use the command line to log in with your email address. Replace `alice@example.com` with your actual email:

   ```bash
   w3 login alice@example.com
   ```

   This command will send an email to your inbox with a link for validation.

3. **Validate Your Email**: Check your email inbox for the validation link. Click on the link to proceed.

4. **Enter Payment Information**: After clicking the validation link, you'll be redirected to a webpage where you can enter your payment information and select a plan. You can choose from various plans, including our Free tier.

5. **Account Creation Complete**: Once you've completed the above steps, your account will be successfully created.

## How to Create a Space

In this how-to guide, you'll learn how to create a web3.storage Space to organize stored data. For an overview of the various ways web3.storage can be integrated with your application, check out Architecture Options.

A Space acts as a namespace for your uploads. It is created locally, offline, and associated with a cryptographic key pair (identified by the did:key of the public key). You can register this Space with your web3.storage account to take responsibility for the uploads in the space. Once you do this, you don't need to worry about keeping track of the Space's private key, because your web3.storage account has been authorized to use the Space.

### Using the CLI

1. **Initiate Space Creation**: Run the following command to create a new Space:

   ```bash
   w3 space create
   ```

2. **Name Your Space**: The CLI will ask, "What would you like to call this space?". Provide a name that will help you distinguish it from other spaces, then press the enter key. If you're unsure, you can try naming it "my first space".

3. **Save the Secret Recovery Key**: The CLI will display a message: "🔑 You need to save the following secret recovery key somewhere safe!…". Press the enter key to reveal the recovery phrase.

4. **Backup the Recovery Phrase**: Save the recovery phrase somewhere safe. This is crucial if you want to recover control of the space in case you lose access to the computer you used to create the space. Even if you don't need this level of recovery, you will need to store this phrase and be able to repeat it in the next step.

5. **Confirm Backup**: Type the recovery phrase so `w3cli` knows you have backed it up, then press the enter key.

## Setting Up Environment Variables

To interact with the `w3cli` and manage your Filecoin dApp, you'll need to set up some environment variables. Follow these steps to obtain and configure your `KEY` and `PROOF`.

### Obtain Your Agent Private Key and DID

1. **Create a Key**: Run the following command to generate your agent's private key and DID:

   ```bash
   w3 key create
   ```

   - **Important**: Store the private key (starting with "Mg...") in an environment variable named `KEY`.

### Create a UCAN Delegation

2. **Set the Space**: Before creating a delegation, ensure you have set the Space you intend to delegate access to by using:

   ```bash
   w3 space use ${yourSpaceDID}
   ```

3. **Create a Delegation**: Use the following command to create a UCAN delegation from the `w3cli` agent to the agent you generated above. Replace `<did_from_ucan-key_command_above>` with the DID obtained from the previous step:

   ```bash
   w3 delegation create <did_from_ucan-key_command_above> --base64
   ```

   - **Important**: Store the output in an environment variable named `PROOF`.

   - **Optional**: If you want to limit permissions being passed to the Agent, you can specify permissions to give, e.g., `--can space/blob/add --can space/index/add --can filecoin/offer --can upload/add` limits to just being able to upload.

### Update Your Environment Variables

```shell
cp .env.example .env.local
```

Make sure to update your environment variables in your system or project configuration to include `KEY` and `PROOF`. This will ensure secure and efficient interaction with your Filecoin dApp using the `w3cli`.

By following these steps, you will have successfully set up your `w3cli`, created a Space, and configured the necessary environment variables to allow your app to upload files for the users by delegating them upload access!

### Run the app

1. ```shell
   yarn install
   ```

2. ```shell
   yarn dev
   ```
