/** Crear un conjunto de funciones que van a dar respuesta a nuestras rutas  */
const mongoose = require('mongoose');

// Importamos el modelo
const Apartment = require('../models/apartment.model.js');
const Reservation = require('../models/reservation.model.js');

const getApartments = async (req, res) => {

    // Obtenemos todos los apartamentos de la base de datos
    const apartments = await Apartment.find().sort({ _id: -1 });
    console.log(res.locals.success_msg)

    res.render('home', {
        apartments,
        isAuthenticated: req.session.isAuthenticated,
        role: req.session.role,
        username: req.session.username

    });
}

const getApartmentById = async (req, res) => {
    // 1. Obtain the apartment ID from the request parameters
    const { idApartment } = req.params;

    try {
        // Fetch the selected apartment from the database
        const selectedApartment = await Apartment.findById(idApartment);
        
        // Check if the apartment exists
        if (!selectedApartment) {
            req.flash('error_msg', 'Apartamento no encontrado.');
            return res.redirect('/');
        }

        // Render the detail view and pass the selected apartment
        res.render('detail-apartment', {
            selectedApartment
        });
    } catch (error) {
        req.flash('error_msg', 'Error al obtener los detalles del apartamento.');
        return res.redirect('/');
    }
};


const searchApartments = async (req, res) => {
    // Parse the query string received from the form
    const { capacity, maxPrice, city, startDate, endDate, orderBy } = req.query;

    // Dictionary for sorting criteria
    const orderDict = {
        "default": { _id: -1 },
        "minPrice": { price: 1 }
    };

    const sortCriteria = orderDict[orderBy] || orderDict.default; // Default to 'default' if orderBy is not valid
    console.log("sortCriteria:", sortCriteria);

    // Build filter object
    const filter = {};

    // Add conditions based on the provided query parameters
    if (maxPrice) {
        filter.price = { $lte: Number(maxPrice) }; // Ensure maxPrice is a number
    }
    if (capacity) {
        filter.capacity = { $gte: Number(capacity) }; // Change from $lte to $gte for proper capacity filtering
    }
    if (city) {
        filter.city = city; // Only apply city filter if it's provided
    }

    // Reservations filter logic
    if (startDate && endDate) {
        filter.reservations = {
            $not: {
                $elemMatch: {
                    startDate: { $lt: new Date(endDate) },
                    endDate: { $gt: new Date(startDate) } // Ensure there's no overlap
                }
            }
        };
    }

    try {
        // Fetch filtered apartments and sort
        const apartments = await Apartment.find(filter).sort(sortCriteria);

        // Pass filtered apartments to the view
        res.render('home', {
            apartments
        });
    } catch (error) {
        console.error("Error fetching apartments:", error);
        res.status(500).send('Internal Server Error');
    }
};   

const postNewReservation = async (req, res) => {
    const { email, startDate, endDate, idApartment } = req.body;

    try {

        console.log('Received reservation data:', { email, startDate, endDate, idApartment });

        // Validar las fechas de la reserva
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validar si las fechas son correctas
        if (start >= end) {
            req.flash('error_msg', 'La fecha de inicio debe ser anterior a la fecha de fin.');
            return res.redirect(`/apartment/${idApartment}`);
        }

        // Recuperar el apartamento usando el ID proporcionado
        const apartment = await Apartment.findById(idApartment);
        
        // Verificar si se encontró el apartamento
        //console.log("Apartamento encontrado:", apartment);

        if (!apartment) {
            req.flash('error_msg', 'Apartamento no encontrado.');
            return res.redirect('/');
        }


        // Validar si el apartamento essta reservado en las fechas solicitadas
        const apartmentAlreadyBooked = await Reservation.find({
            apartment: apartment._id,
            $or: [
                {startDate: { $lt: end},  endDate: {$gt: start} }, // verififca que la  nueva reserva no se sobreponga sobre otra ya existente
                {startDate: {$gte: start, $lte: end}}, // verifica qu ela fecha de inciio de la nueva reserva no esta dentro de una reserva existente
                {endDate: { $gte: start, $lte: end}} // mismo que antes pero que la fecha fin no este dento de una reserva ya existente
            ]
        })

        if (apartmentAlreadyBooked.length > 0) {
            req.flash('error_msg', 'This apartament is already booked for the selected days');
            return res.redirect(`/apartment/${idApartment}`);
        }


        // Crear la reserva
        const newReservation = await Reservation.create({
            email,
            startDate,
            endDate,
            apartment: apartment._id,
        });

        // verificar los datos creados de la reserva
        console.log("Reserva creada:", newReservation);

        // Renderizar la vista con los detalles de la reserva
        res.render('reservation-confirmation', {
            reservation: {
                email: newReservation.email,
                startDate: newReservation.startDate,
                endDate: newReservation.endDate,
                status: newReservation.status,
                apartment: {
                    title: apartment.title,
                    price: apartment.price
                }
            }
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error al crear la reserva.');
        res.redirect(`/apartment/${idApartment}`);
    }
};


module.exports = {
    getApartments,
    getApartmentById,
    searchApartments,
    postNewReservation
}