import axios from "../api/axios";

export interface IRoleCreateData{
    roleName: string;
}

export interface IRoleData extends IRoleCreateData{
    id: number;
}

export const getAllRoles = async (): Promise<IRoleData[]|undefined> => {
    try{
        const response = await axios.get("/role");
        if(response.status === 200){
            return response.data.roles;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const getRole = async (id: number): Promise<IRoleData|undefined> => {
    try{
        const response = await axios.get(`/role/${id}`);
        if(response.status === 200){
            return response.data.role;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const createRole = async (data: IRoleCreateData): Promise<IRoleData|undefined> => {
    try{
        const response = await axios.post("/role", data);
        if(response.status === 200){
            return response.data.role;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const updateRole = async (id: number, data: IRoleCreateData): Promise<IRoleData|undefined> => {
    try{
        const response = await axios.put(`/role/${id}`, data);
        if(response.status === 200){
            return response.data.role;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const deleteRoles = async (ids: number[]): Promise<boolean> => {
    try{
        const data = {roleIds: ids};
        const response = await axios.delete(`/role`, {data: data});
        if(response.status === 200){
            return true;
        }
        return false;
    }
    catch(err){
        return false;
    }
}

export interface IRoleAssignData{
    status: "success"|"fail";
    invalidEmails: string[]|null;
    alreadyAssignedEmails: string[]|null;
}

export interface IRoleMember{
    name: string;
    email: string;
}

export interface IRoleMemberList{
    role: number;
    members: string[];
}

export const assignUsersToRole = async (roleId: number, userEmails: string[]): Promise<IRoleAssignData|undefined> => {
    try{
        const data = {roleId: roleId, userEmails: userEmails};
        const response = await axios.post(`/role/assign`, data);
        if(response.status === 200){
            return response.data;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const getRoleMembers = async (id: number): Promise<IRoleMember[]|undefined> => {
    try{
        const response = await axios.get(`/role/${id}/users`);
        if(response.status === 200){
            return response.data.users;
        }
        return undefined;
    }
    catch(err){
        return undefined;
    }
}

export const removeRoleMembers = async (roleId: number, userEmail:string): Promise<boolean> => {
    try{
        const response = await axios.delete(`/role/${roleId}/user/${userEmail}`);
        if(response.status === 200){
            return true;
        }
        return false;
    }
    catch(err){
        return false;
    }
}