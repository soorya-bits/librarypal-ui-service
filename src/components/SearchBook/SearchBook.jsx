import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import './SearchBook.css'

export const SearchBook = ({ setResults, books }) => {
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')

  const handleSearch = (value) => {
    setInput(value)

    // Filter books based on the input value
    const filtered = books.filter((book) => 
     ( book.title && book.title.toLowerCase().includes(value.toLowerCase() )) ||
     (book.author && book.author.toLowerCase().includes(value.toLowerCase() ))  ||
     (book.genre && book.genre.toLowerCase().includes(value.toLowerCase() ))  
    )

    if (filtered.length > 0) {
      setMessage('') // Clear the message if books are found
    } else {
      setMessage('No books found! Please try a different search.') // Set message if no books are found
    }
    //console.log(filtered)
    setResults(filtered) // Send filtered results back to parent

  }

  return (
    <div>
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        className='text-lg text-blue-800'
        type="text"
        placeholder=" Type to search..."
        value={input}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
   
     {message && (
      <p className="h-[55vh] text-red-500 text-center font-semibold text-2xl mt-4">{message}</p>
    )}
    </div>
 
  )
}

export default SearchBook