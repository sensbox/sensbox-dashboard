import Parse from 'parse'
import Api from './api'
import Cloud from './cloud'

const RESOURCE_CLASS_NAME = 'Sensor'

async function find(payload = {}) {
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

async function remove(objectId) {
  await Api.remove(RESOURCE_CLASS_NAME, objectId)
}

async function subscribeToChanges(deviceId) {
  if (!deviceId) throw new Error('Device Id cannot be null or undefined ')
  const query = new Parse.Query('Sensor')
  query.equalTo('device', Api.createPointer('Device', deviceId))
  const subscription = await query.subscribe()
  return subscription
}

async function unsubscribe(subscription) {
  return subscription.unsubscribe()
}

async function findByDevice(deviceId) {
  const query = new Parse.Query(RESOURCE_CLASS_NAME)
  query.equalTo('device', Api.createPointer('Device', deviceId))
  const results = await query.find()
  return {
    results: results.map(r => r.toJSON()),
  }
}

/**
 * Return sensors intersection between array of devices
 *
 * @param {Array} devices
 */
async function findByDevices(devices) {
  return Cloud.findSensorsByDevices(devices)
}

export default {
  find,
  findById,
  findByDevice,
  findByDevices,
  create,
  update,
  remove,
  subscribeToChanges,
  unsubscribe,
}
