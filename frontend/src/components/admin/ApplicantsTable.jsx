import React, {useState, useEffect} from "react";
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
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "../../utils/constant";
import axios from "axios";

const shortlistingStatus = ["accepted", "rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const [localApplicants, setLocalApplicants] = useState([]);

  useEffect(() => {
    if (applicants?.applications) {
      setLocalApplicants(applicants.applications);
    }
  }, [applicants]);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);

        const updated = localApplicants.map((app) =>
          app._id === id ? { ...app, status } : app
        );
        setLocalApplicants(updated);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent applied user</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>FullName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-left">
          {localApplicants.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item?.applicant?.fullname}</TableCell>
              <TableCell>{item?.applicant?.email}</TableCell>
              <TableCell>{item?.applicant?.phoneNumber}</TableCell>
              <TableCell>
                {item.applicant?.profile?.resume ? (
                  <a
                    className="text-blue-600"
                    href={item?.applicant?.profile?.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item?.applicant?.profile?.resumeOriginalName}
                  </a>
                ) : (
                  "NA"
                )}
              </TableCell>
              <TableCell>{item?.applicant.createdAt?.split("T")[0]}</TableCell>

              {/* Combined Status + Action in one */}
              <TableCell className="text-right">
                {item?.status === "pending" ? (
                  <Popover>
                    <PopoverTrigger>
                      <span className="text-blue-600 cursor-pointer">
                        {item.status.toUpperCase()}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      {shortlistingStatus.map((status, index) => (
                        <div
                          key={index}
                          onClick={() => statusHandler(status, item._id)}
                          className="flex items-center my-2 cursor-pointer hover:font-semibold"
                        >
                          {status.toUpperCase()}
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                ) : (
                  <span
                    className={`${
                      item.status === "accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    } font-semibold`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
