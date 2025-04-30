import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const Loans = () => {
  const { LENDING_SERVICE_API_URL, BOOK_SERVICE_API_URL, USER_SERVICE_API_URL } = config;
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookMap, setBookMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) setIsLoggedIn(true);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.get(`${LENDING_SERVICE_API_URL}/loans`, config);
        setLoans(res.data);

        const bookIds = [...new Set(res.data.map((loan) => loan.book_id))];
        const userIds = [...new Set(res.data.map((loan) => loan.user_id))];

        const [bookData, userData] = await Promise.all([
          Promise.all(bookIds.map((id) => axios.get(`${BOOK_SERVICE_API_URL}/books/${id}`, config))),
          Promise.all(userIds.map((id) =>
            axios.get(`${USER_SERVICE_API_URL}/get-user-info`, {
              headers: {
                ...config.headers,
                id: id,
              },
            })
          )),
        ]);

        const bookMap = {};
        bookData.forEach((res) => (bookMap[res.data.id] = res.data));

        const userMap = {};
        userData.forEach((res) => (userMap[res.data.id] = res.data));

        setBookMap(bookMap);
        setUserMap(userMap);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching loans:', error);
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  return (
    <div style={{ height: '85vh' }} className="bg-[#f0f4f8] px-12 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-[#5C99BA]">Loan Records</h2>
        {isLoggedIn && (
          <button
            onClick={() => navigate('/add-loan')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Request a Book
          </button>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow table-auto">
            <thead className="bg-[#5C99BA] text-white">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Book</th>
                <th className="py-3 px-4 text-left">Loan Date</th>
                <th className="py-3 px-4 text-left">Due Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                {isLoggedIn && (
                  <th className="py-3 px-4 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{userMap[loan.user_id]?.username || 'Loading...'}</td>
                  <td className="py-2 px-4">{bookMap[loan.book_id]?.title || 'Loading...'}</td>
                  <td className="py-2 px-4">{loan.loan_date}</td>
                  <td className="py-2 px-4">{loan.due_date}</td>
                  <td className="py-2 px-4 capitalize">{loan.status.toLowerCase()}</td>
                  {isLoggedIn && (
                    <td className="py-2 px-4 text-center">
                      <button
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                        onClick={() => navigate(`/edit-loan/${loan.id}`)}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {loans.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No loans found.
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

export default Loans;
