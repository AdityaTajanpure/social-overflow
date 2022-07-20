import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];

export default function alertReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      window.scrollTo(0, 0);
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
