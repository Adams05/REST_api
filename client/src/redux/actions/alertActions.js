import { SET_ALERT, HIDE_ALERT } from '../actionTypes';
// Action for Alerts
export const setAlert = (message, alertType) => ({
	type: SET_ALERT,
	payload: { message, alertType },
});

export const hideAlert = () => ({
	type: HIDE_ALERT,
});
