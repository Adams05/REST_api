import axios from 'axios';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT_SUCCESS,
	LOAD_USER,
	AUTH_ERROR,
	UPDATE_OCCUPATION_SUCCESS,
	UPDATE_OCCUPATION_FAIL,
} from '../actionTypes';

const registerURL = 'http://localhost:5000/api/register';
const loginURL = 'http://localhost:5000/api/login';

export const register =
	({ username, email, password, occupation }) =>
	async (dispatch) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const body = JSON.stringify({ username, email, password, occupation });

		try {
			const res = await axios.post(registerURL, body, config);
			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data,
			});
			return Promise.resolve(); // Resolve the promise on success
		} catch (err) {
			dispatch({
				type: REGISTER_FAIL,
			});
			return Promise.reject(err); // Reject the promise on failure
		}
	};

// Login User
export const login = (email, password) => async (dispatch) => {
	try {
		const response = await axios.post(
			loginURL,
			{ email, password }, // Correctly formatted object
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		const { token } = response.data;

		localStorage.setItem('token', token);

		dispatch({
			type: LOGIN_SUCCESS,
			payload: token,
		});
		dispatch(loadUser());
	} catch (error) {
		console.error('Login error:', error);
		dispatch({
			type: LOGIN_FAIL,
			payload: error.response?.data?.error || 'Login failed',
		});
	}
};

// Logout User
export const logout = () => (dispatch) => {
	// Clear user data from localStorage or cookies
	localStorage.removeItem('token');
	dispatch({
		type: LOGOUT_SUCCESS,
	});
};

// Load user
export const loadUser = () => async (dispatch) => {
	try {
		// Get the token from localStorage
		const token = localStorage.getItem('token');

		// Make the authenticated request
		const response = await axios.get('http://localhost:5000/api/user', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		// Dispatch the user data
		dispatch({
			type: LOAD_USER,
			payload: response.data,
		});
	} catch (error) {
		dispatch({
			type: AUTH_ERROR,
			payload: error.response?.data?.error || 'Failed to load user',
		});
	}
};

// Action to update user occupation
export const updateOccupation = (occupation) => async (dispatch) => {
	try {
		const res = await axios.patch('/api/user/occupation', { occupation });
		dispatch({
			type: UPDATE_OCCUPATION_SUCCESS,
			payload: res.data,
		});
	} catch (error) {
		console.error('Failed to update occupation:', error);
		dispatch({
			type: UPDATE_OCCUPATION_FAIL,
		});
	}
};
