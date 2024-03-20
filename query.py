def GetRoomDetails(check_in, check_out):
    return f"""select cd.first_Name, cd.CheckIn_Date, cd.CheckOut_Date, cd.Allowed_Room, rt.Type from CostumerDetails cd
    inner join RoomsDetails rd on cd.Allowed_Room = rd.room_number
    inner join RoomType rt on rd.room_type_id = rt.id
    where cd.CheckIn_Date >= '{check_in}' and CheckOut_Date <= '{check_out}' and checked_out = 0 and checked_in = 0 """

def CheckedOutUpdateInConsumer(room_number):
    return f"update CostumerDetails set checked_out = 1, status='checked out' where Allowed_Room = '{room_number}'"

def LoginUserVerfication(username, password):
    return f"SELECT id, admin FROM Users WHERE username = '{username}' AND password = '{password}'"

def CheckedInUpdateInConsumer(room_number):
    return f"update CostumerDetails set checked_in = 1, status = 'occupied' where Allowed_Room = '{room_number}'"

def CancelBookingCostumer(room_number):
    return f"update CostumerDetails set checked_out = 1, checked_in = 1, status = 'canceled' where Allowed_Room = '{room_number}'"


def UpdateAvailableRoom(room_number):
    return f"update RoomsDetails set occupied = 1 where room_number = '{room_number}'"
def UpdateOccupiedRoom(room_number):
    return f"update RoomsDetails set occupied = 0 where room_number = '{room_number}'"

def GetEmptyRoomsList(room_type):
    return f"""select rd.room_number from RoomsDetails rd
inner join RoomType rt on rd.room_type_id = rt.id
where rd.occupied = 0 and rt.Type = '{room_type}'"""


RoomTypes = """select distinct rt.Type from RoomsDetails rd
inner join RoomType rt on rd.room_type_id = rt.id
where rd.occupied = 0"""

NotBookedRooms = """select rd.room_number, rd.occupied, rt.Type from RoomsDetails rd 
inner join RoomType rt on rt.id = rd.room_type_id where rd.occupied = 0"""

BookedRooms = """select cd.first_Name, cd.CheckIn_Date, cd.CheckOut_Date, cd.Allowed_Room, rt.Type, cd.checked_out, cd.checked_in from CostumerDetails cd
inner join RoomsDetails rd on cd.Allowed_Room = rd.room_number
inner join RoomType rt on rd.room_type_id = rt.id where cd.checked_in = 1 and checked_out = 0"""

GetBookings = """select cd.first_Name, cd.CheckIn_Date, cd.CheckOut_Date, cd.Allowed_Room, rt.Type, cd.checked_out, cd.checked_in from CostumerDetails cd
inner join RoomsDetails rd on cd.Allowed_Room = rd.room_number
inner join RoomType rt on rd.room_type_id = rt.id where cd.checked_out = 0 and cd.checked_in = 0"""


############################## Project management Utility ###########################



def TaskByStatus(status):
    return f"""select assignee, project_name, status, task_title, task_description, taskID from ProjectManagement
where status = '{status}' and isActive = 1"""

def TaskByID(taskID):
    return f"""select assignee, project_name, status, task_title, task_description, taskID from ProjectManagement
where taskID = '{taskID}' and isActive = 1"""


Employees = """select Name from employees"""
Projects = """select project_name from Projects"""
Employee_Status = """SELECT * FROM EmployeeStatuses"""
Tasks = """select assignee, project_name, status, task_title, task_description, taskID, CreatedAt from ProjectManagement where isActive = 1"""
Leaves = """SELECT * FROM LeaveStatuses """
