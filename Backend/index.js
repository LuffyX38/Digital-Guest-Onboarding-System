const app = require("./app");

const dbConnection = require("./src/db/db");

const port = process.env.PORT || 4444;

dbConnection()
  .then(() => {
    app.on("error", (err) => {
      console.log("error connecting to the database");
    });

    app.listen(port, () => {
      console.log(`server is running on port - ${port}`);
    });
  })
  .catch((err) => {
    console.log("error connecting to the db ", err);
  });
