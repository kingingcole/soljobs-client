import { Box, Button, Modal, Stack, TextField } from '@mui/material';
import JobOfferItem from 'components/JobOffer';
import { ContextValueReady } from 'eth.context';
import { CreatorProfile, JobOffer } from 'models';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../profile.module.css';

interface ProfilePageProps {
    open: boolean;
    handleClose: () => void;
    profile: CreatorProfile;
    eth: ContextValueReady;
}

const EditProfileModal = ({ open, handleClose, profile, eth }: ProfilePageProps) => {
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [name, setName] = useState(profile.name);
    const [description, setDescription] = useState(profile.description);
    const [tagline, setTagline] = useState(profile.tagline);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpdate = async () => {
        setLoading(true);
        setError('');

        try {
            await eth.contracts.solJobs.methods.editCreatorProfile(eth.account, name, description, tagline).send({ from: eth.account });
            eth.setProfile({ ...profile, name, description, tagline });
            handleClose();
        } catch (e: any) {
            setError(e.message)
        }

        setLoading(false);
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h3>Edit Profile</h3>
                <TextField sx={{ mb: 2 }} variant='standard' label='Name' value={name} onChange={e => setName(e.target.value)} fullWidth />
                <TextField sx={{ mb: 2 }} variant='standard' label='Description' value={description} onChange={e => setDescription(e.target.value)} fullWidth multiline />
                <TextField sx={{ mb: 2 }} variant='standard' label='Tagline' value={tagline} onChange={e => setTagline(e.target.value)} fullWidth />
                {error && <p className={styles.error}>{error}</p>}
                <Button disabled={loading} onClick={handleUpdate} variant='outlined'>Update Profile</Button>
            </Box>
        </Modal>
    )
}

export default function CreatorProfile({ eth }: ProfilePageProps) {
    const { query: { address } }: any = useRouter();
    
    const [profile, setProfile] = useState<CreatorProfile | null>(null);
    const [jobs, setJobs] = useState<JobOffer[]>([])
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (!eth.ready || !address) return;

        const getProfile = async () => {
            setLoading(true);

            const fetchedProfile: CreatorProfile = await eth.contracts.solJobs.methods.creatorProfiles(address).call();
            const jobOffers = await eth.contracts.solJobs.methods.getCreatedJobsForProfile(address).call();
            
            setProfile(fetchedProfile);
            setJobs(jobOffers);

            setLoading(false);
        }

        getProfile()
    }, [eth, address])

    if (!eth.ready) {
        return <p>Initializing...</p>
    }

    if (!eth.web3.utils.isAddress(address)) {
        return <p>Invalid address.</p>
    }

    if (loading) {
        return <p>Loading profile...</p>
    }

    if (!loading && profile && profile.creatorAddress === "0x0000000000000000000000000000000000000000") {
        return <p>Profile not found.</p>
    }

    return (
        <Box className={styles.container}>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <h2 className={styles.pageTitle}>{profile?.name}</h2>
                {profile?.creatorAddress === eth.account && <Button onClick={() => setOpenModal(true)}>Edit Profile</Button>}
            </Stack>
            <span>{profile?.tagline}</span><br />
            <small>{profile?.email}</small> <br />
            <Box>
                <h3 className={styles.pageTitle}>Description</h3>
                <p>{profile?.description}</p>
            </Box>
            <Box>
                <h3 className={styles.pageTitle}>{jobs.length || ''} Job Offer(s)</h3>
                {jobs.length == 0 && <p>No jobs created.</p>}
                {jobs.length > 0 && jobs.map((job: JobOffer) => {
                    return <JobOfferItem key={job.id} job={job} eth={eth} />
                })}
            </Box>

            {profile && <EditProfileModal open={openModal} handleClose={() => setOpenModal(false)} profile={profile} eth={eth} />}
        </Box>
    )
}