"use client";

import { Box, Tab, Tabs, TextField } from "@mui/material";
import { ContextValueReady } from "eth.context";
import { useState } from "react";
import CustomButton from "../../components/Button";
import styles from './create-profile.module.css';

const CreateCreatorProfile = ({ loading }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [tagline, setTagline] = useState('');

    const handleCreate = () => {
        console.log('create creator profile');
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

const CreateApplicantProfile = ({ loading }: any) => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');

    const handleCreate = () => {
        console.log('create applicant profile')
    }

    const areAllFieldsFilled = () => {
        return fullname && email && location && bio && true;
    }

    console.log(areAllFieldsFilled())

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

    return (
        <Box className={styles.container}>
            <Tabs value={type} onChange={(e, val) => setType(val)} centered>
                <Tab label="Creator" />
                <Tab label="Applicant" />
            </Tabs>
            {
                type == 0 ? <CreateCreatorProfile loading={loading} /> : <CreateApplicantProfile loading={loading} />
            }
        </Box>
    )
}

export default CreateProfile;