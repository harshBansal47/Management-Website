import React, { useEffect, useState } from "react";
import Loader from "../Common/Loader";
import { Axios } from "../../config";
import EmployeeStatusCard from "../TaskByDay/EmployeeStatusCard";
import NoDataFound from "../Common/NoDataFound";
import LeaveStatusCard from "./LeaveStatusCard";
import axios from "axios";
import LeaveForm from "../Common/LeaveForm";

function LeaveStatus() {
  const [isDialogBoxOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leavesList, setLeavesList] = useState([]);
  const [baseUrl, setBaseUrl] = useState("");
  const [filterLeaveList, setFilterLeaveList] = useState([]);
  const [comingList, setComingList] = useState([]);
  const [filterState, setFilterState] = useState(0);
  const [empolyees, setEmpolyees] = useState([]);

  const openDialog = () => {
    console.log("dialog box"+isDialogBoxOpen)
    setDialogOpen(true);
  };




  useEffect(() => {
    setLoading(true);
    Axios.get("leave-statuses")
      .then((res) => {
        setLeavesList(res.data.Data);
        setFilterLeaveList(res.data.Data);
        setComingList(res.data.Data);
      })
      .catch(() => {
        console.error("Errro when Fetching Room Details");
      })
      .finally(() => {
        setLoading(false);
      });
      Axios.get('employees')
      .then((res) => {
          setEmpolyees(res.data.Data);
      });
    const baseUrl = window.location.protocol + "//" + window.location.host;
    setBaseUrl(baseUrl);

    return () => {};
  }, [false]);

  const handleClick = (e) => {
    const value = e.target.value;
    if (value === "1") {
      setFilterState(1);
      const comingList = leavesList.filter((leave) => {
        return leave.timePeriod !== "full" || (leave.timePeriod === "half" && leave.noOfDays === 0);
      });
      setComingList(comingList); // Corrected assignment using setComingList
    } else {
      setFilterState(2);
      const filterLeaveList = leavesList.filter((leave) => {
        const leaveDate = new Date(leave.createdAt);
        const today = new Date();
        return leaveDate.toDateString() === today.toDateString();
      });
      setFilterLeaveList(filterLeaveList); // Corrected assignment using setFilterLeaveList
    }
  };
  
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="availability">
          <div className="flex justify-between items-center">
          {isDialogBoxOpen && <LeaveForm isModalOpen={isDialogBoxOpen} data={{empolyees:empolyees}}/>}
            <h2>Leave Status</h2>
            <button
              disabled={false}
              className="booknow-btn smallButton"
              onClick={openDialog} // Open dialog box on button click
            >
              Apply
            </button>
          </div>
          {/* Filter Buttons */}
          <div className="status-wrapper-filter">
            <div className="task-status">
              <button
                className="outlined-button"
                value={1}
                onClick={handleClick}
              >
                Coming Today
              </button>
            </div>
            <div className="task-assignee">
              <button
                className="outlined-button"
                value={2}
                onClick={handleClick}
              >
                Leave from Today
              </button>
            </div>
          </div>
          {/* Leave cards */}
          <div className="room-card-wrapper">
            {filterState === 0 ? (
              leavesList.map((leave, index) => {
                return (
                  <LeaveStatusCard
                    key={index}
                    object={leave}
                    handleClick={handleClick}
                  />
                );
              })
            ) : filterState === 1 ? (
              comingList.map((leave, index) => {
                return (
                  <LeaveStatusCard
                    key={index}
                    object={leave}
                    handleClick={handleClick}
                  />
                );
              })
            ) : filterState === 2 ? (
              filterLeaveList.map((leave, index) => {
                return (
                  <LeaveStatusCard
                    key={index}
                    object={leave}
                    handleClick={handleClick}
                  />
                );
              })
            ) : (
              <NoDataFound />
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default LeaveStatus;
