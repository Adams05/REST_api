import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/actions/authActions';
import { setAlert, hideAlert } from '../redux/actions/alertActions';
import Alert from './Alert';

const Register = () => {
	const { message, type } = useSelector((state) => state.alert);
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		occupation: '',
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { username, email, password, occupation } = formData;

	const handleCloseAlert = () => {
		dispatch(hideAlert());
	};

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		dispatch(register({ username, email, password, occupation }))
			.then(() => {
				setFormData({
					username: '',
					email: '',
					password: '',
					occupation: '',
				});
				navigate('/login');
			})
			.catch((err) => {
				// Handle registration error if needed
				console.error(err);
				dispatch(setAlert('Email already registered', 'error'));
			});
	};

	return (
		<div class='container'>
			<div className='card'>
				<h1 className='text-center card-title'>Register</h1>
				<form onSubmit={onSubmit}>
					<div>
						<input
							type='text'
							placeholder='Username'
							name='username'
							value={username}
							onChange={onChange}
							required
						/>
					</div>
					<div>
						<input
							type='email'
							placeholder='Email'
							name='email'
							value={email}
							onChange={onChange}
							required
						/>
					</div>
					<div>
						<input
							type='text'
							placeholder='Occupation (Not Required)'
							name='occupation'
							value={occupation}
							onChange={onChange}
						/>
					</div>
					<div>
						<input
							type='password'
							placeholder='Password'
							name='password'
							value={password}
							onChange={onChange}
							required
						/>
					</div>
					{message && (
						<Alert message={message} type={type} onClose={handleCloseAlert} />
					)}
					<button class='center-element mt-2 btn btn-primary' type='submit'>
						Register
					</button>
				</form>

				<p class='text-center'>
					Already have an account?{' '}
					<Link to='/login' className='link'>
						Login here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
