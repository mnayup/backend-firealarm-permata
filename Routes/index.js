import express from "express";
import {
  CekPasswordLama,
  getUsers,
  // Register,
  Login,
  Logout,
  // Update,
} from "../Controller/UserController.js";
import {
  getNotifOnline,
  getNotifOffline,
  sendNotif,
  getAllNotif,
  getNotifKebakaran,
  getNotSigned,
  updatePerangkat,
  getAllCabang,
  deleteCabang,
  updateStatus,
} from "../Controller/NotifController.js";
import { verifyToken } from "../Middleware/verifyToken.js";
import { refreshToken } from "../Controller/RefreshToken.js";

const router = express.Router();

/*API Login, Logout*/
router.get("/users", verifyToken, getUsers);
// router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
// router.post("/update", Update);
router.post("/cekpasswordlama", CekPasswordLama);

/*API Notif*/
router.get("/notifonline", getNotifOnline);
router.get("/notifoffline", getNotifOffline);
router.get("/notifall", getAllNotif);
router.get("/notifkebakaran", getNotifKebakaran);
router.get("/notsigned", getNotSigned);
router.get("/sendnotif", sendNotif);
router.post("/updateperangkat", updatePerangkat);
router.get("/cabang", getAllCabang);
router.post("/deletecabang", deleteCabang);
router.get("/updatestatus", updateStatus);

/*Tambah Cabang*/

export default router;
