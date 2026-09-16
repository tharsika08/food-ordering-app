import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ReviewModal({ item, isOpen, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && item) {
      loadReviews();
    }
  }, [isOpen, item]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/menu/${item._id}/reviews`);
      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!rating || !comment.trim()) {
      alert('Please provide both rating and comment');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/menu/${item._id}/reviews`, { rating, comment });
      setComment('');
      setRating(5);
      setShowForm(false);
      loadReviews(); // Reload reviews
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/menu/${item._id}/reviews/${reviewId}`);
      loadReviews(); // Reload reviews
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #ff6b35 0%, #ff5512 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>⭐ Reviews for {item.name}</h3>
            <p style={{ margin: '0.5rem 0 0', opacity: 0.9 }}>
              Average Rating: {item.rating?.toFixed(1) || '4.5'} ({reviews.length} reviews)
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '2rem' }}>
          {/* Add Review Button */}
          {user && (
            <div style={{ marginBottom: '2rem' }}>
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #ff5512 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 107, 53, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ✍️ Write a Review
                </button>
              ) : (
                <div style={{
                  background: '#f9f9f9',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ margin: '0 0 1rem', color: '#2c3e50' }}>Share your experience</h4>

                  {/* Rating Stars */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                      Rating:
                    </label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: star <= rating ? '#ffc107' : '#ddd'
                          }}
                        >
                          ★
                        </button>
                      ))}
                      <span style={{ marginLeft: '0.5rem', color: '#666' }}>
                        {rating} star{rating !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                      Your Review:
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell others about your experience with this dish..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        minHeight: '80px',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#ff6b35'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setShowForm(false)}
                      style={{
                        padding: '8px 16px',
                        background: '#f0f0f0',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: '#666'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitReview}
                      disabled={submitting}
                      style={{
                        padding: '8px 16px',
                        background: submitting ? '#ccc' : 'linear-gradient(135deg, #ff6b35 0%, #ff5512 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reviews List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              📝 Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviews.map(review => (
                <div
                  key={review._id}
                  style={{
                    background: '#f9f9f9',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  {/* Review Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '0.3rem' }}>
                        {review.userName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} style={{
                              color: star <= review.rating ? '#ffc107' : '#ddd',
                              fontSize: '14px'
                            }}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Delete button for own reviews */}
                    {user && review.user === user.id && (
                      <button
                        onClick={() => deleteReview(review._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e74c3c',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#ffeaea'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>

                  {/* Review Comment */}
                  <p style={{ color: '#555', lineHeight: '1.5', margin: 0 }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}