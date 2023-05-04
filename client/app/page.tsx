"use client"

import { NotReadyReason, useEth } from "@/eth.context";
import styles from "./page.module.css";

export default function Home(): JSX.Element {
  const eth = useEth();
  if (!eth.ready) {
    switch (eth.notReadyReason) {
      case NotReadyReason.Initializing:
        return <p>Initializing...</p>;
      case NotReadyReason.NoWallet:
        return <p>⚠️ Cannot find wallet.</p>;
      case NotReadyReason.NoArtifact:
        return (
          <p>
            ⚠️ Cannot find <span className="code">SolJobs</span> contract
            artifact. Please complete the above preparation first.
          </p>
        );
      case NotReadyReason.NoAccount:
        return <p>⚠️ Wallet not connected.</p>;
      case NotReadyReason.WrongNetwork:
        return (
          <p>
            ⚠️ MetaMask is not connected to the same network as the one you
            deployed to.
          </p>
        );
    }
  }
  
  return (
    <div className={styles.container}>
      <p>Smart contract successfully deployed to <code>{eth.contracts.solJobs.options.address}</code></p>
    </div>
  );
}
