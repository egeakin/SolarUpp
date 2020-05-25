const { db } = require("../util/admin");

exports.addSystem = (request, response) => {
    console.log(request.body);

    if (request.body.address.trim() === '' || request.body.inverterSize < 0 || request.body.name.trim() === '' || ((request.body.panelAngle > 90 || request.body.panelAngle < -90) && request.body.dynamicAngle === false)|| request.body.numPanels < 0 || request.body.panelCap < 0 || request.body.postalCode < 0 || request.body.postalCode > 999999 || request.body.systemSize !== request.body.panelCap * request.body.numPanels || request.body.age < 0 || request.body.age > 25 || !(request.body.dynamicAngle === true || request.body.dynamicAngle === false)) {
        return response.status(400).json({ error: "Invalid arguments"});;
    }

    var angle = request.body.panelAngle;

    if (request.body.dynamicAngle === true) {
        angle = null;
    }

    const newSystem = {
        address: request.body.address,
        userHandle: request.user.handle,
        createdAt: new Date().toISOString(),
        inverterSize: request.body.inverterSize,
        name: request.body.name,
        panelAngle: angle,
        numPanels: request.body.numPanels,
        panelCap: request.body.panelCap,
        postalCode: request.body.postalCode,
        systemSize: request.body.systemSize,
        age: request.body.age,
        dynamicAngle: request.body.dynamicAngle,
    };

    db.collection("existingSystems")
    .add(newSystem)
    .then((doc) => {
      const resSystem = newSystem;
      resSystem.existingSystemsId = doc.id;
      response.json(resSystem);
    })
    .catch((err) => {
      response.status(500).json({ error: "something went wrong" });
      console.log(request);
      console.error(err);
    });
}

// Fetch one system
exports.getSystem = (request, response) => {
  let systemData = {};
  db.doc(`/existingSystems/${request.params.existingSystemsId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "System not found" });
      }
      if (doc.data().userHandle !== request.user.handle) {
        return response.status(403).json({error: "this is not yours!"});
      }
      systemData = doc.data();
      systemData.existingSystemsId = doc.id;
    })
    .then(data => {
      return response.json(systemData);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};

// Delete a system
exports.deleteSystem = (request, response) => {
  const document = db.doc(`/existingSystems/${request.params.existingSystemsId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "System not found" });
      }
      if (doc.data().userHandle !== request.user.handle) {
        return response.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      response.json({ message: "System deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.getUserSystems = (request, response) => {
  db.collection("existingSystems")
    .where("userHandle", "===", request.user.handle)
    .orderBy("createdAt", "systemSize")
    .get()
    .then(data => {
      let systems = [];
      data.forEach(doc => {
        systems.push({
          existingSystemsId: doc.id,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          address: doc.data().address,
          inverterSize: doc.data().inverterSize,
          name: doc.data().name,
          panelCap: doc.data().panelCap,
          panelAngle: doc.data().panelAngle,
          postalCode: doc.data().postalCode,
          systemSize: doc.data().systemSize,
          age: doc.data().age,
          dynamicAngle: doc.data().dynamicAngle,
        });
      });
      return response.json(systems);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });

}