var Model = require(process.env.root + '/lib/mongo/model');
var validator = require('validator');
var sha1 = require('sha1');
var md5 = require('MD5');

var properties = {
    email: String,
    password: { type: String, select: false },
    name: String,
    image: String
}

var options = {}

var methods = {
    getFullName: function () {
        return this.name;
    },

    setPassword: function (password) {
        this.password = sha1(password);
    },

    hasValidEmail: function () {
        return validator.isEmail(this.email);
    },

    setValues: function (values) {
        for (var key in values) {
            if (typeof values[key] === 'string' && values[key].trim() === '') continue;
            if (this.schema.statics.imutable.indexOf(key) > -1) continue;

            if (key === 'email') {
                if (typeof this['email'] !== 'undefined') continue;
                this[key] = values[key].toLowerCase();
                this['image'] = 'https://www.gravatar.com/avatar/' + md5(this[key]) + '?d=identicon&s=512';
            } else if (key === 'password') {
                this.setPassword(values[key]);
            } else {
                this.set(key, values[key]);
            }
        }

        return this;
    }
}

var statics = {};

module.exports = new Model('User', properties, options, methods, statics);
