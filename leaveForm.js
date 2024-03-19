import React, { useState } from "react";
import { Axios } from "../../config";
import Loader from "../Common/Loader";

const LeaveForm = ({ isModalOpen, data, isModalClose }) => {
  const statuses = ["Unapproved", "Approved"];
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    assignee: "",
    leaveTitle: "",
    leaveDescription: "",
    leaveDate: "",
    leaveDuration: 0,
    status: statuses[0],
    createdAt: "",
  });
  const [emptyField, setEmptyField] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
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
      .then((res) => {})
      .catch((error) => {
        console.error("Failed to request", error);
      })
      .finally(() => {
        setLoading(false);
        setFormFields({
          assignee: "",
          leaveTitle: "",
          leaveDescription: "",
          leaveDate: "",
          leaveDuration: 0,
          status: statuses[0],
          createdAt: "",
        });
      });
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        isModalOpen && (
          <div className="snack-bar-wrapper">
            <div className="modal-content-pop-up">
              <span className="close" onClick={isModalClose}>
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
                    {data.employees.map((employee, index) => (
                      <option key={index} value={employee.Name}>
                        {employee.Name}
                      </option>
                    ))}
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
                  ></textarea>
                  {emptyField === "leaveDescription" && (
                    <span className="error-msg">Please Fill Description</span>
                  )}
                </div>
                <div className="task-title">
                  <label htmlFor="leaveDate">Choose Date for Leave</label>
                  <input
                    type="date"
                    id="leaveDate"
                    name="leaveDate"
                    required
                    value={formFields.leaveDate}
                    onChange={handleChange}
                    placeholder="choose leave date"
                  />
                </div>
                <div className="task-title">
                  <label htmlFor="leaveDuration">Leave Duration</label>
                  <div className="leave-duration-options flex justify-between">
                    <input
                      type="radio"
                      id="halfDay"
                      name="leaveDuration"
                      value={0.5}
                      //   checked={parseFloat(formFields.leaveDuration) === 0.5}
                      onChange={handleChange}
                    />
                    <label htmlFor="halfDay">Half Day</label>

                    <input
                      type="radio"
                      id="fullDay"
                      name="leaveDuration"
                      value={1}
                      //   checked={parseFloat(formFields.leaveDuration) === 1}
                      onChange={handleChange}
                    />
                    <label htmlFor="fullDay">Full Day</label>

                    <label htmlFor="customDays">Custom</label>
                    <input
                      type="number"
                      id="customDays"
                      name="leaveDuration"
                      value={formFields.leaveDuration}
                      onChange={handleChange}
                      placeholder="..1-5 Days"
                    />
                  </div>
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
