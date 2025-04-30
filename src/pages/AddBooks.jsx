import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import config from '../config';

const AddBooks = () => {
  const BOOK_SERVICE_API_URL = config.BOOK_SERVICE_API_URL;
  const [Data, setData] = useState({
    title: '',
    author: '',
    genre: '',
    desc: '',
    url: '',
    avail_status: '',
  })

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  }

  const navigate = useNavigate()
  const { id } = useParams()

  // If id is present, fetch book details to populate form
  useEffect(() => {
    if (id) {
      axios.get(`${BOOK_SERVICE_API_URL}/books/${id}`)
        .then((res) => {
          const book = res.data
          setData({
            title: book.title,
            author: book.author,
            genre: book.genre || '',
            desc: book.desc || '',
            url: book.url || '',
            avail_status: book.avail_status || '',
          })
        })
        .catch((err) => {
          console.error('Error fetching book details:', err)
          alert("Failed to fetch book details")
        })
    }
  }, [id])

  const change = (e) => {
    const { name, value } = e.target
    setData({ ...Data, [name]: value })
  }

  const submit = async () => {
    try {
      const isEmpty = Object.values(Data).some((val) => val.trim() === '')
      if (isEmpty) {
        alert('All fields are required')
        return
      }

      if (id) {
        // Edit Mode
        const response = await axios.put(
          `${BOOK_SERVICE_API_URL}/books/${id}`,
          Data,
          { headers }
        )
        alert('Book updated successfully!')
        console.log("Book Updated:", response.data)
      } else {
        // Add Mode
        const response = await axios.post(
          `${BOOK_SERVICE_API_URL}/books/`,
          Data,
          { headers }
        )
        alert('Book created successfully!')
        console.log("Book Created:", response.data)
      }

      setData({
        title: '',
        author: '',
        genre: '',
        desc: '',
        url: '',
        avail_status: '',
      })

      navigate('/books')
    } catch (error) {
      console.error('Error submitting book:', error)
      alert(error.response?.data?.detail || "Failed to submit book.")
    }
  }

  // Handle Cancel action
  const cancel = () => {
    navigate('/books')  // Redirect back to the books list
  }

  return (
    <div className='bg-[#ebf8ff] flex justify-center items-center' style={{ minHeight: '80vh' }}>
      <div className='container p-4'>
        <h1 className='text-3xl text-[#5C99BA] text-center font-semibold'>
          {id ? 'Edit Book' : 'Add New Book'}...
        </h1>
        <div className='container p-4 border-2 border-gray-400 rounded-md shadow-lg'>
          {[
            { label: 'Book Title', name: 'title' },
            { label: 'Author Name', name: 'author' },
            { label: 'Book Genre', name: 'genre' },
            { label: 'Book Image URL', name: 'url' },
            { label: 'Book Description', name: 'desc' },
            { label: 'Availability Status', name: 'avail_status' },
          ].map((field, idx) => (
            <div className='mb-3' key={idx}>
              <label htmlFor={field.name} className='form-label text-blue-900'>{field.label}</label>
              <input
                className='form-control'
                id={field.name}
                type='text'
                placeholder={`Enter ${field.label.toLowerCase()}`}
                name={field.name}
                required
                onChange={change}
                value={Data[field.name]}
              />
            </div>
          ))}
          <div>
            <button className='text-white bg-[#5C99BA] px-4 py-2 rounded' onClick={submit}>
              {id ? 'Update Book' : 'Add Book'}
            </button>
            <button 
              className='ml-4 text-white bg-gray-500 px-4 py-2 rounded' 
              onClick={cancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBooks
