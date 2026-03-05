import React from 'react'
import { PageBackButton } from '@/components/page-back-button'
import { PageHeader } from '@/components/page-header'
import { useNavigate, useParams } from 'react-router-dom'
import { useProjectById } from '@/hooks/use-project'
import type { IProject } from '@/interfaces/project/project.interface'

const ProjectDetails: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { id } = params;
    const projectQuery = useProjectById(id || "")
    const project: IProject = projectQuery.data.data
    return (
        <>
            <PageBackButton
                text='Back to Projects'
                onClick={() => navigate('/projects')}
            />
            <PageHeader
                title={project?.title || "Project Details"}
                description={project?.property.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            />
        </>
    )
}

export default ProjectDetails