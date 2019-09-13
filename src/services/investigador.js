import Parse from 'parse'
import Api from './api';

const RESOURCE_CLASS_NAME = "Investigador";

async function find(payload) {
    const result = await Api.find(RESOURCE_CLASS_NAME, payload);
    return result;
}

async function findById(objectId) {
  const result = await Api.findById(RESOURCE_CLASS_NAME, objectId);
  const centros = await fetchCentros(result.objectId);
  return {
    ...result,
    centros
  };
}

async function create(data) {
  const result = await Api.create(RESOURCE_CLASS_NAME, processFields(data));
  const centros = await fetchCentros(result.objectId);
  return {
    ...result,
    centros
  };
}

async function update(objectId, data) {
  const result = await Api.update(RESOURCE_CLASS_NAME, objectId, processFields(data), false);
  const centros = await fetchCentros(result.objectId);
  return {
    ...result,
    centros
  };
}

async function fetchCentros(objectId) {
  const investigador = Parse.Object.fromJSON({ className: "Investigador", objectId });
  const query = new Parse.Query("CentroInvestigador");
  query.equalTo("investigador", investigador);
  query.include("centro");
  const relations = await query.find();
  const centros=[];
  relations.forEach(relation => {
    console.log(relation)
    const centro = relation.get("centro");
    centros.push({
      objectId: relation.id,
      nombre: centro.get('nombre'),
      telefono: centro.get('telefono'),
      email: centro.get('email'),
    });
  });
  return centros;
};

function processFields(data) {
  const { telefono, celular } = data;
  // if (centro && centro.constructor.name !== 'ParseObject') {
  //   data.centro = Api.createPointer("Centro", centro);
  // }
  if (telefono && typeof telefono === 'number') {
    data.telefono = telefono.toString();
  }
  if (celular && typeof celular === 'number') {
    data.celular = celular.toString();
  }
  return data;
}

export default {
  find,
  findById,
  create,
  update
}