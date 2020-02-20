import actions from './actions'

const initialState = {
  layouts: [],
  widgets: [],
  showWidgetEditor: false,
  showWidgetsCatalog: false,
  stopGridLayoutUpdates: false,
  currentWidget: null,
  currentWidgetErrors: [],
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
