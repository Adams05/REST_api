import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateOccupation } from '../redux/actions/authActions';
import axios from 'axios';

const Profile = () => {
	const auth = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [occupation, setOccupation] = useState('');

	useEffect(() => {
		if (auth.user) {
			setOccupation(auth.user.occupation || '');
		}
	}, [auth.user]);

	const handleEditClick = () => {
		setShow(true);
	};

	const handleInputChange = (e) => {
		setOccupation(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.patch(
				'/api/user/occupation',
				{ occupation },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			dispatch({ type: 'UPDATE_OCCUPATION_SUCCESS', payload: response.data });
			setShow(false);
		} catch (error) {
			console.error('Failed to update occupation:', error);
			dispatch({
				type: 'UPDATE_OCCUPATION_FAIL',
				payload: error.response ? error.response.data.error : 'Update failed',
			});
		}
	};

	return (
		<div className='container'>
			{!auth.user ? (
				<h3>Please log in</h3>
			) : (
				<div className='profile'>
					<img src='images/profile_img.jpg' alt='Profile' />
					<div className='profile-card'>
						<h3>Username: {auth.user.username}</h3>
						<h3>Email: {auth.user.email}</h3>
						{!auth.user.occupation ? (
							<>
								{!show ? (
									<h3 onClick={handleEditClick}>Add Occupation</h3>
								) : (
									<form onSubmit={handleSubmit}>
										<input
											type='text'
											placeholder='Enter your occupation'
											value={occupation}
											onChange={handleInputChange}
											required
										/>
										<button type='submit' className='btn btn-primary'>
											Save
										</button>
										<button
											type='button'
											onClick={() => setShow(false)}
											className='btn btn-secondary'
										>
											Cancel
										</button>
									</form>
								)}
							</>
						) : (
							<h3>Occupation: {auth.user.occupation}</h3>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
