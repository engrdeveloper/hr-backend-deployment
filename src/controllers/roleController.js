const { Roles } = require("../models");
const {
  createData,
  findOneByQuery,
  findOneById,
  updateById,
  deleteById,
} = require("../services/dbService");
const { success, error } = require("../utils/apiResponse");

/**
 * Registers a new role in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object.
 */
exports.createRole = async (req, res) => {
  try {
    // Extract the name, actionsPermission and pagesPermission from the request body.
    const { name, actionsPermission, pagesPermission } = req.body;

    // Check if the name, actionsPermission and pagesPermission are provided.
    if (!name || !actionsPermission || !pagesPermission) {
      return res.status(400).json({
        error: "Name, actionsPermission and pagesPermission are required",
      });
    }
    // Check if the name already exists in the database.
    const roleExists = await findOneByQuery({ name }, Roles);
    if (roleExists) {
      return res.status(400).json({ error: "Role already exists" });
    }

    // Create a new role in the database with the provided name, actionsPermission and pagesPermission.
    const role = await createData(
      { name, actionsPermission, pagesPermission },
      Roles
    );

    // Send a success response with the created role and status code 201.
    return success(role, 201)(req, res);
  } catch (e) {
    // Send an error response with the error message and status code 500.
    return error(e, "Something went wrong", 500)(req, res);
  }
};

/**
 * Retrieves all roles from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the roles and status code 200.
 * @throws {Object} - The response object with an error message and status code 500.
 */
exports.getAllRoles = async (req, res) => {
  try {
    // Find all roles in the database.
    const roles = await Roles.find();

    // Send a success response with the roles and status code 200.
    return success(roles, 200)(req, res);
  } catch (e) {
    // Send an error response with the error message and status code 500.
    return error(e, "Something went wrong", 500)(req, res);
  }
};

/**
 * Updates a role in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the updated role and status code 200.
 * @throws {Object} - The response object with an error message and status code 500.
 */
exports.updateRole = async (req, res) => {
  try {
    // Extract the id, name, actionsPermission and pagesPermissionfrom the request body and parameters.
    const { id } = req.params;
    const { name, actionsPermission, pagesPermission } = req.body;

    // Check if the name, actionsPermission and pagesPermission are provided.
    if (!name || !actionsPermission || !pagesPermission) {
      return res.status(400).json({
        error: "Name, actionsPermission and pagesPermission are required",
      });
    }

    // Find the role by its id in the database.
    const role = await findOneById(id, Roles);

    // If the role is not found, return a 404 error.
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Check if it's the duplicate name or not
    const roleExists = await findOneByQuery({ name }, Roles);
    if (roleExists && roleExists._id.toString() !== id) {
      return res.status(400).json({ error: "Name already exists" });
    }

    // Update the role in the database with the provided name, actionsPermission and pagesPermission.
    const updatedRole = await updateById(
      id,
      { name, actionsPermission, pagesPermission },
      Roles
    );

    // Send a success response with the updated role and status code 200.
    return success(updatedRole, 200)(req, res);
  } catch (e) {
    // Send an error response with the error message and status code 500.
    return error(e, "Something went wrong", 500)(req, res);
  }
};

/**
 * Delete Role
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the deleted role and status code 200.
 * @throws {Object} - The response object with an error message and status code 500.
 */
exports.deleteRole = async (req, res) => {
  try {
    // Extract the id from the request parameters.
    const { id } = req.params;

    // Find the role by its id in the database.
    const role = await findOneById(id, Roles);

    // If the role is not found, return a 404 error.
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Delete the role from the database.
    await deleteById(id, Roles);

    // Send a success response with the deleted role and status code 200.
    return success({ messge: "Role deleted Successfully" }, 200)(req, res);
  } catch (e) {
    // Send an error response with the error message and status code 500.
    return error(e, "Something went wrong", 500)(req, res);
  }
};

/**
 * Get Role By Id
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the role and status code 200.
 * @throws {Object} - The response object with an error message and status code 500.
 */
exports.getRoleById = async (req, res) => {
  try {
    // Extract the id from the request parameters.
    const { id } = req.params;

    // Find the role by its id in the database.
    const role = await findOneById(id, Roles);

    // If the role is not found, return a 404 error.
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Send a success response with the role and status code 200.
    return success(role, 200)(req, res);
  } catch (e) {
    // Send an error response with the error message and status code 500.
    return error(e, "Something went wrong", 500)(req, res);
  }
};
