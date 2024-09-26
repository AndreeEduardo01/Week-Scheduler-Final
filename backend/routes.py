from flask import Blueprint, jsonify, request, Flask, current_app
from models import db, Task,Scheduled,Users,Kindoftask,Roles
from werkzeug.security import check_password_hash
import jwt
import datetime

tasks_bp = Blueprint('tasks_bp', __name__)

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            current_user_id = decode_token(token)
            if not current_user_id:
                return jsonify({'message': 'Invalid or expired token!'}), 401
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user_id, *args, **kwargs)

    return decorated

@tasks_bp.route('/kindoftasks', methods=['GET'])
def get_kindoftasks():
    kindoftasks= Kindoftask.query.all()
    return jsonify([
        {
        'id_kindoftask': kindoftask.id_kindoftask,
        'name_kindoftask':kindoftask.name_kindoftask
         } for kindoftask in kindoftasks
    ])

@tasks_bp.route('/schedule', methods=['POST'])
def schedule_task():
    token = request.headers.get('Authorization').split()[1] 
    try:
        decoded_token = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded_token['user_id']
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

    data = request.json
    new_scheduled_task = Scheduled(
        id_task=data['id_task'],
        time_init=data['time_init'],
        duration_estimated=data['duration_estimated'],
        assigned_to=data['assigned_to'],
        assigned_by=user_id, 
        time_end_estimated=data['time_end_estimated']
    )
    db.session.add(new_scheduled_task)
    db.session.commit()
    return jsonify({'message': 'Task scheduled successfully!'}), 201

@tasks_bp.route('/scheduled', methods=['GET'])
def get_schedules():
    start = request.args.get('start')
    end = request.args.get('end')

    schedules = Scheduled.query.join(Task, Scheduled.id_task == Task.id_task).filter(Scheduled.time_init.between(start,end)).all()

    return jsonify([{
        'id_scheduled': s.id_scheduled,
        'id_task': s.id_task,
        'time_init':s.time_init,
        'duration_estimated' : s.duration_estimated,
        'duration_real' : s.duration_real,
        'time_end_estimated' : s.time_end_estimated,
        'time_end_real' : s.time_end_real,
        'assigned_by' : s.assigned_by,
        'assigned_to' : s.assigned_to,
        'description':s.task.description
    } for s in schedules])

@tasks_bp.route('/users', methods=['GET'])
def get_users():
    users = Users.query.all()
    return jsonify([
        {
            'id_user': user.id_user,
            'name_user': user.name_user,
            'lastname_user': user.lastname_user
        } for user in users
    ])

@tasks_bp.route('/users', methods=['POST'])
def add_user():
    data = request.json
    new_user = Users(
        id_role=data['id_role'],
        name_user=data['name_user'],
        lastname_user=data['lastname_user'],
        dni_user=data['dni_user'],
        birthday=data['birthday'],)
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Task scheduled successfully!'}), 201

@tasks_bp.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([
        {
            'id_task': task.id_task,
            'id_kindoftask': task.id_kindoftask,
            'description': task.description,
            'created_by': task.created_by
        } for task in tasks
    ])

@tasks_bp.route('/tasks', methods=['POST'])
def add_task():
    token = request.headers.get('Authorization').split()[1]
    try:
        decoded_token = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded_token['user_id']
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

    data = request.json
    if not all(key in data for key in ('id_kindoftask', 'description')):
        return jsonify({'error': 'Missing data'}), 400

    new_task = Task(
        id_kindoftask=data['id_kindoftask'],
        description=data['description'],
        created_by=user_id 
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Tarea agregada', 'id_task': new_task.id_task}), 201    
    


@tasks_bp.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'})

# LOGIN
@tasks_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    dniuser = data.get('dni_user')
    password = data.get('password')
    returned_user = Users.query.filter_by(dni_user=dniuser).first()
    if returned_user and returned_user.check_password(password):
        # Generar token JWT usando la clave secreta de la app
        token = jwt.encode({
            'user_id': str(returned_user.id_user),
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({'token': token}), 200

    else:
        return jsonify({'message': 'Invalid username or password'}), 401

# ROLES
@tasks_bp.route('/roles', methods=['GET'])
def get_roles():
    roles = Roles.query.all()
    return jsonify([{'id_role': role.id_role, 'name_role': role.name_role} for role in roles])