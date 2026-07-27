import React, { useState } from 'react';
import axios from 'axios';

const AddProject = ({ onProjectAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'education',
    location: '',
    requiredSkills: '',
    timeCommitment: '',
    volunteersNeeded: 1,
    organizer: '',
    organizerContact: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
    setSuccess(false);

    try {
      const projectData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill),
        volunteersNeeded: parseInt(formData.volunteersNeeded),
        deadline: formData.deadline || undefined
      };

      const response = await axios.post('http://13.49.100.149:5000/api/projects', projectData);

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          title: '',
          description: '',
          category: 'education',
          location: '',
          requiredSkills: '',
          timeCommitment: '',
          volunteersNeeded: 1,
          organizer: '',
          organizerContact: '',
          deadline: ''
        });
        
        // Call callback if provided
        if (onProjectAdded) {
          onProjectAdded();
        }
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error adding project:', error);
      setError(
        error.response?.data?.message || 
        'Failed to create project. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>
          Create New Volunteer Project
        </h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Help connect volunteers with meaningful community work
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '16px'
        }}>
          🎉 Project created successfully! It's now visible to volunteers.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {/* Project Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            Project Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="e.g., Computer Basics for Senior Citizens"
          />
        </div>

        {/* Project Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            Project Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
            placeholder="Describe the project goals, activities, and what volunteers will do..."
          />
        </div>

        {/* Category and Location Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="education">Education & Digital Literacy</option>
              <option value="environment">Environmental</option>
              <option value="healthcare">Healthcare</option>
              <option value="community">Community Support</option>
              <option value="technology">Technology</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
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
              placeholder="e.g., Hyderabad, Kukatpally"
            />
          </div>
        </div>

        {/* Required Skills */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            Required Skills
          </label>
          <input
            type="text"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            placeholder="e.g., Teaching, Patience, Telugu, Computer basics (comma separated)"
          />
          <small style={{ color: '#6c757d', fontSize: '12px' }}>
            Separate multiple skills with commas
          </small>
        </div>

        {/* Time Commitment and Volunteers Needed */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Time Commitment
            </label>
            <input
              type="text"
              name="timeCommitment"
              value={formData.timeCommitment}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="e.g., 2 hours every Saturday"
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Volunteers Needed *
            </label>
            <input
              type="number"
              name="volunteersNeeded"
              value={formData.volunteersNeeded}
              onChange={handleChange}
              min="1"
              max="100"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Organizer Information */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Organizer Name *
            </label>
            <input
              type="text"
              name="organizer"
              value={formData.organizer}
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
              placeholder="e.g., TechForGood NGO"
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Contact Information
            </label>
            <input
              type="text"
              name="organizerContact"
              value={formData.organizerContact}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="e.g., contact@techforgood.org"
            />
          </div>
        </div>

        {/* Project Deadline */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            Project Deadline (Optional)
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            style={{
              width: '200px',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          {loading ? 'Creating Project...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default AddProject;
