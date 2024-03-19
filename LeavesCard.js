import React, { useState } from 'react'
import PopUp from '../Common/PopUp';
import { constants } from "../../config";

const LeaveStatusCard = ({object}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const profilePath = constants.profilePath;
    const imagePath = `${profilePath}/${object.employee_name.toLocaleLowerCase()}.jpg`;
    const placeholderImagePath = `${profilePath}/unknown.jpg`;
    const openModal = () => {
        setModalOpen(true);
        // Disable scrolling
        document.body.style.overflow = 'hidden';
    };


    const closeModal = () => {
        setModalOpen(false);
        // Enable scrolling
        document.body.style.overflow = 'auto';
    };
  return (
    <>
     <PopUp isModalOpen={modalOpen} closeModal={closeModal} content={object.status} />
        <div id="roomList">
            <div className="room-card">
            <div className="profile-picture">
                    <img
                        src={imagePath}
                        onError={(e) => {
                            e.target.src = placeholderImagePath; // Replace with placeholder image
                        }}
                        alt="" />
                </div>
                <p>Date: <strong> {object.createdAt.split("T")[0]}</strong> </p>
                <p>Employee:  <strong> {object.employee_name}</strong></p>
                <p>No of Days:  <strong> {object.noOfDays}</strong></p>
                <p className="employee-des-pop-up" onClick={openModal}>Status: <strong>{object.status.substring(0, 15) + "..."}   </strong> </p>
                {/* <p>Task: <strong>{object.task_title}</strong></p>
                <p >Project: <b className={object.project_name}> {object.project_name}</b></p>
                <p >Status: <strong className={object.status}> {object.status}</strong></p> */}
                <div className="button-wrapper">
                    {/* <button onClick={() => { updateEmployeeStatus(object.taskID) }} disabled={false} className={`${false && "disabled-button"} booknow-btn`}>Add Daily Status</button> */}
                    {/* <button onClick={() => { handleClick(object.taskID) }} disabled={false} className={`${false && "disabled-button"} booknow-btn`}>Update</button> */}
                    {/* {<button onClick={() => { hadnleCheckIn(roomNumber) }} disabled={!checkIn} className={`${!checkIn ? "disabled-button" : "checkout-btn"}`}>Change Assignee</button>}
                    {<button onClick={() => { CancelBooking(roomNumber) }} disabled={!cancel} className={`${!cancel ? "disabled-button" : "cancel-btn"}`}>HH</button>} */}
                </div>
            </div>
        </div >
    </>
  )
}

export default LeaveStatusCard
