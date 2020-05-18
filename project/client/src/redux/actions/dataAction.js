import { ADD_ROOF } from "../types";
import axios from "axios";

// Add Roof
export const addRoof = (roofInfo) => (dispatch) => {
  axios
    .post(`/addRoof`)
    .then((res) => {
      dispatch({
        type: ADD_ROOF,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};
