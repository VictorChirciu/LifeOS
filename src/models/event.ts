import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    default: "",
  },
  culoarea: {
    type: String,
    default: "#1D4ED8",
  },
  owner: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
