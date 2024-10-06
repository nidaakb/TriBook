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
        isAuthenticated: req.session.isAuthenticated || false,
        role: req.session.role || null,
        username: req.session.username || 'Guest'
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
            req.flash('error_msg', 'Apartament not found.');
            return res.redirect('/');
        }

        // Render the detail view and pass the selected apartment
        res.render('detail-apartment', {
            selectedApartment
        });
    } catch (error) {
        req.flash('error_msg', 'Error retrieving apartment details.');
        return res.redirect('/');
    }
};


const searchApartments = async (req, res) => {
    const { capacity, maxPrice, city, startDate, endDate, orderBy } = req.query;

    const orderDict = {
        "default": { _id: -1 },
        "minPrice": { price: 1 }
    };

    const sortCriteria = orderDict[orderBy] || orderDict.default;
    console.log("sortCriteria:", sortCriteria);

    const filter = {};

    if (maxPrice) {
        filter.price = { $lte: Number(maxPrice) };
    }
    if (capacity) {
        filter.capacity = { $gte: Number(capacity) };
    }
    if (city) {
        filter.city = city;
    }

    try {
        let reservedApartments = [];

        // Verifica si se han proporcionado fechas de inicio y fin
        if (startDate && endDate) {
            const reservations = await Reservation.find({
                $or: [
                    { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } }
                ]
            });

            reservedApartments = reservations.map(reservation => reservation.apartment.toString());
        }

        // Excluye los apartamentos reservados del filtro
        if (reservedApartments.length > 0) {
            filter._id = { $nin: reservedApartments };
        }

        // Fetch filtered apartments and sort
        const apartments = await Apartment.find(filter).sort(sortCriteria);

        // Pass filtered apartments to the view
        res.render('home', {
            apartments,
            isAuthenticated: req.session.isAuthenticated || false,
            role: req.session.role || null,
            username: req.session.username || 'Guest'
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
            req.flash('error_msg', 'The start date must be before the end date.');
            return res.redirect(`/apartment/${idApartment}`);
        }

        // Recuperar el apartamento usando el ID proporcionado
        const apartment = await Apartment.findById(idApartment);
        
        // Verificar si se encontró el apartamento
        //console.log("Apartamento encontrado:", apartment);

        if (!apartment) {
            req.flash('error_msg', 'Apartament not found.');
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
        req.flash('error_msg', 'Error creating the reservation.');
        res.redirect(`/apartment/${idApartment}`);
    }
};


module.exports = {
    getApartments,
    getApartmentById,
    searchApartments,
    postNewReservation
}