import Parse from 'parse'

async function find(className, payload = {}) {
    const {
      where = {},
      includes = [],
      searchField = null,
      searchText = '',
      sortField = "objectId",
      sortOrder = 'ascend',
      limit = 100,
      page = 0,
      withCount= true,
    } = payload;
    // Configure Parse Query
    const Class = Parse.Object.extend(className);
    const query = new Parse.Query(Class);
    // Define sort Order
    if (sortOrder === 'ascend'){
      query.ascending(sortField);
    } else {
      query.descending(sortField);
    }

    // Define String Search
    if (searchField && searchText !== ''){
      // ".*string.*"
      query.matches(searchField, new RegExp(`${searchText}`, "i"));
    }

    // Define Equals wheres 
    Object.keys(where).forEach((key) => {
      query.equalTo(key, where[key]);
    });

    // Define includes
    includes.forEach((include) => query.include(include));

    // Define pagination
    query.limit(limit);
    query.skip(page * limit);
    query.withCount(withCount);

    let results = {};
    let total = 0;
    // Query to server
    if (withCount) {
      const { count, results: responseResults } = await query.find();
      results = responseResults;
      total = count;
    } else {
      results = await query.find();
      total = results.length;
    }

    return { 
      results: results.map( r => r.toJSON()),
      total,
      page,
      limit,
    };
}

async function findById(className, objectId, payload ={}) {
  const { includes=[] } = payload;
  const Class = Parse.Object.extend(className);
  const query = new Parse.Query(Class);
  includes.forEach((include) => query.include(include));
  const result = await query.get(objectId);
  return result ? result.toJSON() : null;
}

async function create(className, data) {
    const Class = Parse.Object.extend(className);
    const object = new Class();
    object.set({ ...data });
    const result = await object.save();
    return result ? result.toJSON() : null;
}

/**
 * Update a Resource in Parse Server.
 *
 * @param {string} className - Class Name resource to update
 * @param {string} objectId  - Id of the resource to be updated
 * @param {JSON} data  - Body of json data to update
 * @param {boolean} fetchBeforeSync  - Flag to set if it's necesary fetch resource from the server before to update it.
 * 
 * @return {JSON} result -  Updated Json resource
 *
 * @example
 *     update('User', "ad8f797d", { name: "Santiago" }, true)
 */
async function update(className, objectId, data, fetchBeforeSync = false) {
    let object;
    if (!objectId) throw new Error("Cannot update object without objectId");
    if (fetchBeforeSync) {
      const Class = Parse.Object.extend(className);
      const query = new Parse.Query(Class);
      object = await query.get(objectId);
    } else {
      object = Parse.Object.fromJSON({
        className,
        objectId,
      });
    }
    object.set(data)
    const result = await object.save().catch( err => {
      object.revert();
      throw err;
    });
    return result ? result.toJSON() : null ;
}

async function remove(className, objectId) {
  const Class = Parse.Object.extend(className);
  const object = Class.createWithoutData(objectId);
  const removed = await object.destroy();
  return removed.toJSON();
}

function createPointer(className, objectId) {
  const Class = Parse.Object.extend(className);
  const pointer = new Class();
  pointer.id = objectId;
  return pointer
}

async function setPermissions(className, objectId, permissions) {
  const { public: pubPerm, users } = permissions;
  const Class = Parse.Object.extend(className);
  const object = Class.createWithoutData(objectId);
  const acl = new Parse.ACL();
  acl.setPublicReadAccess(pubPerm.read);
  acl.setPublicWriteAccess(pubPerm.write);
  users.forEach(user => {
    acl.setReadAccess(user.id, user.read);
    acl.setWriteAccess(user.id, user.write);
  });

  object.setACL(acl);
  const result = await object.save();
  return result ? result.toJSON() : null;
}

const ErrorCodes  = Parse.Error;

export default {
  find,
  findById,
  create,
  update,
  remove,
  createPointer,
  setPermissions,
  ErrorCodes,
}