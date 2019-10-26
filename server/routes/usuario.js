//
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

// GET : Usuario ----------------------
app.get('/usuario', function(req, res) {

    //res.json('Hola'); 

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite ||5
    limite = Number(limite);


    Usuario.find({estado: true}, 'nombre email')    //Filtro x [Estado]
        .skip(desde)
        .limit(limite)
        .exec( (err, data) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({estado: true}, (err, cuenta) => {    //Filtro x [Estado]
                res.json({
                    ok: true,
                    data,
                    registros: cuenta
                });
            })
        });
});

// POST : Usuario  ----------------------
app.post('/usuario', function(req, res)  {
  
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( function(err, usuarioDB)  {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});


// PUT : Usuario   ----------------------
app.put('/usuario/:id', function(req, res)  {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'imagen', 'role', 'estado']);

    Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true, context: 'query'}, (err, usuarioDB) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

// DELETE : Usuario  ---------------------------
app.delete('/usuario/:id', function(req, res)  {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    //  *** sentencia para la eliminación física de registro *****
    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    
//, context: 'query'

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if ( !usuarioBorrado ) {           // NOT si usuario no encuentra
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});




module.exports = app;

