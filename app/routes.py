from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash
from . import db, login_manager
from .models import User, Task
from app import socketio
from flask_login import logout_user

main = Blueprint("main", __name__)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@main.route("/")
@login_required
def index():
    shopping = Task.query.filter_by(category="shopping").all()
    todo = Task.query.filter_by(category="todo").all()
    important = Task.query.filter_by(category="important").all()

    return render_template(
        "index.html",
        shopping_tasks=shopping,
        todo_tasks=todo,
        important_tasks=important,
    )


@socketio.on("new_task")
def handle_new_task(data):
    task_text = data.get("text")
    category = data.get("category")

    new_task = Task(text=task_text, user_id=current_user.id, category=category)
    db.session.add(new_task)
    db.session.commit()

    socketio.emit(
        "broadcast_task",
        {
            "id": new_task.id,
            "text": task_text,
            "user_id": current_user.id,
            "category": category,
        },
    )


@socketio.on("delete_task")
def handle_delete_task(data):
    task_id = data.get("id")
    task = Task.query.get(task_id)

    if task:
        db.session.delete(task)
        db.session.commit()
        socketio.emit("task_deleted", {"id": task_id})


@main.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for("main.index"))

        return "Invalid login"

    return render_template("login.html")


@main.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("main.login"))


@main.route("/todo")
def todo():
    return render_template("todo.html")
