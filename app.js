const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
const axios = require("axios");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  let endp = "http://jbusch.webhosting2.eeecs.qub.ac.uk/tvapi/?shows";

  axios
    .get(endp)
    .then((results) => {
      let showsdata = results.data;
      res.render("index", { showsdata });
    })
    .catch((err) => {
      console.log("Error: ", err.message);
    });
});

app.get("/show", async (req, res) => {
  let idvalue = req.query.tvid;
  getshow = await axios.get(
    `http://jbusch.webhosting2.eeecs.qub.ac.uk/tvapi/?id=${idvalue}`
  );

  let showdata = getshow.data.show;
  let actordata = getshow.data.cast;

  // get actor IDs
  const actorID = [];
  for (let loop = 0; loop < actordata.length; loop++) {
    actorID.push(actordata[loop].actorid);
  }

  // get actor names
  const actorNames = [];
  for (let loop = 0; loop < actordata.length; loop++) {
    getactor = await axios.get(
      `https://jbusch.webhosting2.eeecs.qub.ac.uk/tvapi/?actor=${actorID[loop]}`
    );

    actorNames.push(getactor.data.actorname);
  }

  res.render("details", { singledata: showdata, actors: actorNames });
});

app.get("/create", (req, res) => {
  res.render("add");
});

app.post("/create", (req, res) => {
  let senttitle = req.body.fieldTitle;
  let sentimg = req.body.fieldImg;
  let sentdes = req.body.fieldDescr;

  const showData = {
    title: senttitle,
    img: sentimg,
    description: sentdes,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  let epoint =
    "http://jbusch.webhosting2.eeecs.qub.ac.uk/tvapi/?create&apikey=69004604";

  axios
    .post(epoint, showData, config)
    .then((response) => {
      console.log(response.data);
      res.render("add", { showData });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.get("/top", async (req, res) => {
  let topshows = await axios.get(
    "http://jbusch.webhosting2.eeecs.qub.ac.uk/tvapi/?topshows"
  );
  let topactors = await axios.get(
    "http://jbusch.webhosting2.eeecs.qub.ac.uk/tvapi/?topactors"
  );
  let showsdata = topshows.data;
  let actorsdata = topactors.data;

  res.render("topdata", { shows: showsdata, actors: actorsdata });
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
