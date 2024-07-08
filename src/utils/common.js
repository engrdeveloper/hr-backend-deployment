/**
 * Remove Key From Object
 *
 * Remove a key from an object and return the new object.
 * @param {object} obj - The object from which to remove the key.
 * @param {string} keyToRemove - The key to remove from the object.
 * @returns {object} - The new object with the key removed.
 */
exports.removeKeyFromObject = (obj, keyToRemove) => {
  // Create a shallow copy of the object
  const newObj = { ...obj };

  // Remove the specified key from the new object
  delete newObj[keyToRemove];

  // Return the new object
  return newObj;
};
