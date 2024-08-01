import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authActions';

const NavBar = () => {
	const auth = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout());
		navigate('/login');
	};

	return (
		<div class='navbar'>
			<div className='nav'>
				{!auth.isAuthenticated ? (
					<ul className='nav-links'>
						<li>
							<Link to='/' className='nav-link'>
								Register
							</Link>
						</li>
						<li>
							<Link to='/login' className='nav-link'>
								Login
							</Link>
						</li>
					</ul>
				) : (
					<ul className='nav-links'>
						{auth.user && (
							<h4 className='nav-user'>Hello {auth.user.username}</h4>
						)}
						<li>
							<Link to='/profile' className='nav-link'>
								Profile
							</Link>
						</li>
						<button onClick={handleLogout} className='btn logout-btn'>
							Logout
						</button>
					</ul>
				)}
			</div>
		</div>
	);
};

export default NavBar;
