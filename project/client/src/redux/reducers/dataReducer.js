import { ADD_ROOF } from "../types";

const initialState = {
  roofs: [],
  roof: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_ROOF:
      return {
        ...state,
      };
    default:
      return state;
  }
}
