var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var Global_Request_Schema = new Schema({
  // Id: {type: Number, required: true, unique: true },
  title: { type: String },
  desc: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },  //will be added after user is implemented
  ms_mf: {type:String, required:true}
});
const Global_Request = mongoose.model(
  "Global_Request_Schema",
  Global_Request_Schema
);
module.exports = {
  Global_Request: Global_Request
};
