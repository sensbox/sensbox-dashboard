
import { notification } from 'antd'
import Device from 'services/device'
// import actions from './actions'

export function fetchKeyAction(query) {

  return  async (dispatch) => {
    dispatch({
      type: 'REQUEST_KEY',
      payload: query
    });

    notification.info({
      message: 'Getting Device Key from server... ',
      description: ``,
    })

    const response = await Device.getKey(query);

    dispatch({
      type: 'RECEIVE_KEY',
      payload: response
    });

    notification.success({
      message: 'Device Key retrieved ',
      description: ``,
    })

  }
}

export function copyingToClipboard(){
  return ()=>{
    notification.success({
      message: 'Device Key copied to the clipboard '
    });
  }  
}


