const functions = require("firebase-functions");

const app = require("express")();

const cors = require("cors");

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

const { db } = require("./util/admin");

const FBAuth = require("./util/fbAuth");

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
} = require("./handlers/screams");

const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
  changePassword,
} = require("./handlers/users");

const {
  addRoof,
  getUserRoofs,
  uploadRoofImage,
  deleteRoof,
} = require("./handlers/roofs");
//const { addRoof, getUserRoofs } = require("./handlers/roofs");

const {
  addSystem,
  getSystem,
  deleteSystem,
  getUserSystems,
  addGeneration,
  getSystemGenerations,
  getUserGenerations,
} = require("./handlers/maintenance");

const { sendMail } = require("./handlers/emails");
const { getAllInverters } = require("./handlers/inverters");
const { getAllSolarPanels } = require("./handlers/panels");

const {
  addFeasibilityStudy,
  getAllStudies,
  deleteFeasibilityStudy,
} = require("./handlers/feasibilityStudy");

// scream routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);
app.get("/scream/:screamId", getScream);
app.delete("/scream/:screamId", FBAuth, deleteScream);
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);

// users route
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);
app.post("/changePassword", FBAuth, changePassword);

// emails route
app.post("/emails/sendMail", sendMail);

// maintenance route
app.post("/addSystem", FBAuth, addSystem);
app.get("/existingSystems/:existingSystemsId", FBAuth, getSystem);
app.delete("/existingSystems/:existingSystemsId", FBAuth, deleteSystem);
app.get("/existingSystems", FBAuth, getUserSystems);
app.post("/addGeneration/:existingSystemId", FBAuth, addGeneration);
app.get("/generation/:existingSystemId", FBAuth, getSystemGenerations);
app.get("/generation", FBAuth, getUserGenerations)

// roof routes
app.post("/addRoof", FBAuth, addRoof);
app.get("/getRoof", FBAuth, getUserRoofs);
app.post("/uploadRoofImage", FBAuth, uploadRoofImage);
app.delete("/roofs/:roofId", FBAuth, deleteRoof);

//inverter routes
app.get("/getInverters", FBAuth, getAllInverters);

//inverter routes
app.get("/getInverters", FBAuth, getAllInverters);

//panel routes
app.get("/getPanels", FBAuth, getAllSolarPanels);

//feasibilityStudy Routes
app.post("/addFeasibilityStudy", FBAuth, addFeasibilityStudy);
app.get("/getStudies", FBAuth, getAllStudies);
app.delete("/feasibilityStudy/:studyId", FBAuth, deleteFeasibilityStudy);

//region('europe-west1)
exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });

exports.deleteNotificationOnUnlike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => console.error(err));
  });

exports.createNotificationOnComment = functions
  .region("us-central1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });

exports.onUserImageChange = functions
  .region("us-central1")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      const batch = db.batch();
      return db
        .collection("screams")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        })
        .catch((err) => console.error(err));
    } else return true;
  });

exports.onScreamDeleted = functions
  .region("us-central1")
  .firestore.document("/screams/{screamId}")
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("screamId", "==", screamId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
