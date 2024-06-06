import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { api, setAuthToken } from '../api/api-config';
import { EditJobType, JobApiResponse, JobType, PartialJobType } from "../types/jobTypes";

export const useJobs = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState<JobType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getJobs = async (): Promise<JobApiResponse> => {
        try {
            const response = await api.get('/jobs');             
            if (response?.data) {
                setJobs(response.data.jobs);
                return response.data.jobs;
            }
        } 
        catch (error) {
            console.error('error in getting jobs', error);
            return error as object;
        }
        finally {
            setLoading(false);
        }
    }

    const addJob = async (job: PartialJobType): Promise<JobApiResponse> => {
        try {
            const response = await api.post('/jobs', job);          
            if (response?.data) {
                setJobs((prevJobs) => [...prevJobs, response.data.job]);
                return response.data.job;
            }
        } 
        catch (error) {
            console.error('error in adding a job', error);
            return error as object;
        }
    }

    const updateJob = async (jobId: string, editedJob: EditJobType): Promise<JobApiResponse> => {
        try {
            const response = await api.patch(`/jobs/${jobId}`, editedJob);                    
            if (response?.data) {
                setJobs((prevJobs) => prevJobs.map(job => job._id === jobId ? response.data.job : job));
                return response.data.job;
            }
        } 
        catch (error) {
            console.error('error in updating a job', error);
            return error as object;
        }
    }

    const deleteJob = async (jobId: string): Promise<JobApiResponse> => {
        try {
            const response = await api.delete(`/jobs/${jobId}`);         
            if (response?.data){
                setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
                return response.data.job;
            }
        } 
        catch (error) {
            console.error('error in deleting a job', error);
            return error as object;
        }
    }

    useEffect(() => {
        if (user?.token) {
            setAuthToken(user.token);
            getJobs();
        }
    }, [user.token]);

    return { jobs, getJobs, addJob, updateJob, deleteJob, loading }
}