import { SET_ALERT, HIDE_ALERT } from '../actionTypes';

const initialState = {
	message: null,
	type: null,
};

const alertReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_ALERT:
			return {
				...state,
				message: action.payload.message,
				type: action.payload.alertType,
			};
		case HIDE_ALERT:
			return {
				...state,
				message: null,
				type: null,
			};
		default:
			return state;
	}
};

export default alertReducer;
