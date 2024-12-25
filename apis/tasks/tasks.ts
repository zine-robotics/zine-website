import axios from "../../api/axios";
import { IRoleData } from "../roles";

export interface ITaskCreateData{
    title: string;
    subtitle: string;
    description: string;
    dueDate: Date|string;
    psLink: string|null;
    submissionLink: string|null;
    type:string;
    recruitment: number|null;
    visible: boolean;
}

export interface ITaskData extends ITaskCreateData{
    id: number;
    createdDate: number
}

export const getAllTasks = async (): Promise<ITaskData[]|undefined> => {
    try{
        const response = await axios.get("/tasks");
        if(response.status === 200){
            return response.data.tasks;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const getTask = async (id: number): Promise<ITaskData|undefined> => {
    try{
        const response = await axios.get(`/tasks/${id}`);
        if(response.status === 200){
            return response.data.task;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const createTask = async (data: ITaskCreateData): Promise<ITaskData|undefined> => {
    try{
        const response = await axios.post("/tasks", data);
        if(response.status === 200){
            return response.data.task;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const updateTask = async (id: number, data: ITaskCreateData): Promise<ITaskData|undefined> => {
    try{
        const response = await axios.put(`/tasks/${id}`, data);
        if(response.status === 200){
            return response.data.task;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const deleteTasks = async (ids: number[]): Promise<boolean> => {
    try{
        const data = {taskIds: ids};
        const response = await axios.delete(`/tasks`, {data: data});
        if(response.status === 200){
            return true;
        }
        return false;
    }
    catch(err){
        return false;
    }
}

export const assignRoleToTask = async (taskId: number, roleId: number): Promise<boolean> => { //could also be called assign task to role
    try{
        const response = await axios.post(`/tasks/${taskId}/role/${roleId}`);
        if(response.status === 200){
            return true;
        }
        return false;
    }
    catch(err){
        return false;
    }
}

export const getTasksByRole = async (id: number): Promise<ITaskData[]|undefined> => {
    try{
        const response = await axios.get(`/role/${id}/task`);
        if(response.status === 200){
            return response.data.tasks;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const getRolesAssignedToTask = async (id: number): Promise<IRoleData[]|undefined> => {
    try{
        const response = await axios.get(`/tasks/${id}/assigned-roles`);
        if(response.status === 200){
            return response.data.roles;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const removeRoleFromTask = async (taskId: number, roleId: number): Promise<boolean> => {
    try{
        const response = await axios.delete(`/tasks/${taskId}/role/${roleId}`);
        if(response.status === 200){
            return true;
        }
        return false;
    }
    catch(err){
        return false;
    }
}