import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { JOB_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    id : id,
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    position: 0,
    company: '',
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch job on mount
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });

        if(res.data.success) {

          const job = res.data.job;
          setInput({
            title: job.title || '',
            description: job.description || '',
            requirements: job.requirements.join(',') || '',
            salary: job.salary || '',
            location: job.location || '',
            jobType: job.jobType || '',
            experienceLevel: job.experienceLevel || '',
            position: job.position || 0,
            company: job.company.name || '',
          });
        }
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data?.message || 'Job not found');
        navigate('/admin/jobs');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(
        `${JOB_API_END_POINT}/edit/${id}`,
        input,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading job details...</span>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                disabled
                className="my-1 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>Salary (LPA)</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Input
                type="text"
                name="experienceLevel"
                value={input.experienceLevel}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>No of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={input.company || 'N/A'}
                disabled
                className="my-1 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Update Job
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditJob;
