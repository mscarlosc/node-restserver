//  Puerto de conexion al servidor
process.env.PORT = process.env.PORT || 3000;

// Entorno : Producción o Desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Entorno de Base de Datos
let urlDB;
if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/bd_cafe';
} else {
    urlDB = process.env.MONGO_URL;
}
process.env.URL_DB = urlDB;


// Vencimiento del Token
//-----------------------
// 60 segundos * 60 minutos * 24 horas * 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// SEED  de autentificacion
process.env.SEED = process.env.SEED || 'este-es-el-SEED-de-desarrollo';


//  Google Client ID
process.env.CLIEN_ID = process.env.CLIEN_ID || '220973636688-g14h8n30cli1lg0j4hbu3dl8gbjf4fbr.apps.googleusercontent.com';


