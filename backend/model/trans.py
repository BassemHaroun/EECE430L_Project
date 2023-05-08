from app import db,ma
import datetime

class Trans(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usd_amount=db.Column(db.Float,nullable=False)
    lbp_amount=db.Column(db.Float,nullable=False)
    usd_to_lbp=db.Column(db.Boolean,nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=True)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=True)
    added_date = db.Column(db.DateTime)
    
    def __init__(self,usd_amount,lbp_amount,usd_to_lbp,seller_id,buyer_id):
       super(Trans, self).__init__(usd_amount=usd_amount,lbp_amount=lbp_amount, usd_to_lbp=usd_to_lbp,seller_id=seller_id,buyer_id=buyer_id,added_date=datetime.datetime.now())


class TransactionSchema(ma.Schema):
    class Meta:
        fields = ("id", "usd_amount", "lbp_amount", "usd_to_lbp","seller_id","buyer_id","added_date")
        model = Trans
transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True) 