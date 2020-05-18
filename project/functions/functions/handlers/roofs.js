const { db } = require("../util/admin");

exports.addRoof = (request, response) => {
  console.log(request.body);

  const newRoof = {
    roofCoordinates: request.body.roofCoordinates,
    userHandle: request.user.handle,
    createdAt: new Date().toISOString(),
    roofCircumference: request.body.roofCircumference,
    roofArea: request.body.roofArea,
    roofAngle: request.body.roofAngle,
    roofMaterial: "",
    freeSpace: 0,
    occupiedSpace: 0,
    buildingFacade: "",
    buildingType: "",
    buildingName: "",
  };

  db.collection("roofs")
    .add(newRoof)
    .then((doc) => {
      const resRoof = newRoof;
      resRoof.roofId = doc.id;
      response.json(resRoof);
    })
    .catch((err) => {
      response.status(500).json({ error: "something went wrong" });
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
