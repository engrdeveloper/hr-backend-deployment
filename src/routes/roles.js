const router = require("express").Router();
const {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
  getRoleById,
} = require("../controllers/roleController");

// route to create a role
router.post("/create", createRole);

// route to get all roles
router.get("/all", getAllRoles);

// route to get the role by id
router.get("/:id", getRoleById);

// route to update a role
router.put("/update/:id", updateRole);

// route to delete a role
router.delete("/delete/:id", deleteRole);

module.exports = router;
