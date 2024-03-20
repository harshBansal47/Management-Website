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
      setLeavesList(leavesList.filter((leave) => {
        const leaveDateStr = leave.leaveDate;
        const leaveDateParts = leaveDateStr.split('-');
        const leaveDate = new Date(`${leaveDateParts[2]}-${leaveDateParts[0]}-${leaveDateParts[1]}`);
        
        // Parse leave duration to integer
        const leaveDuration = parseInt(leave.leaveDuration);
    
        // Calculate end date of the leave by adding leave duration to leave date
        const arrivalDate = new Date(leaveDate.getTime() + (leaveDuration * 24 * 60 * 60 * 1000));
    
        // Get today's date
        const today = new Date();
    
        // Compare the end date of the leave with today's date
        return arrivalDate.getTime() === today.getTime();
    }));
    

    } else if (e === 2) {
      // Handle click for "Leave from Today" button
      setLeavesList(leavesList.filter((leave)=>{
        const leaveDatestr = leave.leaveDate;
        const leaveDateParts = leaveDatestr.split('-');
        const leaveDate = new Date(`${leaveDateParts[2]}-${leaveDateParts[0]}-${leaveDateParts[1]}`);
        const today = new Date();
        return today.getTime() === leaveDate.getTime();
      }))
    }
  };

  return (
   <>
   {loading?<Loader/>:( <section className="availability">
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
      </div>
      {/* Leave cards */}
      <div className="room-card-wrapper">
        { leavesList.map((leave, index) => {
                return (
                  <LeaveStatusCard
                    key={index}
                    object={leave}
                    handleClick={handleClick}
                  />
                );})}
      </div>
    </section>)}
   </>
  );
};

export default LeaveStatus;
