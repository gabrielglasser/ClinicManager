import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRole } from "../middlewares/ensureRole";
import { validateSchema } from "../middlewares/validate";
import { doctorSchema } from "../schema/doctorSchema";

import { CreateDoctorController } from "../controllers/doctor/CreateDoctorController";
import { DetailDoctorController } from "../controllers/doctor/DetailDoctorController";
import { UpdateDoctorController } from "../controllers/doctor/UpdateDoctorController";
import { DeleteDoctorController } from "../controllers/doctor/DeleteDoctorController";

const doctorRoutes = Router();

const createDoctorController = new CreateDoctorController();
const detailDoctorController = new DetailDoctorController();
const updateDoctorController = new UpdateDoctorController();
const deleteDoctorController = new DeleteDoctorController();

// ROTAS PROTEGIDAS
doctorRoutes.post(
    "/",
    ensureAuthenticated,
    ensureRole(["admin"]),
    validateSchema(doctorSchema),
    createDoctorController.handle
);

doctorRoutes.get(
    "/detail",
    ensureAuthenticated,
    ensureRole(["admin", "recepcionista"]),
    validateSchema(doctorSchema),
    detailDoctorController.handle
);

doctorRoutes.put(
    "/update",
    ensureAuthenticated,
    ensureRole(["admin"]),
    validateSchema(doctorSchema),
    updateDoctorController.handle
);

doctorRoutes.delete(
    "/delete",
    ensureAuthenticated,
    ensureRole(["admin"]),
    validateSchema(doctorSchema),
    deleteDoctorController.handle
);

export { doctorRoutes };