const { admin, db } = require("../util/admin");
const config = require("../util/config");

exports.addFeasibilityStudy = (request, response) => {

  const newFeasibilityStudy = {
    userHandle: request.user.handle,
    createdAt: new Date().toISOString(),
    buildingId: request.body.buildingId,
    study: request.body.study
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