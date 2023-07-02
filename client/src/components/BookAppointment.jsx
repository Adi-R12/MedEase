import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { v4 as uuidv4 } from 'uuid';

const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
  });

  const [roomId, setRoomId] = useState('');
    const createRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
    };

    console.log(roomId);

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };


  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await toast.promise(
        axios.post(
          "/appointment/bookappointment",
          {
            doctorId: ele.userId._id,
            date: formDetails.date,
            time: formDetails.time,
            doctorname: `${ele.userId.firstname} ${ele.userId.lastname}`,
            room_id:roomId
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
      setModalOpen(false);
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <div className="modal flex-center">
        <div className="modal__content">
          <h2 className="page-heading">Book Appointment</h2>
          <IoMdClose
            onClick={() => {
              setModalOpen(false);
            }}
            className="close-btn"
          />
          <div className="register-container flex-center book">
            <form className="register-form">
              <input
                type="date"
                name="date"
                className="form-input"
                value={formDetails.date}
                onChange={inputChange}
              />
              <input
                type="time"
                name="time"
                className="form-input"
                value={formDetails.time}
                onChange={inputChange}
              />
              <input
                type="text"
                name="room_id"
                className="form-input 2"
                placeholder="ROOM ID"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
                readonly="true"
              />
              <button
                onClick={createRoom}
                className="btn form-btn"
              >
                Create Room_ID
              </button>
              <button
                type="submit"
                className="btn form-btn"
                onClick={bookAppointment}
              >
                book
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
