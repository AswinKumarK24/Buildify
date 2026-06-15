"use client";

import React, { useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { BlockType } from "@/lib/buildify/types";
import type { ReactNode } from "react";

export const LibraryCard = React.memo(function LibraryCard({
  type,
  icon,
  title,
  subtitle,
}: {
  type: BlockType;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  const id = `lib:${type}`;
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { source: "library" as const, type },
  });

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    node.style.transform = transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : "";
    node.style.opacity = isDragging ? "0.55" : "1";
    node.style.cursor = isDragging ? "grabbing" : "grab";
  }, [transform, isDragging]);

  const setRef = (node: HTMLDivElement | null) => {
    nodeRef.current = node;
    setNodeRef(node);
  };

  return (
    <div
      ref={setRef}
      className={`componentCard ${isDragging ? "dragging" : ""} transition-all duration-200 hover:scale-[1.02] hover:border-cyan-500/40 hover:bg-slate-900/40`}
      {...attributes}
      {...listeners}
      draggable={false}
    >
      <div className="cardIcon">{icon}</div>
      <div className="cardText">
        <div className="cardTitle">{title}</div>
        <div className="cardSub">{subtitle}</div>
      </div>
    </div>
  );
});

