"use client";

import { Box, Tab, Tabs, TextField } from "@mui/material";
import { ContextValueReady } from "eth.context";
import { useState } from "react";
import CustomButton from "../../components/Button";
import styles from './create-profile.module.css';
import { NextRouter, useRouter } from "next/router";

interface CommonTabProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    eth: ContextValueReady;
    router: NextRouter;
}

const CreateCreatorProfile = ({ loading, setLoading, eth, router }: CommonTabProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [tagline, setTagline] = useState('');

    const handleCreate = async () => {
        setLoading(true);

        try {
            await eth.contracts.solJobs.methods.createCreatorProfile(name, email, description, tagline).send({ from: eth.account });
            // create profile success, redirect to profile page
            router.push('/profile/c/' + eth.account);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    }

    const areAllFieldsFilled = () => {
        return name && email && description && tagline;
    }

    return (
        <Box>
            <TextField sx={{ mb: 2 }} variant='standard' label='Name' value={name} onChange={e => setName(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Email' value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Description' value={description} onChange={e => setDescription(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Tagline' value={tagline} onChange={e => setTagline(e.target.value)} fullWidth />
            <CustomButton disabled={loading || !areAllFieldsFilled()} onClick={handleCreate}>Create Creator Profile</CustomButton>
        </Box>
    )
}

const CreateApplicantProfile = ({ loading, setLoading, eth, router }: CommonTabProps) => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');

    const handleCreate = async () => {
        setLoading(true);

        try {
            await eth.contracts.solJobs.methods.createApplicantProfile(fullname, email, location, bio).send({ from: eth.account });
            eth.setProfile({
                
            })
            // create profile success, redirect to profile page
            router.push('/profile/a/' + eth.account);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    }

    const areAllFieldsFilled = () => {
        return fullname && email && location && bio;
    }

    return (
        <Box>
            <TextField sx={{ mb: 2 }} variant='standard' label='Fullname' value={fullname} onChange={e => setFullName(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Email' value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Location' value={location} onChange={e => setLocation(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Bio' value={bio} onChange={e => setBio(e.target.value)} fullWidth multiline rows={3} />
            <CustomButton disabled={loading || !areAllFieldsFilled()} onClick={handleCreate}>Create Applicant Profile</CustomButton>
        </Box>
    )
}

const CreateProfile = ({ eth }: { eth: ContextValueReady }) => {
    const [type, setType] = useState(0);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    if (!eth.account) {
        // no account
        return (
            <p>No account connected.</p>
        )
    }

    if (eth.profile) {
        // account already has a profile
        return (
            <p>Account already has a profile.</p>
        )
    }

    const commonTabProps: CommonTabProps = {
        loading,
        setLoading,
        eth,
        router
    }

    return (
        <Box className={styles.container}>
            <Tabs value={type} onChange={(e, val) => setType(val)} centered>
                <Tab label="Creator" />
                <Tab label="Applicant" />
            </Tabs>
            {
                type == 0 ? <CreateCreatorProfile {...commonTabProps} /> : <CreateApplicantProfile {...commonTabProps} />
            }
        </Box>
    )
}

export default CreateProfile;