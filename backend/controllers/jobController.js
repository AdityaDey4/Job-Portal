import mongoose from "mongoose";
import { Job } from "../models/job.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateJob = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      description,
      requirements,
      location,
      salary,
      experienceLevel,
      position,
      jobType,
    } = req.body;
    if (!id) {
      return res.status(404).json({
        message: "Something is missing",
        success: false,
      });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    if (description) job.description = description;
    if (requirements) job.requirements = requirements.split(",");
    if (location) job.location = location;
    if (salary) job.salary = Number(salary);
    if (jobType) job.jobType = jobType;
    if (experienceLevel) job.experienceLevel = experienceLevel;
    if (position) job.position = position;

    await job.save();

    return res.status(200).json({
      message: "Job updated successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res
        .status(400)
        .json({ message: "Invalid job ID", success: false });
    }
    const job = await Job.findById(jobId)
      .populate({ path: "company" })
      .populate({
        path: "applications",
      });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const changeExpiry = async (req, res) => {
  try {
    const jobId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(404).json({
            message : "Job ID is invalid",
            success : false
        });
    }

    const job = await Job.findById(jobId);
    if(!job) {
        return res.status(404).json({
            message : "Job not found",
            success : false
        })
    }

    if(job.expired) {
        return res.status(404).json({
            message : "Job already expired",
            success : false
        })
    }

    const date = new Date();
    const isoString = date.toISOString();
    const formattedDate = isoString.split("T")[0];

    job.expired = true;
    job.expiry_date = formattedDate;

    await job.save();

    return res.status(200).json({
        message : "Job expired successfully",
        success : true,
        expiry_date : formattedDate
    })

  } catch (error) {
    console.log(error);
  }
};
