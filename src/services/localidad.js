import Api from './api';

const RESOURCE_CLASS_NAME = "Localidad";

async function find(payload = {}) {
  const result = await Api.find(RESOURCE_CLASS_NAME, payload);
  return result;
}

async function findById() {
  return new Error('Localidad findById not implemented yet');
}

export default {
  find,
  findById,
}