import mongoose from "mongoose";

const connectDB = async ()=> {

    try{

        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB connected");
    }catch(err) {
        console.log("Error while connect");
        console.error(err);
    }
}

export default connectDB;
