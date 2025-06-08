import axios from "axios";
import { USER_API_END_POINT } from "./constant";
import { setSavedJobs } from "../redux/jobSlice";

export const fetchSavedJobs = async (dispatch) => {
  try {
    const res = await axios.get(`${USER_API_END_POINT}/saveJob/get`, {
      withCredentials: true,
    });
    dispatch(setSavedJobs(res.data.details.savedJobs));
  } catch (error) {
    console.error(error);
  }
};
