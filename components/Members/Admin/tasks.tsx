import React, { useEffect, useState } from "react";
import SideNav from "../sidenav";
import styles from "../../../constants/styles";
import { useForm } from "react-hook-form";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import { deleteImage, uploadImage } from "../../../apis/image";
import TaskForm from "./taskComponents/taskForm";
import TaskInstanceForm from "./taskComponents/taskInstanceForm";
import { ITaskCreateData, ITaskData, getAllTasks} from "../../../apis/tasks/tasks";
import { ITaskInstanceData, ITaskInstanceCreateData, getInstancesByTask } from "../../../apis/tasks/taskInstances";

const Tasks = () => {
    const [state, setState] = useState<ITaskData|null>(null)
    const [tasks, setTasks] = useState<ITaskData[]>([])
    const [instances, setInstances] = useState<ITaskInstanceData[]>([])

    useEffect(() => {
        getAllTasks().then((res) => {
            if(res === undefined){
                toast.error("Error fetching tasks")
                return;
            }
            for(const event of res){
                event.dueDate = new Date(event.dueDate).toUTCString()
            }
            setTasks(res)
            // console.log(res)
        }).catch((error) => {
            // console.log(error)
            toast.error("Error fetching tasks")
        })
        // getInstancesByTask().then((res) => {
        //     if(res === undefined){
        //         toast.error("Error fetching instances")
        //         return;
        //     }
        //     setInstances(res)
        //     // console.log(res)
        // }).catch((error) => {
        //     // console.log(error)
        //     toast.error("Error fetching instances")
        // })
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
                    <TaskForm
                        state={state}
                        setState={setState}
                        tasks={tasks}
                        setTasks={setTasks}
                        instances={instances}
                        setInstances={setInstances}
                    />
                    :
                    <TaskInstanceForm
                        state={state}
                        setState={setState}
                        instances={instances}
                        setInstances={setInstances}
                    />
                }
            </div>
        </ProtectedRoute>
      )
}

export default Tasks;