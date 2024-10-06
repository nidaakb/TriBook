// importar módulos de terceros
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
// Swagger for API
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./api-swagger.json');
const bodyParser = require('body-parser')

const dotenv = require('dotenv');
dotenv.config();

// importar las rutas públicas
const indexRoutes = require('./routes/index.js');

// importar las rutas de administrador
const adminRoutes = require('./routes/admin.js');

// rutas de autentificación
const authRoutes = require('./routes/auth.js');

// rutas de la REST API
const apiRoutes = require('./routes/api.js');


// creamos una instancia del servidor Express
const app = express();

// Tenemos que usar un nuevo middleware para indicar a Express que queremos procesar peticiones de tipo POST
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Configurar sesión
app.use(session({
    secret: 'miSecretoSuperSecreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // secure: true en producción con HTTPS
}));

app.use(flash());


/** 
app.use((req, res, next) => {
    // La variable req.locals es una variable "global" de tipo objecto a la que todas las vistas pueden acceder
    // Si el usuario esta autentificado entonces es que es de tipo administrador
    res.locals.isAdmin = req.session.isAuthenticated;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg'); // Agregar para manejar mensajes de error


    // tenemos que ejecutar next() para que la petición HTTP siga su curso
    next();
})

*/

// Middleware to set local variables
app.use((req, res, next) => {
    res.locals.isAdmin = req.session.role === 'admin';
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.isAuthenticated = req.session.isAuthenticated || false;
    res.locals.role = req.session.role || null; // Pass the role to the views
    next();
});


// Añadimos el middleware necesario para que el client puedo hacer peticiones GET a los recursos públicos de la carpeta 'public'
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// Especificar a Express que quiero usar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Usamos el middleware morgan para loguear las peticiones del cliente
app.use(morgan('tiny'));

// We add the swagger route
app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
console.log("Setting up swagger docs")
// Añadimos las ritas de index.js en nuestra app
// El primer parámetro significa que todas las rutas que se encuentren en 'indexRouter' estarán prefijados por '/'
// Voy a prefijar todas las rutas de administrador con '/admin'

// Middleware para proteger las rutas de administrador
app.use('/admin', (req, res, next) => {
    // Miramos si el usuario esta autentificado
    if (req.session.isAuthenticated) {
        // Si es que si, establecemos que es de tipo administrador y permitimos que siga la petición
        res.locals.isAdmin = true;
        next(); // /admin/apartments/new-apartment
    } else {
        // en caso contrario lo llevamos a la vista de login
        res.redirect('/login');
    }
});

app.use('/admin', adminRoutes);
app.use('/', authRoutes);
app.use('/', indexRoutes);
app.use('/api', apiRoutes);

async function connectDB() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to the database');
}

connectDB().catch(err => console.log(err))

/** Uso de middleware para gestionar cualquier error imprevisto de nuestra aplicaicón y fallar de forma grácil */
app.use((err, req, res, next) => {
    // err.message -> simplemente el mensaje
    // err.stack -> la pila de llamadas
    console.error(err)
    // Enviar un correo electronico o cualquier otro medio a los desarrolladores para que se den cuenta de que algo ha 'petao'
    res.status(500).send('<p>Oops! The operation has failed. We have informed the developers. Please try again later. Go back to the <a href="/">home page</a></p> ');
})

app.get('/', (req, res) => {
    const isAuthenticated = req.session.isAuthenticated || false; 
    const isAdmin = isAuthenticated && req.session.role === 'admin'; 

    res.render('home', {
        isAuthenticated,
        isAdmin,
        username: req.user.username || '', 
        success_msg: req.flash('success_msg') 
    });
});

app.listen(PORT, (req, res) => {
    console.log("Server listening correctly on port " + PORT);
    console.log(`Swagger docs available at http://localhost:${PORT}/api/doc`)
});
