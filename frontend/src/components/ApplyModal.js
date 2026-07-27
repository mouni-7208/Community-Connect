import React, { useState } from 'react';
import axios from 'axios';

const ApplyModal = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.put(
        `http://13.49.100.149:5000/api/projects/${project._id}/apply`,
        {
          name: formData.name,
          email: formData.email
        }
      );

      if (response.data.success) {
        alert('🎉 Successfully applied for the project! The organizer will contact you soon.');
        onSuccess();
      }
    } catch (error) {
      console.error('Error applying for project:', error);
      setError(
        error.response?.data?.message || 
        'Failed to apply for project. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6c757d'
          }}
        >
          ×
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>
            Apply for: {project.title}
          </h3>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
            Organized by {project.organizer} • {project.location}
          </p>
        </div>

        {/* Project Summary */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', lineHeight: '1.5' }}>
            {project.description.length > 150 
              ? project.description.substring(0, 150) + '...'
              : project.description
            }
          </p>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <div>📍 Location: {project.location}</div>
            {project.timeCommitment && (
              <div>⏰ Time Commitment: {project.timeCommitment}</div>
            )}
            <div>👥 Volunteers Needed: {project.volunteersNeeded}</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your full name"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email address"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Why are you interested? (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
              placeholder="Tell the organizer why you're interested in this project..."
            />
          </div>

          {/* Form Actions */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                minWidth: '100px'
              }}
            >
              {loading ? 'Applying...' : 'Apply Now'}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#e7f3ff',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#004085'
        }}>
          💡 <strong>Note:</strong> Your application will be sent to the project organizer. 
          They will contact you directly using the email address provided.
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
