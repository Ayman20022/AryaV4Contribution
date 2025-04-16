
import React from 'react';
import CreatePostForm from '../components/feed/CreatePostForm';
import ProjectItem from '../components/projects/ProjectItem';
import { projects } from '../data/dummyData';

const Projects = () => {
  return (
    <div>
      <div className="feed-container">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Share your work, collaborate with others, and discover amazing projects.
          </p>
        </div>
        
        {/* Create project form */}
        <CreatePostForm isProject />
        
        {/* Projects feed */}
        <div className="mt-6">
          {projects.length > 0 ? (
            projects.map(project => (
              <ProjectItem key={project.id} project={project} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No projects to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
