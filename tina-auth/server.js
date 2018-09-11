import {authenticated} from 'jwt-active-directory';
import {Authenticator, authenticated} from 'jwt-active-directory'


const authenticator = new Authenticator({
    url: 'ldap://rcsl.lu:1389',
    baseDN: 'dc=rcsl,dc=lu',
    username: 'adminctg@rcsl.lu',
    //username: 'CN=Authenticator,OU=Special Users,DC=domain,DC=com',
    password: 'Ctgsup*0322',
    logging: {
        name: 'ActiveDirectory',
        streams: [
            {
                level: 'error',
                stream: process.stdout
            }
        ]
    }
});


app.post('/authenticate', function (req, res) {
	if(req.body.username && req.body.password) {
	

authenticator.authenticateAndSign('user@domain.com', 'password', 'no-so-secret-key', {
    expiresIn: '1 day'
},
// Optional claims argument
{
    extra: 'payload options',
    foo: 'bar',
    hello: 'Worl!'
})
.then(({auth, user, groups, token}) => {

    console.log('auth', auth);
    console.log('user', user);
    console.log('groups', groups);
    console.log('token', token);


    var expires = parseInt(moment().add(2, 'days').format("X"));
    var token = jwt.encode({
            exp: expires,
            user_name: user.uid,
            full_name: user.cn,
            mail: user.mail
        }, app.get('jwtTokenSecret'));

        res.json({token: token, full_name: user.cn});
    }).catch((err) => {
        console.log(err);
    })




}}
)

