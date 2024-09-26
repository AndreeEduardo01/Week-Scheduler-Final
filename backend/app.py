from flask import Flask
from models import db,Kindoftask,Roles
from routes import tasks_bp
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:blue@localhost/db_schedule'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'SIDERAL'

db.init_app(app)
migrate = Migrate(app,db)
app.register_blueprint(tasks_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        #Esto es para poblar con algunos datos la base de datos al inicializarla
        if not Kindoftask.query.first():
            task1 = Kindoftask(name_kindoftask="READY")
            task2 = Kindoftask(name_kindoftask="DELAY")
            task3 = Kindoftask(name_kindoftask="STANDBY")
            db.session.add_all([task1, task2, task3])
            db.session.commit()
        if not Roles.query.first():
            rol1 = Roles(name_role="admin")
            rol2 = Roles(name_role="analyst")
            db.session.add_all([rol1, rol2])
            db.session.commit()
    app.run(debug=True)