
//================
//    Puerto
//================
process.env.PORT = process.env.PORT || 3000;

//================
//     Entorno
//================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//======================
//  Fecha de expiracion
//======================
process.env.CADUCIDAD = 60 * 60 * 24 * 30;

//================
//     SEED
//================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



//================
// Base de Datos
//================
let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//================
// Google client ID
//================

process.env.CLIENT_ID = process.env.CLIENT_ID || '237810328270-j7admalgcbqts6degd113f1bq44i7pge.apps.googleusercontent.com';