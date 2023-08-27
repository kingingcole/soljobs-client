import { Box, Stack } from "@mui/material";
import ApplyButton from "components/ApplyButton";
import Application from "components/JobApplication";
import { ContextValueReady } from "eth.context";
import { JobApplication, JobOffer } from "models";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from './job.module.css';

export default function Job({ eth }: { eth: ContextValueReady }) {
    const { query: { id } }: any = useRouter();

    const [job, setJob] = useState<JobOffer | null>(null);
    const [applications, setApplications] = useState<JobApplication[]>([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!eth.ready || !id) return;

        const getJob = async () => {
            setLoading(true);

            const fetchedJob: JobOffer = await eth.contracts.solJobs.methods.jobOffers(id - 1).call();
            const applications: JobApplication[] = await eth.contracts.solJobs.methods.getApplicationsForJob(id).call();

            setJob(fetchedJob);
            setApplications(applications);

            setLoading(false);
        }

        getJob()
    }, [eth, id])

    if (loading) {
        return <p>Fetching job...</p>
    }

    if (!loading && !job) {
        return <p>Job not found.</p>
    }

    return (
        <Box className={styles.container}>
            {job && (
                <Box>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>
                    <Box>
                        <h1 className={styles.title}>{job?.title}</h1>
                        <p><Link href={`/profile/c/${job?.creator.creatorAddress}`}>{job?.creator.name}</Link></p>
                        <Box>
                            <p className={styles.sectionTitle}>Compensation</p>
                            <p>{eth.web3.utils.fromWei(job?.compensation.toString(), 'ether')} ETH</p>
                        </Box>
                        <Box>
                            <p className={styles.sectionTitle}>Job Description</p>
                            <p>{job?.description}</p>
                        </Box>
                    </Box>
                    <Box>
                        <ApplyButton job={job} eth={eth} />
                    </Box>
                </Stack>
                {
                    job.creator.creatorAddress == eth.account && (
                        <Box>
                            <p className={styles.sectionTitle}>Application(s) Submitted</p>
                            {applications.map(application => {
                                return <Application key={application.id} application={application} />
                            })}
                        </Box>
                    )
                }
                </Box>
            )}
        </Box>
    )
}