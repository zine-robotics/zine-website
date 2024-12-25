import axios from "../api/axios";

interface IRecruitmentCreateData{
    title: string;
    stage: number;
    description: string;
}

export interface IRecruitmentData extends IRecruitmentCreateData{
    id: number;
}

export const getAllRecruitments = async (): Promise<IRecruitmentData[]|undefined> => {
    try{
        const response = await axios.get("/recruitment");
        if(response.status === 200){
            // console.log(response.data);
            return response.data.recruitments;
        }
        return undefined;
    }
    catch(err){
        // console.log(err);
        return undefined;
    }
}

export const createRecruitment = async (data: IRecruitmentCreateData): Promise<IRecruitmentData|undefined> => {
    try{
        const response = await axios.post("/recruitment", data);
        if(response.status === 200){
            return response.data.recruitment;
        }
        return undefined;
    }
    catch(err){
        // console.log(err);
        return undefined;
    }
}

export const deleteRecruitments = async (ids: number[]): Promise<boolean> => {
    try{
        const data = {recruitments: ids};
        const response = await axios.delete(`/recruitment`, {data: data});
        // console.log(response);
        if(response.status === 200){
            return true;
        }
        return false;
    }
    catch(err){
        // console.log(err);
        return false;
    }
}

export const editRecruitment = async (data: IRecruitmentData): Promise<IRecruitmentData|undefined> => {
    try{
        const {id, ...rest} = data;
        const response = await axios.put(`/recruitment/${id}`, rest);
        if(response.status === 200){
            return response.data.recruitment;
        }
        return undefined;
    }
    catch(err){
        // console.log(err);
        return undefined;
    }
}

interface IEventCreateData{
    name: string;
    description: string;
    venue: string;
    startDateTime: Date|string;
    endDateTime: Date|string|null;
    recruitment: number;
    type: string;
}

export interface IEventData extends IEventCreateData{
    id: number;
}

interface IUserDetails {
    name: string,
    email: string,
}
export interface IHackathonRegistrationInfo {
    numRegistrations: number;
    list: IUserDetails[];
}

export const getAllEvents = async (): Promise<IEventData[]|undefined> => {
    try{
        const response = await axios.get("/event");
        if(response.status === 200){
            const events = response.data.events.map((event:any) => {
                return {
                    id: event.id,
                    name: event.name,
                    description: event.description,
                    venue: event.venue,
                    startDateTime: event.startDateTime,
                    endDateTime: event.endDateTime,
                    recruitment: event.recruitment.stage,
                    type: event.type
                }
            });
            // console.log(response.data);
            return events;
        }
        return undefined;
    }
    catch(err){
        // console.log(err);
        return undefined;
    }
}

export const createEvent = async (data: IEventCreateData): Promise<IEventData|undefined> => {
    try{
        const response = await axios.post("/event", data);
        if(response.status === 200){
            const event = response.data.event;
            return {
                id: event.id,
                name: event.name,
                description: event.description,
                venue: event.venue,
                startDateTime: event.startDateTime,
                endDateTime: event.endDateTime,
                recruitment: event.recruitment.stage,
                type: event.type
            }
        }
        return undefined;
    }
    catch(err){
        // console.log(err);
        return undefined;
    }
}

export const deleteEvents = async (ids: number[]): Promise<boolean> => {
    try{
        const data = {eventIds: ids};
        const response = await axios.delete(`/event`, {data: data});
        // console.log(response);
        if(response.status === 200){
            return true;
        }
        return false;
    }
    catch(err){
        // console.log(err);
        return false;
    }
}

export const editEvent = async (data: IEventData): Promise<IEventData|undefined> => {
    try{
        const {id, ...rest} = data;
        const response = await axios.put(`/event/${id}`, rest);
        if(response.status === 200){
            const event = response.data.event;
            return {
                id: event.id,
                name: event.name,
                description: event.description,
                venue: event.venue,
                startDateTime: event.startDateTime,
                endDateTime: event.endDateTime,
                recruitment: event.recruitment.stage,
                type: event.type
            }
        }
        return undefined;
    }
    catch(err){
        // console.log(err);
        return undefined;
    }
}

export const fetchHackathonRegistrationInfo = async () => {
    try {
        const response = await axios.get('event/hackathon/registration-info');
        return response.data as IHackathonRegistrationInfo;
    } catch(err) {
        return {list: [], numRegistrations: 0} as IHackathonRegistrationInfo;
    }
}