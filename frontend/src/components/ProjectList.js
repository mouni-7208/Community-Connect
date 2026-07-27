import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from './ProjectCard';
import ApplyModal from './ApplyModal';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    location: '',
    search: ''
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://13.49.100.149:5000/api/projects');
      
      if (response.data.success) {
        setProjects(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(project => 
        project.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(project =>
        project.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.requiredSkills.some(skill => 
          skill.toLowerCase().includes(searchTerm)
        )
      );
    }

    setFilteredProjects(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApply = (project) => {
    setSelectedProject(project);
    setShowApplyModal(true);
  };

  const handleApplySuccess = () => {
    setShowApplyModal(false);
    setSelectedProject(null);
    fetchProjects(); // Refresh projects to show updated volunteer count
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px',
        fontSize: '18px'
      }}>
        <div>🔄 Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h3>⚠️ Error</h3>
        <p>{error}</p>
        <button 
          onClick={fetchProjects}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>
          Volunteer Opportunities
        </h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Find meaningful projects that match your skills and interests
        </p>
      </div>

      {/* Filters */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'end'
        }}>
          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Categories</option>
              <option value="education">Education & Digital Literacy</option>
              <option value="environment">Environmental</option>
              <option value="healthcare">Healthcare</option>
              <option value="community">Community Support</option>
              <option value="technology">Technology</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              Location
            </label>
            <input
              type="text"
              placeholder="Enter city or area..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Search Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search projects, skills..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Clear Filters Button */}
          <div>
            <button
              onClick={() => setFilters({ category: 'all', location: '', search: '' })}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%'
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      </div>

      {/* Projects Grid */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '20px',
        justifyItems: 'center'
      }}>
        {filteredProjects.length === 0 ? (
          <div style={{ 
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            color: '#6c757d'
          }}>
            <h3>No projects found</h3>
            <p>Try adjusting your filters or check back later for new opportunities.</p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onApply={handleApply}
            />
          ))
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedProject && (
        <ApplyModal
          project={selectedProject}
          onClose={() => setShowApplyModal(false)}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

export default ProjectList;
