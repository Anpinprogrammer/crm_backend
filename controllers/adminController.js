import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Admin from "../models/Admin.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {

    const { email, nombre } = req.body;
    
    const existeUsuario = await Admin.findOne({email});
    
    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(404).json({msg: error.message});
    } 

    try {
        const admin = new Admin(req.body);
        const adminGuardado = await admin.save();

        //Enviar Email
        emailRegistro({
            email,
            nombre,
            token : adminGuardado.token
        });

        res.json({ msg: 'Usuario creado correctamente, revise su correo para confirmar la cuenta' });
    } catch (error) {
        console.log(error);
    }
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Admin.findOne({token});
    
    if(!usuarioConfirmar){
        const error = new Error('Usuario necesita registrarse');
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        await usuarioConfirmar.save();

        res.json({ msg: "Usuario confirmado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Admin.findOne({email});

    if(!usuario) {
        const error = new Error('El usuario no existe, registrese');
        return res.status(404).json({msg: error.message});
    }

    if(!usuario.confirmado) {
        const error = new Error('El usuario no ha sido confirmado');
        return res.status(404).json({msg: error.message});
    }

    if( await usuario.comprobarPassword(password) ) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        });
    } else {
        const error = new Error('Contraseña incorrecta');
        return res.status(404).json({msg: error.message});
    }
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeUsuario = await Admin.findOne({email});

    if(!existeUsuario) {
        const error = new Error('Usuario no existe, registrese');
        return res.status(404).json({msg: error.message});
    }

    try {
        existeUsuario.token = generarId();
        await existeUsuario.save();

        //Enviar email
        emailOlvidePassword({
            email,
            nombre: existeUsuario.nombre,
            token: existeUsuario.token
        })

        res.json({msg: 'Las instrucciones para cambiar la contraseña se enviaron al email registrado', });
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Admin.findOne({token});

    if(!tokenValido) {
        const error = new Error('Usuario no existe, registrese');
        return res.status(404).json({msg: error.message});
    } 

    try {
        res.json({msg: 'Token valido, puede cambiar la contraseña'});
    } catch (error) {
        console.log(error);
    }

};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const admin = await Admin.findOne({token});

    if(!admin){

        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        admin.password = password;
        admin.token = null;

        await admin.save();

        res.json({msg: 'Contraseña actualizada satisfactoriamente'});
    } catch (error) {
        console.log(error);
    }
}

const perfil = (req, res) => {
    const { admin } = req;
    res.json(admin);
};

export {
    registrar,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}