import Parse from 'parse'

const storeFetch = async (device, from, to) => {
  const { uuid, sensors } = device
  const metrics = sensors.map(s => s.name)
  const params = {
    uuid,
    metrics,
    from,
    to,
  }
  return Parse.Cloud.run('storeFetch', params)
}

const findUsersByText = async text => {
  const params = { text }
  return Parse.Cloud.run('findUsersByText', params)
}

const requestObjectPermissions = async (className, objectId) => {
  const params = {
    className,
    objectId,
  }
  return Parse.Cloud.run('requestObjectPermissions', params)
}

export default {
  storeFetch,
  findUsersByText,
  requestObjectPermissions,
}
