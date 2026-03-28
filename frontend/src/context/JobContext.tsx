import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  budget: string;
}

interface JobContextType {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const addJob = (job: Job) => {
    setJobs((prev) => [...prev, job]);
  };

  return (
    <JobContext.Provider value={{ jobs, setJobs, addJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};
