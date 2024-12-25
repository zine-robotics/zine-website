import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Script from "next/script";
import img1 from "../../images/blog/algo/algo/image1.jpg"

import smartgrid from "../../images/project/new/abcd.jpg"
import astuti from "../../images/project/new/agstuti.jpg";
import bci from "../../images/project/new/bci.jpg";
import exoskeleton from "../../images/project/new/exoskeleton.jpg";
import gait from "../../images/project/new/gait.jpg";
import handgesture from "../../images/project/new/hand-gesture.jpg";
import hci from "../../images/project/new/hci.jpg";
import highvoltage from "../../images/project/new/highvoltage.jpg";
import home from "../../images/project/new/home.jpg";
import xyz from "../../images/project/new/IMG_2641.webp";
import pros from "../../images/project/new/prosthetics.jpeg";
import quadcopter from "../../images/project/new/quadcopter.jpg";
import wheelchair from "../../images/project/new/wheelchair.jpg";
import Multi from "../../images/project/new/multi.jpeg";
import actroid from "../../images/project/new/actroid.jpeg";
import biped from "../../images/project/new/biped.jpg";
import vtol from "../../images/project/new/vtol.jpeg";
import isro from "../../images/comp_isro.webp";
// Use mobile responsive navbar animation for projects section.

const Projects = () => {
  const [Hide, setHide] = useState(false);
  const [scroll, setscroll] = useState(false);
  const [content, setContent] = useState("");
  const [heading, setHeading] = useState("");
  const [para, setPara] = useState("");
  const [tm, setTm] = useState("");
  const [extracontent, setExtracontent] = useState("");
  const [showMore1, setShowMore1] = useState(false);
  const [showMore2, setShowMore2] = useState(false);
  const [showMore3, setShowMore3] = useState(false);
  const [showMore4, setShowMore4] = useState(false);
  const [showMore5, setShowMore5] = useState(false);
  const [showMore6, setShowMore6] = useState(false);
  const [showMore7, setShowMore7] = useState(false);
  const [showMore8, setShowMore8] = useState(false);
  const [showMore9, setShowMore9] = useState(false);
  const [showMore10, setShowMore10] = useState(false);
  const [showMore11, setShowMore11] = useState(false);
  const [showMore12, setShowMore12] = useState(false);
  const [showMore13, setShowMore13] = useState(false);
  const [showMore14, setShowMore14] = useState(false);
  const [showMore15, setShowMore15] = useState(false);
  const [showMore16, setShowMore16] = useState(false);
  const [showMore17, setShowMore17] = useState(false);
  let scrollpos = 0;

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => {
      window.removeEventListener("scroll", listenToScroll);
    };
  }, []);

  const listenToScroll = () => {
    const currentScrollPos = document.documentElement.scrollTop;
    const visible = scrollpos < currentScrollPos && scrollpos > 30;
    scrollpos = currentScrollPos;
    setscroll(visible);
  };

  const linebreak = '\n';
  const bcitext = "Analyzing the signals from patients' brain, mapping and using the data for effective treatment, Pattern Establishment for benign and malignant neurological disease patients in different frequency ranges. Research was in collaboration with State Health care Hospital (SMS), Jaipur";
  const bcivideo = "https://youtu.be/mBVjJCUecgU"
  const intelligenttext = "Our system records and analyzes the electrical parameters and provides an option for optimized scheduling for electrical appliances. The system provides a real time access to the load parameters and there is a centralized data monitoring system which generates a report and alerts the user to reduce the load consumption on exceeding the proposed usage limit as determined by the predicted load. A smart control feature is integrated which enables control of all the appliances using a handheld device.The system also logs the power consumption so that the discrepancy in billing can be cut down.";
  const intelligentprogress = "Progress: The following tasks have been done and integrated: Retrieval of data from homes. Optimization on Cloud. Scheduling. Remote Access to devices at homes. Penalty factor. Things to be done: Integration of Game Theory";
  const wheelchairtext = "We have achieved the objective of categorizing patients (neurologic disease) using brain signals with a medical team at SMS Hospital, Jaipur. Results have been submitted in IEEE xplore. We have also developed an algorithm for ANN to get enhanced classification of terminal medical disease. Results have been submitted in Springer Journal. Most of the software part has been simulated by us. Now to extend our project towards hardware we are going to construct a fully autonomous wheelchair for completely paralyzed people using BCI.";
  const quad1 = "Our idea is to design a quadcopter which when left in unknown terrains can give us a live video stream on our laptops and also store it according to the need. It is automated so that it can judge its surroundings and perform various actions/maneuverers by determining its position and environment. It can also be used to autonomously model unknown environments using distance measuring sensors and decide its path accordingly."
  const quad2 = "2. Automate it so that it can act by judging its surroundings, perform various actions/maneuverers by determining its position and environment. "
  const quad3 = "3. These quad copters can be sent in evacuated buildings and in bio-chemical factories to act as first respondents, and call for cajole by manoeuvring either autonomously or controlling it through Brain. "
  const quad4 = "4. It can also be used to autonomously model unknown environments using distance measuring sensors and decide its path accordingly."

  const gaittext = "This research project aims to develop a comprehensive biomechanical integrated software tool for measurement and analysis of postural defects in walking gait. It involves applying Image Processing and Machine Learning techniques. The project has been funded by DST (Department of Science and Technology), which comes within the Ministry of Science and Technology, India.";
  const gait1 = "Awards and Recognition: Two papers published, one of which received Best Paper Award.";
  const gaitvideo = "https://youtu.be/d_mkXAMy8lw"

  const prostheticstext = "Making an artificial arm for the amputed and maimed persons controlled by muscle signals to grab and lift objects."
  const pros1 = "Recent Development:     Extremely useful project for physically disabled. Developed a working model successfully. Currently working on the signal extraction from muscles."

  const hcitext = "The scope of our project and the applications in the real world are huge. With this project our aim is to turn the projection of a laptop into an interactive environment, with multi touch features and to have a custom stylus supporting multi touch features (upto 4 distinct points simultaneously). Finger tracking is also applied to achieve gesture recognition. Head tracking is also achieved here."
  const hci1 = "The future scope of our project would be to introduce security systems which make use of gestures, controlling the bot via hand and facial gestures, transcribing sign language into text and to make use of smart TVs."
  const hci2 = "1. Turning the projection of a laptop into an interactive environment, with multi touch features. "
  const hci3 = "2. Turning the LCD screen of a laptop into a touchscreen with the help of a custom stylus, again supporting multi touch features (upto 4 distinct points simultaneously). "
  const hci4 = "3. Finger Tracking for achieving Gesture Recognition for incorporating it with various applications. It would be a giant leap towards augmented reality and controlling computers simply by the wave of our hands. "
  const hci5 = "4. Head Tracking which can find use in Game Development or creating other Simulation Environments. Finger Tracking and Gesture Recognition alone can find use in various other fields. "
  const hci6 = "As far as the future scope of our project is concerned, we would be extending our project to achieve the following: 1. Security Systems which make use of gestures 2. Controlling Robots via hand and facial gestures 3. Transcribing Sign Language into Text 4. Smart TVs"

  const multitext = "The purpose of this project is to implement switch-mode control in a multi-actuator circuit and demonstrate the improvement in efficiency over a traditional hydraulic system with throttling valve control which results in improved energy and efficiency. This idea utilizes the input from both the tank and the pump. Using varying amounts of fluid coming from both sources, we can create various pressure and flow values for different actuators and in the process increase the efficiency of the system by operating the actuators at their rated pressures and flows.This newer technology after implementation will reduce losses in hydraulic systems that depend on multiple actuators to function."

  const suntext = "Energy Efficiency-Microcontroller based Android App controlled Solar Tracking System enables the solar panels to track the sun for maximum energy and the power generated is available to the user android based application for manual modifications and control. Using Self Orienting Solar Panels lead to an enhancement of up to 40% in the generated solar power. Dual axis tracking is an additional feature which makes the design work for any season throughout the year thus accounting for the sun’s deviation during winters."

  const robotictext = "This robotic system is manually controlled through a wireless remote. The video and infrared cameras provide live feeds which are transmitted wirelessly. The receiver kept near the operator receives the live feeds and then they are displayed on the screen. The operator can then control the robotic system to repair the broken strands and can also analyze the hotspots. Loose bolts can be tightened by using the assembly mounted for tightening the bolts. This way the system will minimize the human work, increase efficiency and reduce dangers in maintaining and repairing the transmission lines."
  const roboticvideo = "https://youtu.be/fE149b50yYg"

  const exotext = "The main aim of our project is to design a human exoskeleton which can be applied to various uses. For people suffering from muscular motor loss in limbs to some suffering with paraplegia this can be used in their quick rehabilitation and provides enhanced performance as well as assistance to human actions using Functional Electrical Simulation (FES). "
  const exo1 = "This methodology involves the development of the tentative model on 3D modeling software. Then static and dynamic analysis using Hyperworks. Development of the first prototype based on input and output systems. The integration of input and output systems and then integrating with the feedback control."

  const smartgridtext = "Our system is an advanced Power Grid that uses advanced communication networks to achieve following features like sensing and metering technology for incoming and outgoing power, identifying regions where there is a larger need of power and implementing considerable decrease in other regions. It identifies peaks of consumption in a day and optimizes the use of power. It also has automated control and monitoring to detect faults through sensors so that they can be repaired quickly. It prevents electricity theft."
  const smart1 = "sensing and metering technology for incoming and outgoing power"
  const smart2 = "identifies regions where there is larger need of power and implements considerable decrease in other regions"
  const smart3 = "enables consumers to become suppliers by decentralizing sources of power as there are < 1000 Power stations for over millions of consumers"
  const smart4 = "Roof top solar energy generation, energy storage and excess energy selling with optimization of demand."
  const smart5 = "identifies peaks of consumption in a day and optimizes the use of Power"
  const smart6 = ""
  const smart7 = ""
  const handtext = "Our idea is to make computers to understand human language and develop user-friendly human computer interfaces (HCI). Making a computer understand speech, facial expressions and human gestures are some steps towards it thereby making a translation system that can successfully convert this visual gestural language into digital English text or speech."

  const agtext = "The main aim is to achieve autonomous navigation. The robot will further be used in hospitals where in case of an emergency the nearest ICU for the patient will be automatically fetched from a UNIFIED database and will save precious moments. The robot will feature various robotic sciences like Image Processing,etc. The interface with the robot will be via a touch screen . In the future a multiple number of these robots will be in sync with each other to make navigation very simple and efficient, saving a lot of resources and manpower."

  const actroidtext = "We’ve developed an interactive animatronic robot. It’s a low cost actroid with sharp artificial intelligence, highly precise motion, HD vision and speech features that act and behave almost like a real human. It has a human-like face with eyes, nose and lips. It has 2 DOF at its neck. The bot can perform face tracking and detect human faces with its camera powered vision system. Jaws and the neck utilize a high powered DC motor with a tuning algorithm. It uses deep learning and computer vision which can decipher faces and real world objects. For the articulation and auditory abilities a CNN in coordination with a mic capable of listening to users questions and then processing it via various algorithms is used."
  const actroidvideo = "https://youtu.be/hCTIxSW3q7o"

  const bipedtext = "It is a bipedal robot, an anthropomorphic robot which imitates the human gait, autonomous one with custom made 3D printed parts. High precision servo motors are used for actuating the joints. It uses sensors and arduino nano for measuring stability and posture. It uses rigid body dynamics for motion control and gyroscopes for state estimation and stability. It also has its functioning in rough terrains and military operations."
  const bipedvideo = "https://youtu.be/TQZZt2NlgYY"

  const vtoltext = "It is a Vertical Takeoff and Landing aircraft."
  const vtolvideo = "https://youtu.be/rb-q3BTk5Vk"

  const rovertext = "It is a lunar rover designed as per the requirements of the IRoC-U 2024 challenge by ISRO. The rover can autonomously navigate through a surface containing craters and obstacles, and can also perform autonomous sample collection via the robotic arm. The rover is equipped with a stereo-camera for navigation and an Nvidia Jetson Xavier NX for processing. The navigation is done using Visual SLAM, and the software was developed using ROS2."
    return(
      <div className="text-black bg-white w-full h-full">
        <div className="py-20">

          {/* <div className="shadower grid mt-8 grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">VTOL</h1>
              <Image src={vtol} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">VTOL</h1>
              <br />
              <p className="inline-block md:hidden">{vtoltext}</p>
              <p className="hidden md:inline-block">{vtoltext}</p>

              <div className="cursor-pointer mt-4">
                <Link href={vtolvideo}><FontAwesomeIcon icon={faYoutube} className="text-red-600 hover:text-red-500 mr-4" size="2x" /></Link>
              </div>
              <h1 className="pt-8">Team Members: Karsh Tharyani, Vishakha Tyagi, Jatin Verma</h1>
            </div>
          </div> */}

          <div className="shadower mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Lunar Rover</h1>
              <Image src={isro} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Lunar Rover</h1>
              <p className="inline-block md:hidden">{showMore16 ? rovertext : rovertext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block mt-8">{rovertext}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore16(!showMore16)}>{showMore16 ? `Show Less` : `Show More`}</button>
              <p className="pt-8">Team Members: Batch 2025 & Batch 2026</p>
            </div>
          </div>
          
          <div className="shadower mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 inline-block md:hidden my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Biped</h1>
              <Image src={biped} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Biped</h1>
              <p className="inline-block md:hidden">{showMore16 ? bipedtext : bipedtext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block mt-8">{bipedtext}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore16(!showMore16)}>{showMore16 ? `Show Less` : `Show More`}</button>
              <div className="cursor-pointer mt-4">
                <Link href={bipedvideo}><FontAwesomeIcon icon={faYoutube as IconProp} className="text-red-600 hover:text-red-500 mr-4" size="2x" /></Link>
              </div>
              <p className="pt-8">Team Members: Devang Darode, Karsh Tharyani, Ayush Jhalani</p>
            </div>
            <div className="col-span-1 my-auto hidden md:inline-block">
              <Image src={biped} className="rounded-lg"/>
            </div>
          </div>

          <div className="shadower mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">BCI (Brain Computing Interface)</h1>
              <Image src={bci} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">BCI (Brain Computing Interface)</h1>
              <p className="inline-block md:hidden">{showMore1 ? bcitext : bcitext.substring(0, 200)+`...`}</p>
              <p className="hidden md:inline-block">{bcitext}</p>
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore1(!showMore1)}>{showMore1 ? `Show Less` : `Show More`}</button>
              <div className="cursor-pointer mt-4">
                <Link href={bcivideo}><FontAwesomeIcon icon={faYoutube as IconProp} className="text-red-600 hover:text-red-500 mr-4" size="2x" /></Link>
              </div>
              <h1 className="pt-8">Team Members: Saurab Aggarwal Bhanu Pratap Singh Rawat</h1>
            </div>
          </div>

          <div className="shadower mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 inline-block md:hidden my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Intelligent Home Energy Management System</h1>
              <Image src={home} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Intelligent Home Energy Management System</h1>
              <p className="inline-block md:hidden">{showMore2 ? intelligenttext : intelligenttext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block">{intelligenttext}</p>
              <p>{showMore2 ? intelligentprogress : ``}</p>
              <p className="hidden md:inline-block mt-8">{intelligentprogress}</p>
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore2(!showMore2)}>{showMore2 ? `Show Less` : `Show More`}</button>
              <h1 className="pt-8">Team Members: Akash Shah, Anirudha Kumar, Rajat Arya</h1>
            </div>
            <div className="col-span-1 my-auto hidden md:inline-block">
              <Image src={home} className="rounded-lg"/>
            </div>
          </div>

          <div className="shadower grid mt-8 grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Automotive Wheelchair</h1>
              <Image src={wheelchair} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Automotive Wheelchair</h1>
              <p className="inline-block md:hidden">{showMore3 ? wheelchairtext : wheelchairtext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block">{wheelchairtext}</p>
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore3(!showMore3)}>{showMore3 ? `Show Less` : `Show More`}</button>
              

 
              <h1 className="pt-8">Team Members: Akash Singh, Anirudha Kumar, Rajat Arya</h1>
            </div>
          </div>

          <div className="shadower mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 inline-block md:hidden my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Autonomous Quadcopter</h1>
              <Image src={quadcopter} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Autonomous Quadcopter</h1>
              <p className="inline-block md:hidden">{showMore4 ? quad1 : quad1.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block">{quad1}</p>
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore4(!showMore4)}>{showMore4 ? `Show Less` : `Show More`}</button>
              <h1 className="pt-8">Team Members: Akash Shah, Anirudha Kumar, Rajat Arya</h1>
            </div>
            <div className="col-span-1 my-auto hidden md:inline-block">
              <Image src={quadcopter} className="rounded-lg"/>
            </div>
          </div>

          <div className="shadower grid mt-8 grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Gait Analysis</h1>
              <Image src={gait} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Gait Analysis</h1>
              <p className="inline-block md:hidden">{showMore5 ? gaittext : gaittext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block">{gaittext}</p>
              <p>{showMore5 ? gait1 : ``}</p>
              <p className="hidden md:inline-block mt-8">{gait1}</p>
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore5(!showMore5)}>{showMore5 ? `Show Less` : `Show More`}</button>

              <div className="cursor-pointer mt-4">
                <Link href={gaitvideo}><FontAwesomeIcon icon={faYoutube as IconProp} className="text-red-600 hover:text-red-500 mr-4" size="2x" /></Link>
              </div>
              <h1 className="pt-4">Team Members: Anshul Mittal, Kanika Gupta</h1>
            </div>
          </div>

          <div className="shadower mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 inline-block md:hidden my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Prosthetics Arm</h1>
              <Image src={pros} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Prosthetics Arm</h1>
              <p className="inline-block md:hidden">{showMore6 ? prostheticstext : prostheticstext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block">{prostheticstext}</p>
              <p>{showMore6 ? pros1 : ``}</p>
              <p className="hidden md:inline-block mt-8">{pros1}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore6(!showMore6)}>{showMore6 ? `Show Less` : `Show More`}</button>
            </div>
            <div className="col-span-1 my-auto hidden md:inline-block">
              <Image src={pros} className="rounded-lg"/>
            </div>
          </div>

          <div className="shadower grid mt-8 grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Human Computer Interface</h1>
              <Image src={hci} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Human Computer Interface</h1>
              <p className="inline-block md:hidden">{showMore7 ? hcitext : hcitext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block">{hcitext}</p>
              <p>{showMore5 ? hci1 : ``}</p>
              <p className="hidden md:inline-block mt-4">{hci1}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore7(!showMore7)}>{showMore7 ? `Show Less` : `Show More`}</button>
              <h1 className="pt-8">Team Members: Anshul Mittal, Maitreyee Mehta, Mihika Gupta, Sharad Garg</h1>
            </div>
          </div>

          <div className="shadower mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 inline-block md:hidden my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Multi Actuator Switch Mode Hydraulic System</h1>
              <Image src={Multi} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Multi Actuator Switch Mode Hydraulic System</h1>
              <p className="inline-block md:hidden">{showMore8 ? multitext : multitext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block mt-8">{multitext}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore8(!showMore8)}>{showMore8 ? `Show Less` : `Show More`}</button>
              <p className="pt-8">Team Members: Paresh Anand, Piyush Chauhan, Sharad Garg</p>
            </div>
            <div className="col-span-1 my-auto hidden md:inline-block">
              <Image src={Multi} className="rounded-lg"/>
            </div>
          </div>

          <div className="shadower grid mt-8 grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Sun Tracker</h1>
              <Image src={xyz} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Sun Tracker</h1>
              <p className="inline-block md:hidden">{showMore9 ? suntext : suntext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block mt-8">{suntext}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore9(!showMore9)}>{showMore9 ? `Show Less` : `Show More`}</button>
              <h1 className="pt-8">Team Members: Sharad Garg, Anshul Mittal</h1>
            </div>
          </div>

          <div className="shadower mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 inline-block md:hidden my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Robotic Technology for High Voltage Line Inspection and Repair</h1>
              <Image src={highvoltage} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Robotic Technology for High Voltage Line Inspection and Repair</h1>
              <p className="inline-block md:hidden">{showMore10 ? robotictext : robotictext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block mt-8">{robotictext}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore10(!showMore10)}>{showMore10 ? `Show Less` : `Show More`}</button>
              <div className="cursor-pointer mt-4">
                <Link href={roboticvideo}><FontAwesomeIcon icon={faYoutube as IconProp} className="text-red-600 hover:text-red-500 mr-4" size="2x" /></Link>
              </div>
              <p className="pt-8">Team Members: Akash Shah, Akshay Kumar, Anirudha Kumar, Anshul Mittal, Rajat Arya, Sharad Garg</p>
            </div>
            <div className="col-span-1 my-auto hidden md:inline-block">
              <Image src={highvoltage} className="rounded-lg"/>
            </div>
          </div>

          <div className="shadower grid mt-8 grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Exoskeleton</h1>
              <Image src={exoskeleton} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Exoskeleton</h1>
              <p className="inline-block md:hidden">{showMore11 ? exotext : exotext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block mt-8">{exotext}</p>
              <p>{showMore11 ? exo1 : ``}</p>
              <p className="hidden md:inline-block">{exo1}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore11(!showMore11)}>{showMore11 ? `Show Less` : `Show More`}</button>
              <h1 className="pt-8">Team Members: Devang Darode, Sarthak Jain, Ayush Jhalani, Akshay Kumar</h1>
            </div>
          </div>

          <div className="shadower mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 inline-block md:hidden my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Smart Grid</h1>
              <Image src={smartgrid} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Smart Grid</h1>
              <p className="inline-block md:hidden">{showMore12 ? smartgridtext : smartgridtext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block mt-8">{smartgridtext}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore12(!showMore12)}>{showMore12 ? `Show Less` : `Show More`}</button>
              <p className="pt-8">Team Members: Jatin Verma, Akshay Kumar</p>
            </div>
            <div className="col-span-1 my-auto hidden md:inline-block">
              <Image src={smartgrid} className="rounded-lg"/>
            </div>
          </div>

          <div className="shadower grid mt-8 grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Hand Gesture Recognition</h1>
              <Image src={handgesture} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Hand Gesture Recognition</h1>
              <p className="inline-block md:hidden">{showMore13 ? handtext : handtext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block mt-8">{handtext}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore13(!showMore13)}>{showMore13 ? `Show Less` : `Show More`}</button>
              <h1 className="pt-8">Team Members: Karsh Tharyani, Vishakha Tyagi, Jatin Verma</h1>
            </div>
          </div>

          <div className="shadower mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 inline-block md:hidden my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">A.G.A.S.T.U.T.I</h1>
              <Image src={astuti} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">A.G.A.S.T.U.T.I</h1>
              <p className="inline-block md:hidden">{showMore14 ? agtext : agtext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block mt-8">{agtext}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore14(!showMore14)}>{showMore14 ? `Show Less` : `Show More`}</button>
              <p className="pt-8">Team Members: Devang Darode, Karsh Tharyani, Ayush Jhalani</p>
            </div>
            <div className="col-span-1 my-auto hidden md:inline-block">
              <Image src={astuti} className="rounded-lg"/>
            </div>
          </div>

          <div className="shadower mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-32 bg-gray-100 shadow-xl rounded-xl py-8 px-8 lg:px-16 hover:bg-gray-300 transition duration-500 ease-in-out">
            <div className="col-span-1 my-auto">
              <h1 className="inline-block md:hidden text-2xl font-bold mb-4">Actroid</h1>
              <Image src={actroid} className="rounded-lg"/>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold pb-4 hidden md:inline-block">Actroid</h1>
              <p className="inline-block md:hidden">{showMore15 ? actroidtext : actroidtext.substring(0, 150)+`...`}</p>
              <p className="hidden md:inline-block mt-8">{actroidtext}</p>
           
              <button className="btn inline-block md:hidden font-bold" onClick={() => setShowMore15(!showMore15)}>{showMore15 ? `Show Less` : `Show More`}</button>
              <div className="cursor-pointer mt-4">
                <Link href={actroidvideo}><FontAwesomeIcon icon={faYoutube as IconProp} className="text-red-600 hover:text-red-500 mr-4" size="2x" /></Link>
              </div>
              <h1 className="pt-8">Team Members: Karsh Tharyani, Vishakha Tyagi, Jatin Verma</h1>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Projects;