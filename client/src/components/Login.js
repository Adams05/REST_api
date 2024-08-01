import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/authActions';

const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const auth = useSelector((state) => state.auth); // Get auth state from Redux store
	const { isAuthenticated } = auth;

	const { email, password } = formData;

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		dispatch(login(email, password));

		setFormData({
			email: '',
			password: '',
		});
	};

	// Use effect to handle navigation after login is successful
	useEffect(() => {
		if (isAuthenticated) {
			navigate('/userdetails');
		}
	}, [isAuthenticated, navigate]);

	return (
		<div className='container'>
			<div className='card'>
				<h1 className='text-center'>Login</h1>
				<form onSubmit={onSubmit}>
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
							type='password'
							placeholder='Password'
							name='password'
							value={password}
							onChange={onChange}
							required
						/>
					</div>
					<button className='mt-2 btn btn-primary center-element' type='submit'>
						Login
					</button>
				</form>

				<p className='text-center'>
					Don't have an account?
					<Link to='/' className='link'>
						{' '}
						Register here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
