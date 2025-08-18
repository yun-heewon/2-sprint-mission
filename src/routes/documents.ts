import { Router } from "express";
import upload from "../lib/upload";
import { DocumentService } from "../services/documentService";
import { DocumentController } from "../controllers/documentController";

const DocumentRouter = (): Router => {
  const router = Router();

  const documentService = new DocumentService();
  const documentController = new DocumentController(documentService);

  router.get("/download/:id", documentController.getDocument);
  router.post(
    "/upload",
    upload.single("file"),
    documentController.createDocument
  );
  router.delete("/:id", documentController.deleteDocument);

  return router;
};

export default DocumentRouter;
