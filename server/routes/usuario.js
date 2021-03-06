const express = require('express');
const bcrypt = require('bcrypt');
//const mongoose = require('mongoose');
const _ = require('underscore');
//const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario');
const { verificarToken, verificar_AdminRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificarToken, function (req, res) {
    
   let desde = req.query.desde || 0;
   desde = Number(desde);

   let limite = req.query.limite || 5;
   limite = Number(limite);

   Usuario.find({estado: true}, 'nombre email role estado google')
      .skip(desde)
      .limit(limite)
      .exec( (err, usuarios) => {
            if (err) {
              return res.status(400).json({
                  ok: false,
                  err
              });
            }

             Usuario.countDocuments({estado: true}, (err, conteo) => {

              res.json({
                ok: true,
                usuarios,
                cuantos: conteo
              });
    })   


    });                
});       

//////////////////////////////////////////Agregar la verificacion y subirla a heroku
  
app.post('/usuario', function (req, res) {
  
    let body = req.body;

    let usuario = new Usuario ({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      role: body.role
    });

    usuario.save((err, usuarioDB) => {
      if (err) {
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
  })


  
  app.put('/usuario/:id', [verificarToken, verificar_AdminRole], function (req, res) {
  
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true}, (err, usuarioDB) => {
        if(err){
          res.status(400).json({
            ok: false,
            err
          })
        }else{
          res.json({
            id,
            usuario: usuarioDB
          })
        }
    })
  })
  
  app.delete('/usuario/:id', [verificarToken, verificar_AdminRole],function (req, res) {

    let id = req.params.id;

    let estadoCambiado = {
      estado : false
    }

    Usuario.findByIdAndUpdate(id, estadoCambiado, { new: true }, (err, usuarioBorrado) => {

        if(err){
            res.status(400).json({
              ok: false,
              err
            })
        }else if(!usuarioBorrado){
            res.status(400).json({
              ok: false,
              error: {
                message: 'Usuario no encontrado'
              }
            })
        }
        res.json({
          ok: true,
          usuario: usuarioBorrado
        })
    })
})  

module.exports = app;