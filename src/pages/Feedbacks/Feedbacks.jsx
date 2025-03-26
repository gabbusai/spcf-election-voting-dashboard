import React, { useState, useEffect } from 'react';
import { useFetchFeedbacks } from '../../utils/queries';
import { useAuthContext } from '../../utils/AuthContext';

function Feedbacks() {
  const { token } = useAuthContext();
  const [search, setSearch] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchFeedbacks(token, 15, search);

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

  // Handle search input change
  const handleSearch = (e) => {
    setSearch(e.target.value);
    refetch(); // Trigger refetch when search changes
  };

  // Flatten the pages of feedbacks into a single array
  const feedbacks = data?.pages.flatMap((page) => page.feedbacks) || [];

  return (
    <div className="feedbacks-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Feedbacks</h1>

      {/* Search Input */}
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search feedbacks by title or content..."
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />

      {/* Loading State */}
      {isLoading && <p>Loading feedbacks...</p>}

      {/* Error State */}
      {isError && (
        <p style={{ color: 'red' }}>
          Error loading feedbacks: {error?.message || 'Something went wrong'}
        </p>
      )}

      {/* Feedback List */}
      {!isLoading && !isError && feedbacks.length === 0 && (
        <p>No feedbacks found.</p>
      )}
      {!isLoading && !isError && feedbacks.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {feedbacks.map((feedback, index) => (
            <li
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: '#fff',
              }}
            >
              {/* Stars */}
              <div style={{ color: '#f5c518', fontSize: '20px' }}>
                {'★'.repeat(feedback.stars) + '☆'.repeat(5 - feedback.stars)}
              </div>

              {/* Title */}
              <h3 style={{ margin: '10px 0', fontSize: '18px' }}>
                {feedback.title}
              </h3>

              {/* Content */}
              <p style={{ margin: 0, color: '#555' }}>{feedback.content}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Infinite Scroll Loading Indicator */}
      {isFetchingNextPage && (
        <p style={{ textAlign: 'center' }}>Loading more feedbacks...</p>
      )}

      {/* No More Data */}
      {!hasNextPage && feedbacks.length > 0 && !isFetchingNextPage && (
        <p style={{ textAlign: 'center', color: '#888' }}>
          No more feedbacks to load.
        </p>
      )}
    </div>
  );
}

export default Feedbacks;