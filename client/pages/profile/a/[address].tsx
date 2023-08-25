import { Box } from '@mui/material';
import Application from 'components/JobApplication';
import type { ContextValueReady } from 'eth.context';
import type { ApplicantProfile, JobApplication } from 'models';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import styles from '../profile.module.css';

interface ProfilePageProps {
    eth: ContextValueReady;
}

export default function ApplicantProfile({ eth }: ProfilePageProps) {
    const { query: { address } }: any = useRouter();
    
    const [profile, setProfile] = useState<ApplicantProfile | null>(null);
    const [applications, setApplications] = useState<JobApplication[]>([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!eth.ready || !address) return;

        const getProfile = async () => {
            setLoading(true);

            const fetchedProfile: ApplicantProfile = await eth.contracts.solJobs.methods.applicantProfiles(address).call();
            const jobApplications = await eth.contracts.solJobs.methods.getApplicationsForProfile(address).call();
            
            setProfile(fetchedProfile);
            setApplications(jobApplications);

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

    if (!loading && profile && profile.applicantAddress === "0x0000000000000000000000000000000000000000") {
        return <p>Profile not found.</p>
    }

    return (
        <Box className={styles.container}>
            <h2 className={styles.pageTitle}>{profile?.fullname}</h2>
            <span>{profile?.email}</span><br />
            <small>{profile?.location}</small> <br />
            <Box>
                <h3 className={styles.pageTitle}>Bio</h3>
                <p>{profile?.bio}</p>
            </Box>
            <Box>
                <h3 className={styles.pageTitle}>{applications.length || ''} Application(s) Submitted</h3>
                {applications.length == 0 && <p>No applications submitted.</p>}
                {applications.length > 0 && applications.map((application: JobApplication) => {
                    return <Application key={application.id} application={application} />
                })}
            </Box>

        </Box>
    )
}