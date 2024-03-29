import { Box, Stack } from '@mui/material';
import { JobApplicationStatus, type JobApplication as IJobApplication } from 'models';
import Link from 'next/link';
import { useState } from 'react';

const JobApplication = ({ application }: { application: IJobApplication }) => {
    const [showMore, setShowMore] = useState(false);

    const getApplicationStatus = () => {
        const statuses = Object.values(JobApplicationStatus);
        return statuses[application.status];
    }

    const coverLetter = application.coverLetter.length > 100 && !showMore ? `${application.coverLetter.substring(0, 100)}...` : application.coverLetter;

    return (
        <Box sx={{mb: 3}}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <h3 style={{margin: 0}}><Link href={`/application/${application.id}`}>Application #{application.id}</Link></h3> <i>{getApplicationStatus()}</i>
            </Stack>
            <p style={{margin: '10px 0'}}>{coverLetter}</p>
            {application.coverLetter.length > 100 && (
                <small style={{margin: 0, cursor: 'pointer'}} onClick={() => setShowMore(!showMore)}>{showMore ? 'Show less' : 'Show more'}</small>
            )}
            <hr />
        </Box>
    )
}

export default JobApplication;