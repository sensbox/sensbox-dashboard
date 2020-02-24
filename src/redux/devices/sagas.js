
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
    
    try {
      const result = await Device.getKey(query);
      
      dispatch({
        type: 'RECEIVE_KEY',
        payload: result
      });
  
      notification.success({
        message: 'Device Key retrieved ',
        description: ``,
      })
        
    } catch (error) {
      console.log(error);

      notification.error({
        message: 'Oops! Something went wrong! ',
        description: `${error}`,
      })

      dispatch({
        type: 'RECEIVE_KEY',
        payload: {key: '', receivedAt: Date.now()}
      })
    } 

  }
}

export function copyingToClipboard(){
  return ()=>{
    notification.success({
      message: 'Device Key copied to the clipboard '
    });
  }  
}


