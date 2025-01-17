import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT_SUCCESS,
	AUTH_ERROR,
	LOAD_USER,
	UPDATE_OCCUPATION_SUCCESS,
	UPDATE_OCCUPATION_FAIL,
	DELETE_OCCUPATION_SUCCESS,
	DELETE_OCCUPATION_FAIL,
	DELETE_ACCOUNT_SUCCESS,
	DELETE_ACCOUNT_FAIL,
} from '../actionTypes';

const initialState = {
	isAuthenticated: false,
	user: null,
	token: localStorage.getItem('token'),
	loading: true,
	error: null,
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case REGISTER_SUCCESS:
			return {
				...state,
				isAuthenticated: false,
				loading: false,
			};
		case LOGIN_SUCCESS:
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				isAuthenticated: true,
				loading: false,
			};
		case AUTH_ERROR:
			return {
				...state,
				isAuthenticated: false,
				user: null,
				token: null,
				loading: false,
				error: action.payload,
			};
		case LOGIN_FAIL:
		case REGISTER_FAIL:
			localStorage.removeItem('token');
			return {
				...state,
				isAuthenticated: false,
				user: null,
				loading: false,
				error: action.payload,
			};
		case LOAD_USER:
			return {
				...state,
				isAuthenticated: true,
				user: action.payload,
				loading: false,
				error: null,
			};
		case LOGOUT_SUCCESS:
			return {
				...state,
				isAuthenticated: false,
				user: null,
				token: null,
				loading: false,
				error: null,
			};
		case UPDATE_OCCUPATION_SUCCESS:
			return {
				...state,
				user: { ...state.user, occupation: action.payload.occupation },
				loading: false,
				error: null,
			};
		case UPDATE_OCCUPATION_FAIL:
			return {
				...state,
				error: action.payload.error,
				loading: false,
			};
		case DELETE_OCCUPATION_SUCCESS:
			return {
				...state,
				user: { ...state.user, occupation: null },
				loading: false,
				error: null,
			};
		case DELETE_OCCUPATION_FAIL:
			return {
				...state,
				error: action.payload.error,
				loading: false,
			};
		case DELETE_ACCOUNT_SUCCESS:
			localStorage.removeItem('token');
			return {
				...state,
				isAuthenticated: false,
				user: null,
				token: null,
				loading: null,
				error: null,
			};
		case DELETE_ACCOUNT_FAIL:
			return {
				...state,
				error: action.payload.error,
				loading: false,
			};
		default:
			return state;
	}
};

export default authReducer;
