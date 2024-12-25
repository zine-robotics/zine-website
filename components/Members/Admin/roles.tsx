import { toast,ToastContainer } from "react-toastify"
import ProtectedRoute from "./ProtectedRoute"
import SideNav from "../sidenav"
import styles from "../../../constants/styles";
import { useEffect, useState } from "react";
import { Control, set, useFieldArray, useForm } from "react-hook-form";
import Modal from "../modal";
import { IRoleData, IRoleCreateData, createRole, updateRole, deleteRoles, assignUsersToRole, getRoleMembers, IRoleMember, IRoleMemberList, removeRoleMembers, getAllRoles } from "../../../apis/roles";
import { IMembersList } from "../../../apis/room";

interface IState {
    search: string;
    editing: boolean;
    editingID: number ; //-1 for not editing
    deleteRole: IRoleData | null;
    assignRole: IRoleData | null;
}

interface IAssignState {
    input: string;
    roleId: number;
    emailList: string[];
}

const Roles = () => {
    const [state, setState] = useState<IState>({ search: "", editing: false, editingID: -1, assignRole: null, deleteRole: null });
    const [members, setMembers] = useState<IRoleMember[]>([]);
    const [roles, setRoles] = useState<IRoleData[]>([]);
    const [assignState, setAssignState] = useState<IAssignState>({ roleId: -1, input: "" , emailList: []});

    const { register, watch, handleSubmit, setValue, reset, control, formState: { errors } } = useForm<IRoleCreateData>();

    const onSubmit = async (data: IRoleCreateData) => {
        createRole(data).then(role => {
            if (role === undefined){ 
                toast.error("role create failed")
                return
            }
            setRoles([...roles, role])
            toast.success("role successfully created!")

        }).catch((err) => {
            // console.log(err)
            toast.error("An error occurred. Contact zine team")
        })
    }

    const onEdit = async (data: IRoleCreateData) => {
        
        // let imageexists = data.image[0]
        // data.image = ""
        // if (imageexists){
        //     if(data.dpUrl) deleteImage(data.dpUrl)
        //     let imageName = new Date().getTime().toString()
        //     data.dpUrl = `/rooms/${imageName}`
        //     let imagelink = await uploadImage(imageexists, data.dpUrl)
        //     data.image = imagelink
        // }
        // const { image, ...formData } = data
        const { ...formData } = data

        reset()
        updateRole(state.editingID, data).then(role => {
            if(role!=undefined){
                toast.success("Role successfully edited!")
                setRoles(roles.map(r => r.id === state.editingID ? {...r, ...formData} : r)) //changes the room that was edited
                setState({ ...state, editing: false, editingID:-1 })
            }
            else{
                toast.error("An error occurred. Try again later.")
            }
        }).catch((err) => {
            // console.log(err)
            toast.error("An error occurred. Contact zine team")
        })
    }

    const onCancel = () => {
        setState({ ...state, editing: false, editingID:-1 })
        reset()
    }

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setState({ ...state, [e.target.id]: e.target.value })
    }

    const roleDelete = async (role: IRoleData) => {
        toast.promise(deleteRoles([role.id]), {
            pending: 'Deleting role',
            success: `role ${role.roleName} deleted successfully`,
        }).then(() => {
            setRoles(roles.filter(t => t.id !== role.id))
        })
        setState({...state, deleteRole: null})
    }

    const roleEdit = async (role: IRoleData) => {
        setValue("roleName", role.roleName)

        setState({ ...state, editing: true, editingID: role.id })
    }

    const roleAssign = (role: IRoleData) => {
        setAssignState({ input: "", roleId: role.id, emailList: [] })
        setState({ ...state, assignRole: role })
        getRoleMembers(role.id).then(members => {
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

    const _assignRole = async () => {
        if (!state.assignRole) return
        const role = state.assignRole
        if (assignState.emailList.length === 0) return toast.error('No users added!')

        setState({...state, assignRole: null})
        assignUsersToRole(role.id, assignState.emailList).then(response => {
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
    const _removeUser = async (member: IRoleMember) => {
        if (!state.assignRole) return
        const role = state.assignRole
        const response = await removeRoleMembers(role.id, member.email)
        if(response){
            toast.success(`Successfully removed ${member.email} from ${role.roleName}`)
            setMembers(members.filter(m => m.email !== member.email))
        }
        else{
            toast.error("An error occurred. Try again later.")
        }
    }

    useEffect(() => {
        getAllRoles().then(roles => {
            // console.log(rooms)
            if(roles === undefined){
                toast.error("Error fetching roles")
                return
            }
            setRoles(roles)
        })
    }, [])


    return (
        <ProtectedRoute>
            <ToastContainer
                position="top-left"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="grid grid-cols-12 h-screen" style={{background: "#EFEFEF"}}>
                <SideNav />
                <div className="col-span-12 px-6 md:px-12 flex flex-col overflow-y-scroll md:col-span-9">
                    <h1 className="text-4xl font-bold mt-16 md:mt-8" style={{color: "#AAAAAA"}}>Roles</h1>
                    <div className="row-span-5 bg-white rounded-xl py-4 px-6 my-8 w-full shadow-md">
                        <h1 className="text-2xl font-bold" style={styles.textPrimary}>{state.editing ? "Edit Role" : "Create Role"}</h1>
                        <form>
                            <div className="grid grid-cols-5 gap-6 mt-4">
                                <div className="col-span-3">
                                    <label className="block text-gray-600 text-sm">Role Name<span className="text-red-500">*</span></label>
                                    <input type="text" id="name" className="block w-full focus:outline-none bottom-border pt-2 px-1" {...register('roleName', { required: true })} />
                                    {errors.roleName && <p className="text-red-500 text-sm" role="alert">Name is required</p>}
                                </div>
                            </div>
                            {
                                !state.editing ?
                                    <button className="p-3 block w-40 rounded-3xl text-white mt-8" style={{ background: "#0C72B0" }} onClick={handleSubmit(onSubmit)}>Create</button> :
                                    <div className="text-white mt-8 flex gap-2">
                                        <button className="p-3 block w-40 rounded-3xl" style={{ background: "#0C72B0" }} onClick={handleSubmit(onEdit)}>Edit</button>
                                        <button className="p-3 block w-40 rounded-3xl bg-red-500" onClick={() => onCancel()}>Cancel</button>
                                    </div>
                            }
                        </form>
                    </div>

                    <div className="bg-white py-4 px-6 mb-8 rounded-xl shadow-md">
                        {/* <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-4 flex flex-col">
                                <label className="text-gray-500">Search</label>
                                <input id="search" type="text" className="pt-2 bottom-border focus:outline-none" onChange={onSearchChange} placeholder="Search email ID or name" value={state?.search} autoComplete="off" />
                            </div>
                        </div> */}

                        <table className="table-auto w-full mt-8 text-center">
                            <thead>
                                <tr className="text-left">
                                    <th className="border p-1">S.No</th>
                                    <th className="border p-1">Role Name</th>
                                    {/* <th className="border p-1">Members</th> */}
                                    <th className="border p-1">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    roles
                                        .filter(u => !state.search || u.roleName.toLowerCase().includes(state.search!.toLowerCase()))
                                        .map((u, index) => (
                                            <tr key={u.id} className="text-left border-black text-sm">
                                                <td className="border p-1 text-center">{index + 1}</td>
                                                <td className="border p-1">{u.roleName}</td>
                                                {/* <td className="border p-1 text-center">{ u.members?.length}</td> */} 
                                                <td className="border p-1">
                                                    <button className="bg-yellow-500 text-white py-1 px-2 rounded-lg" onClick={() => roleEdit(u)}>Edit</button>
                                                    <button className="bg-red-500 text-white py-1 px-2 rounded-lg ml-1" onClick={() => setState({...state, deleteRole: u})}>Delete</button>
                                                    <button className="bg-green-500 text-white py-1 px-2 rounded-lg ml-1" onClick={() => roleAssign(u)}>Manage Users</button> 
                                                </td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                        {!roles.length && <p className="text-center text-xl mt-4">No results found</p>}
                    </div>
                </div>
            </div>

            {/* Confirm delete modal */}
            <Modal isOpen={state.deleteRole !== null} onClose={() => setState({...state, deleteRole: null})}>
                <div className="p-4 md:p-5 text-center">
                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete {state.deleteRole?.roleName} room?</h3>
                    <button type="button" className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2" onClick={() => roleDelete(state.deleteRole!)}>
                        Delete
                    </button>
                    <button type="button" className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border ml-2 border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900" onClick={() => setState({...state, deleteRole: null})}>Cancel</button>
                </div>
            </Modal>

            {/* Assign Room Modal */}
            <Modal isOpen={state.assignRole !== null} onClose={() => setState({...state, assignRole: null})}>
                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
                <div className="p-4 md:p-5 text-center relative bg-white rounded-lg w-3/4 h-3/4"  >
                    <h3 className="mb-2 text-lg font-bold text-gray-500">Manage Users {state.assignRole?.roleName}</h3>
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
                        <button type="button" className="p-2 block w-40 rounded-3xl" style={{ background: "#0C72B0" }} onClick={() => _assignRole()}>
                            Assign Role
                        </button>
                        <button type="button" className="p-2 block w-40 rounded-3xl text-red-500 border" onClick={() => {
                            setState({...state, assignRole: null})
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
                                                <td className="border p-1">
                                                    {/* <button className="bg-green-500 text-white py-1 px-2 rounded-lg ml-1" onClick={() => _removeUser(m)}>Change Role</button> */}
                                                    <button className="bg-red-500 text-white py-1 px-2 rounded-lg ml-1" onClick={() => _removeUser(m)}>Remove</button>
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
        </ProtectedRoute>
    )
}

export default Roles