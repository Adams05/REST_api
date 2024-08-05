import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	updateOccupation,
	deleteOccupation,
} from '../redux/actions/authActions';
import { setAlert, hideAlert } from '../redux/actions/alertActions';
import Alert from './Alert';

const Profile = () => {
	const auth = useSelector((state) => state.auth);
	const { message, type } = useSelector((state) => state.alert);
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [occupation, setOccupation] = useState('');

	useEffect(() => {
		if (auth.user) {
			setOccupation(auth.user.occupation || '');
		}
	}, [auth.user]);

	const handleCloseAlert = () => {
		dispatch(hideAlert());
	};

	const handleEditClick = () => {
		setShow(true);
	};

	const handleInputChange = (e) => {
		setOccupation(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault(); // Add e.preventDefault() to prevent default form submission behavior
		try {
			console.log('Dispatching updateOccupation');
			await dispatch(updateOccupation(occupation));

			console.log('Dispatching setAlert for success');
			dispatch(setAlert('Occupation added successfully', 'success'));

			setShow(false);
		} catch (error) {
			console.error('Failed to update Occupation:', error);

			dispatch(setAlert('Failed to update occupation', 'error'));
		}
	};

	const handleDeleteOccupation = async (e) => {
		e.preventDefault();
		dispatch(deleteOccupation());
		dispatch(setAlert('Occupation deleted successfully', 'success'));
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
									<h3 onClick={handleEditClick} className='pointer'>
										Add Occupation
									</h3>
								) : (
									<form onSubmit={handleSubmit} className='profile-form'>
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
								{message && (
									<Alert
										message={message}
										type={type}
										onClose={handleCloseAlert}
									/>
								)}
							</>
						) : (
							<>
								<h3>
									Occupation: {auth.user.occupation}{' '}
									<button
										onClick={handleDeleteOccupation}
										className='btn btn-delete'
									>
										X
									</button>
								</h3>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
