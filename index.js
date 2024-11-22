import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import conectarDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";


const app = express();
app.use(express.json());

dotenv.config();
conectarDB();

//Configuracion CORS
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("No permitido por CORS"));
        }
    } 
};
app.use(cors(corsOptions));

app.use('/api/admin', adminRoutes);
app.use('/api/clientes', clienteRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})