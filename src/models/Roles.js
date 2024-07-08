const mongoose = require("mongoose");

const permissionOptions = {
  READ: "READ", // Compulsory for all roles
  CREATE: "CREATE",
  EDIT: "EDIT",
  DELETE: "DELETE",
};

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  pagesPermission: {
    type: [String],
  },
  actionsPermission: {
    type: [String],
    default: [permissionOptions.READ], // READ is compulsory
    enum: Object.values(permissionOptions), // Restrict to defined options
  },
});

module.exports = mongoose.model("roles", RoleSchema);
