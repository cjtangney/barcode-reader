const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const ListSchema = new Schema(
  {
    name: String,
    fileName: String,
    serials: Array,
    totalQty: Number,
    redeemQty: Number,
  },
  { 
  	timestamps: true,
  }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("List", ListSchema);