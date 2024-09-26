from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Roles(db.Model):
    id_role = db.Column(db.Integer,primary_key=True)
    name_role = db.Column(db.String(200),nullable=False)

class Users(db.Model):
    id_user = db.Column(db.Integer,primary_key=True)
    id_role = db.Column(db.Integer,db.ForeignKey('roles.id_role'),nullable=False)
    name_user = db.Column(db.String(60),nullable=False)
    lastname_user = db.Column(db.String(60),nullable=False)
    dni_user = db.Column(db.String(8),nullable=False,unique=True)
    birthday = db.Column(db.Date,nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Kindoftask(db.Model):
    id_kindoftask = db.Column(db.Integer,primary_key=True)
    name_kindoftask = db.Column(db.String(200),nullable=False)

class Task(db.Model):
    id_task = db.Column(db.Integer,primary_key=True) 
    id_kindoftask = db.Column(db.Integer,db.ForeignKey('kindoftask.id_kindoftask'),nullable=False)
    description = db.Column(db.String(1000),nullable=False)
    created_by = db.Column(db.Integer,db.ForeignKey('users.id_user'),nullable=False)

class Scheduled(db.Model):
    id_scheduled = db.Column(db.Integer,primary_key=True) 
    id_task = db.Column(db.Integer,db.ForeignKey('task.id_task'),nullable=False)
    time_init = db.Column(db.DateTime, nullable=False)
    duration_estimated = db.Column(db.Integer,nullable=False)
    duration_real = db.Column(db.Integer,nullable=True)
    time_end_estimated = db.Column(db.DateTime, nullable=False)
    time_end_real = db.Column(db.Integer,nullable=True)
    assigned_by = db.Column(db.Integer,db.ForeignKey('users.id_user'),nullable=False)
    assigned_to = db.Column(db.Integer,db.ForeignKey('users.id_user'),nullable=False)
    assigned_by_user = db.relationship('Users', foreign_keys=[assigned_by], backref='assigned_by_tasks')
    assigned_to_user = db.relationship('Users', foreign_keys=[assigned_to], backref='assigned_to_tasks')
    task = db.relationship('Task', backref=db.backref('scheduled_tasks', lazy=True))