import Cliente from "../models/Cliente.js";

const agregarCliente = async (req, res) => {
    const { email } = req.body;

    const buscaCliente = await Cliente.findOne({email});

    //Revisa si ya fue agregado el cliente anteriormente
    if(!buscaCliente) {
        try {
            const cliente = new Cliente(req.body);
            cliente.admin = req.admin._id;
            const clienteGuardado = await cliente.save();
            console.log(clienteGuardado);
    
            res.json(clienteGuardado);
        } catch (error) {
            console.log(error);
        }

        return
    }

    const error = new Error('Cliente ya registrado');
    return res.status(404).json({msg: error.message});

    
};

const obtenerClientes = async (req, res) => {
    const clientes = await Cliente.find()
        .where('admin')
        .equals(req.admin);//Usamos el filtro para que muestra solo los pacientes del veterinario asignado

    res.json(clientes);
};

const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if(!cliente) {
        return res.status(404).json({ msg: 'No encontrado' });
    }

    if(cliente.admin._id.toString() !== req.admin._id.toString()) {
        return res.json({ msg: 'Accion no valida' });
    }

    //Actualizar Paciente
    cliente.nombre = req.body.nombre || cliente.nombre;
    cliente.email = req.body.email || cliente.email;
    cliente.telefono = req.body.telefono || cliente.telefono;
    cliente.empresa = req.body.empresa || cliente.empresa;

    try {
        const clienteActualizado = await cliente.save();
        res.json(clienteActualizado);
    } catch (error) {
        console.log(error);
    }
};

const eliminarCliente = async (req, res) => {
    const { id } = req.params;

    const cliente = await Cliente.findById(id);

    if(!cliente) {
        return res.status(404).json({ msg: 'No encontrado' });
    }

    if(cliente.admin._id.toString() !== req.admin._id.toString()) {
        return res.json({ msg: 'Accion no valida' });
    }

    try {
        await cliente.deleteOne();
        res.json({ msg: 'Cliente Eliminado' });
    } catch (error) {
        console.log(error);
    }
};

export {
    agregarCliente,
    obtenerClientes,
    actualizarCliente,
    eliminarCliente
}