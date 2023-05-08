from app import db, ma, bcrypt


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(30), unique=True)
    hashed_password = db.Column(db.String(128))
    usd_amount = db.Column(db.Float, unique=False, nullable=True)
    lbp_amount = db.Column(db.Float, nullable=True)
    def __init__(self, user_name, password):
        super(User, self).__init__(user_name=user_name)
        self.hashed_password = bcrypt.generate_password_hash(password)
        self.usd_amount = 0
        self.lbp_amount = 0
class user_schema(ma.Schema):
    class Meta:
        fields= ("id","user_name","usd_amount","lbp_amount")
        model=User
userSchema= user_schema()