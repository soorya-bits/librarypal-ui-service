import { useState } from 'react'
import axios from 'axios'
import styles from './styles.module.css'

const ForgotPwd = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:1000/api/v1/forgot-password', { email })
      setMessage(response.data.message)
    } catch (error) {
      console.log(error)
      setMessage('Error sending reset instructions. Please try again.')
    }
  }

  return (
    <div className={styles.forgotpwd_container}>
			<div className={styles.forgotpwd_form_container}>
				<div className={styles.left}>
      <form className={styles.form_container} onSubmit={handleSubmit}>
        <h1>Reset Your Password</h1>
        <input
          type="email"
          placeholder="Enter your email address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.green_btn}>
          Send Reset Link
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
    </div>
    </div>
  )
}

export default ForgotPwd
