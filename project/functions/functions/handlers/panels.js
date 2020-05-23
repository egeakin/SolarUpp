const { db } = require("../util/admin");

exports.getAllSolarPanels = (request, response) => {
  db.collection("panels")
   // .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let panels = [];
      data.forEach(doc => {
        panels.push({
          panelId: doc.id,
          efficiency: doc.data().efficiency,
          image: doc.data().image,
          info: doc.data().info,
          name: doc.data().name,
          peakPower: doc.data().peakPower,
          price: doc.data().price,
          type: doc.data().type,
        });
      });
      return response.json(panels);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};