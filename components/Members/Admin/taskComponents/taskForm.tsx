import React, { useEffect, useState } from "react";
import SideNav from "../../sidenav";
import styles from "../../../../constants/styles";
import { useForm } from "react-hook-form";
import ProtectedRoute from "../ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import { ITaskData, ITaskCreateData, createTask, getAllTasks, updateTask, deleteTasks, getRolesAssignedToTask, assignRoleToTask, removeRoleFromTask,  } from "../../../../apis/tasks/tasks";
import { getInstancesByTask, ITaskInstanceData } from "../../../../apis/tasks/taskInstances";
import { getAllRoles, IRoleData } from "../../../../apis/roles";
import { deleteImage, uploadImage } from "../../../../apis/image";
import { ITaskForm } from "./types";
import Modal from "../../modal";

interface TaskManagerProps {
    state: null;
    setState: React.Dispatch<React.SetStateAction<ITaskData|null>>;
    tasks: ITaskData[];
    setTasks: React.Dispatch<React.SetStateAction<ITaskData[]>>;
    instances: ITaskInstanceData[];
    setInstances: React.Dispatch<React.SetStateAction<ITaskInstanceData[]>>;
}

const formatDateTime = (dateTime: Date) => {
    let date = new Date(dateTime);
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000); //to counter conversion to local time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const formatDateTimeToSQL = (dateTime: Date) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}`;
}

interface IFormState{
    search: string;
    editing: boolean;
    editingID: number;
    assignTask: null| ITaskData;
}

interface IAssignState {
    input: string;
    taskId: number;
    roleList: IRoleData[];
}

const TaskForm: React.FC<TaskManagerProps> = ({state, setState, tasks, setTasks, instances, setInstances}) => {
    const [formState, setFormState] = useState<IFormState>({ search: "", editing: false, editingID: -1, assignTask: null })
    const [assignState, setAssignState] = useState<IAssignState>({ input: "",  roleList: [], taskId: -1 })
    const [roles, setRoles] = useState<IRoleData[]>([]) // for mapping roles to task
    const [allRoles, setAllRoles] = useState<IRoleData[]>([]) // stores all roles

    const { register, setValue, reset, formState: {errors}, handleSubmit } = useForm<ITaskForm>({
        defaultValues: {
            title: "",
            subtitle: "",
            description: "",
            dueDate: new(Date),
            psLink: "",
            submissionLink: "",
            type:"Individual",
            recruitment: null,
            visible: false,
        }
    })
    const onSubmit = async(data: ITaskForm) => {
        data.dueDate = formatDateTimeToSQL(data.dueDate as Date)
        reset()
        createTask(data).then((res) => {
            if(res === undefined){
                toast.error("Error creating Task: ");
                return;
            }
            toast.success("Task created successfully")
            res.dueDate = new Date(res.dueDate)
            setTasks(oldInstances => [...oldInstances, res])
        }).catch((error) => {
            // console.log(error)
            toast.error("Error creating Task: ", error);
        })
    }

    const onEdit = async (data: ITaskForm) => {
        // var imageexists = data.image[0]
        // data.image = ""
        // if (imageexists){
        //     if(data.imagepath) deleteImage(data.imagepath)
        //     var imageName = new Date().getTime().toString()
        //     data.imagepath = `/recruitments/${imageName}`
        //     var imagelink = await uploadImage(imageexists, data.imagepath)
        //     data.image = imagelink
        // }
        reset()
        data.dueDate = formatDateTimeToSQL(data.dueDate as Date)
        updateTask(formState.editingID, data).then((res) => {
            if(res === undefined){
                toast.error(`Error editing task: ${data.title}`);
                return;
            }
            toast.success("Edited task successfully")
            res.dueDate = new Date(res.dueDate)
            setTasks(oldInstances => [...oldInstances.filter(e => e.id !== formState.editingID), res])
        }).catch((error) => {
            // console.log(error)
            toast.error("Error adding document: ", error);
        });
    }

    const onCancel = () => {
        setFormState({ ...formState, editing: false, editingID: -1 })
        reset()
    }

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState({ ...formState, search: e.target.value })
    }

    const taskRemove = async (task: ITaskData) => {
        toast.promise(deleteTasks([task.id]), {
            pending: 'Deleting Event',
            success: `Event ${task.title} deleted successfully`,
        }).then(() => {
            setTasks(tasks.filter(t => t.id !== task.id))
        })
    }

    const taskEdit = async (task: ITaskData) => {
        setValue("title", task.title)
        setValue("description", task.description)
        setValue("subtitle", task.subtitle)
        // @ts-ignore
        setValue("dueDate", formatDateTime(task.dueDate))
        setValue("psLink", task.psLink)
        setValue("submissionLink", task.submissionLink)
        setValue("type", task.type)
        setValue("recruitment", task.recruitment)
        setValue("visible", task.visible)

        setFormState({ ...formState, editing: true, editingID: task.id })
    }

    const roleAssign = (task: ITaskData) => {
        setAssignState({ input: "", taskId: task.id, roleList: [] })
        setFormState({ ...formState, assignTask: task })
        getRolesAssignedToTask(task.id).then(roles => {
            if(roles){
                setRoles(roles)
            }
            else{
                setRoles([])
                toast.error("Error fetching roles")
            }
        })
    }

    const _assignRole = async () => {
        if (!formState.assignTask) return
        const role = formState.assignTask
        if (assignState.roleList.length === 0) return toast.error('No users added!')

        setFormState({...formState, assignTask: null})
        
        assignState.roleList.forEach(role => {
            assignRoleToTask(assignState.taskId, role.id).then(res => {
                if(res === undefined){
                    toast.error(`Error assigning role: ${role.roleName}`)
                    return;
                }
                toast.success("Role assigned successfully")
            }).catch((error) => {
                // console.log(error)
                toast.error("Error assigning role")
            })
        })
    }

    const _removeRole = async (role: IRoleData) => {
        if (!formState.assignTask) return
        const task = formState.assignTask
        const response = await removeRoleFromTask(task.id, role.id)
        if(response){
            toast.success(`Successfully removed ${role.roleName} from ${task.title}`)
            setRoles(roles.filter(m => m.id !== role.id))
        }
        else{
            toast.error("An error occurred. Try again later.")
        }
    }

    useEffect(() => {
        getAllRoles().then((res) => {
            if(res === undefined){
                toast.error("Error fetching roles")
                return;
            }
            setAllRoles(res)
        }).catch((error) => {
            // console.log(error)
            toast.error("Error fetching roles")
        })
    }, [])

    return (
        <div className="col-span-12 px-6 md:px-12 flex flex-col overflow-y-scroll md:col-span-9">
            <h1 className="text-4xl font-bold mt-16 md:mt-8" style={{color: "#AAAAAA"}}>Tasks</h1>
            <div className="row-span-5 bg-white rounded-xl py-4 px-6 my-8 w-full">
                <h1 className="text-2xl font-bold" style={styles.textPrimary}>{formState.editing ? "Edit Task" : "Create Task"}</h1>
                <div className="grid grid-cols-5 gap-6 mt-4">
                    <div className="col-span-3">
                        <label className="block text-gray-600 text-sm">Title<span className="text-red-500">*</span></label>
                        <input type="text" id="title" className="block w-full focus:outline-none bottom-border pt-2" {...register("title", {required: true})} />
                        {errors.title && <p className="text-red-500 text-sm" role="alert">Title is required</p>}
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-600 text-sm">Subtitle<span className="text-red-500">*</span></label>
                        <input type="text" id="subtitle" className="block w-full focus:outline-none bottom-border pt-2" {...register("subtitle", {required: true})} />
                        {errors.subtitle && <p className="text-red-500 text-sm" role="alert">Subtitle is required</p>}
                    </div>
                    <div className="col-span-5">
                        <label className="block text-gray-600 text-sm">Description<span className="text-red-500">*</span></label>
                        <textarea id="description" className="block w-full focus:outline-none bottom-border pt-2" rows={1} {...register("description", {required: true})}></textarea>
                        {errors.description && <p className="text-red-500 text-sm" role="alert">Description is required</p>}
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-600 text-sm">Due Date<span className="text-red-500">*</span></label>
                        <input type="date" id="dueDate" className="block w-full focus:outline-none bottom-border pt-2" {...register("dueDate", {required: true, valueAsDate: true})} />
                        {errors.dueDate && <p className="text-red-500 text-sm" role="alert">Duedate is required</p>}
                    </div>
                    <div className="col-span-3">
                        <label className="block text-gray-600 text-sm">Problem Statement Link</label>
                        <input type="text" id="psLink" className="block w-full focus:outline-none bottom-border pt-2" {...register("psLink")} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-600 text-sm">Type</label>
                        <select id="type" className="block w-full focus:outline-none bottom-border pt-2" {...register("type")}>
                            <option value="Individual">Individual</option>
                            <option value="Team">Team</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-600 text-sm">Visible</label>
                        <input type="checkbox" id="visible" className="block w-full focus:outline-none bottom-border pt-2" {...register("visible")} />
                    </div>
                </div>
                {/* <button className="p-3 block w-40 rounded-3xl text-white mt-8" style={{background: "#0C72B0"}} onClick={handleSubmit(onSubmit)}>Create</button> */}
                {
                    !formState.editing ? 
                        <button className="p-3 block w-40 rounded-3xl text-white mt-8" style={{background: "#0C72B0"}} onClick={handleSubmit(onSubmit)}>Create</button> :
                        <div className="text-white mt-8 flex gap-2">
                            <button className="p-3 block w-40 rounded-3xl" style={{background: "#0C72B0"}} onClick={handleSubmit(onEdit)}>Edit</button>
                            <button className="p-3 block w-40 rounded-3xl bg-red-500" onClick={() => onCancel()}>Cancel</button>
                        </div>
                }
            </div>
            <div className="bg-white py-4 px-6 mb-8 rounded-xl">
                <h1 className="text-2xl font-bold" style={styles.textPrimary}>Search Tasks</h1>

                <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-4 flex flex-col">
                            {/* <label className="text-gray-500">Search</label> */}
                            <input id="search" type="text" className="text-lg pt-2 bottom-border focus:outline-none" onChange={onSearchChange} placeholder="Search name or venue" value={formState?.search}/>
                        </div>

                        {/* <button className="p-2 mt-4 text-white rounded-xl" style={{background: "#0C72B0"}}>Search</button> */}
                </div>
                <table className="table-auto w-full mt-8 text-center">
                    <thead>
                        <tr className="text-left">
                            <th className="border p-1">S.No</th>
                            <th className="border p-1">Title</th>
                            <th className="border p-1">Due Date</th>
                            <th className="border p-1">P.S. Link</th>
                            <th className="border p-1">Visible</th>
                            <th className="border p-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tasks
                            .filter(u => !formState.search || u.title.toLowerCase().includes(formState.search!.toLowerCase()))
                            .map((u,index) => (
                                <tr key={u.id} className="text-left border-black">
                                    <td className="border p-1">{index + 1}</td>
                                    <td className="border p-1">{u.title}</td>
                                    <td className="border p-1">{u.dueDate.toString()}</td>
                                    <td className="border p-1">{u.psLink}</td>
                                    <td className="border p-1">{u.visible? 'Yes' : 'No'}</td>
                                    <td className="border p-1">
                                        <button className="bg-yellow-500 text-white py-1 px-4 rounded-lg" onClick={() => taskEdit(u)}>Edit</button>
                                        <button className="bg-red-500 text-white py-1 px-4 rounded-lg ml-2" onClick={() => taskRemove(u)}>Delete</button>
                                        <button className="bg-blue-500 text-white py-1 px-4 rounded-lg ml-2" onClick={() =>{
                                            setState(u)
                                        }}>Manage Instances</button>
                                        <button className="bg-green-500 text-white py-1 px-4 rounded-lg ml-2" onClick={() =>{
                                            roleAssign(u)
                                        } }>Manage Roles</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                    { !tasks.length && <p className="text-center text-xl mt-4">No results found</p>}
            </div>

            {/* Assign Role to Task */}
            <Modal isOpen={formState.assignTask !== null} onClose={() => setFormState({...formState, assignTask: null})}>
                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
                <div className="p-4 md:p-5 text-center relative bg-white rounded-lg w-3/4 h-3/4"  >
                    <h3 className="mb-2 text-lg font-bold text-gray-500">Manage Users {formState.assignTask?.title}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {allRoles.map((role) => (
                            <div key={role.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`role-${role.id}`}
                                    className="mr-2"
                                    checked={assignState.roleList.includes(role)}
                                    onChange={(e) => {
                                        const newRoleList = e.target.checked
                                            ? [...assignState.roleList, role]
                                            : assignState.roleList.filter((rol) => rol.id !== role.id);
                                        setAssignState({ ...assignState, roleList: newRoleList });
                                    }}
                                />
                                <label htmlFor={`role-${role.id}`} className="text-gray-600">
                                    {role.roleName}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="flex mt-4 justify-center text-white text-sm gap-2">
                        <button type="button" className="p-2 block w-40 rounded-3xl" style={{ background: "#0C72B0" }} onClick={() => _assignRole()}>
                            Assign Role
                        </button>
                        <button type="button" className="p-2 block w-40 rounded-3xl text-red-500 border" onClick={() => {
                            setFormState({...formState, assignTask: null})
                            setRoles([])
                        }}>
                            Cancel
                        </button>
                    </div>
                    
                    <div className=" max-h-full overflow-y-auto h-3/4">
                        <table className="table-auto w-full mt-8 text-center ">
                            <thead>
                                <tr className="text-left">
                                    <th className="border p-1">S.No</th>
                                    <th className="border p-1">Role</th>
                                    <th className="border p-1">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    roles
                                        .map((m, index) => (
                                            <tr key={m.id} className="text-left border-black text-sm">
                                                <td className="border p-1 text-center">{index + 1}</td>
                                                <td className="border p-1">{m.roleName}</td>
                                                <td className="border p-1">
                                                    <button className="bg-red-500 text-white py-1 px-2 rounded-lg ml-1" onClick={() => _removeRole(m)}>Remove</button>
                                                </td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                    </div>

                </div>
                </div>
            </Modal>
        </div>
    )
}

export default TaskForm;