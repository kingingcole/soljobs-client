import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { ContextValueReady } from 'eth.context';
import { JobOffer, ProfileType } from 'models';
import { Fragment, useEffect, useState } from 'react';

import { Input } from '@mui/material';
import CustomButton from './Button';

interface ApplyButtonProps {
    job: JobOffer;
    eth: ContextValueReady;
}

interface ApplicationModalProps extends Partial<ApplyButtonProps> {
    open: boolean;
    handleClose: () => void;
    jobId: number;
    setSubmitted: (submitted: boolean) => void;
}

const ApplicationModal = ({ open, handleClose, eth, jobId, setSubmitted }: ApplicationModalProps) => {
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const [coverLetter, setCoverLetter] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmitApplication = async e => {
        e.preventDefault();

        if (eth?.profile) {
            try {
                setSubmitting(true);
                await eth.contracts.solJobs.methods.applyForJob(jobId, coverLetter).send({ from: eth.account });
                setSubmitted(true);
            } catch (e: any) {
                console.warn(e)
                setError(e.message);
            } finally {
                setSubmitting(false);
                handleClose();
            }
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography sx={{ color: 'black' }}>
                    Submit your application
                </Typography>
                <form onSubmit={handleSubmitApplication}>
                    <Input onChange={e => setCoverLetter(e.target.value)} sx={{ my: 2 }} placeholder='Cover letter' multiline fullWidth rows={3} />
                    <CustomButton disabled={submitting} type={'submit'}>Submit</CustomButton>
                </form>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </Box>
        </Modal>
    )
}

const ApplyButton = ({ job, eth }: ApplyButtonProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [applications, setApplications] = useState(job.applications);
    
    const onClick = () => {
        // open submit application modal
        setModalOpen(true);
    }

    useEffect(() => {
        const getApplications = async () => {
            const applications = await eth.contracts.solJobs.methods.getApplicationsForJob(job.id).call();
            setApplications(applications);
        }

        getApplications();
    }, [eth.contracts.solJobs.methods, job.id])

    if (!eth.profile || eth.profile?.profileType != ProfileType.Applicant) {
        return null;
    };

    const disabled = submitted || applications?.some((application) => application.applicant.applicantAddress === eth.account);

    return (
        <Fragment>
            <CustomButton disabled={disabled} variant="contained" size='small' onClick={onClick}>Apply</CustomButton>
            <ApplicationModal open={modalOpen} handleClose={() => setModalOpen(false)} eth={eth} jobId={job.id} setSubmitted={setSubmitted} />
        </Fragment>
    )
}

export default ApplyButton;