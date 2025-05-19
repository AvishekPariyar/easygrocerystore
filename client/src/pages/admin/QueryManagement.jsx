import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QueryManagement = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/queries');
      setQueries(response.data);
      setError(null);
    } catch (err) {
      setError('Error loading queries');
      console.error('Error fetching queries:', err);
      // Dummy data for demonstration
      setQueries([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Product Availability',
          message: 'When will organic apples be back in stock?',
          status: 'pending',
          createdAt: '2025-04-23T10:30:00Z'
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'Delivery Issue',
          message: 'My order #123 hasn\'t arrived yet',
          status: 'resolved',
          response: 'Your order will be delivered today',
          createdAt: '2025-04-22T15:45:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (queryId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/queries/${queryId}`, {
        response,
        status: 'resolved'
      });
      fetchQueries();
      setSelectedQuery(null);
      setResponse('');
    } catch (err) {
      setError('Error sending response');
      console.error('Error responding to query:', err);
    }
  };

  const getStatusColor = (status) => {
    return status === 'resolved' 
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return <div className="text-center py-4">Loading queries...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Query Management</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {queries.map((query) => (
              <tr key={query._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{query.name}</div>
                  <div className="text-sm text-gray-500">{query.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{query.subject}</div>
                  <div className="text-sm text-gray-500">{query.message}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(query.status)}`}>
                    {query.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(query.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedQuery(query)}
                    className="text-green-600 hover:text-green-900"
                  >
                    {query.status === 'resolved' ? 'View Response' : 'Respond'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Response Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedQuery.status === 'resolved' ? 'Response Details' : 'Respond to Query'}
              </h3>
              <div className="mt-2 px-7 py-3">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">From: {selectedQuery.name}</p>
                  <p className="text-sm text-gray-500">Subject: {selectedQuery.subject}</p>
                  <p className="text-sm text-gray-700 mt-2">{selectedQuery.message}</p>
                </div>
                {selectedQuery.status === 'resolved' ? (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-900">Response:</p>
                    <p className="text-sm text-gray-700">{selectedQuery.response}</p>
                  </div>
                ) : (
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="mt-4 w-full px-3 py-2 border rounded-md"
                    rows="4"
                    placeholder="Type your response..."
                  />
                )}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setSelectedQuery(null)}
                  className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300"
                >
                  Close
                </button>
                {selectedQuery.status !== 'resolved' && (
                  <button
                    onClick={() => handleResponse(selectedQuery._id)}
                    className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700"
                  >
                    Send Response
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryManagement;