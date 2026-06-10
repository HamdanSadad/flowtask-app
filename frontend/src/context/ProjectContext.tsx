import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export interface Project {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  _count?: { tasks: number };
}

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  createProject: (name: string, color?: string, icon?: string) => Promise<Project | null>;
  updateProject: (id: string, name: string, color?: string, icon?: string) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await api.get('/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to load projects', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const createProject = async (name: string, color?: string, icon?: string) => {
    try {
      const res = await api.post('/projects', 
        { name, color, icon },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setProjects([res.data, ...projects]);
      toast.success('Project created');
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create project');
      return null;
    }
  };

  const updateProject = async (id: string, name: string, color?: string, icon?: string) => {
    try {
      const res = await api.put(`/projects/${id}`, 
        { name, color, icon },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setProjects(projects.map(p => p.id === id ? { ...res.data, _count: p._count } : p));
      toast.success('Project updated');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update project');
      return false;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted');
      return true;
    } catch (error) {
      toast.error('Failed to delete project');
      return false;
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, isLoading, fetchProjects, createProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
