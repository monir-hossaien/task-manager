export const CreateTask = (req, res) => {
    try {
        res.status(200).json({
            status:"success",
            message:"user createTask success",
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}

export const ReadeTask = (req, res) => {
    try {
        res.status(200).json({
            status:"success",
            message:"user ReadeTask success",
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}

export const TaskListByStatus = (req, res) => {
    try {
        res.status(200).json({
            status:"success",
            message:"user TaskListByStatus success",
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const UpdateTaskStatus = (req, res) => {
    try {
        res.status(200).json({
            status:"success",
            message:"user UpdateTaskStatus success",
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const UpdateTask = (req, res) => {
    try {
        res.status(200).json({
            status:"success",
            message:"user UpdateTask success",
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const DeleteTask = (req, res) => {
    try {
        res.status(200).json({
            status:"success",
            message:"user DeleteTask success",
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const CountTask = (req, res) => {
    try {
        res.status(200).json({
            status:"success",
            message:"user CountTask success",
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}