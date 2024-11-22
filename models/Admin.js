import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import generarId from "../helpers/generarId.js";

const adminSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true/*Para que elimine los espacios en caso de que el usuario ponga algun espacio */
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,/*Garantizamos que utiliza un email por cuenta*/
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    empresa: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    },
});

adminSchema.pre('save', async function (next) {
    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
}

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;