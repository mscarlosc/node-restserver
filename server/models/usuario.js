//
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        index: {unique: true},
        require: [true, 'El E-Mail es requerido']
    },
    password: {
        type: String,
        require: [true, 'La contraseña es requerida']
    },
    imagen: {
        type: String,
        require: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {   // Metodo para no mostrar campo [Password]
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    
    return userObject
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'} );

module.exports = mongoose.model( 'Usuario', usuarioSchema );
