/**
 * Centralized TanStack Query key factory — one entry per entity so
 * mutations' `invalidateQueries` calls never hand-roll key arrays.
 */
export const queryKeys = {
  projects: {
    all: () => ["projects"] as const,
    byId: (id: string) => ["projects", id] as const,
  },
  inspirationBoards: {
    all: () => ["inspiration-boards"] as const,
    byId: (id: string) => ["inspiration-boards", id] as const,
    references: (boardId: string) => ["inspiration-boards", boardId, "references"] as const,
  },
  notes: {
    all: () => ["notes"] as const,
    byId: (id: string) => ["notes", id] as const,
  },
  resources: {
    all: () => ["resources"] as const,
    byId: (id: string) => ["resources", id] as const,
  },
  archive: {
    all: () => ["archive"] as const,
  },
} as const;
