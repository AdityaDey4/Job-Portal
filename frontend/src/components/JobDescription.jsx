import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
  USER_API_END_POINT,
} from "../utils/constant";
import { setSingleJob } from "../redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Bookmark, Loader2 } from "lucide-react";
import { fetchSavedJobs } from "../utils/fetchSavedJobs";

const JobDescription = () => {
  const { singleJob, savedJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const [initialLoading, setInitialLoading] = useState(true);

  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isIntiallyApplied);
  const [bookmarked, setBookmarked] = useState(false);

  const params = useParams();
  const jobId = params.id;

  console.log(jobId);
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleToggle = async (e) => {
    e.preventDefault();
    try {
      const job_id = singleJob._id;
      const res = await axios.put(
        `${USER_API_END_POINT}/saveJob/add`,
        { job_id },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
      setBookmarked(res.data.added);
      await fetchSavedJobs(dispatch);
      console.log(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.error(err);
    }
  };
  useEffect(() => {
    if (singleJob?._id && savedJobs) {
      const isSaved = savedJobs.some((j) => j._id === singleJob._id);
      setBookmarked(isSaved);
    }
  }, [singleJob, savedJobs]);

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setInitialLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
          if(!res.data.success) {
            toast.error(res.data.message);
            navigate('/');
          }
        }

      } catch (error) {
        toast.error(error?.response?.data?.message || 'Job not found');
        navigate('/');
      }
      finally {
      
          setInitialLoading(false);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

   if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading job details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-start">
            <h1 className="font-bold text-xl">{singleJob?.company?.name}</h1>
            <h6 className="font-bold text-sm">{singleJob?.title}</h6>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge className={"text-blue-700 font-bold"} variant="ghost">
              {singleJob?.position} Positions
            </Badge>
            <Badge className={"text-[#F83002] font-bold"} variant="ghost">
              {singleJob?.jobType}
            </Badge>
            <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
              {singleJob?.salary}LPA
            </Badge>
          </div>
        </div>
        <div className="flex flex-col items-start space-between gap-4">
          <div className="flex items-center justify-between gap-2">
          {!singleJob.expired && <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied || !user}
            className={`rounded-lg ${
              isApplied
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>}
          <Bookmark
            variant="outline"
            onClick={handleToggle}
            className="cursor-pointer rounded-full"
            color={bookmarked ? "#6A38C2" : "gray"}
            fill={bookmarked ? "#6A38C2" : "none"}
            size={34}
          />
        </div>
        <div>
          {singleJob.expired && 
            <Badge className= "text-xl bg-red-400">EXPIRED</Badge>  
          }
        </div>
        </div>
      </div>
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4 text-left">
        Job Details :
      </h1>
      <div className="my-4 text-left">
        <h1 className="font-bold my-1">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </h1>
        {singleJob.requirements && (
          <h1 className="font-bold my-1">
            Requirements:{" "}
            {singleJob.requirements.map((data) => (
              <Badge className={"text-orange-700 font-bold"} variant="ghost">
                {data}
              </Badge>
            ))}
          </h1>
        )}
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experienceLevel} yrs
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary}LPA
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.applications?.length}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.createdAt?.split("T")[0]}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default JobDescription;
