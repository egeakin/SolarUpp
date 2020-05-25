const { db } = require("../util/admin");

exports.getAllInverters = (request, response) => {
  db.collection("inverters")
   //.orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let inverters = [];
      data.forEach(doc => {
        inverters.push({
          inverterId: doc.id,
          efficiency: doc.data().efficiency,
          image: doc.data().image,
          info: doc.data().info,
          name: doc.data().name,
          peakACPower: doc.data().peakACPower,
          price: doc.data().price
        });
      });
      return response.json(inverters);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};