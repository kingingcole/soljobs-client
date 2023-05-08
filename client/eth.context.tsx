"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import Web3 from "web3";
import type { Contract } from "web3-eth-contract";
import solJobsArtifact from "./contracts/SolJobs.json";
import { ApplicantProfile, CreatorProfile, Profile } from "./models";

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
  profile: Profile
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
  const [account, setAccount] = useState<string>();
  const [solJobs, setSolJobs] = useState<Contract>();
  
  const [profile, setProfile] = useState<Profile>(null);

  const web3 = useMemo(() => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      return new Web3(window.ethereum);
    }
    return null;
  }, []);

  const init = useCallback(async () => {
    setReady(false);
    if (!web3) return setNotReadyReason(NotReadyReason.NoWallet);

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
  }, [web3]);

  useEffect(() => void init(), [init]);

  useEffect(() => {
    // fetch and set profile
    const getProfile = async () => {
      if (account && solJobs) {
        let profile: Profile;
        profile = await solJobs.methods.creatorProfiles(account).call() as CreatorProfile;
        if (profile && Number(profile.id) < 1) {
          profile = await solJobs.methods.applicantProfiles(account).call() as ApplicantProfile;
        }

        profile && Number(profile.id) > 0 && setProfile(profile)
      } else {
        setProfile(null);
      }
    }

    getProfile();
  }, [account, solJobs])

  useEffect(() => {
    // check and set active account without initiating new connection request
    if (window.ethereum && web3) {
      const { selectedAddress } = window.ethereum;
      if (selectedAddress) {
        setAccount(web3.utils.toChecksumAddress(selectedAddress))
      }
    }
  }, [web3]);

  useEffect(() => {
    // Listen for changes to the user's account or network
    const handleAccountsChanged = (accounts: string[]) => {
      setProfile(null);
      setAccount(accounts.length === 0 ? '' : accounts[0]);
    };
    const handleChainChanged = () => {
      // Reset the user's Ethereum address
      setProfile(null);
      setAccount('');
    };
  
    // Add listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
  
    // Remove listeners when the component is unmounted
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const value = ready
    ? ({
        ready,
        web3: web3 as Web3,
        account: account as string,
        contracts: { solJobs: solJobs as Contract },
        setAccount,
        profile
      } satisfies ContextValueReady)
    : ({
        ready,
        notReadyReason
      } satisfies ContextValueNotReady);

  return <EthContext.Provider value={value}>{children}</EthContext.Provider>;
}
