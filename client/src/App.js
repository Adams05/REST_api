import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Register from './components/Register';
import Login from './components/Login';
import UserDetails from './components/UserDetails';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
	return (
		<Provider store={store}>
			<Router>
				<div>
					<NavBar />
					<Routes>
						<Route exact path='/' element={<Register />} />
						<Route path='/register' element={<Register />} />
						<Route path='/login' element={<Login />} />
						<Route path='/userdetails' element={<UserDetails />} />
						<Route
							path='/profile'
							element={<ProtectedRoute element={<Profile />} />}
						/>
					</Routes>
					<br />
				</div>
			</Router>
		</Provider>
	);
}

export default App;
