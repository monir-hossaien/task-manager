import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending"
        },
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Task = mongoose.model('task', TaskSchema);

export default Task;