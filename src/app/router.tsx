import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/shared/AppLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";
import { ProjectDetailPage } from "@/features/projects/pages/ProjectDetailPage";
import { InspirationPage } from "@/features/inspiration/pages/InspirationPage";
import { BoardDetailPage } from "@/features/inspiration/pages/BoardDetailPage";
import { NotesPage } from "@/features/notes/pages/NotesPage";
import { ResourcesPage } from "@/features/resources/pages/ResourcesPage";
import { ArchivePage } from "@/features/archive/pages/ArchivePage";
import { NotFoundPage } from "./NotFoundPage";

/** All routes nest under one AppLayout so the sidebar persists. */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "projects/:projectId", element: <ProjectDetailPage /> },
      { path: "inspiration", element: <InspirationPage /> },
      { path: "inspiration/:boardId", element: <BoardDetailPage /> },
      { path: "notes", element: <NotesPage /> },
      { path: "resources", element: <ResourcesPage /> },
      { path: "archive", element: <ArchivePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
