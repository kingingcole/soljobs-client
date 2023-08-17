import { Box, Button, TextField } from '@mui/material'
import { ContextValueReady } from 'eth.context'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import styles from './create-job.module.css'
import { ProfileType } from 'models'

export default function CreateJob({ eth }: { eth: ContextValueReady }) {
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [compensation, setCompensation] = useState(0.5)
    const [maxHires, setMaxHires] = useState(5)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)
        setError('');

        try {
            const response = await eth.contracts.solJobs.methods
                .createJobOffer(title, description, eth.web3.utils.toWei(compensation.toString(), 'ether'), maxHires)
                .send({ from: eth.account })
            // navigate to job detail page
            const jobId = response.events?.JobCreated?.returnValues?.newJobID;
            router.push('/job/' + jobId);
        } catch (e: any) {
            console.warn(e)
            setError(e.message);
        }

        setLoading(false)
    }

    if (eth.profile?.profileType != ProfileType.Creator) {
        return (
            <Box>
                <p className={styles.error}>You need a Creator Profile to create jobs.</p>
            </Box>
        )
    }

    const disableBtn = () =>
        !title || !description || compensation < 0.05 || !maxHires

    return (
        <Box className={styles.container}>
            <form onSubmit={handleSubmit}>
                <TextField
                    className={styles.field}
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="standard"
                    required
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="standard"
                    multiline
                    rows={3}
                    required
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="Compensation (in Eth)"
                    type="number"
                    value={compensation}
                    onChange={(e) => setCompensation(parseFloat(e.target.value))}
                    variant="standard"
                    error={compensation < 0.05}
                    helperText= {compensation < 0.05 && "Compensation cannot be less than 0.05 ETH"}
                    required
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label=""
                    type="number"
                    value={maxHires}
                    onChange={(e) => setMaxHires(parseInt(e.target.value))}
                    variant="standard"
                    required
                    fullWidth
                />
                <Button
                    disabled={disableBtn() || loading}
                    variant="contained"
                    type="submit"
                >
                    Create
                </Button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </Box>
    )
}
