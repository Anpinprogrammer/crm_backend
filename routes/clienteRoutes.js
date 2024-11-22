import express from 'express';
import {
    agregarCliente,
    obtenerClientes,
    eliminarCliente,
    actualizarCliente
} from "../controllers/clienteController.js";
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(checkAuth, agregarCliente)
    .get(checkAuth, obtenerClientes);

router.route('/:id')
    .put(checkAuth, actualizarCliente)
    .delete(checkAuth, eliminarCliente);
        

export default router;