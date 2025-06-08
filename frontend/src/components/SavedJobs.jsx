import Navbar from "./shared/Navbar";
import Job from "./Job";
import {  useSelector } from "react-redux"
import { motion } from 'framer-motion';
import useGetSavedJobs from "../hooks/useGetSavedJobs";

const SavedJobs = () => {

  useGetSavedJobs();
  const { savedJobs } = useSelector((store) => store.job);
  
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">
          Search Results ({savedJobs.length})
        </h1>
        {savedJobs.length == 0 ? (
          <h5 className='text-4xl font-bold text-[#6A38C2]'>You have not saved any job yet</h5>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {savedJobs.map((job) => (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                key={job?._id}>
                <Job key={job._id} job={job} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
