from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_socketio import SocketIO
import os
from dotenv import load_dotenv
from flask_migrate import Migrate

load_dotenv()
db = SQLAlchemy()
login_manager = LoginManager()
socketio = SocketIO()

migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "main.login"
    socketio.init_app(app)

    from .routes import main

    app.register_blueprint(main)

    return app