"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import Web3 from "web3";
import type { Contract } from "web3-eth-contract";
import solJobsArtifact from "../contracts/SolJobs.json";

export enum NotReadyReason {
  Initializing,
  NoWallet,
  NoArtifact,
  NoAccount,
  WrongNetwork
}

export interface ContextValueNotReady {
  ready: false;
  notReadyReason: NotReadyReason;
}

export interface ContextValueReady {
  ready: true;
  web3: Web3;
  account: string;
  contracts: Record<"solJobs", Contract>;
  setAccount: Dispatch<SetStateAction<string | undefined>>;
}

type ContextValue = ContextValueNotReady | ContextValueReady;

export const EthContext = createContext<ContextValue>({
  ready: false,
  notReadyReason: NotReadyReason.Initializing
});

export const useEth = () => useContext(EthContext);

interface EthProviderProps {
  children: React.ReactNode;
}

export function EthProvider({ children }: EthProviderProps): JSX.Element {
  const [ready, setReady] = useState(false);
  const [notReadyReason, setNotReadyReason] = useState(
    NotReadyReason.Initializing
  );
  const [web3, setWeb3] = useState<Web3>();
  const [account, setAccount] = useState<string>();
  const [solJobs, setSolJobs] = useState<Contract>();

  const init = useCallback(async () => {
    setReady(false);
    if (!window.ethereum) return setNotReadyReason(NotReadyReason.NoWallet);

    const web3 = new Web3(window.ethereum);
    setWeb3(web3);

    let account;
    try {
      [account] = await web3.eth.requestAccounts();
    } catch {
      return setNotReadyReason(NotReadyReason.NoAccount);
    }
    setAccount(account);

    const networkId = (await web3.eth.net.getId()).toString();
    const networks = solJobsArtifact.networks;
    const solJobsAddress = networks[networkId as keyof typeof networks]?.address;
    if (!solJobsAddress)
      return setNotReadyReason(NotReadyReason.WrongNetwork);

    const solJobs = new web3.eth.Contract(
      solJobsArtifact.abi as any,
      solJobsAddress
    ) as unknown as Contract;
    setSolJobs(solJobs);

    setReady(true);
  }, []);

  useEffect(() => void init(), [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    events.forEach(e => window.ethereum.on(e, init));
    return () => events.forEach(e => window.ethereum.removeListener(e, init));
  }, [init]);

  const value = ready
    ? ({
        ready,
        web3: web3 as Web3,
        account: account as string,
        contracts: { solJobs: solJobs as Contract },
        setAccount,
      } satisfies ContextValueReady)
    : ({
        ready,
        notReadyReason
      } satisfies ContextValueNotReady);

  return <EthContext.Provider value={value}>{children}</EthContext.Provider>;
}
