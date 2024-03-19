import React, { useState } from "react";
import { getEmptyFields, isObjectEmpty } from "../../DataUtility";
import { Axios } from "../../config";
import Loader from "./Loader";

const LeaveForm = ({ isModalOpen, closeModal, data }) => {
  const [loading, setLoading] = useState(false);
  const [emptyField, setEmptyField] = useState("");
  const statuses = ["Unapproved", "Approved"];
  const [modalOpen, setModalOpen] = useState(isModalOpen);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numDays, setNumDays] = useState(0);
  const [formFields, setFormFields] = useState({
    assignee: "",
    leaveTitle: "",
    leaveDescription: "",
    status: statuses[0],
    createdAt: "",
    timePeriod: 0,
    date: startDate,
    noOfDays: numDays,
  });

  const openModal = () => {
    setModalOpen(true);
    // Disable scrolling
    document.body.style.overflow = "hidden";
  };

  const modelClose = () => {
    setModalOpen(false);
    // Enable scrolling
    document.body.style.overflow = "auto";
  };
  const handleStartDateChange = (event) => {
    setStartDate(event.target.valueAsDate);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.valueAsDate);
    calculateNumDays();
  };

  const calculateNumDays = () => {
    // Calculate the number of days between start and end dates
    // You can use a library like date-fns or moment.js for date calculations
    // Here's a simplified example:
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate the difference in milliseconds
    const diffTime = Math.abs(end - start);
    
    // Calculate the difference in days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    console.log(start, "start");
    console.log(end, "end");
    console.log(diffDays, "diffDays");
    
    // Set the number of days
    setNumDays(diffDays);
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
    
    // Setting empty field name to state to render error messages
    if (value === "") {
      setEmptyField(name);
    } else {
      setEmptyField("");
    }
  };
 const handleSubmit = (e) => {
    e.preventDefault();
    formFields.createdAt = new Date().toISOString();
    if (Object.values(formFields).some((field) => field === "")) {
      setEmptyField("All fields are required");
      return;
    }
    setLoading(true);
    Axios.post("create-leave", formFields)
      .then((res) => {
        openModal();
      })
      .catch((error) => {
        console.error("Failed to request", error);
      })
      .finally(() => {
        setLoading(false);
        closeModal(); // Close modal after form submission
        setFormFields({
          assignee: "",
          leaveTitle: "",
          leaveDescription: "",
          status: statuses[0],
          createdAt: "",
          timePeriod: 0,
          date: startDate,
          noOfDays: numDays,
        });
      });
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        modalOpen && (
          <div className="snack-bar-wrapper" onClick={closeModal}>
            <div className="modal-content-pop-up">
              <span className="close" onClick={modelClose}>
                &times;
              </span>

              <form onSubmit={handleSubmit}>
                <div className="task-assignee">
                  <label htmlFor="assignee">Employee Name:</label>
                  <select
                    id="assignee"
                    name="assignee"
                    required
                    value={formFields.assignee}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Employee
                    </option>
                    {data.empolyees.map((value, index) => {
                      return (
                        <option key={index} value={value.Name}>
                          {value.Name}
                        </option>
                      );
                    })}
                  </select>
                  {emptyField === "assignee" && (
                    <span className="error-msg">Please Select Assignee </span>
                  )}
                </div>
                <div className="task-title">
                  <label htmlFor="leaveTitle">Leave Title</label>
                  <input
                    type="text"
                    id="leaveTitle"
                    name="leaveTitle"
                    onChange={handleChange}
                    required
                    value={formFields.leaveTitle}
                    placeholder="Enter Leave Title"
                  />
                  {emptyField === "leaveTitle" && (
                    <span className="error-msg">Please Fill Name</span>
                  )}
                </div>
                <div className="textarea-wrapper">
                  <label htmlFor="leaveDescription">Leave Description:</label>
                  <textarea
                    id="leaveDescription"
                    name="leaveDescription"
                    required
                    onChange={handleChange}
                    placeholder="Enter leave description.."
                    value={formFields.leaveDescription}
                  >
                  </textarea>
                  {emptyField === "leaveDescription" && (
                    <span className="error-msg">Please Fill Description</span>
                  )}
                </div>
                <div className="textarea-wrapper">
                  {formFields.timePeriod !== "custom" && (
                    <label>
                      Select Duration of Leave:
                      <select
                        value={formFields.timePeriod}
                        onChange={handleChange}
                        name="timePeriod"
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="0">1/2 Day</option>
                        <option value="1">1 Day</option>
                        <option value="custom">More</option>
                      </select>
                    </label>
                  )}
                  {(formFields.timePeriod === "0" ||
                    formFields.timePeriod === "1") && (
                    <div>
                      <label>
                        Choose Date:
                        <input
                          type="date"
                          value={startDate}
                          onChange={handleStartDateChange}
                        />
                      </label>
                    </div>
                  )}
                  {formFields.timePeriod === "custom" && (
                    <div>
                      <label>
                        Start Date:
                        <input
                          type="date"
                          value={startDate}
                          onChange={handleStartDateChange}
                        />
                      </label>
                      <label>
                        End Date:
                        <input
                          type="date"
                          value={endDate}
                          onChange={handleEndDateChange}
                        />
                      </label>
                      {numDays > 0 && <p>Number of Days: {numDays}</p>}
                    </div>
                  )}
                </div>

                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default LeaveForm;
