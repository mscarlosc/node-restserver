//  Puerto de conexion al servidor
process.env.PORT = process.env.PORT || 3000;

// Entorno : Producción o Desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Entorno de Base de Datos
let urlDB;
if ( process.env.NODE_ENV = process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/bd_cafe';
} else {
    urlDB = 'mongodb+srv://admin:M0ngoAdmin27421042@cluster0-wjqqe.mongodb.net/bd_cafe';
}
process.env.URL_DB = urlDB;


