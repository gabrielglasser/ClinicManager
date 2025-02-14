import e, { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRole } from "../middlewares/ensureRole";
import { validateSchema } from "../middlewares/validate";
import { consultationSchema } from "../schema/consultationSchema"; 

import { CreateConsultationController } from "../controllers/consultation/CreateConsultationController";
import { DetailConsultationController } from "../controllers/consultation/DetailConsultationController";
import { UpdateConsultationController } from "../controllers/consultation/UpdateConsultationController";
import { DeleteConsultationController } from "../controllers/consultation/DeleteConsultationController";

const consultationsRoutes = Router();

const createConsultationController = new CreateConsultationController();
const detailConsultationController = new DetailConsultationController();
const updateConsultationController = new UpdateConsultationController();
const deletePatientController = new DeleteConsultationController();


// ROTAS PROTEGIDAS
consultationsRoutes.post(
    "/",
    ensureAuthenticated,
    ensureRole(["recepcionista", "admin"]),
    validateSchema(consultationSchema),
    createConsultationController.handle
);

consultationsRoutes.get(
    "/detail",
    ensureAuthenticated,
    ensureRole(["recepcionista", "admin", "medico"]),
    validateSchema(consultationSchema),
    detailConsultationController.handle
);

consultationsRoutes.put(
    "/update",
    ensureAuthenticated,
    ensureRole(["recepcionista", "admin"]),
    validateSchema(consultationSchema),
    updateConsultationController.handle
);

consultationsRoutes.delete(
    "/delete",
    ensureAuthenticated,
    ensureRole(["recepcionista", "admin"]),
    validateSchema(consultationSchema),
    deletePatientController.handle
);



export { consultationsRoutes };