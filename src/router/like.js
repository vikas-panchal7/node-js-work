const express = require("express");
const router = express.Router();
const Like = require("../models/like");
const Bike = require("../models/bike");
const auth = require("../middleware/auth");

//for likeing dislike bike

router.post("/bike/like/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const bike = await Bike.findById(_id);
    if (!bike) {
      return res.status(404).send({ error: "Bike not found" });
    }
    const like = await Like.findOne({ bike_id: _id, owner: req.user.id });
    if (like) {
      const liketype = like.like_dislike ? false : true;
      await Like.updateOne(
        { bike_id: _id, owner: req.user.id },
        { like_dislike: liketype }
      );
      return res.status(200).send(liketype ? "Liked !" : "Disliked");
    }

    const addlike = new Like({ bike_id: _id, owner: req.user.id });
    await addlike.save();
    res.status(201).send("Liked ! ");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
