import Parse from 'parse'

const metricsStoreFetch = async (device, from, to) => {
  const { uuid, sensors } = device
  const metrics = sensors.map(s => s.name)
  const params = {
    uuid,
    metrics,
    from,
    to,
  }
  return Parse.Cloud.run('metricsStoreFetch', params)
}

const metricsStoreFetchSeries = async series => {
  // if (Array.isArray(sensors)) {
  //   sensors.forEach(sensor => metrics.push(sensor.name))
  // } else if (typeof sensors === 'object' && sensors !== null) {
  //   metrics.push(sensors.name)
  // } else {
  //   throw new Error(
  //     'Sensors type not supported. Only array of type { name: "sensor"} or object of this type are valid',
  //   )
  // }
  let from
  let to

  const params = {
    series,
    from,
    to,
  }
  return Parse.Cloud.run('metricsStoreFetchSeries', params)
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

const findSensorsByDevices = async devices => {
  const params = {
    devices,
  }
  return Parse.Cloud.run('findSensorsByDevices', params)
}

export default {
  metricsStoreFetch,
  metricsStoreFetchSeries,
  findUsersByText,
  requestObjectPermissions,
  findSensorsByDevices,
}
