import React, { useEffect, useState, useRef } from "react";
import ProtectedRoute from "./ProtectedRoute";
import SideNav from "../sidenav";
import { useAuth } from "../../../context/authContext";
import { getRoom, fetchRoomMessages, fetchRoomsByUser, IRoomData, IMessageData , updateLastSeen, lastSeen, ANNOUNCEMENT_ROOM_NEW_ID, getAnnouncementRoom} from "../../../apis/room";
import Image from "next/image";
import Send from "../../../images/icons/Send.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faLeftLong, faReply } from "@fortawesome/free-solid-svg-icons";
import SockJS from "sockjs-client";
import { Stomp, Client } from "@stomp/stompjs";
import ChatDP from "../../../images/admin/logo.png";

const Channels = () => {
  type KeyValueArray = Array<{
    id: string;
    data: IMessageData;
  }>;

  const { authUser } = useAuth();
  const [rooms, setRooms] = useState<IRoomData[]>([]);
  const [announcementRoom, setAnnouncementRoom] = useState<IRoomData>();
  const [currRoomID, setCurrRoomID] = useState<number>();
  const [currRoom, setCurrRoom] = useState<string>("");
  const [messages, setMessages] = useState<IMessageData[]>([]);
  const [currMsg, setCurrMsg] = useState("");
  const [replyText, setReplyText] = useState<string>("");
  const [replyingName, setReplyingName] = useState<string>("");
  const [replyingMessageID, setReplyingMessageID] = useState<number | null>(null);
  const [currRoomImage, setCurrRoomImage] = useState<string>("");
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [hide, setHide] = useState(false);
  const [stompClient, setStompClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomLastSeen, setRoomLastSeen] = useState<number>(0);
  const updateScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  const onConnected = () => {
    setIsConnected(true);
  };

  useEffect(() => {
    if (currRoomID) {
      stompClient;
    }
  }, []);

  useEffect(() => {
    let subscription: any; 
    if (currRoomID && stompClient !== null) {
      subscription = stompClient.subscribe("/room/" + currRoomID, (msg: any) => {
        let body = JSON.parse(msg.body) as IMessageData;
        setMessages(prev => [...prev, body]);
        setRoomLastSeen(body.timestamp)
      });
    }
  
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [currRoomID]);
  
  const onError = (error: any) => {
    // console.log(error);
  };
  const connect = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const client = new Client({
        webSocketFactory: () =>
          new SockJS(process.env.NEXT_PUBLIC_API_URL+"/ws", null, {
            withCredentionals: false,
          }),
        connectHeaders: { Authorization: `Bearer ${token}` },
        debug: (str: any) => {
          // console.log(str);
        },
        onConnect: onConnected,
        onStompError: onError,
        reconnectDelay: 10000,
      });
      client.activate();
      setStompClient(client);
    }
  };
  useEffect(() => {
    connect();
  }, []);
  useEffect(() => {
    window.addEventListener("resize", updateScreenWidth);
    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

  useEffect(() => {
    if(authUser?.email && currRoomID)
      updateLastSeen(authUser?.email, currRoomID)
  }, [roomLastSeen, currRoomID])

  // to fetch the rooms once the component loads
  useEffect(() => {
    if (authUser?.email) {
      fetchRoomsByUser(authUser.email)
        .then((res) => {
          // console.log("res",res[0]);
          setRooms(res);
          // console.log(res);
          
        })
        .catch((err) => {
          // console.log(err);
        });
        getAnnouncementRoom(authUser.email).then((res) => {
          setAnnouncementRoom(res);
          // console.log(res); 
          
        })
    }
  }, []);

  // useEffect(() => {
  //   // console.log("list of rooms", rooms);
  // }, [rooms])

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current!.scrollIntoView();
    }
  }, [messages]);

  const handleSend = async () => {
    if (!currMsg) return;
    const msgBody = {
      type: "text",
      content: currMsg.trim(),
      sentFrom: authUser?.id,
      roomId: currRoomID,
      replyTo: replyingMessageID,
      contentUrl: null,
    };
    if (msgBody.sentFrom) {
      stompClient.publish({ destination: "/app/message", headers: {}, body: JSON.stringify(msgBody) });
    }
    setCurrMsg("");
    setReplyText("");
    setReplyingName("");
    setReplyingMessageID(null);
  };

  const URL_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
  function RenderMessageWithLinks({
    message,
    user,
    space,
    name,
    id,
    text,
    disableStatus,
    mobile,
  }: {
    message: string;
    user: boolean;
    space: boolean;
    name: string;
    id: number;
    text: string;
    disableStatus: boolean;
    mobile: boolean;
  }) {
    return (
      <div
        className={`bg-blue-600 py-3 px-1 pr-3`}
        style={{
          backgroundColor: `${user ? "#95C5E2" : "#0C72B0"}`,
          borderRadius: `${user ? "1.5rem 1.5rem 0.75rem 1.5rem" : "1.5rem 1.5rem 1.5rem 0.75rem"}`,
          marginLeft: `${user ? "auto" : space ? "2rem" : "0rem"}`,
          maxWidth: `${mobile ? "calc(95% - 2.5rem)" : "calc(60% - 2.5rem)"}`,
        }}
      >
        <div className="whitespace-pre-wrap break-words pl-3 text-white text-sm w-fit">
          {message.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line.split(/\s+/g).map((word, wordIndex) =>
                word.match(URL_REGEX) ? (
                  <a key={wordIndex} href={word} className={`${user ? "text-blue-500" : "text-blue-100"} underline`} target="_blank">
                    {word}{" "}
                  </a>
                ) : (
                  <React.Fragment key={wordIndex}>{word} </React.Fragment>
                )
              )}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
  const GetRepliedText = ({ msgID, user, space }: { msgID: number; user: boolean; space: boolean }) => {
    const msg = messages?.find((item) => item.id === msgID);
    return (
      <div
        className={`flex flex-col ${user ? "ml-auto" : "mr-auto"}`}
        style={{
          marginLeft: `${user ? "auto" : space ? "2rem" : "0rem"}`,
        }}
      >
        <div className={`text-sm ${user ? "ml-auto" : ""}`} style={{ color: "#8D989F" }}>{`Replying to ${msg?.sentFrom.name.split(" ")[0]}`}</div>
        <div className={`flex ${!user ? "flex" : ""}`}>
          {!user && (
            <div
              className={`w-1 h-fit`}
              style={{
                backgroundColor: "#95C5E2",
              }}
            ></div>
          )}
          <div className={`bg-white w-4/5 text-sm px-6 py-3 w-full flex-wrap ${user ? "ml-auto" : ""}`} style={{ borderRadius: `${user ? "20px 10px 10px 20px" : "10px 20px 20px 10px"}` }}>
            {truncateString(msg?.content || "")}
          </div>
          {user && (
            <div
              className={`w-1 h-fit`}
              style={{
                backgroundColor: "#95C5E2",
              }}
            ></div>
          )}
        </div>
      </div>
    );
  };
  const truncateString = (str: string) => {
    let end = "";
    if (str.length > 50) {
      end = "...";
    }
    return str?.substring(0, 50) + end;
  };
  const displayReply = (id: number, name: string, text: string) => {
    setReplyingMessageID(id);
    setReplyingName(name);
    setReplyText(text);
  };

  const displayRoomMessages = (id: number) => {
    fetchRoomMessages(id).then((res) => {
      // console.log(res);
      setMessages(res);
    });
  };

  const unixToHumanReadable = (timestamp: number) => {
    let dataObj = new Date(timestamp);
    return dataObj.toLocaleString();
  }

  useEffect(() => {
    // console.log("messages", messages);
  }, [messages]);

  const handleRoomChange = (room: IRoomData, mobile: boolean) => {
    // console.log(room);
    
    if(currRoomID !== null)
      updateLastSeen(authUser?.email as string, room.id as number);
    setCurrRoomID(room.id);
    currRoomID !== room.id && setMessages([]);
    displayRoomMessages(room.id)
    setCurrRoom(room.name);
    setCurrRoomImage(room.dpUrl);

    lastSeen(authUser?.email as string, room.id).then((res) => {
      setRoomLastSeen(res);
    });
    updateLastSeen(authUser?.email as string, room.id)

    if(mobile)
      setHide(true);
    setReplyText("");
    setReplyingName("");
    setReplyingMessageID(null);
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col md:grid grid-cols-12 h-screen w-screen font-poppins" style={{ background: "#EFEFEF" }}>
        <SideNav />

        {/* rooms/ channels */}
 
        <div className="flex h-screen md:col-span-9" style={{"display": isConnected? "": "none"}}>
          {screenWidth >= 768 ? (
            <div className="w-60 bg-white shrink-0 px-3 pt-10 flex justify-center overflow-y-auto">
              <div className="w-full">
                <div
                  onClick={() => {
                    handleRoomChange(announcementRoom as IRoomData, false);
                  }}
                  className={`w-11/12 flex font-extrabold text-sm rounded-2xl mb-1 py-2 pl-4 ${currRoom === announcementRoom?.name ? "bg-white" : "bg-gray-200"}`}
                  style={{
                    color: "#003d63",
                    border: `${currRoom === announcementRoom?.name ? "1px solid #003d63" : ""}`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="w-6 h-6 mr-2"
                    style={{
                      backgroundColor: "white",
                      borderRadius: "50%",
                    }}
                  >
                    <div className="h-full w-full flex flex-col justify-center">
                      <Image layout="responsive" src={ChatDP} />
                    </div>
                  </div>
                    <div className="flex items-center">{announcementRoom?.name}</div>
                    <div className="text-xs ml-auto pr-2 flex items-center">{announcementRoom?.unreadMessages!=0 ? announcementRoom?.unreadMessages : <></>}</div>
                  </div>
                {rooms.filter(room => room.type == 'workshop').length != 0 &&
                  <div className="font-normal ml-2 mt-5" style={{ color: "#8D989F" }}>
                  Workshops
                  </div>}
                {rooms &&
                  rooms.map((ele) => {
                    if (ele.id === null) return; //if room does not exist
                    return (
                      ele.type === "workshop" && (
                        <div
                          key={ele.id}
                          onClick={() => {
                            handleRoomChange(ele, false);
                          }}
                          className={`w-11/12 flex font-extrabold rounded-2xl mb-1 py-2 pl-4 text-sm ${currRoom === ele.name ? "bg-white" : "bg-gray-200"}`}
                          style={{
                            color: "#003d63",
                            border: `${currRoomID === ele.id ? "1px solid #003d63" : ""}`,
                            cursor: "pointer",
                          }}
                        >
                          <div
                            className="w-6 h-6 z-4 mr-2"
                            style={{
                              backgroundColor: "white",
                              borderRadius: "50%",
                            }}
                          >
                            {ele.dpUrl ? (
                              <div
                                className="h-full w-full flex flex-col justify-center rounded-full relative"
                                style={{
                                  overflow: "hidden",
                                  borderRadius: "50%",
                                }}
                              >
                                <Image
                                  width={50}
                                  height={50}
                                  src={ele.dpUrl}
                                  className="rounded-full"
                                  style={{
                                    backgroundColor: "#0C72B0",
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-full w-full flex flex-col justify-center relative">
                                <Image layout="responsive" objectFit="cover" src={ChatDP} />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">{ele.name}</div>
                          <div className="text-xs ml-auto pr-2 text-xs ml-auto pr-5 flex items-center">{ele?.unreadMessages!=0 ? ele?.unreadMessages : <></>}</div>
                        </div>
                      )
                    );
                  })}
                {rooms.filter(room => room.type == 'group').length != 0 &&
                <div className="font-normal ml-2 mt-5" style={{ color: "#8D989F" }}>
                  Groups
                  </div>}
                {rooms &&
                  rooms.map((ele) => {
                    if (ele.id === null) return; //if room does not exist
                    return (
                      ele.type === "group" && (
                        <p
                          onClick={() => {
                            handleRoomChange(ele, false);
                          }}
                          key={ele.name}
                          className={`w-11/12 flex font-extrabold rounded-2xl mb-1 py-2 pl-4 text-sm ${currRoom === ele.name ? "bg-white" : "bg-gray-200"}`}
                          style={{
                            color: "#003d63",
                            border: `${currRoomID === ele.id ? "1px solid #003d63" : ""}`,
                            cursor: "pointer",
                          }}
                        >
                          <div
                            className="w-6 h-6 mr-2 rounded-full"
                            style={{
                              backgroundColor: "white",
                            }}
                          >
                            {ele.dpUrl ? (
                              <Image
                                width={50}
                                height={50}
                                src={ele.dpUrl}
                                className="rounded-full"
                                style={{
                                  backgroundColor: "#0C72B0",
                                }}
                              />
                            ) : (
                              <div className="h-full w-full flex flex-col justify-center">
                                <Image layout="responsive" src={ChatDP} />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">{ele.name}</div>
                          <div className="text-xs ml-auto pr-2 text-xs ml-auto pr-5 flex items-center">{ele?.unreadMessages!=0 ? ele?.unreadMessages : <></>}</div>
                        </p>
                      )
                    );
                  })}
                {rooms.filter(room => room.type == 'project').length != 0 &&
                <div className="font-normal ml-2 mt-5" style={{ color: "#8D989F" }}>
                  Projects
                  </div>}
                {rooms &&
                  rooms.map((ele) => {
                    if (ele.id === null) return; //if room does not exist
                    return (
                      ele.type === "project" && (
                        <div
                          key={ele.id}
                          onClick={() => {
                            handleRoomChange(ele, false);
                          }}
                          className={`w-11/12 flex font-extrabold rounded-2xl mb-1 py-2 pl-4 text-sm ${currRoom === ele.name ? "bg-white" : "bg-gray-200"}`}
                          style={{
                            color: "#003d63",
                            border: `${currRoomID === ele.id ? "1px solid #003d63" : ""}`,
                            cursor: "pointer",
                          }}
                        >
                          <div
                            className="w-6 h-6 z-4 mr-2"
                            style={{
                              backgroundColor: "white",
                              borderRadius: "50%",
                            }}
                          >
                            {ele.dpUrl ? (
                              <div
                                className="h-full w-full flex flex-col justify-center rounded-full relative"
                                style={{
                                  overflow: "hidden",
                                  borderRadius: "50%",
                                }}
                              >
                                <Image
                                  width={50}
                                  height={50}
                                  src={ele.dpUrl}
                                  className="rounded-full"
                                  style={{
                                    backgroundColor: "#0C72B0",
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-full w-full flex flex-col justify-center relative">
                                <Image layout="responsive" objectFit="cover" src={ChatDP} />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">{ele.name}</div>
                          <div className="text-xs ml-auto pr-2 text-xs ml-auto pr-5 flex items-center">{ele?.unreadMessages!=0 ? ele?.unreadMessages : <></>}</div>
                        </div>
                      )
                    );
                  })}
              </div>
            </div>
          ) : (
            !hide && (
              <div className="fixed bg-white h-full w-screen bottom-0 z-40 pt-20 justify-center overflow-y-auto pb-3" style={{"display": isConnected? "": "none"}}>
                <div className={`w-4/5 mx-auto`}>
                  <div
                    onClick={() => {
                      handleRoomChange(announcementRoom as IRoomData, true);
                    }}
                    className={`flex text-xl rounded-xl mb-1 py-2 pl-4 ${currRoom === announcementRoom?.name ? "bg-white" : "bg-gray-200"}`}
                    style={{
                      color: "#003d63",
                      border: `${currRoom === announcementRoom?.name ? "1px solid #003d63" : ""}`,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className="w-8 h-8 mr-4"
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                      }}
                    >
                      <div className="h-full w-full flex flex-col justify-center">
                        <Image layout="responsive" src={ChatDP} />
                      </div>
                    </div>
                    {announcementRoom?.name}
                    <div className="text-xs ml-auto pr-5 flex items-center">{announcementRoom?.unreadMessages!=0 ? `(${announcementRoom?.unreadMessages})` : <></>}</div>
                  </div>
                  <div className="font-normal w-3/5 mt-5" style={{ color: "#8D989F" }}>
                    Workshops
                  </div>
                  {rooms &&
                    rooms.map((ele) => {
                      if (ele.id === null) return; //if room does not exist
                      return (
                        ele.type === "workshop" && (
                          <p
                            key={ele.id}
                            onClick={() => {
                              // console.log(ele.id);
                              handleRoomChange(ele, true);
                            }}
                            className={`flex rounded-xl text-xl mb-2 py-2 pl-4 text-sm ${currRoom === ele.name ? "bg-white" : "bg-gray-200"}`}
                            style={{
                              color: "#003d63",
                              border: `${currRoomID === ele.id ? "1px solid #003d63" : ""}`,
                              cursor: "pointer",
                            }}
                          >
                            <div
                              className="w-8 h-8 mr-4"
                              style={{
                                backgroundColor: "#fff",
                                borderRadius: "50%",
                              }}
                            >
                              {ele.dpUrl ? (
                                <div className="h-full w-full flex flex-col justify-center">
                                  <Image
                                    height={50}
                                    width={50}
                                    src={ele.dpUrl}
                                    className="rounded-full"
                                    style={{
                                      backgroundColor: "#0C72B0",
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="h-full w-full flex flex-col justify-center">
                                  <Image layout="responsive" src={ChatDP} />
                                </div>
                              )}
                            </div>
                            {ele.name}
                            <div className="text-xs ml-auto pr-5 flex items-center">{ele?.unreadMessages !== 0 ? `(${ele?.unreadMessages})` : <></>}</div>
                          </p>
                        )
                      );
                    })}
                  <div className="font-normal w-3/5 mt-5" style={{ color: "#8D989F" }}>
                    Groups
                  </div>
                  {rooms &&
                    rooms.map((ele) => {
                      if (ele.id === null) return; //if room does not exist
                      return (
                        ele.type === "group" && (
                          <p
                            key={ele.id}
                            onClick={() => {
                              // console.log(ele.id);
                              handleRoomChange(ele, true);
                            }}
                            className={`flex rounded-xl text-xl mb-2 py-2 pl-4 text-sm ${currRoom === ele.name ? "bg-white" : "bg-gray-200"}`}
                            style={{
                              color: "#003d63",
                              border: `${currRoomID === ele.id ? "1px solid #003d63" : ""}`,
                              cursor: "pointer",
                            }}
                          >
                            <div
                              className="w-8 h-8 mr-4"
                              style={{
                                backgroundColor: "#fff",
                                borderRadius: "50%",
                              }}
                            >
                              {ele.dpUrl ? (
                                <div className="h-full w-full flex flex-col justify-center">
                                  <Image
                                    height={50}
                                    width={50}
                                    src={ele.dpUrl}
                                    className="rounded-full"
                                    style={{
                                      backgroundColor: "#0C72B0",
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="h-full w-full flex flex-col justify-center">
                                  <Image layout="responsive" src={ChatDP} />
                                </div>
                              )}
                            </div>
                            {ele.name}
                            <div className="text-xs ml-auto pr-5 flex items-center">{ele?.unreadMessages !== 0 ? `(${ele?.unreadMessages})` : <></>}</div>
                          </p>
                        )
                      );
                    })}
                  <div className="font-normal w-3/5 mt-5" style={{ color: "#8D989F" }}>
                    Rooms
                  </div>
                  {rooms &&
                    rooms.map((ele) => {
                      if (ele.id === null) return; //if room does not exist
                      return (
                        ele.type === "project" && (
                          <p
                            key={ele.id}
                            onClick={() => {
                              handleRoomChange(ele, true);
                            }}
                            className={`flex rounded-2xl mb-2 py-2 pl-4 text-xl ${currRoom === ele.name ? "bg-white" : "bg-gray-200"}`}
                            style={{
                              color: "#003d63",
                              border: `${currRoomID === ele.id ? "1px solid #003d63" : ""}`,
                              cursor: "pointer",
                            }}
                          >
                            <div
                              className="w-8 h-8 mr-4"
                              style={{
                                backgroundColor: "transparent",
                                borderRadius: "50%",
                              }}
                            >
                              {ele.dpUrl ? (
                                <div
                                  className="flex flex-col justify-center bg-white rounded-full"
                                  style={{
                                    overflow: "hidden",
                                    borderRadius: "50%",
                                  }}
                                >
                                  <Image
                                    width={30}
                                    height={30}
                                    src={ele.dpUrl}
                                    className="rounded-full"
                                    style={{
                                      backgroundColor: "#0C72B0",
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="h-full w-full flex flex-col justify-center overflow-hidden rounded-full bg-white">
                                  <Image layout="responsive" src={ChatDP} />
                                </div>
                              )}
                            </div>
                            {ele.name}
                            <div className="text-xs ml-auto pr-5 flex items-center">{ele?.unreadMessages !== 0 ? `(${ele?.unreadMessages})` : <></>}</div>
                          </p>
                        )
                      );
                    })}
                </div>
              </div>
            )
          )}

          {/* CHAT PART */}
          {screenWidth >= 768 ? (
            <div className="flex-1 bg-gray-100 flex flex-col sm:w-full">
              {currRoomID && (
                <div className="bg-white flex w-full py-3 my-auto">
                  <div
                    className="w-8 h-8 mr-2 ml-6 py-auto object-fill rounded-xl my-auto"
                    // style={{backgroundColor: "#0C72B0"}}
                  >
                    {currRoomImage ? (
                      <div className="m">
                        <Image
                          height={50}
                          width={50}
                          src={currRoomImage}
                          className="rounded-full"
                          style={{
                            backgroundColor: "#0C72B0",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center align-center">
                        <Image src={ChatDP} />
                      </div>
                    )}
                  </div>
                  <div className="font-bold h-fit text-xl" style={{ color: "#0C72B0" }}>
                    {currRoom}
                  </div>
                </div>
              )}
              {/* <p className="whitespace-pre-wrap">
                                            {msg.message.split(/\s+/g).map(word => word.match(URL_REGEX) ? <><a href={word} className="text-blue-500 underline" target="_blank">{word}</a>{" "}</> : word + " ")}
                                        </p> */}
              <div className="overflow-auto h-screen overflow-x-hidden">
                {messages?.map((msg, idx, array) => {
                  const date = unixToHumanReadable(msg.timestamp);
                  const whiteRect = (idx + 1 < array.length && array[idx + 1].sentFrom.id !== msg.sentFrom.id) || idx == array.length - 1;
                  const user = msg.sentFrom.id === authUser?.id;
                  const reply = (msg.replyTo != null) ? msg.replyTo: null;
                  return (
                    <div className="pl-7 mt-2" key={msg.timestamp}>
                      {((idx > 0 && array[idx - 1].sentFrom.id !== msg.sentFrom.id) || idx == 0) && (
                        <p
                          className="text-gray-500 text-xs pl-10 w-full"
                          style={{
                            textAlign: `${user ? "right" : "left"}`,
                          }}
                        >
                          {msg.sentFrom.name} | {date}
                        </p>
                      )}

                      <div className={`flex ${reply && user ? "flex-col" : ""}`}>
                        {whiteRect && msg.sentFrom.id !== authUser?.id && (
                          <div className="w-6 h-6 bg-white mr-2 mt-auto rounded">
                            <Image src={ChatDP} />
                          </div>
                        )}

                        {reply && user && <div className="flex w-full"><GetRepliedText msgID={reply.id} user={user} space={!whiteRect} /></div>}
                        {reply && !user && (
                          <div className="flex flex-col">
                            <GetRepliedText msgID={reply.id} user={user} space={!whiteRect} />
                            <div className="flex">
                              <RenderMessageWithLinks
                                message={msg.content}
                                user={user}
                                space={!whiteRect}
                                name={msg.sentFrom.name}
                                id={msg.id}
                                text={msg.content}
                                disableStatus={currRoom === "Announcements"}
                                mobile={screenWidth < 768}
                              />
                              <div
                                className="ml-2 cursor-pointer mt-2"
                                style={{ color: "#a9a9a9" }}
                                onClick={() => {
                                  displayReply(msg.id, msg.sentFrom.name, msg.content);
                                }}
                              >
                                <FontAwesomeIcon icon={faReply} />
                              </div>
                            </div>
                          </div>
                        )}
                        {(!reply || user) && (
                          <>
                            <RenderMessageWithLinks
                              message={msg.content}
                              user={user}
                              space={!whiteRect}
                              name={msg.sentFrom.name}
                              id={msg.id}
                              text={msg.content}
                              disableStatus={currRoom === "Announcements"}
                              mobile={screenWidth < 768}
                            />
                            {!user && (
                              <div
                                className="ml-2 cursor-pointer mt-2"
                                style={{ color: "#a9a9a9" }}
                                onClick={() => {
                                  displayReply(msg.id, msg.sentFrom.name, msg.content);
                                }}
                              >
                                <FontAwesomeIcon icon={faReply} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {((idx+1)<messages.length && msg.timestamp < roomLastSeen && messages[idx+1].timestamp > roomLastSeen) && 
                      <div className="text-center text-xs">
                          Unread messages
                      </div>}
                    </div>
                  );
                })}
                <div ref={lastMessageRef}></div>
              </div>
              <div className="flex flex-col bg-white px-8 rounded-2xl mx-6 w-100">
                {replyingMessageID && (
                  <div className="flex mt-2">
                    <div className="w-fit text-sm" style={{ color: "#8D989F" }}>
                      Replying to {replyingName.split(" ")[0]}
                    </div>
                    <div className="ml-auto cursor-pointer">
                      <FontAwesomeIcon
                        icon={faXmark}
                        onClick={() => {
                          setReplyText("");
                          setReplyingName("");
                          setReplyingMessageID(null);
                        }}
                      />
                    </div>
                  </div>
                )}
                {replyText && <div className="block w-fit">{truncateString(replyText)}</div>}
              </div>
              {currRoom !== "" ? (
                <div className="flex rounded-xl mx-2 border-2 mb-2 md:mb-2 mt-2 md:mx-4 bg-white max-h-16">
                  <textarea
                    className="w-full px-3 py-4 pl-5 outline-none bg-white rounded-xl"
                    placeholder="Send message"
                    style={{ resize: "none", overflow: "hidden" }}
                    value={currMsg}
                    onChange={(e) => {
                      setCurrMsg(e.target.value);
                    }}
                  />
                  <div
                    className="bg-white cursor-pointer h-full pt-2 pb-2"
                    onClick={() => {
                      handleSend();
                    }}
                  >
                    <Image src={Send} height={40} width={40} />
                  </div>
                </div>
              ) : (
                <div className="mt-2"></div>
              )}
            </div>
          ) : (
            <div className={`bg-gray-100 w-screen flex flex-col h-dvh`}>
              <div className="border bg-white flex fixed w-full top-12 z-30 align-center py-5 my-auto">
                <div
                  className="flex w-9 h-9 mr-2 ml-6 rounded-full border"
                  // style={{backgroundColor: "#0C72B0"}}
                >
                  {currRoomImage ? (
                    <Image
                      height={50}
                      width={50}
                      src={currRoomImage}
                      className="rounded-full"
                      style={{
                        backgroundColor: "#0C72B0",
                      }}
                    />
                  ) : (
                    <Image src={ChatDP} />
                  )}
                </div>
                <div className="font-bold text-xl py-auto" style={{ color: "#0C72B0" }}>
                  {currRoom}
                </div>
                {hide && (
                  <div
                    className="font-bold text-xl ml-auto mr-3"
                    style={{ color: "#0C72B0" }}
                    onClick={() => {
                      setHide(false);
                    }}
                  >
                    <FontAwesomeIcon size="xl" icon={faLeftLong} />
                  </div>
                )}
              </div>
              <div className={`pt-32 ${hide ? "overflow-auto" : "overflow-auto"} h-screen pr-2`}>
                {messages?.map((msg, idx, array) => {
                  const date = unixToHumanReadable(msg.timestamp);
                  const whiteRect = (idx + 1 < array.length && array[idx + 1].sentFrom.id !== msg.sentFrom.id) || idx == array.length - 1;
                  const user = msg.sentFrom.id === authUser?.id;
                  const reply = msg.replyTo?.id;
                  return (
                    <div className="pl-7 mt-2" key={msg.timestamp}>
                      {((idx > 0 && array[idx - 1].sentFrom.id !== msg.sentFrom.id) || idx == 0) && (
                        <p
                          className="text-gray-500 text-xs pl-10 w-full"
                          style={{
                            textAlign: `${user ? "right" : "left"}`,
                          }}
                        >
                          {msg.sentFrom.name} | {date}
                        </p>
                      )}
                      {/* <p className="whitespace-pre-wrap">
                                            {msg.message.split(/\s+/g).map(word => word.match(URL_REGEX) ? <><a href={word} className="text-blue-500 underline" target="_blank">{word}</a>{" "}</> : word + " ")}
                                        </p> */}
                      <div className={`flex ${reply && user ? "flex-col" : ""}`}>
                        {whiteRect && msg.sentFrom.id !== authUser?.id && (
                          <div className="w-6 h-6 bg-white mr-2 mt-auto rounded">
                            <Image src={ChatDP} />
                          </div>
                        )}

                        {reply && user && <div className="flex w-fit"><GetRepliedText msgID={reply} user={user} space={!whiteRect} /></div>}
                        {reply && !user && (
                          <div className="flex flex-col">
                            <GetRepliedText msgID={reply} user={user} space={!whiteRect} />
                            <div className="flex">
                              <RenderMessageWithLinks
                                message={msg.content}
                                user={user}
                                space={!whiteRect}
                                name={msg.sentFrom.name}
                                id={msg.id}
                                text={msg.content}
                                disableStatus={currRoom === "Announcements"}
                                mobile={screenWidth < 768}
                              />
                              <div
                                className="ml-2 cursor-pointer mt-2"
                                style={{ color: "#a9a9a9" }}
                                onClick={() => {
                                  displayReply(msg.id, msg.sentFrom.name, msg.content);
                                }}
                              >
                                <FontAwesomeIcon icon={faReply} />
                              </div>
                            </div>
                          </div>
                        )}
                        {(!reply || user) && (
                          <>
                            <RenderMessageWithLinks
                              message={msg.content}
                              user={user}
                              space={!whiteRect}
                              name={msg.sentFrom.name}
                              id={msg.id}
                              text={msg.content}
                              disableStatus={currRoom === "Announcements"}
                              mobile={screenWidth < 768}
                            />
                            {!user && (
                              <div
                                className="ml-2 cursor-pointer mt-2"
                                style={{ color: "#a9a9a9" }}
                                onClick={() => {
                                  displayReply(msg.id, msg.sentFrom.name, msg.content);
                                }}
                              >
                                <FontAwesomeIcon icon={faReply} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {((idx+1)<messages.length && msg.timestamp < roomLastSeen && messages[idx+1].timestamp > roomLastSeen) && 
                      <div className="text-center text-xs">
                          Unread messages
                      </div>}
                    </div>
                  );
                })}
                <div ref={lastMessageRef}></div>
              </div>
              <div className="flex flex-col bg-white px-8 rounded-2xl mx-6 w-100">
                {replyingMessageID && (
                  <div className="flex mt-2">
                    <div className="w-fit text-sm" style={{ color: "#8D989F" }}>
                      Replying to {replyingName.split(" ")[0]}
                    </div>
                    <div className="ml-auto">
                      <FontAwesomeIcon
                        icon={faXmark}
                        onClick={() => {
                          setReplyText("");
                          setReplyingName("");
                          setReplyingMessageID(null);
                        }}
                      />
                    </div>
                  </div>
                )}
                {replyText && <div className="block w-fit">{truncateString(replyText)}</div>}
              </div>
              {currRoom !== "" ? (
                <div className="max-h-14 flex rounded-xl mx-2 overflow-hidden border-2 mb-2 md:mb-2 mt-2 md:mx-4 bg-white">
                  <textarea
                    className="w-full px-3 py-4 pl-5 outline-none bg-white rounded-xl"
                    placeholder="Send message"
                    style={{ resize: "none", overflow: "hidden" }}
                    value={currMsg}
                    onChange={(e) => {
                      setCurrMsg(e.target.value);
                    }}
                  />
                  <div
                    className="bg-white cursor-pointer my-auto mr-2"
                    onClick={() => {
                      handleSend();
                    }}
                    style={{ marginTop: "1%" }}
                  >
                    <Image src={Send} height={40} width={40} />
                  </div>
                </div>
              ) : (
                <div className="mt-2"></div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Channels;
