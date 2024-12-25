import React, { useEffect, useState } from "react";
import SideNav from "../../sidenav";
import styles from "../../../../constants/styles";
import { useForm } from "react-hook-form";
import ProtectedRoute from "../ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import { ITaskInstanceCreateData, ITaskInstanceData, createInstance, updateInstance, deleteInstances, getInstancesByTask, getAssigned, assignInstance, IInstanceMember } from "../../../../apis/tasks/taskInstances";
import { deleteImage, uploadImage } from "../../../../apis/image";
import { ITaskInstanceForm } from "./types";
import { ITaskData } from "../../../../apis/tasks/tasks";
import { IRoleMember } from "../../../../apis/roles" ;
import Modal from "../../modal";

interface TaskManagerProps {
    state: ITaskData;
    setState: React.Dispatch<React.SetStateAction<ITaskData|null>>;
    instances: ITaskInstanceData[];
    setInstances: React.Dispatch<React.SetStateAction<ITaskInstanceData[]>>;
}

interface formState {
    search: string;
    editing: boolean;
    editingInstance: ITaskInstanceData|null;
    assignInstance: ITaskInstanceData|null;
}

interface IAssignState {
    input: string;
    instanceId: number;
    emailList: string[];
}

const InstanceForm: React.FC<TaskManagerProps> = ({state, setState, instances, setInstances}) => {
    const [formState, setFormState] = useState<formState>({search: "", editing: false, editingInstance: null, assignInstance: null})
    const [members, setMembers] = useState<IRoleMember[]>([]);
    const [assignState, setAssignState] = useState<IAssignState>({ instanceId: -1, input: "" , emailList: []});


    const { register, setValue, reset, formState: {errors}, handleSubmit } = useForm<ITaskInstanceForm>({
        defaultValues: {
            type: "",
            name: "",
            status: "Not Started",
            completionPercentage: 0,
        }
    })
    const onSubmit = async(data: ITaskInstanceForm) => {
        createInstance(state.id, data).then((res) => {
            if(res === undefined){
                toast.error("Error creating instance: ");
                return;
            }
            toast.success("Instance created successfully")
            setInstances(oldInstances => [...oldInstances, res])
        }).catch((error) => {
            // console.log(error)
            toast.error("Error adding document: ", error);
        })
    }

    const onEdit = async (data: ITaskInstanceForm) => {
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
        if(formState.editingInstance === null) return;
        updateInstance({...data, taskId: formState.editingInstance.taskId, roomId: formState.editingInstance.roomId, taskInstanceId: formState.editingInstance.taskInstanceId})
        .then((res) => {
            if(res === undefined){
                toast.error(`Error editing instance: ${data.name}`);
                return;
            }
            toast.success("Edited instance successfully")
            setInstances(oldInstances => [...oldInstances.filter(e => e.taskInstanceId !== formState.editingInstance?.taskInstanceId), res])
        }).catch((error) => {
            // console.log(error)
            toast.error("Error adding document: ", error);
        });
    }

    const onCancel = () => {
        setFormState({ ...formState, editing: false, editingInstance: null })
        reset()
    }

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState({ ...formState, search: e.target.value })
    }

    const instanceRemove = async (instance: ITaskInstanceData) => {
        toast.promise(deleteInstances(state.id, [instance.taskInstanceId]), {
            pending: 'Deleting Instance',
            success: `Instance ${instance.name} deleted successfully`,
        }).then(() => {
            setInstances(instances.filter(t => t.taskInstanceId !== instance.taskInstanceId))
        })
    }

    const instanceEdit = async (instance: ITaskInstanceData) => {
        setValue("name", instance.name)
        setValue("type", instance.type)
        setValue("status", instance.status)
        setValue("completionPercentage", instance.completionPercentage)

        setFormState({ ...formState, editing: true, editingInstance: instance })
    }

    const instanceAssign = (instance: ITaskInstanceData) => {
        setAssignState({ input: "", instanceId: instance.taskInstanceId, emailList: [] })
        setFormState({ ...formState, assignInstance: instance })
        getAssigned(instance).then(members => {
            if(members){
                setMembers(members)
            }
            else{
                setMembers([])
            }
        })
    }

    const addAssignEmail = () => {
        assignState.input.trim().split(/[ ,]+/).map(e => {
            const emails = assignState.emailList
            if (emails.some(f => f === e)) return
            if (!/^\S+@\S+\.\S+$/.test(e) && !e.startsWith('$')) return
            emails.push(e)
            setAssignState({...assignState, input: "", emailList: emails });
        })
    };

    const _assignInstance = async () => {
        if (!formState.assignInstance) return
        const instance = formState.assignInstance
        if (assignState.emailList.length === 0) return toast.error('No users added!')

        setFormState({...formState, assignInstance: null})
        assignInstance(state.id, instance.taskInstanceId, assignState.emailList).then(response => {
            if(response!=undefined){
                const { status, invalidEmails, alreadyAssignedEmails } = response;

                let message = '';
                if (status === "success") {
                    message += "Users assigned successfully!\n";
                } else {
                    message += "Failed to assign users.\n";
                }

                if (invalidEmails!=null) {
                    message += `Invalid emails: ${invalidEmails.join(', ')}\n`;
                }

                if (alreadyAssignedEmails!=null) {
                    message += `Already assigned emails: ${alreadyAssignedEmails.join(', ')}\n`;
                }

                toast(message.trim());
                }
                else{
                    toast.error("An error occurred. Try again later.")
                }
        })
    }

    //could be written for multiple emails?
    // const _removeUser = async (member: IInstanceMember) => {
    //     if (!formState.assignInstance) return
    //     const role = formState.assignInstance
    //     const response = await removeRoleMembers(role.id, member.email)
    //     if(response){
    //         toast.success(`Successfully removed ${member.email} from ${role.roleName}`)
    //         setMembers(members.filter(m => m.email !== member.email))
    //     }
    //     else{
    //         toast.error("An error occurred. Try again later.")
    //     }
    // }

    useEffect(() => {
        getInstancesByTask(state.id).then(res => {
            if(res === undefined){
                toast.error("Error fetching tasks.")
                setInstances([])
                return;
            }
            setInstances(res)
        })
    }, [])

    return (
        <div className="col-span-12 px-6 md:px-12 flex flex-col overflow-y-scroll md:col-span-9">
            <h1 className="text-4xl font-bold mt-16 md:mt-8" style={{color: "#AAAAAA"}}>Task Instances</h1>
            <button className="p-3 block w-40 rounded-3xl bg-red-500 justify-end" onClick={() => setState(null)}>Back</button>
            <div className="row-span-5 bg-white rounded-xl py-4 px-6 my-8 w-full">
            <h1 className="text-2xl font-bold" style={styles.textPrimary}>{formState.editing ? "Edit Instance" : "Create Instance"}</h1>
            <div className="grid grid-cols-5 gap-6 mt-4">
                <div className="col-span-3">
                    <label className="block text-gray-600 text-sm">Name<span className="text-red-500">*</span></label>
                    <input type="text" id="title" className="block w-full focus:outline-none bottom-border pt-2" {...register("name", {required: true})} />
                    {errors.name && <p className="text-red-500 text-sm" role="alert">Name is required</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-600 text-sm">Type</label>
                    <select id="type" className="block w-full focus:outline-none bottom-border pt-2" {...register("type")}>
                        <option value="Individual">Individual</option>
                        <option value="Team">Team</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-600 text-sm">Status</label>
                    <select id="type" className="block w-full focus:outline-none bottom-border pt-2" {...register("status")}>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-600 text-sm">Completion Percentage</label>
                    <input type="number" id="completionPercentage" className="block w-full focus:outline-none bottom-border pt-2" {...register("completionPercentage", { min: 0, max: 100 })} />
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
            <h1 className="text-2xl font-bold" style={styles.textPrimary}>Search Instances</h1>

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
                        <th className="border p-1">Name</th>
                        <th className="border p-1">Status</th>
                        <th className="border p-1">Completion Percentage</th>
                        <th className="border p-1">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        instances
                        .filter(u => !formState.search || u.name.toLowerCase().includes(formState.search!.toLowerCase()) || u.taskId.title.toLowerCase().includes(formState.search!.toLowerCase()))
                        .map((u,index) => (
                            <tr key={u.taskInstanceId} className="text-left border-black">
                                <td className="border p-1">{index + 1}</td>
                                <td className="border p-1">{u.name}</td>
                                <td className="border p-1">{u.status}</td>
                                <td className="border p-1">{u.completionPercentage}</td>
                                <td className="border p-1">
                                    <button className="bg-yellow-500 text-white py-1 px-4 rounded-lg" onClick={() => instanceEdit(u)}>Edit</button>
                                    <button className="bg-red-500 text-white py-1 px-4 rounded-lg ml-2" onClick={() => instanceRemove(u)}>Delete</button>
                                    {/* <button className="bg-blue-500 text-white py-1 px-4 rounded-lg ml-2" onClick={() => setState(u)}>Assign Members</button> */}
                                    <button className="bg-blue-500 text-white py-1 px-4 rounded-lg ml-2" onClick={() => instanceAssign(u)}>Assign Members</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            { !instances.length && <p className="text-center text-xl mt-4">No results found</p>}
        </div>
        <Modal isOpen={formState.assignInstance !== null} onClose={() => setFormState({...formState, assignInstance: null})}>
            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
            <div className="p-4 md:p-5 text-center relative bg-white rounded-lg w-3/4 h-3/4"  >
                <h3 className="mb-2 text-lg font-bold text-gray-500">Manage Users {formState.assignInstance?.name}</h3>
                <div className="flex text-sm">
                    <input type='text' className="block w-full focus:outline-none bottom-border pt-2 px-1" value={assignState.input} placeholder="2021ucp1011@mnit.ac.in, $2023, $admin" onChange={(e) => setAssignState({...assignState, input: e.target.value})} />
                    <button type="button" className="text-white rounded-md ml-2 px-2 py-1" style={{ background: "#0C72B0" }} onClick={addAssignEmail}>Add</button>
                </div>

                <div className="grid grid-cols-2 text-sm font-medium mt-2 gap-1">
                    {assignState.emailList.map((email, index) => (
                        <div key={email} className="flex py-1 px-2 rounded-3xl" style={{background: "#C2FFF48A", color: "#0C72B0F2"}}>
                            <input className="font-medium" disabled value={email} />
                            <button className="ml-1" type="button" onClick={() => setAssignState({...assignState, emailList: assignState.emailList.filter(t => t !== email)})}>✕</button>
                        </div>
                    ))}
                </div>

                <div className="flex mt-4 justify-center text-white text-sm gap-2">
                    <button type="button" className="p-2 block w-40 rounded-3xl" style={{ background: "#0C72B0" }} onClick={() => _assignInstance()}>
                        Assign Role
                    </button>
                    <button type="button" className="p-2 block w-40 rounded-3xl text-red-500 border" onClick={() => {
                        setFormState({...formState, assignInstance: null})
                        setMembers([])
                    }}>
                        Cancel
                    </button>
                </div>
                
                <div className=" max-h-full overflow-y-auto h-3/4">
                    <table className="table-auto w-full mt-8 text-center ">
                        <thead>
                            <tr className="text-left">
                                <th className="border p-1">S.No</th>
                                <th className="border p-1">Email</th>
                                <th className="border p-1">Name</th>
                                <th className="border p-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                members
                                    .map((m, index) => (
                                        <tr key={m.email} className="text-left border-black text-sm">
                                            <td className="border p-1 text-center">{index + 1}</td>
                                            <td className="border p-1">{m.email}</td>
                                            <td className="border p-1">{m.name}</td>
                                            {/* <td className="border p-1">
                                                <button className="bg-red-500 text-white py-1 px-2 rounded-lg ml-1" onClick={() => _removeUser(m)}>Remove</button>
                                            </td> */}
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

export default InstanceForm;