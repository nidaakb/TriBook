const { Schema, model } = require('mongoose');

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ 
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'Password must contain at least 6 characters.'],
        validate: {
            validator: function(v) {
                return /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(v);
            },
            message: 'The password must be at least 6 characters, including one capital letter, one number and one special character.'
        } 
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    }
});


const User = model('User', userSchema);
module.exports = User;