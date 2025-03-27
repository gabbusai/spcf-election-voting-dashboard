import React, { useEffect } from 'react';
import { useFetchPaginatedPosts } from '../utils/queries';
import { useAuthContext } from '../utils/AuthContext';
import { Button, Spin, message, Badge } from 'antd';
import axios from 'axios';
import { ENV_BASE_URL } from '../../DummyENV';

function CampaignPage() {
  const { token } = useAuthContext();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useFetchPaginatedPosts(token, 3); // 3 posts per page

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading posts..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-4 max-w-4xl mx-auto shadow-sm">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Unable to load posts data: {error?.message}</span>
      </div>
    );
  }

  // Handle Approve action
  const handleApprove = async (postId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${ENV_BASE_URL}/api/admin/posts/${postId}/approve`, {}, config);
      message.success('Post approved successfully');
      fetchNextPage(); // Refresh data
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to approve post');
    }
  };

  // Handle Delete action
  const handleDelete = async (postId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${ENV_BASE_URL}/api/admin/posts/${postId}`, config);
      message.success('Post deleted successfully');
      fetchNextPage(); // Refresh data
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Campaign Posts</h1>
        <div className="flex space-x-2">
          <Button 
            className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 rounded-md shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">Posts Overview</h2>
          <p className="text-sm text-gray-500">Review and moderate candidate campaign posts</p>
        </div>
        
        <div className="space-y-6 p-6"> {/* Added space-y-6 for vertical spacing */}
          {data?.pages.map((page, pageIndex) => (
            <div key={pageIndex}>
              {page.posts.map((post) => (
                <div
                  key={post.id}
                  className="p-6 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {post.image && (
                      <div className="w-full md:w-1/3 flex-shrink-0">
                        <img
                          src={`${ENV_BASE_URL}/storage/${post.image}`}
                          alt={post.title}
                          className="w-full h-48 md:h-56 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
                        <Badge 
                          status={post.is_approved ? "success" : "warning"} 
                          text={post.is_approved ? "Approved" : "Pending"} 
                          className="ml-2"
                        />
                      </div>
                      <p className="text-gray-600 mb-3">{post.content}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{post.candidate.user.name}</span>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{post.candidate.position.name}</span>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                          <span>{post.candidate.partylist.name}</span>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        {!post.is_approved && (
                          <Button
                            type="primary"
                            className="bg-green-600 hover:bg-green-700 border-none shadow-sm"
                            onClick={() => handleApprove(post.id)}
                            disabled={isFetchingNextPage}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          danger
                          className="shadow-sm"
                          onClick={() => handleDelete(post.id)}
                          disabled={isFetchingNextPage}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center my-6">
          <Spin tip="Loading more posts..." />
        </div>
      )}

      {hasNextPage && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded-md shadow-sm px-6"
          >
            Load More
          </Button>
        </div>
      )}

      {!hasNextPage && data?.pages[0]?.posts.length > 0 && (
        <div className="text-center text-gray-500 my-6">
          <p>You've reached the end of the list</p>
        </div>
      )}
    </div>
  );
}

export default CampaignPage;