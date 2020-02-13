import Parse from 'parse'

function getServerUrl() {
  return process.env.REACT_APP_SERVER_URL
}

function getApiKey() {
  return process.env.REACT_APP_API_KEY
}

async function getInfluxFunctions() {
  const config = await Parse.Config.get()
  return config.get('InfluxFunctions')
}

async function get() {
  const result = await Parse.Config.get()
  return result
}

export default {
  get,
  getInfluxFunctions,
  getServerUrl,
  getApiKey,
}
