from flask import jsonify, request, abort
from . import createDbConnection, hotel_blueprint,closeDbConnection
from flask_cors import cross_origin
from ..querys import querys


@hotel_blueprint.route('/checkout', methods=['POST'])
@cross_origin(supports_credentials=True)
def room_checkout():
    db, cursorDb = createDbConnection()

    data = request.get_json()
    room_number = data['room_number']

    query = querys.CheckedOutUpdateInConsumer(room_number)
    query2 = querys.UpdateOccupiedRoom(room_number)

    cursorDb.execute(query)
    cursorDb.execute(query2)
    try:
        # Database operations (insert, update, delete)
        db.commit()
        print("checked Out", room_number)
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        closeDbConnection(db, cursorDb)
    return jsonify({})


@hotel_blueprint.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    db, cursorDb = createDbConnection()
    data = request.get_json()
    username = data['username']
    password = data['password']

    query = querys.LoginUserVerfication(username, password)

    cursorDb.execute(query)
    usersDetails = cursorDb.fetchall()
    print(usersDetails)
    if(len(usersDetails)==0):
        abort(400, description="Invalid username or password")
        return jsonify({"status": False})
    try:
        # Database operations (insert, update, delete)
        db.commit()
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        closeDbConnection(db, cursorDb)
    return jsonify({"status": True, "admin": True if usersDetails[0]['admin'] == 1 else False})

@hotel_blueprint.route('/check-in', methods=['POST'])
@cross_origin(supports_credentials=True)
def room_check_in():
    db, cursorDb = createDbConnection()

    data = request.get_json()
    room_number = data['room_number']

    query = querys.CheckedInUpdateInConsumer(room_number)

    cursorDb.execute(query)
    try:
        # Database operations (insert, update, delete)
        db.commit()
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        closeDbConnection(db, cursorDb)
    return jsonify({})

@hotel_blueprint.route('/room-details', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_rooms():
    db, cursorDb = createDbConnection()
    query = querys.NotBookedRooms
    cursorDb.execute(query)
    rooms = cursorDb.fetchall()

    closeDbConnection(db, cursorDb)

    return jsonify({'RoomDetails': rooms})

@hotel_blueprint.route('/room-type', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_room_types():
    db, cursorDb = createDbConnection()

    query = querys.RoomTypes
    cursorDb.execute(query)
    roomTypes = cursorDb.fetchall()

    closeDbConnection(db, cursorDb)
    return jsonify({'RoomTypes': roomTypes})


@hotel_blueprint.route('/available', methods=['POST'])
@cross_origin(supports_credentials=True)
def SendRoomsDetails():
    db, cursorDb = createDbConnection()
    data = request.get_json()
    check_in = data['check_in']
    check_out = data['check_out']

    room_details_query = querys.GetRoomDetails(check_in, check_out)
    cursorDb.execute(room_details_query)
    bookedRoomDetails = cursorDb.fetchall()

    closeDbConnection(db, cursorDb)

    return jsonify({'BookedRooms': bookedRoomDetails})

@hotel_blueprint.route('/booked-rooms', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_booked_rooms():
    db, cursorDb = createDbConnection()
    query = querys.BookedRooms
    cursorDb.execute(query)
    bookedRooms = cursorDb.fetchall()

    closeDbConnection(db, cursorDb)
    return jsonify({"BookedRooms": bookedRooms})

@hotel_blueprint.route('/bookings', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_bookings():
    db, cursorDb = createDbConnection()
    query = querys.GetBookings
    cursorDb.execute(query)
    bookings = cursorDb.fetchall()

    closeDbConnection(db, cursorDb)
    return jsonify({"Data": bookings})

@hotel_blueprint.route('/cancel-booking', methods=['Post'])
@cross_origin(supports_credentials=True)
def cancel_booking():
    data = request.get_json()
    room_number = data["room_number"]
    db, cursorDb = createDbConnection()
    query = querys.CancelBookingCostumer(room_number)
    query2 = querys.UpdateOccupiedRoom(room_number)
    cursorDb.execute(query)
    cursorDb.execute(query2)
    try:
        # Database operations (insert, update, delete)
        db.commit()
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()  # Rollback changes in case of an exception
    finally:
        closeDbConnection(db, cursorDb)
    return jsonify({})


@hotel_blueprint.route('/order', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_order():
    db, cursorDb = createDbConnection()
    data = request.get_json()
    f_name = data['fname']
    l_name = data['lname']
    address = data['address']
    check_in = data['check_in']
    check_out = data['check_out']
    id_type = data['id_type']
    no_of_persons = data['no_of_persons']
    number = data['number']
    room_type = data['room_type']

    cursorDb.execute(querys.GetEmptyRoomsList(room_type))
    emptyRooms = cursorDb.fetchall()
    emptyRoomNo = emptyRooms[0]['room_number']

    cursorDb.execute("INSERT INTO CostumerDetails (first_Name, last_Name, address, CheckIn_Date, CheckOut_Date, ID_Proof, phone_number, no_of_persons, Allowed_Room, room_type, checked_out, checked_in, status) Values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                     (f_name, l_name, address, check_in, check_out, id_type, number, no_of_persons, emptyRoomNo, room_type, 0, 0, 'booking'))

    cursorDb.execute(querys.UpdateAvailableRoom(emptyRoomNo))
    try:
        # Database operations (insert, update, delete)
        db.commit()
        return jsonify({"room_number":emptyRoomNo})
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()  # Rollback changes in case of an exception
    finally:
        closeDbConnection(db, cursorDb)
    # return jsonify({'message': 'Hotel created successfully'}), 201
    return jsonify({})


######################### Project Management Section #########################

#########################Task Management######################################
@hotel_blueprint.route('/create-task', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_task():
    db, cursorDb = createDbConnection()
    data = request.get_json()
    assignee = data['assignee']
    taskTitle = data['taskTitle']
    taskDescription = data['taskDescription']
    project_name = data['project_name']
    status = data['status']
    createdAt = data['createdAt']
    taskID = data["taskID"]
    # cursorDb.execute(querys.GetEmptyRoomsList(room_type))
    # emptyRooms = cursorDb.fetchall()
    # emptyRoomNo = emptyRooms[0]['room_number']

    cursorDb.execute("INSERT INTO ProjectManagement (assignee, project_name, status, task_title, task_description, createdAt, taskID, isActive) Values(%s, %s, %s, %s, %s, %s, %s, 1)",
                     (assignee, project_name, status, taskTitle, taskDescription, createdAt, taskID))

    # cursorDb.execute(querys.UpdateAvailableRoom(emptyRoomNo))
    try:
        # Database operations (insert, update, delete)
        db.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()  # Rollback changes in case of an exception
    finally:
        closeDbConnection(db, cursorDb)
    # return jsonify({'message': 'Hotel created successfully'}), 201
    return jsonify({})


@hotel_blueprint.route('/update-task', methods=['POST'])
@cross_origin(supports_credentials=True)
def update_task():
    db, cursorDb = createDbConnection()
    data = request.get_json() 
    task_title = data['task_title']
    task_description = data['task_description']
    project_name = data['project_name']
    assignee = data['assignee']
    status = data['status']
    updatedAt = data['updatedAt']
    taskID = data['taskID']
    print(assignee,status,updatedAt,taskID)
    # cursorDb.execute(querys.GetEmptyRoomsList(room_type))
    # emptyRooms = cursorDb.fetchall()
    # emptyRoomNo = emptyRooms[0]['room_number']

    cursorDb.execute("update ProjectManagement set status = %s, assignee = %s, updatedAt = %s, task_title = %s, task_description = %s, project_name = %s where taskID = %s", (status, assignee, updatedAt, task_title, task_description, project_name, taskID))

    # cursorDb.execute(querys.UpdateAvailableRoom(emptyRoomNo))
    try:
        # Database operations (insert, update, delete)
        db.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()  # Rollback changes in case of an exception
    finally:
        closeDbConnection(db, cursorDb)
    # return jsonify({'message': 'Hotel created successfully'}), 201
    return jsonify({"data": "success"})


@hotel_blueprint.route('/delete-task', methods=['POST'])
@cross_origin(supports_credentials=True)
def delete_task():
    db, cursorDb = createDbConnection()
    data = request.get_json()
    taskID = data['taskID']

    print(taskID)
    # cursorDb.execute(querys.GetEmptyRoomsList(room_type))
    # emptyRooms = cursorDb.fetchall()
    # emptyRoomNo = emptyRooms[0]['room_number']

    cursorDb.execute(f"update ProjectManagement set isActive = '0' where taskID = {taskID}")

    # cursorDb.execute(querys.UpdateAvailableRoom(emptyRoomNo))
    try:
        # Database operations (insert, update, delete)
        db.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()  # Rollback changes in case of an exception
    finally:
        closeDbConnection(db, cursorDb)
    # return jsonify({'message': 'Hotel created successfully'}), 201
    return jsonify({"data": "success"})

@hotel_blueprint.route('/tasks-by-id', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_tasks_by_id():
    db, cursorDb = createDbConnection()
    taskId = request.args.get("taskID")

    query = querys.TaskByID(taskId)
    cursorDb.execute(query) #query execution 
    tasks = cursorDb.fetchall() # fetch all data from query
    closeDbConnection(db, cursorDb) # close connection from db
    return jsonify({"Data": tasks}) # send data in json format

@hotel_blueprint.route('/tasks-by-status', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_tasks_by_status():
    db, cursorDb = createDbConnection()
    status = request.args.get("status")
    query = querys.TaskByStatus(status)
    cursorDb.execute(query)
    tasks = cursorDb.fetchall()

    closeDbConnection(db, cursorDb)
    return jsonify({"Data": tasks})


@hotel_blueprint.route('/tasks', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_tasks():
    db, cursorDb = createDbConnection()
    status = request.args.get("status")
    query = querys.Tasks
    cursorDb.execute(query)
    tasks = cursorDb.fetchall()

    closeDbConnection(db, cursorDb)
    return jsonify({"Data": tasks})

################### Employee Management ############################3
@hotel_blueprint.route('/employees', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_employees():
    db, cursorDb = createDbConnection()
    query = querys.Employees
    cursorDb.execute(query)
    employees = cursorDb.fetchall()

    closeDbConnection(db, cursorDb)
    return jsonify({"Data": employees})


###################Employee Status Management################
@hotel_blueprint.route('/add-employee-status', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_employee_status():
    db, cursorDb = createDbConnection()
    data = request.get_json()
    # taskTitle = data['taskTitle']
    # taskDescription = data['taskDescription']
    # project_name = data['project_name']
    status = data['employeeDescription']
    assignee = data['assignee']
    createdAt = data['createdAt']
    # taskID = data['taskID']
    # cursorDb.execute(querys.GetEmptyRoomsList(room_type))
    # emptyRooms = cursorDb.fetchall()
    # emptyRoomNo = emptyRooms[0]['room_number']

    cursorDb.execute("insert into EmployeeStatuses (status, employee_name, createdAt) values(%s, %s, %s)", (status, assignee, createdAt))

    # cursorDb.execute(querys.UpdateAvailableRoom(emptyRoomNo))
    try:
        # Database operations (insert, update, delete)
        db.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()  # Rollback changes in case of an exception
    finally:
        closeDbConnection(db, cursorDb)
    # return jsonify({'message': 'Hotel created successfully'}), 201
    return jsonify({"data": "success"})

@hotel_blueprint.route('/employee-statuses', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_employees_status():
    db, cursorDb = createDbConnection()
    # status = request.args.get("status")
    query = querys.Employee_Status
    cursorDb.execute(query)
    tasks = cursorDb.fetchall()
    closeDbConnection(db, cursorDb)
    return jsonify({"Data": tasks})

########################### Projects #########################
@hotel_blueprint.route('/projects', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_projects():
    db, cursorDb = createDbConnection()
    query = querys.Projects
    cursorDb.execute(query)
    projects = cursorDb.fetchall()

    closeDbConnection(db, cursorDb)
    return jsonify({"Data": projects})

###################### Leave Management ##########################
@hotel_blueprint.route('/create-leave', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_leaves():
    db, cursorDb = createDbConnection()
    data = request.get_json()
    assignee = data["assignee"]
    leaveTitle = data["leaveTitle"]
    leaveDescription = data["leaveDescription"]
    leaveDate = data["leaveDate"]
    leaveDuration = data["leaveDuration"]
    status = data["status"]
    createdAt = data["createdAt"]
    params = (assignee, leaveTitle, leaveDescription, leaveDate, leaveDuration, status, createdAt)
    cursorDb.execute("INSERT INTO LeaveStatuses (assignee, leaveTitle, leaveDescription, leaveDate, leaveDuration, status, createdAt) VALUES (%s, %s, %s, %s, %s, %s, %s)", params)
    try:
        # Database operations (insert, update, delete)
        db.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()  # Rollback changes in case of an exception
    finally:
        closeDbConnection(db, cursorDb)
    # Indent this return statement to be inside the try-except-finally block
    return jsonify({"data": "success"})

@hotel_blueprint.route('/leave-statuses', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_leaveStatus():
    db, cursorDb = createDbConnection()
    query = querys.Leaves
    cursorDb.execute(query)
    leaves = cursorDb.fetchall()

    closeDbConnection(db, cursorDb)
    return jsonify({"Data": leaves})
