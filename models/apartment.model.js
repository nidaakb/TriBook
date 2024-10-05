// Your code here ...
const { Schema, model } = require('mongoose');


const apartmentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true,
        min: 0
    },
    mainPhoto: {
        type: String,
        required: true,
        match: [/^(https):\/\/[^\s/$.?#].[^\s]*$/i, 'Invalid URL. Please insert a valid URL.']
    },
    services: {
        type: [String],  // Array of services
        enum: ['air_conditioning','disability_access', 'heating', 'tv', 'kitchen', 'wifi', 'balcony', 'gym', 'pool'], 

    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    rooms: {
        type: Number,
        required: true,
        min: 1,
        max:10
    },
    beds:{
        type: Number,
        required: true,
        min: 1,
        max:10
    },
    bathrooms: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    city: {
        type: String,
        required: true
    },
    latitude: {
        type:Number,
        required: true
    },
    longitude: {
        type:Number,
        required: true 
    }
});

const Apartment = model('Apartment', apartmentSchema);

// Exporta un único recurso
module.exports = Apartment;