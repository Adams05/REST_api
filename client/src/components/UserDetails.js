import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser, logout } from '../redux/actions/authActions';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

const UserDetails = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const auth = useSelector((state) => state.auth);

	// State to manage loading status
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (auth.isAuthenticated) {
			setLoading(false);
		} else {
			dispatch(loadUser());
		}
	}, [dispatch, auth.isAuthenticated]);

	useEffect(() => {
		if (auth.user) {
			setLoading(false); // User data is loaded
		} else if (auth.error) {
			setLoading(false); // Handle error state
		}
	}, [auth.user, auth.error]);

	const handleLogout = () => {
		dispatch(logout());
		navigate('/login'); // Redirect to login page
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<div>
			<h1>User Details</h1>
			{auth.isAuthenticated && auth.user ? (
				<div>
					<p>Username: {auth.user.username}</p>
					<p>Email: {auth.user.email}</p>
					<p>Occupation: {auth.user.occupation}</p>
					<button onClick={handleLogout}>Logout</button>
					<Alert />
				</div>
			) : (
				<p>
					Please log in <Link to='/login'>here</Link>
				</p>
			)}
		</div>
	);
};

export default UserDetails;
