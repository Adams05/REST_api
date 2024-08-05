import React from 'react';

const Alert = ({ message, type, onClose }) => {
	if (!message) return null;

	return (
		<div className={`alert alert-${type}`}>
			<span>{message}</span>
			<button onClick={onClose} className='btn btn-close'>
				X
			</button>
		</div>
	);
};

export default Alert;
