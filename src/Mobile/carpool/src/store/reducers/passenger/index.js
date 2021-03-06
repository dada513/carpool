import * as actions from '../../actions/passenger';
import {initialStoreItem} from '../utils';

const initialState = {
  allRides: initialStoreItem,
  userRides: initialStoreItem,
  userPastRides: initialStoreItem,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GetAllRides.Success:
      return {
        ...state,
        allRides: {
          ...initialStoreItem,
          data: action.payload,
        },
      };
    case actions.GetAllRides.Error:
      return {
        ...state,
        allRides: {
          ...initialStoreItem,
          error: action.payload,
        },
      };
    case actions.GetAllRides.Loading:
      return {
        ...state,
        allRides: {
          ...state.allRides,
          loading: true,
        },
      };
    case actions.GetUsersRides.Success:
      return {
        ...state,
        userRides: {
          ...initialStoreItem,
          data: action.payload,
        },
      };
    case actions.GetUsersRides.Error:
      return {
        ...state,
        userRides: {
          ...initialStoreItem,
          error: action.payload,
        },
      };
    case actions.GetUsersRides.Loading:
      return {
        ...state,
        userRides: {
          ...state.userRides,
          loading: true,
        },
      };
    case actions.GetUsersPastRides.Success:
      return {
        ...state,
        userPastRides: {
          ...initialStoreItem,
          data: action.payload,
        },
      };
    case actions.GetUsersPastRides.Error:
      return {
        ...state,
        userPastRides: {
          ...initialStoreItem,
          error: action.payload,
        },
      };
    case actions.GetUsersPastRides.Loading:
      return {
        ...state,
        userPastRides: {
          ...state.userPastRides,
          loading: true,
        },
      };
    default:
      return state;
  }
};

export default reducer;
