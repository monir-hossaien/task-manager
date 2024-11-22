import Task from "../../app/models/taskModel.js";
import mongoose from "mongoose";

export const CreateTask = async (req, res) => {
    try {
        const user_id = req.headers.id;
        const reqBody = req.body;
        reqBody.user_id = user_id;

        const newTask = await Task.create(reqBody);
        res.status(200).json({
            status:"success",
            message:"Task create successfully",
            data: newTask
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}

export const ReadeTask = async (req, res) => {
    try {
        const user_id = req.headers.id;
        const task_id = req.params.id;
        
        const result = await Task.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(task_id),
                    user_id: new mongoose.Types.ObjectId(user_id)
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            {
                $unwind: "$user_details" // Unwind user_details array for cleaner response
            },
            {
                $project:{
                    _id: 1,
                    title: 1,
                    description: 1,
                    status: 1,
                    user_id: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "user_details.name" : 1,
                }
            }
        ])

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Task not found."
            });
        }
        else{
            res.status(200).json({
                status:"success",
                message:"Task read successfully",
                data: result
            })
        }
        
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}

export const TaskListByStatus = async(req, res) => {
    try {
        const {status} = req.body;
        const user_id = req.headers.id;

        if(!status){
            return res.status(404).json({
                status: "fail",
                message: "Task status not found."
            });
        }
        
        const result = await Task.find({status:{ $regex: new RegExp(`^${status}$`, "i") }, user_id});

        if(!result || result === 0){
            return res.status(404).json({
                status: "fail",
                message: "Task not found."
            });
        }
        else{
            res.status(200).json({
                status:"success",
                message:"tasks read successfully",
                data: result
            })
        }
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const UpdateTaskStatus = async (req, res) => {
    try {
        const task_id = req.params.id;
        const user_id = req.headers.id;
        const reqBody = req.body
        
        if(!task_id){
            return res.status(404).json({
                status: "fail",
                message: "Task Id required"
            })
        }
        
        const result = await Task.findOneAndUpdate({_id: task_id, user_id: user_id}, {$set:reqBody}, {new: true});

        if(!result || result === 0){
            return res.status(404).json({
                status: "fail",
                message: "Task not found."
            });
        }
        else{
            res.status(200).json({
                status:"success",
                message:" status update successfully",
                data: result
            })
        }
        
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const UpdateTask = async (req, res) => {
    try {
        const task_id = req.params.id;
        const user_id = req.headers.id;
        const reqBody = req.body;
        
        if(!task_id){
            return res.status(404).json({
                status: "fail",
                message: "Task Id required"
            })
        }
        
        await Task.findOneAndUpdate({_id: task_id, user_id: user_id}, {$set:reqBody}, {new: true});

        // Fetch updated task with user info using aggregation
        const result = await Task.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(task_id),
                    user_id: new mongoose.Types.ObjectId(user_id)
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            {
                $project:{
                    _id: 1,
                    title: 1,
                    description: 1,
                    status: 1,
                    user_id: 1,
                    updatedAt: 1,
                    "user_details.firstName": 1,
                    "user_details.lastName": 1,

                }
            }
        ])

        if(!result || result === 0){
            return res.status(404).json({
                status: "fail",
                message: "Task not found."
            });
        }
        else{
            res.status(200).json({
                status:"success",
                message:"update successfully",
                data: result
            })
        }
        
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const DeleteTask = async (req, res) => {
    try {
        const task_id = req.params.id;
        const user_id = req.headers.id;
        
        if(!task_id){
            return res.status(404).json({
                status: "fail",
                message: "Task Id required"
            })
        }
        
        const result = await Task.findOneAndDelete({_id: task_id, user_id: user_id});

        if(!result || result === 0){
            return res.status(404).json({
                status: "fail",
                message: "Task not found."
            });
        }
        else{
            res.status(200).json({
                status:"success",
                message:" delete successfully",
                data: result
            })
        }
        
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const CountTask = async (req, res) => {
    try {
        
        const id = req.headers.id;
        const user_id = new mongoose.Types.ObjectId(id)
        
        const result = await Task.aggregate([
            {
                $match:{user_id: user_id}
            },
            {
                $group:{_id:"$status", total_task:{$count:{}}}
            }
        ])

        if(!result || result === 0){
            return res.status(404).json({
                status: "fail",
                message: "Task not found."
            });
        }
        else{
            res.status(200).json({
                status:"success",
                message:"tasks read successfully",
                data: result
            })
        }
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const TaskList = async (req, res) => {
    try{
        const id = req.headers['id'];
        const user_id = new mongoose.Types.ObjectId(id)
        const allTask = await Task.aggregate([
            {
                $match:{"user_id": user_id}
            },
            {
                $lookup:{
                    from: "users", // Name of the 'users' collection
                    localField: "user_id", // Field in 'tasks'
                    foreignField: "_id", // Field in 'users'
                    as: "user_details",
                }
            },

            {
                $unwind: "$user_details" // Unwind user_details array for cleaner response
            },
            
            {
                $project:{
                    _id: 1,
                    title: 1,
                    description: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "user_details.name": 1
                }
            }
        ])

        if(!allTask || allTask === 0){
            return res.status(404).json({
                status: "fail",
                message: "Task not found."
            });
        }else{
            res.status(200).json({
                status:"success",
                message:"tasks read successfully",
                data: allTask
            })
        }
    }
    catch(e){
        return res.json({status:"fail","Message":e.toString()})
    }
}
