import React, { useEffect, useState } from "react";
import LeaveForm from "./LeaveForm";
import { Axios } from "../../config";
import LeaveStatusCard from "./LeaveStatusCard";
import Loader from "../Common/Loader";

const LeaveStatus = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leavesList, setLeavesList] = useState([]);
  const [filterList,setFilterList] = useState([]);
  const [baseUrl, setBaseUrl] = useState("");

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    Axios.get("leave-statuses")
      .then((res) => {
        setLeavesList(res.data.Data);
        setFilterList(res.data.Data);
      })
      .catch(() => {
        console.error("Errro when Fetching Room Details");
      })
      .finally(() => {
        setLoading(false);
      });
    Axios.get("employees").then((res) => {
      setEmployees(res.data.Data);
    });
    const baseUrl = window.location.protocol + "//" + window.location.host;
    setBaseUrl(baseUrl);
  }, []);
 
  const handleClick = (e) => {
    if (e === 1) {
      // Handle click for "Coming Today" button
      setFilterList(
        leavesList.filter((leave) => {
          const leaveDate = new Date(leave.leaveDate);
          const today = new Date();

          // Calculate end date by adding leave duration to leave date
          const endDate = new Date(leaveDate);
          endDate.setDate(endDate.getDate() + leave.leaveDuration);

          console.log(endDate.getDate()); // Output the day of the end date

          // Check if the end date is equal to today's date
          return today.getDate() === endDate.getDate();

          // Compare the end date of the leave with today's date
          // return arrivalDate.getTime() === today.getTime();
        })
      );
    } else if (e === 2) {
      // Handle click for "Leave from Today" button
      setFilterList(
        leavesList.filter((leave) => {
          // Get the current date
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1; // Month is zero-based
          const currentDay = currentDate.getDate();

          // Split the date string by the '-' delimiter
          const parts = leave.leaveDate.split("-");
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const day = parseInt(parts[2], 10);
          // Check if the date components match today's date
          return (
            year === currentYear && month === currentMonth && day === currentDay
          );
        })
      );
    }else if(e===3){
      setFilterList(leavesList);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="availability">
          {isDialogOpen && (
            <LeaveForm
              isModalOpen={isDialogOpen}
              isModalClose={closeDialog}
              data={{ employees: employees }}
            />
          )}
          <div className="flex justify-between items-center">
            <h2>Leave Status</h2>
            <button
              disabled={false}
              className="booknow-btn smallButton"
              onClick={openDialog} // Open dialog box on button click
            >
              Apply for leave
            </button>
          </div>

          <div className="status-wrapper-filter">
            <div className="task-status flex items-center ">
              <button
                className="outlined-button"
                value={1}
                onClick={() => handleClick(1)} // Pass a function reference to onClick
              >
                Coming Today
              </button>
            </div>
            <div className="task-status">
              <button
                className="outlined-button"
                value={2}
                onClick={() => handleClick(2)} // Pass a function reference to onClick
              >
                Leave from Today
              </button>
            </div>
            <div className="task-status">
              <button
                className="outlined-button"
                value={3}
                onClick={() => handleClick(3)} // Pass a function reference to onClick
              >
                All Leaves
              </button>
            </div>
          </div>
          {/* Leave cards */}
          <div className="room-card-wrapper">
            {filterList.map((leave, index) => {
              return (
                <LeaveStatusCard
                  key={index}
                  object={leave}
                  handleClick={handleClick}
                />
              );
            })}
          </div>
        </section>
      )}
    </>
  );
};

export default LeaveStatus;
