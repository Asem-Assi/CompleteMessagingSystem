import mongoose from "mongoose";

const connectDB=async ()=>
    {
        try {
            await mongoose.connect(process.env.MONGO_DB_STRING_CONNECTION);
            const connection=mongoose.connection // Retrieves the current connection to the MongoDB database.
            connection.on('connected',()=>{console.log('connected to DB is done successfully')}) //Sets up an event listener for when the connection is successfully established.
            connection.on('error',(er)=>{console.log('something wrong in mongodb',er)})//Sets up an event listener for when there is an error with the MongoDB connection.

        } catch (error) {
            console.log('an error occure when attempt to connect to database',error)
        }
    }
 export default connectDB