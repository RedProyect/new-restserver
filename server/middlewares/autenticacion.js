const jwt = require('jsonwebtoken');

//======================
//  Verificar token
//======================

let verificarToken = (req, res, next) => {

     let token = req.get('token');
    

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;

        next();

    })
};

//======================
//  Verifica AdminRole
//======================

let verificar_AdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if ( usuario.role === 'ADMIN_ROLE' ){
        next();
    }else{
        return res.status(404).json({
            ok: false,
            error: {
                message: 'No eres administrador'
            }
        })
    }
}

//======================
//  Verifica token de la Imagen
//======================

let verificarTokenImage = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;

        next();

    })

}



module.exports = {
    verificarToken,
    verificar_AdminRole,
    verificarTokenImage
}