import express from 'express';
const app = express();
const port = 8000;
import { use, authenticate } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { meet as Meeting } from 'google-meet-api';


clientID = "733040958719-oveoc1dummk6ohqka9umksaf6o0ts4da.apps.googleusercontent.com"
clientSecret="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"

use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:8000/auth/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        Meeting({
            clientId: clientID,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            date: "2022-06-30",
            time: "04:30",
            summary: 'summary',
            location: 'location',
            description: 'description',
            checking:0
        }).then(function (result) {
            console.log(result);
        }).catch((error) => {
            console.log(error)
        });
        return cb();
    }
));

app.get('/auth/callback',
    authenticate('google', { failureRedirect: '/' })
);

app.get('/auth/google',
    authenticate('google', {
        scope: ['profile','https://www.googleapis.com/auth/calendar'],
        accessType: 'offline',
        prompt: 'consent'
    }
    ));

app.get('/',function(req,res){
    res.send("done")
})

app.listen(port, function (err) {
    if (err) {
        console.log('something wrong in starting server !!!');
        return;
    }
    return console.log("server is up and running on port ", port);
});
