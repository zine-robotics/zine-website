import React, { useEffect, useState } from "react";
import SideNav from "../../sidenav";
import styles from "../../../../constants/styles";
import { useForm } from "react-hook-form";
import ProtectedRoute from "../ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import { IEventData, IRecruitmentData, createEvent, deleteEvents, editEvent, getAllEvents } from "../../../../apis/events";
import { deleteImage, uploadImage } from "../../../../apis/image";
import { IEventForm } from "./types";

interface EventManagerProps {
    state: IRecruitmentData;
    setState: React.Dispatch<React.SetStateAction<IRecruitmentData|null>>;
    events: IEventData[];
    setEvents: React.Dispatch<React.SetStateAction<IEventData[]>>;
    recruitments: IRecruitmentData[];
}

const formatDateTime = (dateTime: Date) => {
    let date = new Date(dateTime);
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000); //to counter conversion to local time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const formatDateTimeToSQL = (dateTime: Date) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const EventForm: React.FC<EventManagerProps> = ({state, setState, events, setEvents, recruitments}) => {
    // const [events, setEvents] = useState<IEventData[]>([])
    const [formState, setFormState] = useState({ search: "", editing: false, editingID: -1 })

    const { register, setValue, reset, formState: {errors}, handleSubmit } = useForm<IEventForm>({
        defaultValues: {
            name: "",
            description: "",
            venue: "",
            startDateTime: new Date(),
            endDateTime: null,
            recruitment: state.stage,
            type: "workshop"
        }
    })
    const onSubmit = async(data: IEventForm) => {
        // console.log("data: ",data);
        // if (data.image[0]){
        //     var imageName = new Date().getTime().toString()
        //     data.imagepath = `/events/${imageName}`
        //     var imagelink = await uploadImage(data.image[0], data.imagepath)
        //     data.image = imagelink
        // }
        // else{
        //     data.image = ""
        //     data.imagepath= ""
        // }
        // const { date, time, ...formdata } = data
        data.recruitment = state.stage
        data.startDateTime = formatDateTimeToSQL(data.startDateTime as Date)
        // console.log("endtime", data.endDateTime)
        if(data.endDateTime==="")
            data.endDateTime = null
        if(data.endDateTime!=null)
            data.endDateTime = formatDateTimeToSQL(data.endDateTime as Date)
        reset()
        createEvent(data).then((res) => {
            if(res === undefined){
                toast.error("Error creating event");
                return;
            }
            toast.success("Created event successfully")
            res.startDateTime = new Date(res.startDateTime)
            if(res.endDateTime != null)    res.endDateTime = new Date(res.endDateTime)
            setEvents((oldEvents)=>[...oldEvents, res])
        }).catch((error) => {
            // console.log(error)
            toast.error("Error adding document: ", error);
        });
    }

    const eventRemove = async (event: IEventData) => {
        toast.promise(deleteEvents([event.id]), {
            pending: 'Deleting Event',
            success: `Event ${event.name} deleted successfully`,
        }).then(() => {
            setEvents(events.filter(t => t.id !== event.id))
        })
    }

    const eventEdit = async (event: IEventData) => {
        setValue("name", event.name)
        setValue("description", event.description)
        // @ts-ignore
        setValue("startDateTime", formatDateTime(event.startDateTime))
        // @ts-ignore
        setValue("endDateTime", formatDateTime(event.endDateTime))
        setValue("venue", event.venue)
        setValue("type", event.type)
        setValue("recruitment", state.stage)

        setFormState({ ...formState, editing: true, editingID: event.id })
    }

    const onEdit = async (data: IEventForm) => {
        // var imageexists = data.image[0]
        // data.image = ""
        // if (imageexists){
        //     if(data.imagepath) deleteImage(data.imagepath)
        //     var imageName = new Date().getTime().toString()
        //     data.imagepath = `/events/${imageName}`
        //     var imagelink = await uploadImage(imageexists, data.imagepath)
        //     data.image = imagelink
        // }
        reset()
        data.startDateTime = formatDateTimeToSQL(data.startDateTime as Date)
        if(data.endDateTime=="")
            data.endDateTime = null
        if(data.endDateTime!=null)
            data.endDateTime = formatDateTimeToSQL(data.endDateTime as Date)
        const eventData = { ...data, id: formState.editingID }
        editEvent(eventData).then((res) => {
            if(res === undefined){
                toast.error("Error editing event");
                return;
            }
            toast.success("Edited event successfully")
            res.startDateTime = new Date(res.startDateTime)
            if(res.endDateTime !== null) res.endDateTime = new Date(res.endDateTime)
            setEvents(events.map(t => t.id === formState.editingID ? eventData : t))
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

    return (

        <div className="col-span-12 px-6 md:px-12 flex flex-col overflow-y-scroll md:col-span-9">
            <h1 className="text-4xl font-bold mt-16 md:mt-8" style={{color: "#AAAAAA"}}>Events</h1>
            <button className="p-3 block w-40 rounded-3xl bg-red-500 justify-end" onClick={() => setState(null)}>Back</button>
            <div className="row-span-5 bg-white rounded-xl py-4 px-6 my-8 w-full">
            <h1 className="text-2xl font-bold" style={styles.textPrimary}>{formState.editing ? "Edit Event" : "Create Event"}</h1>
            <div className="grid grid-cols-5 gap-6 mt-4">
                <div className="col-span-3">
                    <label className="block text-gray-600 text-sm">Event Name<span className="text-red-500">*</span></label>
                    <input type="text" id="name" className="block w-full focus:outline-none bottom-border pt-2" {...register("name", {required: true})} />
                    {errors.name && <p className="text-red-500 text-sm" role="alert">Event name is required</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-600 text-sm">Type</label>
                    <select id="type" className="block w-full focus:outline-none bottom-border pt-2" {...register("type")}>
                        <option value="Test">Test</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Hackathon">Hackathon</option>
                    </select>
                </div>
                <div className="col-span-5">
                    <label className="block text-gray-600 text-sm">Event Description<span className="text-red-500">*</span></label>
                    <textarea id="description" className="block w-full focus:outline-none bottom-border pt-2" rows={1} {...register("description", {required: true})}></textarea>
                    {errors.description && <p className="text-red-500 text-sm" role="alert">Description is required</p>}
                </div>
                <div className="col-span-3">
                    <label className="block text-gray-600 text-sm">Event Location<span className="text-red-500">*</span></label>
                    <input type="text" id="location" className="block w-full focus:outline-none bottom-border pt-2" {...register("venue", {required: true})} />
                    {errors.venue && <p className="text-red-500 text-sm" role="alert">Venue is required</p>}
                </div>
                <div className="col-span-3">
                    <label className="block text-gray-600 text-sm">Event Start Date<span className="text-red-500">*</span></label>
                    <input type="datetime-local" id="startDate" className="block w-full focus:outline-none bottom-border pt-2" {...register("startDateTime", {required: true, valueAsDate: true})} />
                    {errors.startDateTime && <p className="text-red-500 text-sm" role="alert">Date is required</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-600 text-sm">Event End Date</label>
                    <input type="datetime-local" id="endDate" className="block w-full focus:outline-none bottom-border pt-2" {...register("endDateTime", {required: false, valueAsDate: true})} />
                </div>
                {/* <div className="col-span-1">
                    <label className="block text-gray-600 text-sm">Recruitment</label>
                    <select id="recruitment" className="block w-full focus:outline-none bottom-border pt-2" {...register("recruitment")}>
                        {recruitments.sort((a,b)=> a.stage-b.stage).map((recruitment) => (
                            <option key={recruitment.stage} value={recruitment.stage}>{recruitment.title}</option>
                        ))}
                    </select>
                </div> */}
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
            {/* <eventEdit setMessage={setMessage} /> */}
        <div className="bg-white py-4 px-6 mb-8 rounded-xl">
            <h1 className="text-2xl font-bold" style={styles.textPrimary}>Search Events</h1>

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
                            <th className="border p-1">Type</th>
                            <th className="border p-1">Venue</th>
                            <th className="border p-1">Recruitment</th>
                            <th className="border p-1">Start Date</th>
                            <th className="border p-1">End Date</th>
                            <th className="border p-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            events
                            .filter(u => !formState.search || u.name.toLowerCase().includes(formState.search!.toLowerCase()) || u.venue?.toLowerCase().includes(formState.search!.toLowerCase()))
                            .filter(u => u.recruitment === state.stage)
                            // .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())
                            .map((u,index) => (
                                <tr key={u.id} className="text-left border-black">
                                    <td className="border p-1">{index + 1}</td>
                                    <td className="border p-1">{u.name}</td>
                                    <td className="border p-1">{u.type}</td>
                                    <td className="border p-1">{u.venue}</td>
                                    <td className="border p-1">{u.recruitment}</td>
                                    <td className="border p-1">{u.startDateTime.toString()}</td>
                                    <td className="border p-1">{(u.endDateTime)?u.endDateTime.toString():""}</td>
                                    <td className="border p-1">
                                        <button className="bg-yellow-500 text-white py-1 px-4 rounded-lg" onClick={() => eventEdit(u)}>Edit</button>
                                        <button className="bg-red-500 text-white py-1 px-4 rounded-lg ml-2" onClick={() => eventRemove(u)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                { !events.length && <p className="text-center text-xl mt-4">No results found</p>}
            </div>
        </div>
      )
}

export default EventForm;