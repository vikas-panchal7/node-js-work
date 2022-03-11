const BikeType = require("../models/biketype");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// for adding bike type

router.post("/bike/addtype", auth, async (req, res) => {
  const addType = new BikeType(req.body);

  try {
    await addType.save();
    res.status(201).send(addType);
  } catch (error) {
    if (error && error?.code) {
      return res.status(409).send({ error: "BikeType is Already Exist" });
    }
    res.status(500).send(error);
  }
});

// for getting all bike types
router.get("/bike/biketypes", auth, async (req, res) => {
  try {
    const biketypes = await BikeType.find();
    res.status(200).send(biketypes);
  } catch (error) {
    res.send(error.toString());
  }
});

//
module.exports = router;
