import Api from './api';

const RESOURCE_CLASS_NAME = "Sensor";

async function find(payload = {}) {
  const result = await Api.find(RESOURCE_CLASS_NAME, payload);
  return result;
}

async function findById(objectId) {
  const result = await Api.findById(RESOURCE_CLASS_NAME, objectId);
  return result;
}

async function create(data) {
  const result = await Api.create(RESOURCE_CLASS_NAME, data);
  return result;
}

async function update(objectId, updatedCentro) {
  const result = await Api.update(RESOURCE_CLASS_NAME, objectId, updatedCentro, false);
  return result;
}

export default {
  find,
  findById,
  create,
  update,
}