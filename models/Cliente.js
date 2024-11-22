import mongoose from 'mongoose';

const clienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    empresa: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    }
},
{
    timestamps: true //Activa el createdAt y UpdatedAt
});

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;