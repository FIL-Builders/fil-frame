"use client";

import styles from "./SectionLanding.module.scss";

import Link from "next/link";

import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";

export function SectionLanding() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>
            <span className={styles.title}>Welcome to</span>
            <span className={styles.subtitle}>FIL-Frame</span>
          </h1>
          <div className={styles.addressContainer}>
            <p className={styles.addressLabel}>Connected Address:</p>
            0x42
          </div>
          <p className={styles.ctaLabel}>
            Get started by editing{" "}
            <code className={styles.codeBlock}>
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className={styles.ctaLabel}>
            Edit your smart contract{" "}
            <code className={styles.codeBlock}>YourContract.sol</code> in{" "}
            <code className={styles.codeBlock}>packages/hardhat/contracts</code>
          </p>
        </div>

        <div className={styles.bgSection}>
          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <BugAntIcon className={styles.icon} />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className={styles.link}>
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className={styles.card}>
              <MagnifyingGlassIcon className={styles.icon} />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className={styles.link}>
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
