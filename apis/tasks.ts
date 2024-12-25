import axios from "../api/axios";
import {IRoomData}  from "./room"

const taskURL = "/tasks"
const roleURL = "/role"
const userURL = "/user"
const instanceURL = "/instance"
const commentURL = "/comment"

export interface ITaskData {
    id: number,
    createdDate: number,
    title: string,
    subtitle: string,
    description: string,
    dueDate: number,
    psLink: string|null,
    submissionLink: string|null,
    type: string,
    recruitment: number|null,
    visible: boolean    
}

export interface ITaskInstanceData {
    id: number,
    type: string,
    name: string,
    status: string, 
    completionPercentage: number,
    task: ITaskData
    roomId: number,
    roomName: string
}

export interface ITaskInstanceCreateData {
    type: string,
    name: string,
    dpUrl: string,
    description: string,
    status: string,
    completionPercentage: number,
}

export interface ICheckpointData {
    id: number,
    remark: boolean,
    content: string,
    timestamp: number,
    sentFrom: string
    sentFromId: number,
}

export interface ICheckpointCreateData {
    remark: boolean,
    content: string,
    sentFromId: number,
}

export interface ILinkData {
    id: number,
    type: string,
    link: string,
    timestamp: number
    sentFrom: string,
    sentFromId: number
}

export interface ILinkCreateData {
    type: string,
    link: string,
    sentFromId: number
}

export interface ICommentCreateData {
    message: string, 
    senderId: number,
}

export interface ICommentData extends ICommentCreateData{
    commentId: number;
    taskInstance: number;
    taskId: number;
    senderEmail: string;
    senderName: string;
    timestamp: number;
}

export const getAssignedTaskInstances = async (jwt: string) => {
    try{
        const response = await axios.get(taskURL + "/user", 
            {headers: {"Authorization": `Bearer ${jwt}`}});
        if(response.status==200) {
            let instances: ITaskInstanceData[] = response.data.instances;
            return instances;
        } else {
            console.error("Error fetching assigned task instances", response.statusText);
            return []
        }
    } catch(error) {
        console.error("Error fetching assigned task instances", error);
        return []
    }
}

export const getRoleMappedTasks = async (jwt: string) => {
    try{
        const response = await axios.get(taskURL + "/user/mapped-tasks", 
            {headers: {"Authorization": `Bearer ${jwt}`}});
        if(response.status==200) {
            let tasks: ITaskData[] = response.data.tasks;
            return tasks;
        } else {
            console.error("Error fetching assigned tasks", response.statusText);
            return []
        }
    } catch(error) {
        console.error("Error fetching assigned tasks", error);
        return []
    }
}

export const getTasksByRole = async (roleID: string) => {
    try {
        const response = await axios.get(roleURL + `/${roleID}/task`);
        if(response.status==200) {
            let tasks: ITaskData[] = response.data.tasks;
            return tasks;
        } else {
            console.error("Error fetching tasks by role", response.statusText);
            return []
        }
    } catch(error) {
        console.error("Error fetching tasks by role", error);
        return []
    }
}

export const chooseTask = async (taskId: number, jwt: string, data: ITaskInstanceCreateData) => {
    try {
        const response = await axios.post(userURL + `/tasks/${taskId}/instance`, data, {headers: {"Authorization": `Bearer ${jwt}`}});
        if(response.status==200) {
            return response.data.instance as ITaskInstanceData;
        } else {
            console.error("Error fetching tasks by role", response.statusText);
        }
        return;
    } catch(error) {
        console.error("Error fetching tasks by role", error);
        return;
    }
}

export const fetchCheckpoints = async (instanceId: number) => {
    try {
        const response = await axios.get(instanceURL + `/${instanceId}/checkpoints`);
        if(response.status == 200) {
            let checkpoints: ICheckpointData[] = response.data.checkpoints;
            return checkpoints;
        } else {
            console.error("Error fetching checkpoints", response.statusText);
            return []
        }
    } catch(error) {
        console.error("Error fetching checkpoints", error);
        return [];
    }
}

export const addCheckpoint = async (instanceId: number, data: ICheckpointCreateData) => {
    try {
        const response = await axios.post(instanceURL + `/${instanceId}/checkpoints`, data);
        if(response.status == 200) {
            let checkpoint: ICheckpointData = response.data.checkpoint;
            return checkpoint;
        } else {
            console.error("Error sending checkpoint", response.statusText);
            return;
        }
    } catch(error) {
        console.error("Error sending checkpoint", error);
        return;;
    }
}

export const fetchLinks = async (instanceId: number) => {
    try {
        const response = await axios.get(instanceURL + `/${instanceId}/links`);
        if(response.status == 200) {
            let links: ILinkData[] = response.data.links;
            return links;
        } else {
            console.error("Error fetching links", response.statusText);
            return []
        }
    } catch(error) {
        console.error("Error fetching links", error);
        return [];
    }
}

export const addLink = async (instanceId: number, data: ILinkCreateData) => {
    try {
        const response = await axios.post(instanceURL + `/${instanceId}/links`, data);
        if(response.status == 200) {
            let link: ILinkData = response.data.link;
            return link;
        } else {
            console.error("Error sending link", response.statusText);
            return;
        }
    } catch(error) {
        console.error("Error sending link", error);
        return;;
    }
}

export const fetchComments = async (instanceId: number) => {
    try {
        const response = await axios.get(commentURL, {params: {instance: instanceId}} );
        if(response.status == 200) {
            return response.data.comments as ICommentData[];
        } else {
            console.error("Error fetching comments", response.statusText);
            return;
        }
    } catch(error) {
        console.error("Error fetching comments", error);
        return;
    }
}

export const postComment = async (instanceId: number, data: ICommentCreateData) => {
    try {
        const response = await axios.post(commentURL, data, {params: {instance: instanceId} } );
        if(response.status == 200) {
            // console.log(response);
            
            return response.data.comment as ICommentData;
        } else {
            console.error("Error posting comments", response.statusText);
            return;
        }
    } catch(error) {
        console.error("Error posting comments", error);
        return;
    }
}

export const monthDay = (timestamp: number) => {
    let dataObj = new Date(timestamp);
    return dataObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const hourMinute = (timestamp: number) => {
    let dataObj = new Date(timestamp);
    return dataObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
}