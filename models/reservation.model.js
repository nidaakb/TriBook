const { Schema, model } = require('mongoose');

const reservationSchema = Schema({
    email: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    apartment: { type: Schema.Types.ObjectId, ref: 'Apartment' }
});

const Reservation = model('Reservation', reservationSchema);
module.exports = Reservation;