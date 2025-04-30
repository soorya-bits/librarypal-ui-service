import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import SearchBook from '../components/SearchBook/SearchBook';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const Books = () => {
  const BOOK_SERVICE_API_URL = config.BOOK_SERVICE_API_URL;
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        setIsLoggedIn(true);
    }
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${BOOK_SERVICE_API_URL}/books/`);
        setAllBooks(response.data);
        setFilteredBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleSearchResults = (results) => {
    setFilteredBooks(results);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const token = localStorage.getItem('token'); // or get from context
        await axios.delete(`${BOOK_SERVICE_API_URL}/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFilteredBooks((prev) => prev.filter((book) => book.id !== id));
        setAllBooks((prev) => prev.filter((book) => book.id !== id));
        alert('Book deleted successfully');
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
      }
    }
  };

  return (
    <div style={{height: '85vh'}} className="bg-[#ebf8ff] px-12 py-8">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl text-[#5C99BA] font-semibold">Find your book of choice...</h2>
          {
            isLoggedIn && (
              <button
                onClick={() => navigate('/add-book')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create Book
              </button>
            )
          }
        </div>
        <div className="mt-4">
          <SearchBook setResults={handleSearchResults} books={allBooks} />
        </div>
      </header>
      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded shadow">
            <thead className="bg-[#5C99BA] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Author</th>
                <th className="py-3 px-4 text-left">Genre</th>
                <th className="py-3 px-4 text-left">Available</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{book.title}</td>
                  <td className="py-2 px-4">{book.author}</td>
                  <td className="py-2 px-4">{book.genre}</td>
                  <td className="py-2 px-4">{book.avail_status}</td>
                  <td className="py-2 px-4 text-center space-x-2">
                    {isLoggedIn && (
                      <>
                        <button
                          className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                          onClick={() => navigate(`/edit-book/${book.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Books;