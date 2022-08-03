import Notification from "../Models/NotifModels.js";
import { Op, where } from "sequelize";

/*Notifikasi*/
export const getNotifOnline = async (req, res) => {
  try {
    const NotifOnline = await Notification.findAll({
      where: {
        [Op.and]: [
          { statuss: "Online" },
          {
            cabang: {
              [Op.ne]: "",
            },
          },
        ],
      },
      order: [
        ["kejadian", "DESC"],
        ["cabang", "ASC"],
      ],
      // order: ["kejadian", "DESC"],
    });
    io.emit("infoSTCABANGONLINE", NotifOnline);
    // res.json(NotifOnline);
  } catch (error) {
    console.log(error);
  }
};

export const getNotSigned = async (req, res) => {
  try {
    const NotSignet = await Notification.findAll({
      where: {
        cabang: "",
        statuss: "Online",
      },
    });
    res.json(NotSignet);
  } catch (error) {
    console.log(error);
  }
};

export const getNotifOffline = async (req, res) => {
  try {
    const NotifOffline = await Notification.findAll({
      where: {
        [Op.and]: [
          { statuss: "Offline" },
          {
            cabang: {
              [Op.ne]: "",
            },
          },
        ],
      },
      order: [
        ["cabang", "ASC"],
      ],
    });
    io.emit("infoSTCABANGOFFLINE", NotifOffline);
    // res.json(NotifOffline);
  } catch (error) {
    console.log(error);
  }
};

export const getNotifKebakaran = async (req, res) => {
  try {
    const NotifKebakaran = await Notification.findAll({
      where: {
        [Op.and]: [
          { kejadian: "Kebakaran" },
          {
            cabang: {
              [Op.ne]: "",
            },
          },
        ],
      },
    });
    res.json(NotifKebakaran);
  } catch (error) {
    console.log(error);
  }
};

export const getAllNotif = async (req, res) => {
  console.log("function jalan");
  try {
    let data = {
      online: 0,
      offline: 0,
      kebakaran: 0,
      jumlahCabang: 0,
    };
    const NotifAll = await Notification.findAll();
    NotifAll.map((val) => {
      if (val.cabang != "") {
        data.jumlahCabang++;
      }
      if (val.statuss == "Offline" && val.cabang != "") {
        data.offline++;
      } else if (val.statuss == "Online" && val.cabang != "") {
        data.online++;
      }
      if (val.kejadian == "Kebakaran" && val.cabang != "") {
        data.kebakaran++;
      }
    });
    io.emit("infoSCABANGKEBAKARAN", data);
    io.emit("infoSCABANG", data);
    io.emit("infoSCABANGONLINE", data);
    io.emit("infoSCABANGOFFLINE", data);

    // res.json(data);
  } catch (error) {
    console.log(error);
  }
};

export const getAllNotifUseEffect = async (req, res) => {
  console.log("function jalan");
  try {
    let data = {
      online: 0,
      offline: 0,
      kebakaran: 0,
      jumlahCabang: 0,
    };
    const NotifAll = await Notification.findAll();
    NotifAll.map((val) => {
      if (val.cabang != "") {
        data.jumlahCabang++;
      }
      if (val.statuss == "Offline" && val.cabang != "") {
        data.offline++;
      } else if (val.statuss == "Online" && val.cabang != "") {
        data.online++;
      }
      if (val.kejadian == "Kebakaran" && val.cabang != "") {
        data.kebakaran++;
      }
    });

    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

export const getAllCabang = async (req, res) => {
  try {
    const Cabang = await Notification.findAll({
      where: {
        [Op.and]: [
          {
            cabang: {
              [Op.ne]: "",
            },
          },
        ],
      },
    });
    // io.emit("infoUPDATECABANG",Cabang);
    res.json(Cabang);
  } catch (error) {
    console.log(error);
  }
};

/*Mengirim Notifikasi*/
export const sendNotif = async (req, res) => {
  let { kode_perangkat, kejadian } = req.query;
  // let { statuss } = "Online";
  // let { statuss } = req.body
  let date = new Date().getTime();
  // console.log(kode_perangkat, kejadian);
  try {
    let cekPerangkat = await Notification.findAll({
      where: {
        kode_perangkat: kode_perangkat,
      },
    });
console.log(cekPerangkat.length)
    if (cekPerangkat.length > 0) {
      await Notification.update(
        {
          waktu: date,
          statuss: 'Online',
          lastonline: date,
          kejadian: kejadian,
        },
        {
          where: {
            kode_perangkat: kode_perangkat,
          },
        }
      );
      // if (kejadian === "Kebakaran") {
      const NotifKebakaran = await Notification.findAll({
        where: {
          [Op.and]: [
            { kejadian: "Kebakaran" },
            {
              cabang: {
                [Op.ne]: "",
              },
            },
          ],
        },
      });
      // console.log(NotifKebakaran.length);
      io.emit("infoKEBAKARAN", NotifKebakaran);

      // }
      res.json({
        data: NotifKebakaran.length,
        msg: "Update Notifikasi Berhasil",
      });

      // Socket IO
      getAllNotif();
      getAllCabang();
      getNotifOffline();
      getNotifOnline();
    } else {
      await Notification.create({
        kode_perangkat: kode_perangkat,
        waktu: date,
        cabang: "",
        statuss: "Online",
        kejadian: kejadian,
        lastonline: date,
      });
      // if (kejadian === "Kebakaran") {
      const NotifKebakaran = await Notification.findAll({
        where: {
          [Op.and]: [
            { kejadian: "Kebakaran" },
            {
              cabang: {
                [Op.ne]: "",
              },
            },
          ],
        },
      });
      io.emit("infoKEBAKARAN", NotifKebakaran);
      // }
      res.json({
        data: cekPerangkat.length,
        msg: "Mengirim Notifikasi Berhasil",
      });

      // Socket IO
      getAllNotif();
      getAllCabang();
      getNotifOffline();
      getNotifOnline();
    }
  } catch (error) {
    console.log(error);
  }
};

/*Update Perangkat*/
export const updatePerangkat = async (req, res) => {
  let { kode_perangkat, cabang } = req.body;
  // console.log(kode_perangkat, cabang);
  try {
    let updatePerangkat = await Notification.findAll({
      where: {
        kode_perangkat: kode_perangkat,
      },
    });
    if (updatePerangkat.length > 0) {
      await Notification.update(
        {
          cabang: cabang,
        },
        {
          where: {
            kode_perangkat: updatePerangkat[0].kode_perangkat,
          },
        }
      );
      res.json({
        data: updatePerangkat.length,
        msg: "Update Data Peraangkat Berhasil",
      });
    }
  } catch (error) {
    res.json({ msg: "Update Data Perangkat Gagal" });
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  // let { statuss } = req.body;
  console.log(">>>>>>>>>>>>");
  let dataTglterakhir = [];
  let date = new Date().getTime();

  try {
    let updateStatus = await Notification.findAll({
      // where: {
      //   statuss: "Online",
      // },
    });
    // res.status(200).json(updateStatus);
    // if (updateStatus.length > 0) {
    updateStatus.map((val) => {
      let timeStamp = new Date(val.lastonline).getTime();
      let selisih = date - timeStamp;
      // let diff = Math.round(selisih / 60000);//Menit
      let diff = Math.round(selisih / 1000);//Detik
      dataTglterakhir.push(diff);
      // res.status(200).json(updateStatus);

      if (diff > 15) {
        let kodePerangkat = val.kode_perangkat;
        let tmp = Notification.update(
          {
            statuss: "Offline",
          },
          {
            where: {
              kode_perangkat: kodePerangkat,
            },
          }
        );

        return tmp;
      } 
      // else {
      //   let kodePerangkat = val.kode_perangkat;
      //   let tmp = Notification.update(
      //     {
      //       statuss: "Online",
      //     },
      //     {
      //       where: {
      //         kode_perangkat: kodePerangkat,
      //       },
      //     }
      //   );

      //   return tmp;
      // }
    });
    getAllNotif()
    getAllCabang()
    getNotifOnline()
    getNotifOffline()
    res.json({ msg: "Berhasil diupdate" });
  } catch (error) {
    res.json({ msg: "gagal update" });
  }
};
/*Delete Cabang*/
export const deleteCabang = async (req, res) => {
  let { cabang } = req.body;
  try {
    let cekCabang = await Notification.findAll({
      where: { cabang: cabang },
    });
    if (cekCabang.length > 0) {
      await Notification.update(
        {
          cabang: "",
        },
        {
          where: {
            cabang: cabang,
          },
        }
      );
      res.json({
        msg: "Cabang Berhasil di Hapus",
      });
    } else {
      res.json({
        msg: "Cabang Gagal di Hapus",
      });
    }
  } catch (error) {
    res.json({ error });
  }
};