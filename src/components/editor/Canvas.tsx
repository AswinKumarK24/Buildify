"use client";

import { Fragment, useMemo } from "react";
import type { Block, Device, StylePreset } from "@/lib/buildify/types";
import { CanvasBlock } from "./CanvasBlock";
import { useDroppable } from "@dnd-kit/core";

export function Canvas({
  blocks,
  selectedBlockId,
  device,
  aiStyle,
  insertIndex,
  showInsertIndicator,
  canvasHighlighted,
  onSelectBlock,
  onDeleteBlock,
}: {
  blocks: Block[];
  selectedBlockId: string | null;
  device: Device;
  aiStyle: StylePreset;
  insertIndex: number;
  showInsertIndicator: boolean;
  canvasHighlighted: boolean;
  onSelectBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
}) {
  const hasBlocks = blocks.length > 0;
  const { setNodeRef } = useDroppable({ id: "canvas" });

  const content = useMemo(() => {
    if (!hasBlocks) {
      return (
        <div className="emptyState">
          <div className="emptyBox">
            <div className="emptyText">
              <div className="emptyDash" />
              <div className="emptyTitle">Drag components here to start building</div>
              <div className="emptySub">Drop, select, and edit live. Reorder with the handle.</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="blocksContainer">
        {blocks.map((block, idx) => (
          <Fragment key={block.id}>
            {showInsertIndicator && insertIndex === idx && <div className="insertIndicator show" />}
            <CanvasBlock
              block={block}
              selected={selectedBlockId === block.id}
              onSelect={() => onSelectBlock(block.id)}
              onDelete={() => onDeleteBlock(block.id)}
            />
          </Fragment>
        ))}
        {showInsertIndicator && insertIndex === blocks.length && <div className="insertIndicator show" />}
      </div>
    );
  }, [aiStyle, hasBlocks, insertIndex, onDeleteBlock, onSelectBlock, selectedBlockId, showInsertIndicator, blocks]);

  return (
    <div className="canvasFrame">
      <div className={`canvasDevice ${device}`} aria-label="Canvas preview">
        {device === "desktop" && (
          <div className="browserBar">
            <div className="dot row"><span/><span/><span/></div>
            <div className="urlBar">Preview Mode</div>
          </div>
        )}
        {device === "tablet" && (
          <div className="browserBar tablet">
            <div className="camera"></div>
          </div>
        )}
        {device === "mobile" && (
          <div className="notch"></div>
        )}
        <div ref={setNodeRef} className={`canvas ${canvasHighlighted ? "dragging" : ""}`}>
          {content}
        </div>
        {device === "mobile" && <div className="homeIndicator"></div>}
      </div>
    </div>
  );
}

