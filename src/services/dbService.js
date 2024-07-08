/**
 * Creates a new document in the specified model using the provided data.
 *
 * @param {Object} data - The data to create a new document with.
 * @param {Model} model - The model to create the document in.
 * @returns {Promise<Document>} - A promise that resolves to the created document.
 */
exports.createData = async (data, model) => model.create(data);

/**
 * Find All
 * This function retrieves all documents from a given model.
 *
 * @param {Model} model - The model to query.
 * @returns {Promise<Array>} - A promise that resolves to an array of documents.
 */
exports.findAll = async (model) => model.find();

/**
 * Find One By Id
 * This function retrieves a document by its ID from a given model.
 *
 * @param {string} id - The ID of the document to retrieve.
 * @param {Model} model - The model to query.
 * @returns {Promise<Document>} - A promise that resolves to the retrieved document.
 */
exports.findOneById = async (id, model) => model.findById(id);

/**
 * Find One By Query
 * This function retrieves a document by a query from a given model.
 *
 * @param {Object} query - The query to search for.
 * @param {Model} model - The model to query.
 * @returns {Promise<Document>} - A promise that resolves to the retrieved document.
 */
exports.findOneByQuery = async (query, model) => model.findOne(query);

/**
 * Find All By Query
 * This function retrieves multiple documents by a query from a given model.
 *
 * @param {Object} query - The query to search for.
 * @param {Model} model - The model to query.
 * @returns {Promise<Array>} - A promise that resolves to an array of documents.
 */
exports.findAllByQuery = async (query, model) => model.find(query);

/**
 * Update By Id
 * This function updates a document by its ID with new data from a given model.
 *
 * @param {string} id - The ID of the document to update.
 * @param {Object} data - The new data to update the document with.
 * @param {Model} model - The model to query.
 * @returns {Promise<Document>} - A promise that resolves to the updated document.
 */
exports.updateById = async (id, data, model) =>
  model.findByIdAndUpdate(id, data, { new: true });

/**
 * Update By Query
 * This function updates a document by a query with new data from a given model.
 *
 * @param {Object} query - The query to search for.
 * @param {Object} data - The new data to update the document with.
 * @param {Model} model - The model to query.
 * @returns {Promise<Document>} - A promise that resolves to the updated document.
 */
exports.updateByQuery = async (query, data, model) =>
  model.findOneAndUpdate(query, data, { new: true });

/**
 * Remove By Id
 * This function removes a document by its ID from a given model.
 *
 * @param {string} id - The ID of the document to remove.
 * @param {Model} [model=usersModel] - The model to query. Defaults to usersModel.
 * @returns {Promise<Document>} - A promise that resolves to the removed document.
 */
exports.removeById = async (id, model) => model.findByIdAndRemove(id);

/**
 * Delete By Id
 *
 * @param {string} id - The ID of the document to remove.
 * @param {Model} model - The model to query.
 * @returns - A promise that resolves to the removed document.
 */
exports.deleteById = async (id, model) => model.deleteOne({ _id: id });
