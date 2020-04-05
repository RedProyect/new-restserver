const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion : {
        type: String,
        unique: false,
        required: [true, 'La descripción es obligatoria']
    },
    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, {autoIndex: false});

module.exports = mongoose.model('Categoria', categoriaSchema);