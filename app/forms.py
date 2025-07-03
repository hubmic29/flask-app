from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length

class LoginForm(FlaskForm):
    username = StringField('Nazwa użytkownika', validators=[InputRequired(), Length(min=4)])
    password = PasswordField('Hasło', validators=[InputRequired(), Length(min=4)])
    submit = SubmitField('Zaloguj')

class RegisterForm(FlaskForm):
    username = StringField('Nazwa użytkownika', validators=[InputRequired(), Length(min=4)])
    password = PasswordField('Hasło', validators=[InputRequired(), Length(min=4)])
    submit = SubmitField('Zarejestruj')

class TaskForm(FlaskForm):
    text = StringField('Zadanie', validators=[InputRequired()])
    submit = SubmitField('Dodaj zadanie')
