const Booking = require("../models/Bookings");
const axios = require("axios");
const showTimes = require("../models/showTimes");
const mongoose = require("mongoose");

exports.bookShowtime = async (req, res) => {
  const { showTime, seats, tickets } = req.body;
  console.log(req.body);
  // console.log(req.session);
  try {
    // update showtime with pushed booked:[new seats]
    await showTimes
      .findOneAndUpdate({ _id: showTime }, { $push: { booked: seats } })
      .exec();

    // create booking with user
    const booking = await Booking.create({
      user: req.session.user._id,
      seatRows: seats,
      showtime: showTime,
      tickets: tickets,
    });
    res.json(booking);
  } catch (err) {
    console.log(err);
  }
};

exports.CartBookings = async (req, res) => {
  let ids = req.body.map((booking) => mongoose.Types.ObjectId(booking));
  const bookings = await Booking.find({ _id: { $in: ids } })
    .populate({
      path: "showtime",
      populate: {
        path: "movie",
        model: "Movie",
      },
    })
    .exec();
  res.json(bookings);
};

//Get all user-bookings
exports.getUserBookings = async (req, res) => {
  console.log(
    "Session id",
    req.session.user._id,
    "session user: ",
    req.session.user
  );
  let userBookings = await Booking.find({
    user: mongoose.Types.ObjectId(req.session.user._id),
  })
    .populate({
      path: "showtime",
      populate: {
        path: "movie",
        model: "Movie",
      },
    })
    .populate({
      path: "showtime",
      populate: {
        path: "saloon",
        model: "Saloon",
      },
    })
    .exec();

  if (userBookings) {
    res.json(userBookings);
  } else {
    res.json({ error: "error no bookings found" });
  }
};
