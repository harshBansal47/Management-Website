import React, { useState } from "react";
import PopUp from "../Common/PopUp";
import { constants } from "../../config";

const LeaveStatusCard = ({ object, click }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const profilePath = constants.profilePath;
  const imagePath = `${profilePath}/${object.assignee.toLocaleLowerCase()}.jpg`;
  const placeholderImagePath = `${profilePath}/unknown.jpg`;
  const openModal = () => {
    setModalOpen(true);
    // Disable scrolling
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    // Enable scrolling
    document.body.style.overflow = "auto";
  };

  function convertDateFormat(dateStr) {
    // Split the date string by the '-' delimiter
    var parts = dateStr.split("-");

    // Create a new Date object with the year, month, and day
    var date = new Date(parts[0], parts[1] - 1, parts[2]); // Month is 0-indexed, so subtract 1 from the month

    // Get the day, month, and year components from the Date object
    var day = date.getDate().toString().padStart(2, "0"); // Ensure two-digit day
    var month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed, so add 1
    var year = date.getFullYear();

    // Concatenate the components in the desired format
    var formattedDate = day + "-" + month + "-" + year;

    return formattedDate;
  }
  return (
    <>
      <PopUp
        isModalOpen={modalOpen}
        closeModal={closeModal}
        content={object.status}
      />
      <div id="roomList">
        <div className="room-card">
          <div className="profile-picture">
            <img
              src={imagePath}
              onError={(e) => {
                e.target.src = placeholderImagePath; // Replace with placeholder image
              }}
              alt=""
            />
          </div>
          <p>
            Date: <strong> {convertDateFormat(object.leaveDate)}</strong>{" "}
          </p>
          <p>
            Employee: <strong> {object.assignee}</strong>
          </p>
          <p>
            No of Days: <strong> {object.leaveDuration}</strong>
          </p>
          <p className="employee-des-pop-up" onClick={openModal}>
            Status:{" "}
            <strong
              className={object.status === "Approved" ? "Completed" : "New"}
            >
              {object.status.substring(0, 15) + "..."}{" "}
            </strong>{" "}
          </p>
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
      </div>
    </>
  );
};

export default LeaveStatusCard;
