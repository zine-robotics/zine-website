export interface ITaskForm{
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

export interface ITaskInstanceForm {
    type: string;
    name: string;
    status: string;
    completionPercentage: number;
}