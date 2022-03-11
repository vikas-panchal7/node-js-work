const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Bike = require("../models/bike");
const auth = require("../middleware/auth");

router.post("/bike/comment/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const bike = await Bike.findById(_id);
    if (!bike) {
      return res.status(404).send({ error: "Bike Not found" });
    }
    const addcomment = new Comment({
      ...req.body,
      bikeid: _id,
      owner: req.user.id,
    });
    await addcomment.save();
    res.status(201).send(addcomment);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
