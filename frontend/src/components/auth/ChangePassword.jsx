import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const { loading, user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const [input, setInput] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `${USER_API_END_POINT}/changePassword`,
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
        if(user.role == "student") {
            navigate("/profile");
        }else {
            navigate("/admin/companies");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        <form
          onSubmit={submitHandler}
          className='w-1/2 border border-gray-200 rounded-md p-4 my-10'
        >
          <h1 className='font-bold text-xl mb-5'>Change Password</h1>

          <div className='my-2'>
            <Label>Old Password</Label>
            <Input
              type='password'
              name='oldPassword'
              value={input.oldPassword}
              onChange={changeEventHandler}
              placeholder='Enter your old password'
            />
          </div>

          <div className='my-2'>
            <Label>New Password</Label>
            <Input
              type='password'
              name='newPassword'
              value={input.newPassword}
              onChange={changeEventHandler}
              placeholder='Enter your new password'
            />
          </div>

          {loading ? (
            <Button className='w-full my-4' disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
            </Button>
          ) : (
            <Button type='submit' className='w-full my-4'>
              Change Password
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
