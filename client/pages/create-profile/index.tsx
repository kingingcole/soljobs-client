"use client";

import { Box, Tab, Tabs, TextField } from "@mui/material";
import { ContextValueReady } from "eth.context";
import { useState } from "react";
import CustomButton from "../../components/Button";
import styles from './create-profile.module.css';

const CreateCreatorProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [tagline, setTagline] = useState('');

    const handleCreate = () => {
        console.log('create creator profile');
    }

    return (
        <Box>
            <TextField sx={{ mb: 2 }} variant='standard' label='Name' value={name} onChange={e => setName(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Email' value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Description' value={description} onChange={e => setDescription(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Tagline' value={tagline} onChange={e => setTagline(e.target.value)} fullWidth />
            <CustomButton onClick={handleCreate}>Create Creator Profile</CustomButton>
        </Box>
    )
}

const CreateApplicantProfile = () => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');

    const handleCreate = () => {
        console.log('create applicant profile')
    }

    return (
        <Box>
            <TextField sx={{ mb: 2 }} variant='standard' label='Fullname' value={fullname} onChange={e => setFullName(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Email' value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Location' value={location} onChange={e => setLocation(e.target.value)} fullWidth />
            <TextField sx={{ mb: 2 }} variant='standard' label='Bio' value={bio} onChange={e => setBio(e.target.value)} fullWidth multiline rows={3} />
            <CustomButton onClick={handleCreate}>Create Applicant Profile</CustomButton>
        </Box>
    )
}

const CreateProfile = ({ eth }: { eth: ContextValueReady }) => {
    const [type, setType] = useState(0);
    
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
                type == 0 ? <CreateCreatorProfile /> : <CreateApplicantProfile />
            }
        </Box>
    )
}

export default CreateProfile;