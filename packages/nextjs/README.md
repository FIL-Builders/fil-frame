# Fil-Frame (Storacha)

Quickstart your Filecoin dApp using this open-source development stack.

Get started with Storacha Delegations by visiting the [documentation](https://web3.storage/docs/how-to/upload/#bring-your-own-delegations).

## Complete Workflow to Set Up Your Environment for web3.storage

This guide will walk you through setting up the `w3cli` tool, creating an account, generating a Space, obtaining the necessary keys and proofs, and configuring your environment variables. By the end of this guide, you'll be able to integrate your app with web3.storage and delegate upload access to users.

---

## Table of Contents

1. [Install the CLI](#1-install-the-cli)
2. [Create an Account](#2-create-an-account)
3. [Create a Space](#3-create-a-space)
4. [Set Up Environment Variables](#4-set-up-environment-variables)
   - [Obtain Your Agent Private Key and DID](#obtain-your-agent-private-key-and-did)
   - [Create a UCAN Delegation](#create-a-ucan-delegation)
5. [Update Your Environment Variables](#5-update-your-environment-variables)
6. [Run Your App](#6-run-your-app)
7. [Conclusion](#7-conclusion)

---

## 1. Install the CLI

First, you'll need to install the `w3cli` command-line interface to interact with web3.storage.

```bash
npm install -g @web3-storage/w3cli
```

_Make sure you have [Node.js and npm](https://nodejs.org/) installed on your system before running this command._

---

## 2. Create an Account

Follow these steps to create a web3.storage account using the CLI:

### a. Log In with Your Email

Replace `your-email@example.com` with your actual email address:

```bash
w3 login your-email@example.com
```

- This command will send a validation email to your inbox.

### b. Validate Your Email

- Check your email inbox for a message from web3.storage.
- Click on the validation link provided in the email.

### c. Enter Payment Information

- After validation, you'll be redirected to a webpage.
- Enter your payment information if prompted.
- Choose a plan that suits you; a **Free tier** is available.

### d. Account Creation Complete

- Your account is now successfully created and ready to use!

---

## 3. Create a Space

A **Space** acts as a namespace for your uploads. It is created locally and associated with a cryptographic key pair. Follow these steps to create one:

### a. Initiate Space Creation

Run the following command:

```bash
w3 space create
```

### b. Name Your Space

- When prompted:

  ```
  What would you like to call this space?
  ```

- Type a name that helps you identify the space (e.g., `MyFirstSpace`) and press **Enter**.

### c. Save the Secret Recovery Phrase

- You'll see a message:

  ```
  🔑 You need to save the following secret recovery key somewhere safe!
  ```

- Press **Enter** to reveal the recovery phrase.

### d. Backup the Recovery Phrase

- **Copy the recovery phrase** exactly as shown.
- **Store it securely**, such as in a password manager.
- This phrase is crucial for recovering access to your space if needed.

### e. Confirm Backup

- The CLI will ask you to type the recovery phrase to confirm you've saved it.
- Carefully **type the recovery phrase** and press **Enter**.

### f. Copy the Space DID

- After confirmation, the CLI will display your **Space DID** (Decentralized Identifier), which looks like:

  ```
  did:key:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  ```

- **Copy this Space DID** and keep it for later use.

---

## 4. Set Up Environment Variables

To allow your app to interact with web3.storage, you'll need to obtain your agent's private key and create a delegation proof. These will be stored in environment variables.

### Obtain Your Agent Private Key and DID

#### a. Create a Key

Run the following command to generate your agent's private key and DID:

```bash
w3 key create
```

- The output will display:

  - **Agent DID**: A decentralized identifier for your agent.
  - **Private Key**: A base64-encoded private key string.

- **Important**: Copy both the **Agent DID** and the **Private Key** and store them securely.

### Create a UCAN Delegation

A **UCAN (User Controlled Authorization Network)** delegation allows you to delegate permissions from one agent to another.

#### a. Use Your Space

Set the CLI to use the Space you created earlier:

```bash
w3 space use <your-space-did>
```

- Replace `<your-space-did>` with the Space DID you copied earlier.

#### b. Create a Delegation

Run the following command to create a delegation from your Space to your agent:

```bash
w3 delegation create <agent-did> --base64
```

- Replace `<agent-did>` with the Agent DID obtained from the `w3 key create` command.
- The `--base64` flag outputs the delegation proof in base64 format.

**Optional**: Limit the permissions by adding `--can` flags. For example:

```bash
w3 delegation create <agent-did> --base64 --can space/info --can upload/add
```

- This limits the delegation to specific actions like viewing space info and adding uploads.

#### c. Copy the Delegation Proof

- The command outputs a base64-encoded **Delegation Proof**.
- **Copy this proof** and store it securely **don't include the % symbol at the end of the proof(output)**.


---

## 5. Update Your Environment Variables

Now that you have your **Private Key** and **Delegation Proof**, you need to set them as environment variables for your app.

### a. Create an Environment File

- In your project directory, copy the example environment file:

  ```bash
  cp .env.example .env.local
  ```

### b. Edit the Environment File

- Open `.env.local` in a text editor.
- Set the following variables:

  ```env
  KEY=your-private-key
  PROOF=your-delegation-proof
  ```

- Replace `your-private-key` with the base64-encoded Private Key you saved earlier.
- Replace `your-delegation-proof` with the base64-encoded Delegation Proof.

### c. Save the File

- Make sure to **save** the `.env.local` file after editing.

---

## 6. Run Your App

With the environment variables set, you can now run your app.

### a. Install Dependencies

```bash
yarn install
```

_Or if you're using npm:_

```bash
npm install
```

### b. Start the Development Server

```bash
yarn dev
```

_Or with npm:_

```bash
npm run dev
```

Your app should now be running and able to interact with web3.storage using the configured keys and proofs.

---

## 7. Conclusion

You've successfully:

- Installed the `w3cli` tool.
- Created a web3.storage account.
- Generated a Space and obtained its DID.
- Created an agent with its own Private Key and DID.
- Delegated permissions from your Space to your agent.
- Set up environment variables with your `KEY` and `PROOF`.
- Ran your app with the necessary configurations.

**Important Reminders**:

- **Keep your Private Key and Delegation Proof secure**. Do not share them publicly or commit them to version control systems.
- **Use `.env.local` or similar files** to store sensitive information and ensure they are ignored by your version control system (e.g., via `.gitignore`).

---

### Need Help?

- **Documentation**: Refer to the [web3.storage documentation](https://web3.storage/docs/) for more detailed guides and API references.
- **Support**: If you encounter issues, consider reaching out to the web3.storage support team or community forums.

**Happy building with web3.storage!**
