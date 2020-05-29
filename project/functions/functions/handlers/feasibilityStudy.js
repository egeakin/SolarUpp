const { admin, db } = require("../util/admin");
const config = require("../util/config");

exports.addFeasibilityStudy = (request, response) => {

  const newFeasibilityStudy = {
    userHandle: request.user.handle,
    createdAt: new Date().toISOString(),
    buildingId: request.body.buildingId,
    solarPanel: request.body.solarPanel,
    inverter: request.body.inverter,
    estimatedProfit25Year: request.body.estimatedProfit25Year,
    energyProduction: request.body.energyProduction,
    carbonFootPrint: request.body.carbonFootPrint,
    panelEfficiency: request.body.panelEfficiency,
    cost: request.body.cost,
    study: request.body.study,
    roofAngle: request.body.roofAngle,
    averageConsumption: request.body.averageConsumption,
    freeSpace: request.body.freeSpace
  };

  db.collection("feasibilityStudies")
    .add(newFeasibilityStudy)
    .then((doc) => {
      const resFeasibilityStudy = newFeasibilityStudy;
      resFeasibilityStudy.feasibilityStudyId = doc.id;
      response.json(resFeasibilityStudy);
    })
    .catch((err) => {
      response.status(500).json({ error: request.body });
      console.log(request);
      console.error(err);
    });
};

exports.getAllStudies = (request, response) => {
  db.collection("feasibilityStudies")
    .orderBy("createdAt", "asc")
    .get()
    .then(data => {
      let studies = [];
      data.forEach(doc => {
        if (doc.data().userHandle === request.user.handle) {
          studies.push({
            studyId: doc.id,
            buildingId: doc.data().buildingId,
            solarPanel: doc.data().solarPanel,
            inverter: doc.data().inverter,
            estimatedProfit25Year: doc.data().estimatedProfit25Year,
            panelEfficiency: doc.data().panelEfficiency,
            energyProduction: doc.data().energyProduction,
            carbonFootPrint:doc.data().carbonFootPrint,
            cost: doc.data().cost,
            study: doc.data().study,
            roofAngle: doc.data().roofAngle,
            averageConsumption: doc.data().averageConsumption,
            freeSpace: doc.data().freeSpace
          });
        }
      });
      return response.json(studies);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};