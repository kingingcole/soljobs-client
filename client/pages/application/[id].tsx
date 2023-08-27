import { Box, Stack } from "@mui/material";
import CustomButton from "components/Button";
import { ContextValueReady } from "eth.context";
import { JobApplication, JobApplicationStatus, JobOffer } from "models";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from './application.module.css';

export default function Application({ eth }: { eth: ContextValueReady }) {
    const { query: { id } }: any = useRouter();

    const [application, setApplication] = useState<JobApplication | null>(null);
    const [job, setJob] = useState<JobOffer | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!eth.ready || !id) return;

        const getApplication = async () => {
            setLoading(true);

            try {
                const application: JobApplication = await eth.contracts.solJobs.methods.jobApplications(id - 1).call();
                const job: JobOffer = await eth.contracts.solJobs.methods.jobOffers(application.jobOfferId - 1).call();
                setApplication(application);
                setJob(job);
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        }

        getApplication()
    }, [eth, id])

    if (loading) {
        return <p>Fetching application...</p>
    }

    if (!loading && !application) {
        return <p>Application not found.</p>
    }

    const getApplicationStatus = () => {
        const statuses = Object.values(JobApplicationStatus);
        return application ? statuses[application.status] : '';
    }

    const renderActionButtons = application?.status == JobApplicationStatus.Pending && job?.creator.creatorAddress === eth.account;

    return (
        <Box className={styles.container}>
            {application && (
                <>
                    <Link href={`/job/${job?.id}`}><h1 className={styles.title}>{job?.title}</h1></Link>
                    <Box>
                        <h3 className={styles.sectionTitle}>Application status - {getApplicationStatus()}</h3>
                        <h3 className={styles.sectionTitle}>Applicant - {application.applicant.applicantAddress == eth.account ? 'You' : <Link href={`/profile/a/${application?.applicant.applicantAddress}`}>{application?.applicant.fullname}</Link>}</h3>
                        {application.coverLetter.length > 0 && <p>{application.coverLetter}</p>}
                    </Box>
                    {
                        renderActionButtons && (
                            <Stack mt={2} direction={'row'} alignItems={'flex-start'} spacing={1}>
                                <CustomButton size='small'>Approve</CustomButton>
                                <CustomButton size='small' color="error">Reject</CustomButton>
                            </Stack>
                        )
                    }
                </>
            )}
        </Box>
    )
}