export interface IRecruitmentForm{
    title: string;
    stage: number;
    description: string;
}

export interface IEventForm{
    name: string;
    description: string;
    venue: string;
    startDateTime: Date|string;
    endDateTime: Date|string|null;
    recruitment: number;
    type: string;
}