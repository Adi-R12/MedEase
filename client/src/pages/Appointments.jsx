import React, { useEffect, useState,useCallback } from "react";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const { userId } = jwt_decode(localStorage.getItem("token"));
  const socket = useSocket();
  const navigate = useNavigate();

  const getAllAppoint = async (e) => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(
        `/appointment/getallappointments?search=${userId}`
      );
      console.log(temp);
      setAppointments(temp);
      dispatch(setLoading(false));
    } catch (error) {}
  };

  useEffect(() => {
    getAllAppoint();
  }, []);

  const complete = async (ele) => {
    try {
      const { data } = await toast.promise(
        axios.put(
          "/appointment/completed",
          {
            appointid: ele._id,
            doctorId: ele.doctorId._id,
            doctorname: `${ele.userId.firstname} ${ele.userId.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment booked successfully",
          error: "Unable to book appointment",
          loading: "Booking appointment...",
        }
      );

      getAllAppoint();
    } catch (error) {
      return error;
    }
  };

  const Join = (room,email)=>{
    // useCallback(
    //   (e) => {
    //     e.preventDefault();
        socket.emit("room:join", { email, room });
    //   },
    //   [email, room, socket]
    // );
  
    // const handleJoinRoom = useCallback(
    //   (data) => {
    //     navigate(`/room/${room}`);
    //   },
    //   [navigate]
    // );

    // const handleJoinRoom=()=>{
      navigate(`/room/${room}`);
    // }
  
    // useEffect(() => {
    //   socket.on("room:join", handleJoinRoom);
    //   return () => {
    //     socket.off("room:join", handleJoinRoom);
    //   };
    // }, [socket, handleJoinRoom]);
  }

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="container notif-section">
          <h2 className="page-heading">Your Appointments</h2>

          {appointments.length > 0 ? (
            <div className="appointments">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Doctor</th>
                    <th>Patient</th>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Booking Date</th>
                    <th>Booking Time</th>
                    <th>Status</th>
                    {userId === appointments[0].doctorId._id ? (
                      <th>Action</th>
                    ) : (
                      <></>
                    )}
                    {userId === appointments[0].doctorId._id ? (
                      <th>Join</th>
                    ) : (
                      <></>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {appointments?.map((ele, i) => {
                    return (
                      <tr key={ele._id}>
                        <td>{i + 1}</td>
                        <td>
                          {ele.doctorId.firstname + " " + ele.doctorId.lastname}
                        </td>
                        <td>
                          {ele.userId.firstname + " " + ele.userId.lastname}
                        </td>
                        <td>{ele.date}</td>
                        <td>{ele.time}</td>
                        <td>{ele.createdAt.split("T")[0]}</td>
                        <td>{ele.updatedAt.split("T")[1].split(".")[0]}</td>
                        <td>{ele.status}</td>
                        {userId === ele.doctorId._id ? (
                          <td>
                            <button
                              className={`btn user-btn accept-btn ${
                                ele.status === "Completed" ? "disable-btn" : ""
                              }`}
                              disabled={ele.status === "Completed"}
                              onClick={() => complete(ele)}
                            >
                              Complete
                            </button>
                          </td>
                        ) : (
                          <></>
                        )}
                        {userId === (ele.doctorId._id || ele.userId._id) && ele.room_id!=="" ? (
                          <td>
                            <button
                              className="meet"
                              onClick={() => Join(ele.room_id,ele.userId.email)}
                            >
                              <img width="30px" src="/videocall.png" alt="Videocall Meet" />
                            </button>
                          </td>
                        ) : (
                          <td>
                            <button
                              className="meet"
                            >
                              <img width="30px" src="/users.png" alt="Offline Meet" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
      <Footer />
    </>
  );
};
export default Appointments;
