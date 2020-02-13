import Parse from 'parse'
import { notification } from 'antd'
import Api from './api'
import Config from './config'

Parse.serverURL = Config.getServerUrl()
Parse.initialize(Config.getApiKey())
export async function login(email, password) {
  return Parse.User.logIn(email, password)
    .then(() => true)
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    })
}

export async function currentAccount() {
  function getCurrentUser() {
    return new Promise(resolve => {
      if (!Parse.User.current()) resolve(false)

      Parse.User.current()
        .fetch()
        .then(user => {
          resolve({
            id: user.id,
            email: user.getEmail(),
            username: user.getUsername(),
            // eslint-disable-next-line no-underscore-dangle
            profilePhoto: user.attributes.profilePhoto ? user.attributes.profilePhoto._url : null,
          })
        })
        .catch(() => resolve(false))
    })
  }

  return getCurrentUser()
}

export async function localCurrentUser() {
  return Parse.User.current().toJSON()
}

export async function logout() {
  return Parse.User.logOut()
    .then(() => true)
    .catch(() => true)
}

export async function find(payload) {
  const result = await Api.find('_User', payload)
  return result
}
