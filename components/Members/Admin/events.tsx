import React, { useEffect, useState } from "react";
import SideNav from "../sidenav";
import styles from "../../../constants/styles";
import { useForm } from "react-hook-form";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import { deleteImage, uploadImage } from "../../../apis/image";
import RecruitmentForm from "./eventComponents/recruitmentForm";
import EventForm from "./eventComponents/eventForm";
import { getAllEvents, getAllRecruitments, IEventData, IRecruitmentData } from "../../../apis/events";

const Events = () => {
    const [state, setState] = useState<IRecruitmentData|null>(null)
    const [recruitments, setRecruitments] = useState<IRecruitmentData[]>([])
    const [events, setEvents] = useState<IEventData[]>([])

    useEffect(() => {
        getAllRecruitments().then((res) => {
            if(res === undefined){
                toast.error("Error fetching recruitments")
                return;
            }
            setRecruitments(res)
        }).catch((error) => {
            // console.log(error)
            toast.error("Error fetching recruitments")
        })
        getAllEvents().then((res) => {
            if(res === undefined){
                toast.error("Error fetching events")
                return;
            }
            for(const event of res){
                event.startDateTime = new Date(event.startDateTime).toUTCString()
                if(event.endDateTime !== null)
                    event.endDateTime = new Date(event.endDateTime).toUTCString()
            }
            setEvents(res)
            // console.log(res)
        }).catch((error) => {
            // console.log(error)
            toast.error("Error fetching events")
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
                {
                    (state === null)?
                    <RecruitmentForm
                        state={state}
                        setState={setState}
                        recruitments={recruitments}
                        setRecruitments={setRecruitments}
                        events={events}
                        setEvents={setEvents}
                    />
                    :
                    <EventForm
                        state={state}
                        setState={setState}
                        events={events}
                        setEvents={setEvents}
                        recruitments={recruitments}
                    />
                }
            </div>
        </ProtectedRoute>
      )
}

export default Events;