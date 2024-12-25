import { toast, ToastContainer } from "react-toastify"
import ProtectedRoute from "./ProtectedRoute"
import SideNav from "../sidenav"
import { useEffect, useState } from "react";
import { fetchHackathonRegistrationInfo, IHackathonRegistrationInfo } from "../../../apis/events"



const HackathonRegistration = () => {
  const [hackathonInfo, setHackathonInfo] = useState<IHackathonRegistrationInfo>({
    numRegistrations: 0,
    list: []
  });

  useEffect(() => {
    fetchHackathonRegistrationInfo().then((res) => {
      setHackathonInfo(res);
    })
  }, []);

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

      <div className="grid grid-cols-12 h-screen" style={{ background: "#EFEFEF" }}>
        <SideNav />
        <div className="col-span-12 px-6 md:px-12 flex flex-col overflow-y-scroll md:col-span-9">

          {/* Display integer */}
          <div className="bg-white rounded-xl py-4 px-6 my-8 w-full shadow-md text-center">
            <h2 className="text-3xl font-bold" style={{ color: "#0C72B0" }}>Total Registrations: {hackathonInfo.numRegistrations}</h2>
          </div>

          {/* Table of names and emails */}
          <div className="bg-white py-4 px-6 mb-8 rounded-xl shadow-md">
            <table className="table-auto w-full text-center">
              <thead>
                <tr className="text-left">
                  <th className="border p-2">S.No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {hackathonInfo.list.length > 0 ? (
                  hackathonInfo.list.map((user, index) => (
                    <tr key={user.email} className="text-left border-black text-sm">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2">{user.name}</td>
                      <td className="border p-2">{user.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-xl p-4">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>


    </ProtectedRoute>
  )
}

export default HackathonRegistration