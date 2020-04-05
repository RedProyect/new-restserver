const express = require('express');
const {verificarToken} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


app.get('/producto', verificarToken, (req, res) => {

    //let desde = req.query.desde || 0;
    //desde = Number(desde);

    Producto.find({})
            //.skip(desde)
            //.limit(5)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, producto) => {
                if(err){
                    res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    producto
                });
            });

});

app.get('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
        
                if(!productoDB){
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'El ID no es correcto'
                        }
                    });
                }
                res.json({
                    ok: true,
                    producto: productoDB
                });        
            });
});

app.get('/producto/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex})
            .populate('categoria', 'nombre')
            .exec( (err, productos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.status(201).json({
                    ok: true,
                    producto: productos
                });
            } )
})


app.post('/producto', verificarToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre:      body.nombre,
        precioUni:   body.precioUni,
        descripcion: body.descripcion,
        disponible:  body.disponible,
        usuario:     req.usuario._id,
        categoria:   body.categoria
    });

    producto.save( (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

app.put('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let datosActualizados = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
    };

    Producto.findByIdAndUpdate(id, datosActualizados, { new: true, runValidators: true}, (err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El ID es incorrecto'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

app.delete('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    let disponibleModificado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, disponibleModificado, {new: true, runValidators: true}, (err, productoBorrado) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoBorrado){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El ID es incorrecto'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoBorrado,
            message: 'Producto borrado'
        });
        });
});



module.exports = app;