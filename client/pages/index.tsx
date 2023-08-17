import JobOfferItem from "components/JobOffer";
import { ContextValueReady } from "eth.context";
import { JobOffer } from "models";
import { useEffect, useState } from "react";

export default function Home({ eth }: { eth: ContextValueReady }): JSX.Element {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const getJobs = async () => {
      if (!eth.ready) return;
      setLoading(true);

      const fetchedJobs: JobOffer[] = await eth.contracts.solJobs.methods.getAllJobsCreated().call();
      setJobs(Array.from(fetchedJobs).sort((a, b) => b.id - a.id)); // sort from newest to oldest
      
      setLoading(false);
    }

    getJobs();

  }, [eth])

  if (loading) {
    return <p>Fetching jobs...</p>
  }

  if (!loading && jobs.length === 0) {
    return <p>No jobs found.</p>
  }

  return (
    <div>
      {jobs.map((job: JobOffer) => {
        return <JobOfferItem key={job.id} job={job} eth={eth} />
      })}
    </div>
  );
}
