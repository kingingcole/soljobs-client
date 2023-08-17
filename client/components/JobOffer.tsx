import { Box, Button, Stack } from "@mui/material"
import { ContextValueReady } from "eth.context"
import { JobOffer } from "models"
import Link from "next/link"
import styles from '../pages/index.module.css'

const JobOfferItem = ({ job, eth }: { job: JobOffer, eth: ContextValueReady }) => {
    return (
        <Stack className={styles.container} key={job.id}>
            <Box>
                <h3><Link href={`/job/${job.id}`}>{job.title}</Link></h3>
                <span className={styles.metadata}><Link href={`/profile/c/${job.creator.creatorAddress}`}>{job.creator.name}</Link></span>
                <span className={styles.metadata}>{eth.web3.utils.fromWei(job.compensation.toString(), 'ether')} ETH</span>
            </Box>
            <Button variant="contained" size='small'>Apply</Button>
        </Stack>
    )
}

export default JobOfferItem;