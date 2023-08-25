import { Box, Stack } from "@mui/material"
import { ContextValueReady } from "eth.context"
import { JobOffer } from "models"
import Link from "next/link"
import styles from '../pages/index.module.css'
import ApplyButton from "./ApplyButton"

const JobOfferItem = ({ job, eth }: { job: JobOffer, eth: ContextValueReady }) => {
    return (
        <Stack className={styles.container} key={job.id}>
            <Box>
                <h3><Link href={`/job/${job.id}`}>{job.title}</Link></h3>
                <span className={styles.metadata}><Link href={`/profile/c/${job.creator.creatorAddress}`}>{job.creator.name}</Link></span>
                <span className={styles.metadata}>{eth.web3.utils.fromWei(job.compensation.toString(), 'ether')} ETH</span>
            </Box>
            <ApplyButton job={job} eth={eth} />
        </Stack>
    )
}

export default JobOfferItem;