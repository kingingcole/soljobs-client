"use client";

import { useEth } from '@/eth.context';
import { Profile, ProfileType } from '@/models';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import CustomButton from './Button';

const Navbar = () => {
    const eth = useEth();
    const [profile, setProfile] = useState<Profile>(null);
    const [walletConnected, setWalletConnected] = useState(false);

    useEffect(() => {
        if (eth.ready) {
            eth.profile && setProfile(eth.profile);
            setWalletConnected(true);
        }
    }, [eth])

    return (
        <nav>
            <Link href='/'>SolJobs</Link>
            <ul>
                {
                    walletConnected && (
                        <Fragment>
                            {profile && profile.profileType == ProfileType.Creator && <li><Link href={'/create-job'}>Create Job</Link></li>}
                            {!profile && <li><Link href={'/create-profile'}>Create Profile</Link></li>}
                        </Fragment>
                    )
                }
                <li>
                    {walletConnected ? <CustomButton>Disconnect Wallet</CustomButton> : <CustomButton>Connect Wallet</CustomButton>}
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;