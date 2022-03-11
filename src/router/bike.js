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
    if (error && error.errors?.biketype) {
      return res.status(404).send({ error: "Bike Type is Invalid" });
    } else {
      if (error && error?.code) {
        return res.status(409).send({ error: "Bike is Already Exist" });
      }
      res.status(500).send(error);
    }
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
      return res.status(404).send({ error: "Bike Not Found" });
    }
    enterdata.forEach((update) => {
      bike[update] = req.body[update];
    });
    await bike.save();
    if (!validenterdata) {
      return res.status(400).send({ error: "Update is invalid" });
    }
    res.status(200).send(bike);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// delete bike

router.delete("/bike/delete/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const bike = await Bike.findOne({ _id, owner: req.user.id });
    if (!bike) {
      return res.status(404).send({ error: "Bike Not found !" });
    }
    await bike.remove();
    res.status(200).send(bike);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// get all bikes for all user
router.get("/bike/bikes", async (req, res) => {
  try {
    if (req.query.sort) {
      const bikes = await Bike.find().sort({ _id: -1 });

      return res.status(200).send(bikes);
    }
    const bikes = await Bike.find().populate("biketype").exec();
    res.status(200).send(bikes);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});
//

// get bike by bike type
router.get("/bike/biketype/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const bikes = await Bike.find({ biketype: id });
    if (!bikes) {
      res.status(404).send(" Bikes Not Exist");
    }
    res.status(200).send(bikes);
  } catch (error) {
    res.send(error.toString());
  }
});

// get most liked bikes
router.get("/bike/bike/likes", auth, async (req, res) => {
  try {
    const bikes = await Bike.aggregate([
      {
        $lookup: {
          from: "likes",
          as: "result",
          let: { bid: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$bid", "$bike_id"] },
                like_dislike: true,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          totalLikes: {
            $size: "$result",
          },
        },
      },
      {
        $sort: {
          totalLikes: -1,
        },
      },
      { $limit: 10 },
    ]);
    res.send(bikes);
  } catch (error) {
    res.send(error.toString());
  }
});

//
module.exports = router;
