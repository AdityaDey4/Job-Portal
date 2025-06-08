import React, {useState} from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { USER_API_END_POINT } from "../utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { fetchSavedJobs } from "../utils/fetchSavedJobs";
import { useDispatch } from "react-redux";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {savedJobs} = useSelector((store)=> store.job);
  const check = savedJobs.find(j=> j._id == job._id);
   const [bookmarked, setBookmarked] = useState(check ? true : false);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

   const handleToggle = async () => {
    try {
      const job_id = job._id;
        const res = await axios.put(`${USER_API_END_POINT}/saveJob/add`, {job_id}, {withCredentials : true});
        if(res.data.success) {
            toast.success(res.data.message);
        }
        setBookmarked( res.data.added);
        await fetchSavedJobs(dispatch);
        console.log(res.data)
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.message);
        console.error(err);
      }
  };


  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
          <Bookmark variant="outline" onClick={handleToggle}
            className="cursor-pointer rounded-full"
            color={bookmarked ? '#6A38C2' : 'gray'}
            fill={bookmarked ? '#6A38C2' : 'none'}
            size={34}/>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className="text-left font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-left text-sm text-gray-500">{job?.location}</p>
        </div>
      </div>

      <div>
        <h1 className="text-left font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-left text-sm text-gray-600">{job?.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className={"text-blue-700 font-bold"} variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className={"text-[#F83002] font-bold"} variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
          {job?.salary}LPA
        </Badge>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
        className="bg-[#7209b7] item-right"
          onClick={() => navigate(`/description/${job?._id}`)}
          
        >
          Details
        </Button>
      </div>
    </div>
  );
};

export default Job;
