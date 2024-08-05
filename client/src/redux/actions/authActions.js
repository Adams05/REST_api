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
	DELETE_OCCUPATION_SUCCESS,
	DELETE_OCCUPATION_FAIL,
} from '../actionTypes';

const registerURL = 'http://localhost:5000/api/register';
const loginURL = 'http://localhost:5000/api/login';
const userURL = 'http://localhost:5000/api/user';
const occupationURL = 'http://localhost:5000/api/user/occupation';

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
			return Promise.resolve();
		} catch (err) {
			dispatch({
				type: REGISTER_FAIL,
			});
			return Promise.reject(err);
		}
	};

// Login User
export const login = (email, password) => async (dispatch) => {
	try {
		const response = await axios.post(
			loginURL,
			{ email, password },
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
		const response = await axios.get(userURL, {
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
		const token = localStorage.getItem('token');

		const response = await axios.patch(
			'http://localhost:5000/api/user/occupation',
			{ occupation },
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		);
		dispatch({ type: UPDATE_OCCUPATION_SUCCESS, payload: response.data });
	} catch (error) {
		console.error('Failed to update occupation:', error);
		dispatch({
			type: UPDATE_OCCUPATION_FAIL,
			payload: error.response ? error.response.data.error : 'Update failed',
		});
	}
};

export const deleteOccupation = () => async (dispatch) => {
	try {
		const token = localStorage.getItem('token');

		const res = await axios.delete(occupationURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		dispatch({
			type: DELETE_OCCUPATION_SUCCESS,
			payload: res.data,
		});
	} catch (error) {
		console.error('Failed to update occupation:', error);
		dispatch({
			type: DELETE_OCCUPATION_FAIL,
		});
	}
};
