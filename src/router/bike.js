const Bike = require("../models/bike");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// bike add code
router.post("/bike/add", auth, async (req, res) => {
  const addbike = new Bike({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await addbike.save();
    res.status(201).send(addbike);
  } catch (error) {
    res.send(error);
  }
});

//bike update
router.patch("/bike/edit/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const validdata = ["Name", "biketype"];
  const enterdata = Object.keys(req.body);
  const validenterdata = enterdata.every((r) => validdata.includes(r));
  try {
    const bike = await Bike.findOne({ _id, owner: req.user.id });
    if (!bike) {
      return res.status(404).send();
    }
    enterdata.forEach((update) => {
      bike[update] = req.body[update];
    });
    await bike.save();
    if (!validenterdata) {
      return res.status(400).send({ error: "Update is invalid" });
    }
    res.send(bike);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// delete bike

router.delete("/bike/delete/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const bike = await Bike.findByIdAndDelete({ _id, owner: req.user.id });
    if (!bike) {
      return res.status(404).send();
    }
    res.status(200).send(bike);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// get all bikes
router.get("/bike/bikes", async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.status(200).send(bikes);
  } catch (error) {
    res.send(error.toString());
  }
});

// get bike by bike type
router.get("/bike/biketype/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const bikes = await Bike.find({ biketype: id });
    res.status(200).send(bikes);
  } catch (error) {
    res.send(error.toString());
  }
});

module.exports = router;
