import Parse from 'parse'
import Api from './api'

const RESOURCE_CLASS_NAME = 'Device'

async function find(payload) {
  const result = await Api.find(RESOURCE_CLASS_NAME, payload)
  return result
}

async function findById(objectId) {
  const result = await Api.findById(RESOURCE_CLASS_NAME, objectId)
  return result
}

async function create(data) {
  const result = await Api.create(RESOURCE_CLASS_NAME, data)
  return result
}

async function update(objectId, updatedCentro) {
  const result = await Api.update(RESOURCE_CLASS_NAME, objectId, updatedCentro, false)
  return result
}

async function subscribeToMessages(uuid) {
  const query = new Parse.Query('DeviceMessage')
  query.equalTo('uuid', uuid)
  // query.equalTo('topic', 'agent/message');
  query.descending('createdAt')
  const subscription = await query.subscribe()
  return subscription
}

async function unsubscribe(subscription) {
  return subscription.unsubscribe()
}

/**
 * Search in all fields
 * @param String value search criteria
 */
async function search(value) {
  const uuid = new Parse.Query(RESOURCE_CLASS_NAME)
  uuid.matches('uuid', new RegExp(`${value}`, 'i'))
  const description = new Parse.Query(RESOURCE_CLASS_NAME)
  description.matches('description', new RegExp(`${value}`, 'i'))
  const mainQuery = Parse.Query.or(uuid, description)
  let results
  try {
    results = await mainQuery.find()
  } catch (error) {
    console.error(error)
  }
  return {
    results: results.map(r => r.toJSON()),
  }
}

export default {
  find,
  findById,
  create,
  update,
  search,
  subscribeToMessages,
  unsubscribe,
}
