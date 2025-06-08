import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSavedJobs } from "../utils/fetchSavedJobs";

const useGetSavedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSavedJobs(dispatch);
  }, []);
};

export default useGetSavedJobs;