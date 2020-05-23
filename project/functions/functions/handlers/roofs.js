const { admin, db } = require("../util/admin");
const config = require("../util/config");

exports.addRoof = (request, response) => {
  console.log(request.body);

  const newRoof = {
    roofCoordinates: request.body.roofCoordinates,
    userHandle: request.user.handle,
    createdAt: new Date().toISOString(),
    roofCircumference: request.body.roofCircumference,
    roofArea: request.body.roofArea,
    roofAngle: "",
    roofMaterial: "",
    freeSpace: 0,
    occupiedSpace: 0,
    buildingFacade: "",
    buildingType: request.body.buildingType,
    buildingName: request.body.buildingName,
    roofImage: "",
  };

  db.collection("roofs")
    .add(newRoof)
    .then((doc) => {
      const resRoof = newRoof;
      resRoof.roofId = doc.id;
      response.json(resRoof);
    })
    .catch((err) => {
      response.status(500).json({ error: request.body });
      console.log(request);
      console.error(err);
    });
};

exports.getUserRoofs = (request, response) => {
  db.collection("roofs")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let roofs = [];
      data.forEach((doc) => {
        if (doc.data().userHandle === request.user.handle) {
          roofs.push({
            roofId: doc.id,
            roofCoordinates: doc.data().roofCoordinates,
            userHandle: doc.data().userHandlehandle,
            createdAt: doc.data().createdAt,
            roofCircumference: doc.data().roofCircumference,
            roofArea: doc.data().roofArea,
            roofAngle: doc.data().roofAngle,
            roofMaterial: doc.data().roofMaterial,
            freeSpace: doc.data().freeSpace,
            occupiedSpace: doc.data().occupiedSpace,
            buildingFacade: doc.data().buildingFacade,
            buildingType: doc.data().buildingType,
            buildingName: doc.data().buildingName,
            roofImage: doc.data().roofImage,
          });
        }
      });
      return response.json(roofs);
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};

exports.uploadRoofImage = (request, response) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: request.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  let id;

  busboy.on("field", (fieldName, value) => {
    if (fieldName === "roofId") {
      id = value;
    }
  });

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return response.status(400).json({ error: "Wrong file type submitted" });
    }

    // image.png
    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    //1000000000.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`;

    const filepath = path.join(os.tmpdir(), imageFileName);

    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

        return db.doc(`/roofs/` + id).update({ roofImage: imageUrl });
      })
      .then(() => {
        return response.json({ messsage: "Image successfully uploaded" });
      })
      .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
      });
  });

  busboy.end(request.rawBody);
};
