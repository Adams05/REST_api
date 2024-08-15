import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	updateOccupation,
	deleteOccupation,
	deleteAccount,
} from '../redux/actions/authActions';
import { setAlert, hideAlert } from '../redux/actions/alertActions';
import Alert from './Alert';

const Profile = () => {
	const auth = useSelector((state) => state.auth);
	const { message, type } = useSelector((state) => state.alert);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [showModal, setShowModal] = useState(false);
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
		e.preventDefault();
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

	const handleDeleteAccount = async (e) => {
		e.preventDefault();
		setShowModal(true);
	};

	const confirmDeleteAccount = async () => {
		setShowModal(false);
		await dispatch(deleteAccount());
		navigate('/register');
	};

	const cancelDeleteAccount = () => {
		setShowModal(false);
	};

	const DeleteAccountModal = ({ onClose, onConfirm }) => (
		<div className='modal'>
			<div className='modal-content'>
				<h3>Are you sure you wish to delete your account?</h3>
				<button onClick={onConfirm} className='btn btn-danger mr-2'>
					Delete
				</button>
				<button onClick={onClose} className='btn btn-primary'>
					Cancel
				</button>
			</div>
		</div>
	);

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
									<h3
										onClick={handleEditClick}
										className='pointer btn btn-primary'
									>
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
						<button onClick={handleDeleteAccount} className='btn btn-danger'>
							Delete Account
						</button>
					</div>
				</div>
			)}
			{showModal && (
				<DeleteAccountModal
					onClose={cancelDeleteAccount}
					onConfirm={confirmDeleteAccount}
				/>
			)}
		</div>
	);
};

export default Profile;
