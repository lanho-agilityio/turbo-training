import { MetadataRoute } from 'next';

// APIs
import { getProjectList } from '@/api/projects';
import { getTasks } from '@/api/tasks';

// Constants
import { ROUTES } from '@repo/ui/constants/routes';

const URL = process.env.NEXT_PUBLIC_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: projects } = await getProjectList();
  const { data: tasks } = await getTasks();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${URL}${ROUTES.SIGN_IN}`,
    },
    {
      url: `${URL}${ROUTES.SIGN_UP}`,
    },
    {
      url: `${URL}${ROUTES.BOARDS}`,
      priority: 1,
    },
  ];

  const projectSitemap = projects.map((project): MetadataRoute.Sitemap[0] => ({
    url: `${URL}${ROUTES.PROJECT_DETAIL(`${project.slug}-${project.id}`)}`,
    lastModified: project.updatedAt,
  }));

  const taskSitemap = tasks.map((task): MetadataRoute.Sitemap[0] => ({
    url: `${URL}${ROUTES.TASK_DETAIL(`${task.slug}-${task.id}`)}`,
    lastModified: task.updatedAt,
  }));

  return [...staticRoutes, ...projectSitemap, ...taskSitemap];
}
