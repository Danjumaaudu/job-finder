

const seenJobs = new Set<string>();

export function isNewJob(jobId: string): boolean{
    if(seenJobs.has(jobId)){
        return false;
    }
    seenJobs.add(jobId)
    return true;
}