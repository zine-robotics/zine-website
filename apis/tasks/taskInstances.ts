import axios from "../../api/axios";
import { ITaskData } from "./tasks";
import { IRoomData } from "../room";

export interface ITaskInstanceCreateData{
    type: string;
    name: string;
    // dpUrl: string;
    status: string;
    completionPercentage: number;
}

export interface ITaskInstanceData extends ITaskInstanceCreateData{
    taskId: ITaskData; //naming convention is a bit fucked but we ball
    roomId: IRoomData;
    taskInstanceId: number;
    // title: string,
    
}

export interface IAssignedUsers{
    name: string;
    email: string;
}

export const getAllInstances = async(): Promise<ITaskInstanceData[]|undefined> => {
    try{
        const response = await axios.get(`/instance`);
        if(response.status === 200){
            return response.data.instances;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const getInstancesByTask = async(taskId: number): Promise<ITaskInstanceData[]|undefined> => {
    try{
        const response = await axios.get(`/tasks/${taskId}/instance`);
        if(response.status === 200){
            return response.data.instances;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const createInstance = async(taskId:number, data:ITaskInstanceCreateData): Promise<ITaskInstanceData|undefined> => {
    try{
        const response = await axios.post(`/tasks/${taskId}/instance`, data);
        if(response.status === 200){
            return response.data.taskInstance;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const updateInstance = async(data:ITaskInstanceData): Promise<ITaskInstanceData|undefined> => {
    try{
        const {taskId, taskInstanceId, ...rest} = data
        const response = await axios.put(`/tasks/${taskId.id}/instance/${taskInstanceId}`, rest);
        if(response.status === 200){
            return response.data.taskInstance;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const updateStatus = async(taskId:number, instanceId:number, status:string): Promise<boolean> => {
    try{
        const response = await axios.put(`/tasks/${taskId}/instance/${instanceId}`, {status: status});
        if(response.status === 200){
            return true
        }
        return false;
    }
    catch(err){
        return false;
    }
}

export const deleteInstances = async(taskId:number, ids:number[]): Promise<boolean> => {
    try{
        const data = {instanceIds: ids};
        const response = await axios.delete(`/tasks/${taskId}/instance`, {data: data});
        if(response.status === 200){
            return true;
        }
        return false;
    }
    catch(err){
        return false;
    }
}

export interface IInstanceAssignData{
    status: "success"|"fail";
    invalidEmails: string[]|null;
    alreadyAssignedEmails: string[]|null;
}

export interface IInstanceMember{
    name: string;
    email: string;
}

export interface IInstanceMemberList{
    role: number;
    members: string[];
}

export const assignInstance = async(taskId:number, instanceId:number, userEmails: string[]): Promise<IInstanceAssignData|undefined> => {
    try{
        const data = {userEmails: userEmails};
        const response = await axios.post(`/tasks/${taskId}/instance/${instanceId}/assign`, data);
        if(response.status === 200){
            // console.log(response.data)
            return response.data;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const getAssigned = async(instance: ITaskInstanceData): Promise<IInstanceMember[]|undefined> => {
    try{
        const response = await axios.get(`/tasks/${instance.taskId.id}/instance/${instance.taskInstanceId}/assigned`);
        if(response.status === 200){
            return response.data.users;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const getTaskByUser = async() => {

}

export const mapTaskToRole = async(taskId: number, roleId: number) => {
    try{
        const response = await axios.put(`/tasks/${taskId}/role/${roleId}`);
        if(response.status === 200){
            return true;
        }
        return false;
    }
    catch(err){
        return false;
    }
}

export const deleteTaskToRole = async(taskId: number, roleId: number) => {
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