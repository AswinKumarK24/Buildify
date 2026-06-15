"use client";

import { create } from "zustand";
import type { Block, BuilderProject, Device, StylePreset } from "@/lib/buildify/types";
import { DEFAULT_DEVICE, createBlock } from "@/lib/buildify/templates";
import { presetComponentTypes } from "@/lib/buildify/templates";

type BuilderState = {
  projectId: string;
  pageName: string;
  device: Device;
  blocks: Block[];
  selectedBlockId: string | null;
  aiStyle: StylePreset;
  isDirty: boolean;
};

type BuilderActions = {
  setProjectId: (id: string) => void;
  setPageName: (name: string) => void;
  setDevice: (d: Device) => void;
  selectBlock: (id: string | null) => void;
  setAiStyle: (style: StylePreset) => void;
  setDirty: (dirty: boolean) => void;
  saveProject: (projectId: string) => Promise<void>;

  insertBlock: (type: Block["type"], index: number, style: StylePreset) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (dragId: string, targetIndex: number) => void;
  updateBlockProps: (id: string, patch: Record<string, unknown>) => void;
  replaceBlocks: (blocks: Block[], selectFirst?: boolean) => void;

  generatePreset: (style: StylePreset) => void;
};

export const useBuilderStore = create<BuilderState & BuilderActions>((set, get) => ({
  projectId: "demo",
  pageName: "My Website",
  device: DEFAULT_DEVICE,
  blocks: [],
  selectedBlockId: null,
  aiStyle: "Landing Page",
  isDirty: false,

  setProjectId: (id) => set({ projectId: id }),
  setPageName: (name) => set({ pageName: name, isDirty: true }),
  setDevice: (d) => set({ device: d, isDirty: true }),
  selectBlock: (id) => set({ selectedBlockId: id }),
  setAiStyle: (style) => set({ aiStyle: style, isDirty: true }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  saveProject: async (projectId) => {
    const { blocks, device, pageName } = get();
    const payload = { blocks, device, pageName };

    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload }),
    });

    if (!res.ok) {
      throw new Error("Failed to save project");
    }

    set({ isDirty: false });
  },

  insertBlock: (type, index, style) => {
    set((state) => {
      const next = [...state.blocks];
      const safeIndex = Math.max(0, Math.min(index, next.length));
      next.splice(safeIndex, 0, createBlock(type, style));
      const inserted = next[safeIndex];
      return { blocks: next, selectedBlockId: inserted?.id ?? null, isDirty: true };
    });
  },

  deleteBlock: (id) => {
    set((state) => {
      const idx = state.blocks.findIndex((b) => b.id === id);
      if (idx < 0) return state;
      const next = state.blocks.filter((b) => b.id !== id);
      const newSelected = state.selectedBlockId === id ? (next[idx - 1]?.id ?? next[0]?.id ?? null) : state.selectedBlockId;
      return { blocks: next, selectedBlockId: newSelected, isDirty: true };
    });
  },

  moveBlock: (dragId, targetIndex) => {
    set((state) => {
      const from = state.blocks.findIndex((b) => b.id === dragId);
      if (from < 0) return state;

      const safeTarget = Math.max(0, Math.min(targetIndex, state.blocks.length - 1));
      const adjusted = safeTarget > from ? safeTarget - 1 : safeTarget;

      const next = [...state.blocks];
      const [moved] = next.splice(from, 1);
      next.splice(Math.max(0, Math.min(adjusted, next.length)), 0, moved);
      return { blocks: next, selectedBlockId: dragId, isDirty: true };
    });
  },

  updateBlockProps: (id, patch) => {
    set((state) => {
      const next = state.blocks.map((b) => (b.id === id ? { ...b, props: { ...b.props, ...patch } } : b));
      return { blocks: next, isDirty: true };
    });
  },

  replaceBlocks: (blocks, selectFirst = true) => {
    set(() => ({ blocks, selectedBlockId: selectFirst ? blocks[0]?.id ?? null : null, isDirty: true }));
  },

  generatePreset: (style) => {
    const types = presetComponentTypes(style);
    const blocks = types.map((t) => createBlock(t, style));
    set((state) => ({ ...state, blocks, selectedBlockId: blocks[0]?.id ?? null, aiStyle: style, isDirty: true }));
  },
}));

// Optional helper for persistence (kept outside store so UI stays clean).
export function projectToJSON(project: Omit<BuilderProject, "updatedAt"> & { updatedAt?: string }) {
  return {
    ...project,
    updatedAt: project.updatedAt ?? new Date().toISOString(),
  };
}

