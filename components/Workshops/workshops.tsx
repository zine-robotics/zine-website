import React, {
  useState,
  KeyboardEvent,
  useEffect,
} from "react";
import Link from "next/link";
import { IEventData, IRecruitmentData, getAllEvents, getAllRecruitments } from "../../apis/events";
import { toast } from "react-toastify";

interface IStageProps {
  events: IEventData[];
  state: { selected: number };
  stage: number;
  select: (id: number) => void;
  right: boolean;
}

// export interface IWorkshopProps {
//   recruitmentEvents: IEventData[]
// }

const Stage = ({
  events,
  state,
  select,
  right
}: IStageProps) => {
  return (
    <>
      {events.map((item, key) => {
        const card = (
          <div
            className={
              "p-4 my-4 text-white flex flex-col justify-center " +
              (key % 2 === 0
                ? "col-start-1 col-end-5 text-right"
                : "col-start-6 col-end-9")
            }
          >
            <h3 className="font-semibold sm:text-lg mb-1">
              {item.name}
            </h3>
            {state.selected === key && (
              <p className="leading-tight">
                {item.description}
              </p>
            )}
          </div>
        );

        const title = (
          <div
            className={
              "p-4 my-4 text-white flex flex-col justify-center " +
              (key % 2 !== 0
                ? "col-start-1 col-end-5 text-right"
                : "col-start-6 col-end-9")
            }
          >
            <h3
              className="font-semibold sm:text-lg mb-1"
              style={{ color: "#C2FFF4" }}
            >
              {/* {(item.startDateTime as Date).toDateString()} */}
              {(item.startDateTime as Date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <h3
              className="font-semibold sm:text-lg mb-1"
              style={{ color: "#C2FFF4" }}
            >
              {
                // (item.endDateTime === null) ?
                (item.startDateTime as Date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                // :
                // (item.startDateTime as Date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + " - " + (item.endDateTime as Date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
              }
            </h3>
            <h3
              className="font-semibold text-md mb-1"
              style={{ color: "#C2FFF4" }}
            >
              {item.venue}
            </h3>
          </div>
        );

        return (
          <div
            key={item.name}
            className="contents flex-row-reverse cursor-pointer"
            onClick={() => select(key)}
          >
            {key % 2 === 0 ? card : title}

            <div className="col-start-5 col-end-6 mx-auto relative">
              <div className="h-full w-8 flex items-center justify-center">
                <div className="h-full w-1 bg-white"></div>
              </div>
              <div className="w-8 h-8 absolute top-1/2 -mt-3 rounded-full bg-white">
                {state.selected === key && (
                  <div
                    className="w-4 h-4 mx-auto mt-2 rounded-full"
                    style={{
                      background: "#95C5E2",
                    }}
                  ></div>
                )}
              </div>
            </div>

            {key % 2 === 0 ? title : card}
          </div>
        );
      })}
    </>
  );
};

const Workshops = () => {
  const [state, setState] = useState({
    selected: 0,
  });
  const [recruitments, setRecruitments] = useState<IRecruitmentData[]>([])
  const [events, setEvents] = useState<IEventData[]>([])

  const select = (id: number) => {
    setState({ selected: id });
  };

  useEffect(() => {
    getAllRecruitments().then((res) => {
      if(res === undefined){
        toast.error("Error fetching recruitments")
        return;
      }
      res.sort((a, b) => a.stage - b.stage)
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
        event.startDateTime = new Date(event.startDateTime)
        event.startDateTime.setTime(event.startDateTime.getTime() + event.startDateTime.getTimezoneOffset() * 60 * 1000) //counters the time convertion from utc to local
        event.startDateTime.setDate(event.startDateTime.getUTCDate())
        if(event.endDateTime !== null){
          event.endDateTime = new Date(event.endDateTime)
          event.endDateTime.setTime(event.endDateTime.getTime() + event.endDateTime.getTimezoneOffset() * 60 * 1000)
          event.endDateTime.setDate(event.endDateTime.getUTCDate())
        }
      }
      res.sort((a, b) => (a.startDateTime as Date).getTime() - (b.startDateTime as Date).getTime())
      setEvents(res)
      // console.log(res)
    }).catch((error) => {
      // console.log(error)
      toast.error("Error fetching events")
    })
  }, [])

  const handleKeyDown = (
    e: KeyboardEvent<HTMLElement>
  ) => {
    const { selected } = state;
    if (e.key === "ArrowUp" && selected > 0) {
      setState({ selected: selected - 1 });
    } else if (
      e.key === "ArrowDown" &&
      selected < events.length - 1
    ) {
      setState({ selected: selected + 1 });
    }
  };

  let length = 0;

  return (
    <div
      className="flex flex-col min-h-screen items-center"
      style={{
        background:
          "linear-gradient(to right, #003D63, #0C72B0)",
        marginBottom: -35,
      }}
    >

      <h1 className="text-white font-bold mt-24 text-2xl md:text-6xl">
        Recruitment & Workshops
      </h1>

      {/* <Link href="/workshops/registration">
        <button
          className="mt-8 p-4 block rounded-3xl font-semibold text-lg bg-white"
          style={{ width: 300, color: "#0C72B0" }}
        >
          Register Now
        </button>
      </Link> */}

      {/* Timeline */}
      <div className="container my-24">
        <div
          className="grid grid-cols-9 outline-none"
          tabIndex={1}
          onKeyDown={handleKeyDown}
        >
          {/* <div className="my-4 text-2xl text-white col-start-2 col-end-9 text-center">
            <h3 className="font-bold">
              Aptitude Test
            </h3>
            <h3 style={{ color: "#C2FFF4" }}>
              Stage 1
            </h3>
          </div>
          <Stage
            events={events}
            state={state}
            select={select}
            stage={1}
          /> */}
          {
            recruitments.map((recruitment, key) => {
            const subevents = events.filter(event => event.recruitment === recruitment.stage)
            length+=subevents.length
            return (
              <>
              <div key={key} className="my-4 text-2xl text-white col-start-2 col-end-9 text-center">
                <h3 className="font-bold">
                  {recruitment.title}
                </h3>
                <h3 style={{ color: "#C2FFF4" }}>
                  Stage {recruitment.stage}
                </h3>
              </div>
              <Stage
                events={subevents}
                state={state}
                select={select}
                stage={recruitment.stage}
                right={length % 2 === 0}
              />
              </>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Workshops;
