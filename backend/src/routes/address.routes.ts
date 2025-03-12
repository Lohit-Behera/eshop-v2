import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createAddress,
  getAllAddress,
  getAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController";

const addressRouter = Router();

addressRouter.post("/create", authMiddleware, createAddress);
addressRouter.get("/all", authMiddleware, getAllAddress);
addressRouter.get("/get/:addressId", authMiddleware, getAddress);
addressRouter.patch("/update", authMiddleware, updateAddress);
addressRouter.delete("/delete/:addressId", authMiddleware, deleteAddress);

export default addressRouter;
