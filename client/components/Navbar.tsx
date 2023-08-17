"use client";

import { useEth } from 'eth.context';
import { Profile, ProfileType } from 'models';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import CustomButton from './Button';

const Navbar = () => {
    const eth = useEth();
    const [profile, setProfile] = useState<Profile>(null);
    const [walletConnected, setWalletConnected] = useState(false);

    useEffect(() => {
        if (eth.ready) {
            setProfile(eth.profile);
            setWalletConnected(Boolean(eth.account));
        }
    }, [eth]);

    const connectWallet = async () => {
        // Check if Web3 is available
        if (window.ethereum) {
          try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Set the user's Ethereum address
            eth.ready && eth.setAccount(accounts[0]);
          } catch (error) {
            console.error(error);
          }
        } else {
          console.error('Web3 is not available in your browser');
        }
    };

    const disconnectWallet = async () => {
        eth.ready && eth.setAccount('');
    };

    const getUserProfileLink = () => {
        if (!eth.ready) return '';

        let profileType = profile?.profileType == ProfileType.Creator ? 'c' : 'a';
        return `/profile/${profileType}/${eth.account}`
    }

    return (
        <nav>
            <Link href='/'>SolJobs</Link>
            <ul>
                {
                    walletConnected && (
                        <Fragment>
                            {profile && profile.profileType == ProfileType.Creator && <li><Link href={'/create-job'}>Create Job</Link></li>}
                            {profile && <li><Link href={getUserProfileLink()}>View Profile</Link></li>}
                            {!profile && <li><Link href={'/create-profile'}>Create Profile</Link></li>}
                        </Fragment>
                    )
                }
                <li>
                    {walletConnected ? <CustomButton onClick={disconnectWallet}>Disconnect Wallet</CustomButton> : <CustomButton onClick={connectWallet}>Connect Wallet</CustomButton>}
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;