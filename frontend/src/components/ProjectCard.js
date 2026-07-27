import React from 'react';

const ProjectCard = ({ project, onApply }) => {
  const skillsArray = Array.isArray(project.requiredSkills)
    ? project.requiredSkills
    : typeof project.requiredSkills === 'string' && project.requiredSkills.length > 0
      ? project.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const getBadgeColor = (category) => {
    const colors = {
      education: '#007bff',
      environment: '#28a745',
      healthcare: '#dc3545',
      community: '#6f42c1',
      technology: '#fd7e14'
    };
    return colors[category] || '#6c757d';
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      margin: '16px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease-in-out',
      cursor: 'pointer',
      maxWidth: '400px',
      minHeight: '320px'
    }}
    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
    >
      <div style={{ marginBottom: '12px' }}>
        <span style={{
          backgroundColor: getBadgeColor(project.category),
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          {project.category}
        </span>
        {project.status === 'full' && (
          <span style={{
            backgroundColor: '#ffc107',
            color: '#000',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginLeft: '8px'
          }}>
            FULL
          </span>
        )}
      </div>

      <h3 style={{ 
        margin: '0 0 12px 0',
        color: '#333',
        fontSize: '18px',
        lineHeight: '1.4'
      }}>
        {project.title}
      </h3>

      <p style={{ 
        color: '#666', 
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '16px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {project.description}
      </p>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '8px', fontSize: '14px' }}>📍</span>
          <span style={{ fontSize: '14px', color: '#555' }}>{project.location}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '8px', fontSize: '14px' }}>👥</span>
          <span style={{ fontSize: '14px', color: '#555' }}>
            {project.appliedVolunteers?.length || 0} / {project.volunteersNeeded} volunteers
          </span>
        </div>

        {project.timeCommitment && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', marginRight: '8px', fontSize: '14px' }}>⏰</span>
            <span style={{ fontSize: '14px', color: '#555' }}>{project.timeCommitment}</span>
          </div>
        )}
      </div>

      {skillsArray.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ 
            fontSize: '12px', 
            color: '#777', 
            margin: '0 0 8px 0',
            fontWeight: 'bold'
          }}>
            Skills needed:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {skillsArray.slice(0, 3).map((skill, index) => (
              <span key={index} style={{
                backgroundColor: '#f8f9fa',
                color: '#495057',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                border: '1px solid #e9ecef'
              }}>
                {skill}
              </span>
            ))}
            {skillsArray.length > 3 && (
              <span style={{ fontSize: '11px', color: '#6c757d' }}>
                +{skillsArray.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <button
          onClick={() => onApply(project)}
          disabled={project.status === 'full'}
          style={{
            backgroundColor: project.status === 'full' ? '#6c757d' : '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: project.status === 'full' ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            width: '100%',
            transition: 'background-color 0.2s ease'
          }}
        >
          {project.status === 'full' ? 'Project Full' : 'Apply Now'}
        </button>
        
        <p style={{ 
          fontSize: '11px', 
          color: '#999', 
          textAlign: 'center',
          margin: '8px 0 0 0'
        }}>
          Posted by {project.organizer} • {formatDate(project.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
