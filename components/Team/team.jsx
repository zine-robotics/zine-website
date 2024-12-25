import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFacebook, faTwitter, faInstagram, faLinkedin, faGithub,  faWordpress} from '@fortawesome/free-brands-svg-icons';
import team from "../../images/team.jpeg"
import RajeshSir from "../../images/rajeshsir.webp"
import { founders, year2024, year2025, year2026,year2027 } from "../../constants/members";



const Team = () => {
    return(
      <div className="text-black bg-white justify-center pb-16">
        <div className="keen-slider__slide number-slide12 h-60 md:h-100 lg:h-130 mb-4">
          <div className="absolute left-8 pl-16 text-xl md:text-3xl lg:text-5xl">
            <p>Team</p>
          </div>
        </div>
        <h1 className="pt-8 text-4xl text-center px-12 lg:px-24">Our Founders: The Roots Of Our Tree</h1>
        <div className="pt-16 grid grid-cols-1 lg:grid-cols-2 px-12 lg:px-24">
          <div className="col-span-1 w-48 member-hover lg:w-80 justify-self-center">
            <Image className="rounded-full" src={RajeshSir} placeholder="blur"/>
            <div className="text-center grid mt-4 justify-evenly grid-cols-3">
              <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href="https://drrajeshkumar.wordpress.com/"><FontAwesomeIcon icon={faWordpress} className="text-black mr-4" size="2x" /></Link></div>
              <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href="https://www.linkedin.com/in/drrajeshkumar/"><FontAwesomeIcon icon={faLinkedin} className="text-blue-600 mr-4" size="2x" /></Link></div>
              <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href="https://www.facebook.com/rkumar.ee"><FontAwesomeIcon icon={faFacebook} className="text-blue-800 mr-4" size="2x" /></Link></div>
            </div>
          </div>
          <div className="col-span-1 my-auto">
            <h1 className="text-2xl text-center font-bold">DR. RAJESH KUMAR</h1>
            <p className="text-center">Fellow IET (UK), Fellow IETE, Fellow IE (India),  SMIEEE (USA), LMCSI,  LMISTE</p>
            <p className="text-center">Professor, Department of Electrical Engineering</p>
            <p className="text-center">Malaviya National Institute of Technology, Jaipur</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 pt-16 px-12 lg:px-24">
        {founders.map((item, index) => (
          <div key={index} className="col-span-1">
            <h1 className="text-black py-2 font-nunito text-center">
              <div className="w-48 mx-auto member-hover">
                <Image className="rounded-full" src={item.image} placeholder="blur"/>
              </div>
              <p className="text-center text-xl font-bold">{item.name}</p>
              <p className="text-center text-md text-gray-600">{item.desc}</p>
              <div className="text-center">
              <div className="grid grid-flow-col auto-cols-auto w-64 mt-2 mx-auto justify-evenly px-8">
                {item.github !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.facebook}><FontAwesomeIcon icon={faGithub} className="text-black mr-4" size="2x" /></Link></div> : <></>}
                {item.linkedin !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.linkedin}><FontAwesomeIcon icon={faLinkedin} className="text-blue-600 mr-4" size="2x" /></Link></div> : <></>}
                {item.instagram !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.twitter}><FontAwesomeIcon icon={faInstagram} className="text-red-500 mr-4" size="2x" /></Link></div> : <></>}
                {item.facebook !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.facebook}><FontAwesomeIcon icon={faFacebook} className="text-blue-800 mr-4" size="2x" /></Link></div> : <></>}
              </div>
              </div>
            </h1>
          </div>
        ))}
        </div>

        { <h1 className="pt-12 text-center font-bold text-4xl px-12 lg:px-24">FINAL YEAR</h1> }
         { <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 pt-16 px-12 lg:px-24">
        {
        year2025.map((item, index) => (
          <div key={index} className="col-span-1">
            <h1 className="text-black py-2 font-nunito text-center">
              <div className="w-48 mx-auto member-hover">
                <Image className="rounded-full" src={item.image} placeholder="blur"></Image>
              </div>
              <p className="text-center text-xl font-bold">{item.name}</p>
              <p className="text-center text-gray-600 text-md">{item.desc}</p>
              <div className="text-center">
              <div className="grid grid-flow-col auto-cols-auto mt-2 w-64 mx-auto">
                {item.github !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.facebook}><FontAwesomeIcon icon={faGithub} className="text-black mr-4" size="2x" /></Link></div> : <></>}
                {item.linkedin !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.linkedin}><FontAwesomeIcon icon={faLinkedin} className="text-blue-600 mr-4" size="2x" /></Link></div> : <></>}
                {item.instagram !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.twitter}><FontAwesomeIcon icon={faInstagram} className="text-red-500 mr-4" size="2x" /></Link></div> : <></>}
                {item.facebook !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.facebook}><FontAwesomeIcon icon={faFacebook} className="text-blue-800 mr-4" size="2x" /></Link></div> : <></>}
              </div>
              </div>
            </h1>
          </div>
        ))
        }
        </div> }
      
        {<h1 className="pt-12 text-center font-bold text-4xl px-12 lg:px-24">THIRD YEAR</h1>}

        {<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 pt-16 px-12 lg:px-24">
        {year2026.map((item, index) => (
          <div key={index} className="col-span-1">
            <h1 className="text-black py-2 font-nunito text-center">
              <div className="w-48 mx-auto member-hover">
                <Image className="rounded-full" src={item.image} placeholder="blur"></Image>
              </div>
              <p className="text-center text-xl font-bold">{item.name}</p>
              <p className="text-center text-md text-gray-600">{item.desc}</p>
              <div className="text-center">
              <div className="grid grid-flow-col auto-cols-auto mt-2 w-64 mx-auto">
                {item.github !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.facebook}><FontAwesomeIcon icon={faGithub} className="text-black mr-4" size="2x" /></Link></div> : <></>}
                {item.linkedin !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.linkedin}><FontAwesomeIcon icon={faLinkedin} className="text-blue-600 mr-4" size="2x" /></Link></div> : <></>}
                {item.instagram !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.twitter}><FontAwesomeIcon icon={faInstagram} className="text-red-500 mr-4" size="2x" /></Link></div> : <></>}
                {item.facebook !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.facebook}><FontAwesomeIcon icon={faFacebook} className="text-blue-800 mr-4" size="2x" /></Link></div> : <></>}
              </div>
              </div>
            </h1>
          </div>
        ))}
        </div> }

        <h1 className="pt-12 text-center font-bold text-4xl px-12 lg:px-24">SECOND YEAR</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 pt-16 px-12 lg:px-24">
        {year2027.map((item, index) => (
          <div key={index} className="col-span-1">
            <h1 className="text-black py-2 font-nunito text-center">
              <div className="w-48 h-30 mx-auto member-hover">
                <Image className="rounded-full object-cover w-full h-full " src={item.image} placeholder="blur"></Image>
              </div>
              <p className="text-center text-xl font-bold">{item.name}</p>
              <p className="text-center text-md text-gray-600">{item.desc}</p>
              <div className="text-center">
              <div className="grid grid-flow-col auto-cols-auto mt-2 w-64 mx-auto">
                {item.github !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.facebook}><FontAwesomeIcon icon={faGithub} className="text-black mr-4" size="2x" /></Link></div> : <></>}
                {item.linkedin !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.linkedin}><FontAwesomeIcon icon={faLinkedin} className="text-blue-600 mr-4" size="2x" /></Link></div> : <></>}
                {item.instagram !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.twitter}><FontAwesomeIcon icon={faInstagram} className="text-red-500 mr-4" size="2x" /></Link></div> : <></>}
                {item.facebook !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.facebook}><FontAwesomeIcon icon={faFacebook} className="text-blue-800 mr-4" size="2x" /></Link></div> : <></>}
              </div>
              </div>
            </h1>
          </div>
        ))}
        </div>
{/* 
        <h1 className="pt-12 text-center font-bold text-4xl px-12 lg:px-24">SECOND YEAR</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 pt-16 px-12 lg:px-24">
        {year2026.map((item, index) => (
          <div key={index} className="col-span-1">
            <h1 className="text-black py-2 font-nunito text-center">
              <div className="w-48 mx-auto member-hover">
                <Image className="rounded-full" src={item.image} placeholder="blur"></Image>
              </div>
              <p className="text-center text-xl font-bold">{item.name}</p>
              <p className="text-center text-md text-gray-600">{item.desc}</p>
              <div className="text-center">
              <div className="grid grid-flow-col auto-cols-auto mt-2 w-64 mx-auto">
                {item.github !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.facebook}><FontAwesomeIcon icon={faGithub} className="text-black mr-4" size="2x" /></Link></div> : <></>}
                {item.linkedin !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.linkedin}><FontAwesomeIcon icon={faLinkedin} className="text-blue-600 mr-4" size="2x" /></Link></div> : <></>}
                {item.instagram !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.twitter}><FontAwesomeIcon icon={faInstagram} className="text-red-500 mr-4" size="2x" /></Link></div> : <></>}
                {item.facebook !== "" ? <div className="cursor-pointer transform-gpu transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"><Link href={item.facebook}><FontAwesomeIcon icon={faFacebook} className="text-blue-800 mr-4" size="2x" /></Link></div> : <></>}
              </div>
              </div>
            </h1>
          </div>
        ))}
        </div> */}

      </div>
    )
}

export default Team;

// float effect on image hover.
