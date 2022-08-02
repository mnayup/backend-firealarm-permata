import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Notification = db.define(
  "notifikasi",
  {
    kode_perangkat: {
      type: DataTypes.STRING,
    },
    waktu: {
      type: DataTypes.DATE,
    },
    cabang: {
      type: DataTypes.STRING,
    },
    statuss: {
      type: DataTypes.STRING,
    },
    kejadian: {
      type: DataTypes.STRING,
    },
    lastonline: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Notification;
