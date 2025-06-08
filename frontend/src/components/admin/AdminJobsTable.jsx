import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { JOB_API_END_POINT } from "../../utils/constant";
import axios from "axios";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("called");
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  const statusHandler = async (id) => {
    try {
        axios.defaults.withCredentials = true;
        const res = await axios.post(`${JOB_API_END_POINT}/expiry/${id}`);

        console.log(res.data)
        if(res.data.success) {
            toast.success(res.data.message);
            const updated = filterJobs.map(job=> (
                job._id == id ? {...job, expired : true, expiry_date : res.data.expiry_date} : job
            ))
            setFilterJobs(updated)
        }
    } catch(err) {
         console.log(err)
        toast.error(err?.response?.data?.message || err?.message);
        navigate('/admin/jobs')
    }
  };
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Expired</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-left">
          {filterJobs?.map((job) => (
            <tr>
              <TableCell>{job?.company?.name}</TableCell>
              <TableCell>{job?.title}</TableCell>
              <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
              <TableCell>
                {job?.expired ? (
                  <span className="font-semibold text-orange-600">YES <p className="text-sm text-black-500">({job.expiry_date})</p></span>
                ) : (
                  <Popover>
                    <PopoverTrigger>
                      <span className="text-blue-600 cursor-pointer">NO</span>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div
                        onClick={()=> statusHandler(job._id)}
                        className="flex items-center my-2 cursor-pointer hover:font-semibold"
                      >
                        YES
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/${job._id}/applicants`)
                      }
                      className="flex items-center w-fit gap-2 cursor-pointer mt-2"
                    >
                      <Eye className="w-4" />
                      <span>Applicants</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
