from app import app

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Tanmay123!@localhost/fsfdb'
app.config['JWT_SECRET_KEY'] = 'snKEXvFy+C8gNgD+uCslD+STavZWV8La+haS6sMw1dU='
