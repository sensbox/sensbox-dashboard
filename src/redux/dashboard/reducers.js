import actions from './actions'

const initialState = {
  startDate: null,
  endDate: Date.UTC(),
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
