//
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//-----------
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIEN_ID);
//----------

const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if ( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if ( ! bcrypt.compareSync( body.password, usuarioDB.password )) {
 
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
})


// Configuraciones de Google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIEN_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
   
    return {
        nombre: payload.name,
        email:  payload.email,
        imagen: payload.picture,
        google: true
    }

}

//verify().catch(console.error);


app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify( token )
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
    });

    usuario.findOne( {email: googleUser.email}, (err, usuarioDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    } )

    if ( usuarioDB ) {
        if (usuarioDB.google === false ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Debe usuar su autenticación normal'
                }
            });
        } else {
            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });
        }
    } else {
        // Si el usuario no exite en nuestra BD - nuevo usuario
        let usuario = new Usuario();
        Usuario.nombre = googleUser.nombre;
        Usuario.email = googleUser.email;
        Usuario.imagen = googleUser.imagen;
        Usuario.google = true;
        Usuario.password = ':)';

        usuario.save( (err, usuarioDB) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
            
            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });
        });
    }
});

module.exports = app;
