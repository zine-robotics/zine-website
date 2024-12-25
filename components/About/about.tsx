import React from "react";
import Link from "next/link";
import Image from "next/image";
import a1 from "../../images/about/1.webp";
import a2 from "../../images/about/2.webp";
import a3 from "../../images/about/3.webp";
import a4 from "../../images/about/4.webp";
import a5 from "../../images/about/5.webp";
import a6 from "../../images/about/6.webp";
import a7 from "../../images/about/7.webp";
import a8 from "../../images/about/8.webp";
import a9 from "../../images/about/9.webp";
import a10 from "../../images/about/10.webp";

const About = () => {
    return(
        <div className="text-black bg-white w-screen">
          <div className="bg-cover bg-about-bg py-16">
            <h1 className="text-3xl pt-8 px-12 lg:px-24 xl:px-48">About ZINE</h1>
            <p className="pt-8 px-12 lg:px-24 xl:px-48">Zine is a creative group of engineering undergraduates of Malaviya National Institute of Technology, Jaipur who are together to learn, improve and apply their technical skills to help foster the growth of society and India in the field of technology by utilising their engineering skills to work on real time problems. It is comprised of students from various disciplines working under guidance of Dr. Rajesh Kumar from Electrical Engineering department and various alumni working in reputed firms and doing research in Universities in India and abroad. Zine has been the only active robotics and research group of MNIT for the last 11 years, since its foundation.</p>
          </div>

            <h1 className="text-3xl pt-16 px-12 lg:px-24 xl:px-48">Our Background and Mission</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 pt-8 px-12 lg:px-24 xl:px-48">
              <div>
                <h1 className="text-2xl">What We Do</h1>
                <p className="py-8 break-normal pr-9">We regularly participate in various national and international events related to a multitude of fields, publish research articles in reputed publications like IEEE Journals and provide services to industries like consultacy related to automation through embedded system based solution for Micro, Small, Medium scale enterprises(MSME).</p>
              </div>

              <div>
                <h1 className="text-2xl">Why We Do It</h1>
                <p className="py-8 break-normal pr-9">We believe in using our knowledge for the betterment of the society and the student community by providing ambitious people a platform to develop their ideas in the fields of Product development, Machine Learning, Software Development and Robotics.</p>
              </div>
              <div>
                <h1 className="text-2xl">Who We Are</h1>
                <p className="py-8 break-normal pr-9">Zine is a creative group of engineering undergraduates of Malaviya National Institute of Technology, Jaipur. Presently our team comprises of around 30 undergraduates from Electrical Engineering, Mechanical Engineering, Electronics and Communication Engineering and Computer Engineering.</p>
              </div>
            </div>
            <h1 className="pt-16 pb-8 text-center text-4xl px-12 lg:px-24 xl:px-48">Memories from ZINE events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              <div className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"><Image src={a2}  alt="image not found" className="object-cover"/></div>
              <div className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"><Image src={a1}  alt="image not found" className="object-cover"/></div>
              <div className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"><Image src={a3}  alt="image not found" className="object-cover"/></div>
              <div className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"><Image src={a4}  alt="image not found" className="object-cover"/></div>
              <div className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"><Image src={a5}  alt="image not found" className="object-cover"/></div>
              <div className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"><Image src={a6}  alt="image not found" className="object-cover"/></div>
              <div className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"><Image src={a7}  alt="image not found" className="object-cover"/></div>
              <div className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"><Image src={a8}  alt="image not found" className="object-cover"/></div>
              <div className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"><Image src={a9}  alt="image not found" className="object-cover"/></div>
              <div className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"><Image src={a10} alt="image not found"  className="object-cover"/></div>
            </div>

            <h1 className="text-center py-8">Follow our photostreams on Social Platforms for more...</h1>
        </div>
    )
}

export default About;