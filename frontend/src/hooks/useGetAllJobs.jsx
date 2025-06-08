import { setAllJobs, setSearchedQuery } from '../redux/jobSlice'
import { JOB_API_END_POINT } from '../utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        dispatch(setSearchedQuery(""));
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`,{withCredentials:true});
                if(res.data.success){
                    console.log(res.data.jobs)
                    const validJobs = res.data.jobs ? res.data.jobs.filter(j=> !j.expired) : [];
                    dispatch(setAllJobs(validJobs));
                }
            } catch (error) {
                console.log(error);
                navigate('/');
            }
        }
        fetchAllJobs();
    },[])
}

export default useGetAllJobs