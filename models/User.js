// const { Schema, model } = require("mongoose");

// const User = new Schema({
//   username: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   stats: {
//     bar: [
//       {
//         name: { type: Number },
//         percent: { type: String },
//         count: { type: Number },
//       },
//       {
//         name: { type: Number },
//         percent: { type: String },
//         count: { type: Number },
//       },
//       {
//         name: { type: Number },
//         percent: { type: String },
//         count: { type: Number },
//       },
//       {
//         name: { type: Number },
//         percent: { type: String },
//         count: { type: Number },
//       },
//       {
//         name: { type: Number },
//         percent: { type: String },
//         count: { type: Number },
//       },
//       {
//         name: { type: Number },
//         percent: { type: String },
//         count: { type: Number },
//       },
//     ],
//     loss: { type: Number },
//     surrender: { type: Number },
//     win: { type: Number },
//   },
// });

// module.exports = model("User", User);

const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  stats: {
    bar: [
      {
        name: { type: Number },
        percent: { type: String },
        count: { type: Number },
      },
      {
        name: { type: Number },
        percent: { type: String },
        count: { type: Number },
      },
      {
        name: { type: Number },
        percent: { type: String },
        count: { type: Number },
      },
      {
        name: { type: Number },
        percent: { type: String },
        count: { type: Number },
      },
      {
        name: { type: Number },
        percent: { type: String },
        count: { type: Number },
      },
      {
        name: { type: Number },
        percent: { type: String },
        count: { type: Number },
      },
    ],
    loss: { type: Number },
    surrender: { type: Number },
    win: { type: Number },
  },
});

module.exports = model("User", UserSchema);
