import ldap
from flask_wtf import Form
from wtforms import TextField, PasswordField
from wtforms.validators import InputRequired
from authapp import db, app


def get_ldap_connection():
    conn = ldap.initialize(app.config['LDAP_PROVIDER_URL'])
    conn.protocol_version = ldap.VERSION3
    conn.set_option(ldap.OPT_REFERRALS, 0)
    return conn


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))

    def __init__(self, username, password):
        self.username = username


    @staticmethod
    def try_login(username, password):
        conn = get_ldap_connection()
        conn.simple_bind_s(username + "@rcsl.lu", password)
        


    """ @staticmethod
    def try_login(username, password):
        conn = get_ldap_connection()
        conn.simple_bind_s(username, password)
        base = "dc=rcsl, dc=lu"
        criteria = "(&(objectClass=user)(sAMAccountName=username))"
        attributes = ['displayName', 'company']
        result = conn.search_s(base, ldap.SCOPE_SUBTREE, criteria, attributes)
 
        results = [entry for dn, entry in result if isinstance(entry, dict)]
        print (results) """

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return f"{self.id}"


class LoginForm(Form):
    username = TextField('Username', [InputRequired()])
    password = PasswordField('Password', [InputRequired()])
