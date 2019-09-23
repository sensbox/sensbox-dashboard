import Parse from 'parse'

async function find(className, payload) {
    // const lquery = new Parse.Query('DeviceMessage');
    // lquery.equalTo('uuid', '7697BA99-A630-5162-9B60-885512B0BAC1');
    // lquery.equalTo('topic', 'agent/message');
    // const subscription = await lquery.subscribe();
    // subscription.on('create', (message) => {
    //   console.log(message.toJSON()); // This should output Mengyan
    // });
    const {
      where = {},
      includes = [],
      searchField = null,
      searchText = '',
      sortField = "objectId",
      sortOrder = 'ascend',
      limit = 100,
      page = 0,
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

    // Count Objects
    const total = await query.count();
    // Query to server
    const results = await query.find();
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
  await object.destroy();
}

function createPointer(className, objectId) {
  const Class = Parse.Object.extend(className);
  const pointer = new Class();
  pointer.id = objectId;
  return pointer
}

export default {
  find,
  findById,
  create,
  update,
  remove,
  createPointer
}