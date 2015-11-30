var User = require(process.env.root + '/models/user');
var sha1 = require('sha1');

module.exports =
{
    get: function (req, res) {
        if (!req.session.user) return res.status(404).send('Session not found');
        res.json(req.session);
    },

    authorize: function (req, res) {
        User.findOne({
            email : req.body.email.toLowerCase(),
            password : sha1(req.body.password)
        })
        .exec()
        .then(function (user) {
            if (!user) return res.status(400).send('Invalid email or password');
            req.session.user = user;
            res.json({
                redirect : req.headers.referer,
                user : req.session.user
            });
        }, function (err) {
            return res.status(400).send('Invalid email or password');
        });
    },

    unauthorize: function (req, res) {
        delete req.session.user;
        res.end();
    }
}
