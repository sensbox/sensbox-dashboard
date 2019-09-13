import Api from './api';

const RESOURCE_CLASS_NAME = "Provincia";

async function find(payload = {}) {
  const result = await Api.find(RESOURCE_CLASS_NAME, payload);
  return result;
}

async function findById() {
  return new Error('Provincia findById not implemented yet');
}

export default {
  find,
  findById,
}