//recruitments is used to refer to the stages of the recruitment process
//each recruitment has events associated with it

import React, { useEffect, useState } from "react";
import SideNav from "../../sidenav";
import styles from "../../../../constants/styles";
import { useForm } from "react-hook-form";
import ProtectedRoute from "../ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import { IEventData, IRecruitmentData, createRecruitment, deleteRecruitments, editRecruitment, getAllRecruitments } from "../../../../apis/events";
import { deleteImage, uploadImage } from "../../../../apis/image";
import { IRecruitmentForm } from "./types";

interface RecruitmentManagerProps {
    state: null;
    setState: React.Dispatch<React.SetStateAction<IRecruitmentData|null>>;
    recruitments: IRecruitmentData[];
    setRecruitments: React.Dispatch<React.SetStateAction<IRecruitmentData[]>>;
    events: IEventData[];
    setEvents: React.Dispatch<React.SetStateAction<IEventData[]>>;
}

const RecruitmentForm: React.FC<RecruitmentManagerProps> = ({state, setState, recruitments, setRecruitments, events, setEvents}) => {
    const [formState, setFormState] = useState({ search: "", editing: false, editingID: -1 })

    const { register, setValue, reset, formState: {errors}, handleSubmit } = useForm<IRecruitmentForm>({
        defaultValues: {
            title: "",
            stage: 0,
            description: "",
        }
    })
    const onSubmit = async(data: IRecruitmentForm) => {
        createRecruitment(data).then((res) => {
            if(res === undefined){
                toast.error("Error creating recruitment stage: ");
                return;
            }
            toast.success("Event created successfully")
            setRecruitments(oldEvents => [...oldEvents, res])
        }).catch((error) => {
            // console.log(error)
            toast.error("Error adding document: ", error);
        })
    }

    const onEdit = async (data: IRecruitmentForm) => {
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
        editRecruitment({...data, id: formState.editingID}).then((res) => {
            if(res === undefined){
                toast.error(`Error editing recruitment stage: ${data.title}`);
                return;
            }
            toast.success("Edited event successfully")
            setRecruitments(oldEvents => [...oldEvents.filter(e => e.id !== formState.editingID), res])
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

    const recruitmentRemove = async (recruitment: IRecruitmentData) => {
        toast.promise(deleteRecruitments([recruitment.id]), {
            pending: 'Deleting Event',
            success: `Event ${recruitment.title} deleted successfully`,
        }).then(() => {
            setRecruitments(recruitments.filter(t => t.id !== recruitment.id))
            setEvents(events.filter(e => e.recruitment !== recruitment.id))
        })
    }

    const recruitmentEdit = async (recruitment: IRecruitmentData) => {
        setValue("title", recruitment.title)
        setValue("description", recruitment.description)
        setValue("stage", recruitment.stage)

        setFormState({ ...formState, editing: true, editingID: recruitment.id })
    }

    useEffect(() => {
        getAllRecruitments().then(res => {
            if(res === undefined){
                toast.error("Error fetching tasks.")
                setRecruitments([])
                return;
            }
            setRecruitments(res)
        })
    }, [])

    return (
        <div className="col-span-12 px-6 md:px-12 flex flex-col overflow-y-scroll md:col-span-9">
            <h1 className="text-4xl font-bold mt-16 md:mt-8" style={{color: "#AAAAAA"}}>Recruitments</h1>
            <div className="row-span-5 bg-white rounded-xl py-4 px-6 my-8 w-full">
            <h1 className="text-2xl font-bold" style={styles.textPrimary}>{formState.editing ? "Edit Recruitment" : "Create Recruitment"}</h1>
            <div className="grid grid-cols-5 gap-6 mt-4">
                <div className="col-span-3">
                    <label className="block text-gray-600 text-sm">Title<span className="text-red-500">*</span></label>
                    <input type="text" id="title" className="block w-full focus:outline-none bottom-border pt-2" {...register("title", {required: true})} />
                    {errors.title && <p className="text-red-500 text-sm" role="alert">Title is required</p>}
                </div>
                <div className="col-span-5">
                    <label className="block text-gray-600 text-sm">Description<span className="text-red-500">*</span></label>
                    <textarea id="description" className="block w-full focus:outline-none bottom-border pt-2" rows={1} {...register("description", {required: true})}></textarea>
                    {errors.description && <p className="text-red-500 text-sm" role="alert">Description is required</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-600 text-sm">Stage<span className="text-red-500">*</span></label>
                    <input type="number" id="stage" className="block w-full focus:outline-none bottom-border pt-2" {...register("stage", {required: true})} />
                    {errors.stage && <p className="text-red-500 text-sm" role="alert">Stage is required</p>}
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
            {/* <recruitmentEdit setMessage={setMessage} /> */}
        <div className="bg-white py-4 px-6 mb-8 rounded-xl">
            <h1 className="text-2xl font-bold" style={styles.textPrimary}>Search Recruitments</h1>

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
                            <th className="border p-1">Stage</th>
                            <th className="border p-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            recruitments
                            .filter(u => !formState.search || u.title.toLowerCase().includes(formState.search!.toLowerCase()))
                            .sort((a, b) => a.stage - b.stage)
                            .map((u,index) => (
                                <tr key={u.id} className="text-left border-black">
                                    <td className="border p-1">{index + 1}</td>
                                    <td className="border p-1">{u.title}</td>
                                    <td className="border p-1">{u.stage}</td>
                                    <td className="border p-1">
                                        <button className="bg-yellow-500 text-white py-1 px-4 rounded-lg" onClick={() => recruitmentEdit(u)}>Edit</button>
                                        <button className="bg-red-500 text-white py-1 px-4 rounded-lg ml-2" onClick={() => recruitmentRemove(u)}>Delete</button>
                                        <button className="bg-blue-500 text-white py-1 px-4 rounded-lg ml-2" onClick={() => setState(u)}>Manage Events</button>

                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                { !recruitments.length && <p className="text-center text-xl mt-4">No results found</p>}
            </div>
        </div>
      )
}

export default RecruitmentForm;