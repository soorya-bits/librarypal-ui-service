import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import config from '../config';

const AddLoans = () => {
  const { USER_SERVICE_API_URL, BOOK_SERVICE_API_URL, LENDING_SERVICE_API_URL } = config
  const [data, setData] = useState({
    book_id: '',
    user_id: '',
  })
  const [status, setStatus] = useState('PENDING')
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  }

  // Fetch users and books
  useEffect(() => {
    
    axios.get(`${USER_SERVICE_API_URL}/users`, { headers })
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error("Failed to load users", err)
        alert("Error fetching users")
      })

    axios.get(`${BOOK_SERVICE_API_URL}/books`, { headers })
      .then(res => {
        // Filter books with avail_status > 0
        const availableBooks = res.data.filter(book => book.avail_status > 0)
        setBooks(availableBooks)
      })
      .catch(err => {
        console.error("Failed to load books", err)
        alert("Error fetching books")
      })

  }, [])

  // Load loan if editing
  useEffect(() => {
    if (id) {
      axios
        .get(`${LENDING_SERVICE_API_URL}/loans/${id}`, { headers })
        .then((res) => {
          const loan = res.data
          setData({
            book_id: loan.book_id,
            user_id: loan.user_id,
          })
          setStatus(loan.status)
        })
        .catch((err) => {
          console.error('Error fetching loan:', err)
          alert('Failed to fetch loan details')
        })
    }
  }, [id])

  const change = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
  }

  const submit = async () => {
    try {
      if (id) {
        await axios.put(
          `${LENDING_SERVICE_API_URL}/loans/${id}/status/${status}`,
          {},
          { headers }
        )
        alert('Loan updated successfully!')
      } else {
        const isEmpty = Object.values(data).some((val) => val.trim() === '')
        if (isEmpty) {
          alert('All fields are required')
          return
        }
        await axios.post(`${LENDING_SERVICE_API_URL}/loans/`, data, { headers })
        alert('Loan created successfully!')
      }

      setData({ book_id: '', user_id: '' })
      setStatus('PENDING')
      navigate('/lend-books')
    } catch (error) {
      console.error('Error submitting loan:', error)
      alert(error.response?.data?.detail || 'Failed to submit loan.')
    }
  }

  const cancel = () => {
    navigate('/lend-books')
  }

  return (
    <div className='bg-[#ebf8ff] flex justify-center items-center' style={{ minHeight: '80vh' }}>
      <div className='container p-4'>
        <h1 className='text-3xl text-[#5C99BA] text-center font-semibold'>
          {id ? 'Edit Loan' : 'Request a Book'}
        </h1>
        <div className='container p-4 border-2 border-gray-400 rounded-md shadow-lg'>

          {/* User Dropdown */}
          <div className='mb-3'>
            <label htmlFor='user_id' className='form-label text-blue-900'>Select User</label>
            <select
              id='user_id'
              name='user_id'
              className='form-control'
              value={data.user_id}
              onChange={change}
              disabled={!!id}
            >
              <option value=''>-- Select User --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.username || user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Book Dropdown */}
          <div className='mb-3'>
            <label htmlFor='book_id' className='form-label text-blue-900'>Select Book</label>
            <select
              id='book_id'
              name='book_id'
              className='form-control'
              value={data.book_id}
              onChange={change}
              disabled={!!id}
            >
              <option value=''>-- Select Book --</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown (Only on edit) */}
          {id && (
            <div className='mb-3'>
              <label htmlFor='status' className='form-label text-blue-900'>Loan Status</label>
              <select
                id='status'
                className='form-control'
                value={status}
                onChange={handleStatusChange}
              >
                <option value='Pending'>Pending</option>
                <option value='Approved'>Approved</option>
                <option value='Returned'>Returned</option>
                <option value='Denied'>Denied</option>
              </select>
            </div>
          )}

          <div>
            <button className='text-white bg-[#5C99BA] px-4 py-2 rounded' onClick={submit}>
              {id ? 'Update Request' : 'Request'}
            </button>
            <button className='ml-4 text-white bg-gray-500 px-4 py-2 rounded' onClick={cancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddLoans
