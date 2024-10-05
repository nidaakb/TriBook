// importar el modelo
const Apartment = require('../models/apartment.model.js');


const getNewApartmentForm = (req, res) => {
    console.log('Accessing new apartment form');
    res.render('new-apartment', {
        apartment: {}
    })
}

const getEditAparmentForm = async (req, res) => {
    // 1. Recuperar el apartmento identificado por su idApartment de la base de datos
    const { idApartment } = req.params;

    // 2. Ir a la base de datos y obtener el apartamento dada su id
    const apartment = await Apartment.findById(idApartment);

    // 3. Pasar este apartmento a la vista para pre rellenar todos los campos
    res.render('new-apartment', {
        apartment
    })
}

const postNewApartment = async (req, res) => {
    const { id, services, rooms, beds, bathrooms, capacity, city, longitude, latitude, ...apartmentData } = req.body;

    // Validar servicios: solo permite ciertos servicios
    const validServices = ['air_conditioning', 'heating', 'tv', 'kitchen', 'wifi', 'balcony', 'gym', 'pool', 'disability_access'];
    
    // Filtrar servicios seleccionados para asegurarse de que sean válidos
    const apartmentServices = Array.isArray(services) 
        ? services.filter(service => validServices.includes(service)) 
        : []; // Si no hay servicios seleccionados, se inicializa como un array vacío

    if (id) {
        // Si se está editando un apartamento
        await Apartment.findByIdAndUpdate(id, { 
            ...apartmentData, 
            services: apartmentServices,
            city,
            longitude,
            latitude 
        });
        req.flash('success_msg', `Datos del apartamento actualizados.`);
        return res.redirect('/'); // redirect to home page after the changes
    }

    // Crear un nuevo apartamento
    await Apartment.create({
        ...apartmentData,
        services: apartmentServices,
        capacity,
        rooms,
        beds,
        bathrooms,
        city,
        longitude, 
        latitude,
    });

    req.flash('success_msg', `Apartamento ${req.body.title} creado correctamente`);
    res.redirect('/');
};

// Endpoint para eliminar un apartamento
const deleteApartment = async(req, res) => {
    const { idApartment } = req.params;
        try {
        // Buscar y eliminar el apartamento
        await Apartment.findByIdAndDelete(idApartment);
        
        req.flash('success_msg', 'Apartamento eliminado correctamente');
        res.redirect('/');  // Redirigir al home o a la lista de apartamentos después de eliminar
    } catch (error) {
        console.error('Error al eliminar el apartamento:', error);
        req.flash('error_msg', 'No se pudo eliminar el apartamento');
        res.redirect(req.get('referer'));  // Redirigir a la página anterior si hay un error
    }
} 
// named exports (expotamos varios recursos, lo hacemos como un objeto)
module.exports = {
    getNewApartmentForm,
    postNewApartment,
    getEditAparmentForm,
    deleteApartment
}

