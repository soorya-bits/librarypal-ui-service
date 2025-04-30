import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import config from '../../config'


const Login = () => {
	const USER_SERVICE_API_URL = config.USER_SERVICE_API_URL
	const [Values, setValues] = useState({ username: '', password: '' ,})

	const change = (e) => {
		const {name, value } = e.target
		setValues({ ...Values, [name]: value})
	}

	const loginUser = async (Values) => {
		try {
			// Make the POST request to the login endpoint
			const response = await axios.post(`${USER_SERVICE_API_URL}/login`, Values);
		
			// If the request is successful, process the response
			console.log(response.data);
		
			// Store user data in localStorage
			localStorage.setItem('id', response.data.id);
			localStorage.setItem('token', response.data.token);
		
			// Redirect to home or dashboard page
			window.location.href = '/';
			
		} catch (error) {
			// Handle error
			if (error.response) {
			// The server responded with a status other than 2xx
			if (error.response.status === 400) {
				alert(`Error: ${error.response.data.detail || 'Invalid credentials!'}`);
			} else {
				alert(`Error: ${error.response.data.detail || 'An error occurred!'} (Status: ${error.response.status})`);
			}
			} else if (error.request) {
			// The request was made but no response was received
			alert('No response from the server. Please try again later.');
			} else {
			// Something happened in setting up the request
			alert('Error setting up the request. Please try again.');
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			if (
				Values.username === '' ||
				Values.email === '' ||
				Values.password === '' 
			) { 
				alert('All fields are required')
			}
			else {
				await loginUser(Values)
			}

		}
		catch(error){
			console.log(error)
		}
	}

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form id='loginsub' className={styles.form_container}>
						<h1>Login</h1>
						<input
							type="text"
							placeholder="Enter your username"
							name="username"
							onChange={change}
							value={Values.username}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Enter your Password"
							name="password"
							onChange={change}
							value={Values.password}
							required
							className={styles.input}
						/>
						
						<button className={styles.green_btn} onClick={handleSubmit}>
							Login
						</button>

						{/* password recovery */}
						{/* Add Forgot Password Link */}
						<div className={styles.forgot_password}>
							<Link to='/forgot-password' className={styles.link}>
								Forgot Password?
							</Link>
            			</div>
					</form>
				</div>
				<div className={styles.right}>
					<h1>New here?</h1>
					<Link to='/signup'>
						<button className={styles.white_btn}>
							Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Login