import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRole } from "../middlewares/ensureRole";
import { validateSchema } from "../middlewares/validate";
import { patientSchema } from "../schema/patientSchema";

import { CreatePatientController } from "../controllers/patient/CreatePatientController";
import { UpdatePatientController } from "../controllers/patient/UpdatePatientController";
import { DeletePatientController } from "../controllers/patient/DeletePatientController";
import { DetailPatientController } from "../controllers/patient/DetailPatientController";

const patientsRoutes = Router();

const createPatientController = new CreatePatientController();
const updatePatientController = new UpdatePatientController();
const deletePatientController = new DeletePatientController();
const detailPatientController = new DetailPatientController();



// ROTAS PROTEGIDAS
patientsRoutes.post(
    "/",
    ensureAuthenticated,
    ensureRole(["recepcionista", "admin"]),
    validateSchema(patientSchema),
    createPatientController.handle
);

patientsRoutes.put(
    "/update",
    ensureAuthenticated,
    ensureRole(["recepcionista", "admin"]),
    validateSchema(patientSchema),
    updatePatientController.handle
);

patientsRoutes.get(
    "/detail",
    ensureAuthenticated,
    ensureRole(["recepcionista", "admin"]),
    validateSchema(patientSchema),
    detailPatientController.handle
);

patientsRoutes.delete(
    "/delete",
    ensureAuthenticated,
    ensureRole(["recepcionista", "admin"]),
    validateSchema(patientSchema),
    deletePatientController.handle
);

export { patientsRoutes };