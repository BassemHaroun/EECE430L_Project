import datetime
import imp
from flask import Flask, abort
from flask import request
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
from db_config import string
from scipy import stats
from sqlalchemy import func
app = Flask(__name__)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
app.config[
'SQLALCHEMY_DATABASE_URI'] = string
db = SQLAlchemy(app)

ma = Marshmallow(app)
bcrypt = Bcrypt(app)

CORS(app)

SECRET_KEY = "b'|\xe7\xbfU3`\xc4\xec\xa7\xa9zf:}\xb5\xc7\xb9\x139^3@Dv'"


from model.user import User,userSchema
from model.trans import Trans,transaction_schema,transactions_schema


def create_token(user_id):
    payload = {
    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=4),
    'iat': datetime.datetime.utcnow(),
    'sub': user_id
    }
    return jwt.encode(
    payload,
    SECRET_KEY,
    algorithm='HS256'
    )
def extract_auth_token(authenticated_request):
    auth_header = authenticated_request.headers.get('Authorization')
    if auth_header:
        return auth_header.split(" ")[1]
    else:
        return None
def decode_token(token):
     payload = jwt.decode(token, SECRET_KEY, 'HS256')
     return payload['sub']

@app.route('/authentication',methods=['POST'])
def authentication():
    username=request.json['user_name']
    password=request.json['password']
    if ( username is None or password is None):
        abort(400)
    else:
        user=db.session.execute(db.select(User).filter_by(user_name=request.json['user_name'])).scalar_one() 
        if(user is None):
            abort(403)
        else:
            if (bcrypt.check_password_hash(user.hashed_password, password)):
                token = create_token(user.id)
                return jsonify(token=token)
            else:
                abort(403)
            


@app.route('/user',methods=['POST'])
def user_record():
    user=User(request.json['user_name'],request.json['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(userSchema.dump(user))

@app.route('/user',methods=['GET'])
def user_info():
    token= extract_auth_token(request)
    if (token is None):
        abort(403)
    else:
        try:
            user_id=decode_token(token)
        except:
            abort(403)
        user= db.session.execute(db.select(User).filter_by(id=user_id)).scalar()
        
        return jsonify({"usd_wallet":user.usd_amount,"lbp_wallet":user.lbp_amount})


@app.route('/trans',methods=['POST'])
def trans_record():
    usd_amount = request.json['usd_amount']
    lbp_amount = request.json['lbp_amount']
    usd_to_lbp = request.json['usd_to_lbp']
    token= extract_auth_token(request)
    print(token)
    if (token is None):
        tx=Trans(usd_amount,lbp_amount,request,usd_to_lbp,None,None)
        db.session.add(tx)
        db.session.commit()
        return jsonify(transaction_schema.dump(tx))
    else:
        try:
            user_id=decode_token(token)
        except:
            abort(403)
        user =db.session.execute(db.select(User).filter_by(id=user_id)).scalar()
        if (usd_to_lbp and user.usd_amount >= float(usd_amount)) or (usd_to_lbp == False and user.lbp_amount >= float(lbp_amount)):
            tx=Trans(usd_amount,lbp_amount,usd_to_lbp,user_id,None)
            db.session.add(tx)
            db.session.commit()
            return jsonify(transaction_schema.dump(tx))
        else:
            return jsonify({"error":"insufficient funds"})

@app.route('/trans',methods=['Get'])
def fetchTrans():
    token= extract_auth_token(request)
    if (token is None):
        abort(403)
    else:
        try:
            userId=decode_token(token)
        except:
            abort(403)
        transactions= db.session.execute(db.select(Trans).filter_by(user_id=userId)).scalars()
        print(transactions)
        return jsonify(transactions_schema.dump(transactions))


@app.route('/exchangeRate',methods=['Get'])   
def find_exchangeRate():

    Trans.query.filter(Trans.added_date.between(datetime.date(2023,3,7), datetime.date(2023,3,10)),Trans.usd_to_lbp == True).all()

    usdToLbp = db.session.execute(db.select(Trans).filter_by(usd_to_lbp=True)).scalars()
    sumlbp1=0
    sumusd1=0
    for row in usdToLbp:
        sumlbp1+=row.lbp_amount
        sumusd1+=row.usd_amount
    if(sumusd1==0):
        avg1=None
    else:
        avg1=round(sumlbp1/sumusd1)

    lbpToUsd = db.session.execute(db.select(Trans).filter_by(usd_to_lbp=False)).scalars()
    sumlbp2=0
    sumusd2=0
    for row in lbpToUsd:
        sumlbp2+=row.lbp_amount
        sumusd2+=row.usd_amount
    if(sumusd2==0):
        avg2=None
    else:
        avg2=round(sumlbp2/sumusd2)
   
    return jsonify (
    usd_to_lbp= avg1,
    lbp_to_usd= avg2
    )
@app.route('/pending', methods=['Get'])
def pending():
    pend = db.session.execute(db.select(Trans).filter_by(buyer_id=None)).scalars()
    return jsonify(transactions_schema.dump(pend))
    

@app.route('/accept',methods=['POST'])
def accept():
    tx_id = request.json['transaction_id']
    print(tx_id)
    print(type(tx_id))
    pending=db.session.execute(db.select(Trans).filter_by(id=tx_id)).scalar()
    print(pending)
    buyer_id = None
    token = extract_auth_token(request)
    if token is not None:
        try:
            buyer_id = decode_token(token)
        except jwt.InvalidTokenError:
            abort(403)
    buyer=db.session.execute(db.select(User).filter_by(id=buyer_id)).scalar()
    seller=db.session.execute(db.select(User).filter_by(id=pending.seller_id)).scalar()
    if (pending.usd_to_lbp == False and buyer.usd_amount >= pending.usd_amount and seller.lbp_amount >= pending.lbp_amount) or (
            pending.usd_to_lbp and buyer.lbp_amount >= pending.lbp_amount and seller.usd_amount >= pending.usd_amount):
        pending.buyer_id=buyer.id
        if pending.usd_to_lbp:
            buyer.lbp_amount -= float(pending.lbp_amount)
            buyer.usd_amount += float(pending.usd_amount)
            seller.lbp_amount += float(pending.lbp_amount)
            seller.usd_amount -= float(pending.usd_amount)
        else:
            buyer.lbp_amount += float(pending.lbp_amount)
            buyer.usd_amount -= float(pending.usd_amount)
            seller.lbp_amount -= float(pending.lbp_amount)
            seller.usd_amount += float(pending.usd_amount)

      
        db.session.commit()
        return jsonify(transaction_schema.dump(tx))
    else:
         return jsonify({"error": "insufficient funds"})
@app.route('/exchangeRateStats', methods=['POST'])
def exchange_rate_stats():
    # extract start date from user input
    try:
        start_date_str = request.json['start_date']
        end_date_str = request.json['end_date']
        start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d %H:%M:%S')
        end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d %H:%M:%S')

        # calculate exchange rate statistics
        usd_to_lbp_tx = db.session.execute(
            db.select(Trans)
            .filter(Trans.usd_to_lbp == True,Trans.added_date >= start_date, Trans.added_date <= end_date)
            .order_by(Trans.added_date)
        ).scalars()
        lbp_to_usd_tx = db.session.execute(
            db.select(Trans)
            .filter(Trans.usd_to_lbp == False, Trans.added_date >= start_date, Trans.added_date <= end_date)
            .order_by(Trans.added_date)
        ).scalars()

        # calculate the average exchange rate for each direction
        usd_to_lbp_rates = [tx.lbp_amount / tx.usd_amount for tx in usd_to_lbp_tx if tx.usd_amount > 0]
        lbp_to_usd_rates = [tx.usd_amount / tx.lbp_amount for tx in lbp_to_usd_tx if tx.lbp_amount > 0]
        usd_to_lbp_avg = round(sum(usd_to_lbp_rates) / len(usd_to_lbp_rates), 2) if usd_to_lbp_rates else None
        lbp_to_usd_avg = round(sum(lbp_to_usd_rates) / len(lbp_to_usd_rates), 2) if lbp_to_usd_rates else None

        # calculate other exchange rate statistics
        usd_to_lbp_min = min(usd_to_lbp_rates) if usd_to_lbp_rates else None
        usd_to_lbp_max = max(usd_to_lbp_rates) if usd_to_lbp_rates else None
        usd_to_lbp_median = sorted(usd_to_lbp_rates)[len(usd_to_lbp_rates) // 2] if usd_to_lbp_rates else None
        lbp_to_usd_min = min(lbp_to_usd_rates) if lbp_to_usd_rates else None
        lbp_to_usd_max = max(lbp_to_usd_rates) if lbp_to_usd_rates else None
        lbp_to_usd_median = sorted(lbp_to_usd_rates)[len(lbp_to_usd_rates) // 2] if lbp_to_usd_rates else None
        usd_to_lbp_var = round(stats.variation(usd_to_lbp_rates), 2) if len(usd_to_lbp_rates) > 1 else None
        lbp_to_usd_var = round(stats.variation(lbp_to_usd_rates), 2) if len(lbp_to_usd_rates) > 1 else None
        usd_to_lbp_stddev = round(stats.tstd(usd_to_lbp_rates), 2) if len(usd_to_lbp_rates) > 1 else None
        lbp_to_usd_stddev = round(stats.tstd(lbp_to_usd_rates), 2) if len(lbp_to_usd_rates) > 1 else None
    
    # return exchange rate statistics as JSON
        return jsonify({
            'start_date': start_date_str,
            'usd_to_lbp_avg': usd_to_lbp_avg,
            'usd_to_lbp_min': usd_to_lbp_min,
            'usd_to_lbp_max': usd_to_lbp_max,
            'usd_to_lbp_median': usd_to_lbp_median,
            'lbp_to_usd_avg': lbp_to_usd_avg,
            'lbp_to_usd_min': lbp_to_usd_min,
            'lbp_to_usd_max': lbp_to_usd_max,
            'lbp_to_usd_median': lbp_to_usd_median,
            'usd_to_lbp_var': usd_to_lbp_var,
            'lbp_to_usd_var': lbp_to_usd_var,
            'usd_to_lbp_stddev':usd_to_lbp_stddev,
            'lbp_to_usd_stddev':lbp_to_usd_stddev
        })
    except:
        return jsonify({'error': 'Invalid date format. Please use the format YYYY-MM-DD HH:MM:SS.'}), 400



@app.route('/graph', methods=['POST'])
def graph():
    try:
    # extract start date from user input
        start_date_str = request.json['start_date']
        end_date_str = request.json['end_date']
        start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d %H:%M:%S')
        end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d %H:%M:%S')

        # check if start date is today's date
        today = datetime.datetime.now().date()
        if start_date.date() == today:
            # retrieve transactions from database grouped by hour
            transactions = db.session.execute(
            db.select(Trans)
            .filter(Trans.usd_to_lbp == True, Trans.added_date >= start_date, Trans.added_date <= end_date)
            ).scalars()

        # calculate average exchange rate for each hour
            hourly_rates = {}
            for tx in transactions:
                date_str = str(tx.added_date.date())
                hour_str = str(tx.added_date.hour)
            
                if date_str not in hourly_rates:
                    hourly_rates[date_str] = {}
                hourly_rates[date_str][hour_str] = hourly_rates[date_str].get(hour_str, {'total_usd': 0, 'total_lbp': 0, 'count': 0})
                hourly_rates[date_str][hour_str]['total_usd'] += tx.usd_amount
                hourly_rates[date_str][hour_str]['total_lbp'] += tx.lbp_amount
                hourly_rates[date_str][hour_str]['count'] += 1
            rates = []   
            for date_str, hours in hourly_rates.items():
                for hour_str, data in hours.items():
                    avg_rate = data['total_lbp'] / data['total_usd']
                    rates.append((datetime.datetime.strptime(date_str + ' ' + hour_str, '%Y-%m-%d %H'), avg_rate))
        else:
            # retrieve transactions from database
            transactions = db.session.execute(
                db.select(Trans)
                .filter(Trans.usd_to_lbp == True, Trans.added_date >= start_date, Trans.added_date <= end_date)
                .order_by(Trans.added_date)
            ).scalars()

            # calculate average exchange rate for each day
            daily_rates = {}
            for tx in transactions:
                date_str = str(tx.added_date.date())
                if date_str not in daily_rates:
                    daily_rates[date_str] = {'total_usd': 0, 'total_lbp': 0, 'count': 0}
                daily_rates[date_str]['total_usd'] += tx.usd_amount
                daily_rates[date_str]['total_lbp'] += tx.lbp_amount
                daily_rates[date_str]['count'] += 1
            rates = []
            for date_str, data in daily_rates.items():
                avg_rate = data['total_lbp'] / data['total_usd']
                rates.append((datetime.datetime.strptime(date_str, '%Y-%m-%d'), avg_rate))

        return jsonify({'rates': rates})
    except:
         return jsonify({'error': 'Invalid date format. Please use the format YYYY-MM-DD HH:MM:SS.'}), 400
    

@app.route('/addFunds', methods=['Post'])
def addFunds():
    usd_amount = request.json['usd_amount']
    lbp_amount = request.json['lbp_amount']
    user_id = None
    token = extract_auth_token(request)
    if token is not None:
        try:
            user_id = decode_token(token)
            print(user_id)
        except jwt.InvalidTokenError:
           return jsonify({'error': 'Invalid input'}),403
    
    if usd_amount < 0 or lbp_amount < 0:
       abort(403)
    user=db.session.execute(db.select(User).filter_by(id=user_id)).scalar()
    
    user.usd_amount += int(usd_amount)
    user.lbp_amount += int(lbp_amount)
    db.session.commit()

    return jsonify(userSchema.dump(user))
    