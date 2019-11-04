const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express.Router();
const Usuario = require('../models/usuario');



app.post('/login', function (req, res) {

    body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if ( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                err: { message: '(Usuario) o contraseña invalido' }
            });
        }
        if( !bcrypt.compareSync(body.password, usuarioDB.password) ){
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario o (contraseña) invalido' }
            });
        }
        
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 });


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    });
});

module.exports = app;