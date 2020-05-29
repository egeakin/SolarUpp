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
      return response.status(500).json({ error: "something went wrong" });
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
      return response.status(500).json({ error: err.code });
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
    .where("userHandle", "==", request.user.handle)
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
          numPanels: doc.data().numPanels,
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
      console.log(data);
      console.log(systems);
      return response.status(500).json({ error: err.code });
    });

}

exports.addGeneration = (request, response) => {
  console.log(request.body);
  var currentTime = new Date();
  var currentYear = currentTime.getFullYear();
  var generated = request.body.generated;

  if (!isFinite(request.body.generated)) {
      generated = parseInt(generated);
  }

  if (request.body.systemId.trim() === '' || request.body.date.trim() === '' || !isFinite(generated)) {
      return response.status(400).json({ error: "Invalid arguments"});
  }
  else if (generated < 0) {  //|| !(request.body.date instanceof String)
      return response.status(401).json({ error: "Invalid arguments"});
  }
  else if (request.body.date.length != 8 || !isFinite(parseInt(request.body.date.substring(0,4))) || !isFinite(parseInt(request.body.date.substring(4,6))) || !isFinite(parseInt(request.body.date.substring(6,8)))) {
      return response.status(402).json({ error: "Invalid arguments"});
  }
  else if (parseInt(request.body.date.substring(0,4)) > currentYear || parseInt(request.body.date.substring(0,4)) < 2000 || parseInt(request.body.date.substring(4,6)) > 12 || parseInt(request.body.date.substring(4,6)) < 1 || parseInt(request.body.date.substring(6,8)) > 31 || parseInt(request.body.date.substring(6,8)) < 1) {
      return response.status(403).json({ error: "Invalid arguments"});
  }

  db.collection("generation")
    .where("userHandle", "==", request.user.handle)
    .where("systemId", "==", request.body.systemId)
    .where("date", "==", request.body.date)
    .get()
    .then(data => {
      data.forEach(doc => {
        const document = db.doc(`/generation/${doc.generationId}`);
        document
          .get()
          .then(doc2 => {
            if (!doc2.exists) {
              return response.status(500).json({ error: "Something went wrong" });
            }
            if (doc2.data().userHandle !== request.user.handle) {
              return response.status(500).json({ error: "Something went wrong" });
            } 
            else {
              document.delete();
            }
          })
          .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
          });
        });
    })
    .catch(err => {
      console.error(err);
      console.log(data);
      console.log(systems);
      return response.status(500).json({ error: err.code });
    });

  const newGeneration = {
      userHandle: request.user.handle,
      createdAt: new Date().toISOString(),
      date: request.body.date,
      systemId: request.body.systemId,
      generated: generated,
  };

  db.collection("generation")
  .add(newGeneration)
  .then((doc) => {
    const resGeneration = newGeneration;
    resGeneration.generationId = doc.id;
    return response.json(resGeneration);
  })
  .catch((err) => {
    console.log(request);
    console.error(err);
    return response.status(500).json({ error: "something went wrong" });
  });
}

exports.getSystemGenerations = (request, response) => {
  db.collection("generation")
    .where("userHandle", "==", request.user.handle)
    .where("systemId", "==", request.body.systemId)
    .get()
    .then(data => {
      let generations = [];
      data.forEach(doc => {
        generations.push({
          generationId: doc.id,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          generated: doc.data().generated,
          date: doc.data().date,
          systemId: doc.data().systemId,
        });
      });
      return response.json(generations);
    })
    .catch(err => {
      console.error(err);
      console.log(data);
      console.log(generations);
      return response.status(500).json({ error: err.code });
    });
}

exports.getUserGenerations = (request, response) => {
  db.collection("generation")
    .where("userHandle", "==", request.user.handle)
    .get()
    .then(data => {
      let generations = [];
      data.forEach(doc => {
        generations.push({
          generationId: doc.id,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          generated: doc.data().generated,
          systemId: doc.data().systemId,
          date: doc.data().date,
        });
      });
      return response.json(generations);
    })
    .catch(err => {
      console.error(err);
      console.log(data);
      console.log(generations);
      return response.status(500).json({ error: err.code });
    });
}