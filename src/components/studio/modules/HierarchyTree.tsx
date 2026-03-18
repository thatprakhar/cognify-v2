"use client";
import React, { useState } from "react";
import { HierarchyTreeConfig } from "@/lib/schema/module-configs/hierarchy-tree";

interface Props {
  config: HierarchyTreeConfig;
  computed?: Record<string, any>;
  slot?: string;
}

type HierarchyNode = {
  id: string;
  label: string;
  description?: string;
  children?: HierarchyNode[];
};

function TreeNode({ node, depth = 0 }: { node: HierarchyNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [selected, setSelected] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-700/50 ${selected ? "bg-gray-700" : ""}`}
        style={{ paddingLeft: `${8 + depth * 20}px` }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          else setSelected(!selected);
        }}
      >
        {hasChildren ? (
          <span className="text-gray-500 w-4 text-xs">{expanded ? "▼" : "▶"}</span>
        ) : (
          <span className="text-gray-600 w-4 text-xs">•</span>
        )}
        <span className="text-sm text-gray-200">{node.label}</span>
      </div>
      {node.description && selected && (
        <div className="text-xs text-gray-400 py-1 bg-gray-800 rounded mx-2" style={{ paddingLeft: `${12 + depth * 20}px` }}>
          {node.description}
        </div>
      )}
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function HierarchyTree({ config }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">{config.title}</h2>
        {config.description && <p className="text-sm text-gray-400 mt-1">{config.description}</p>}
      </div>
      <div className="bg-gray-800 rounded-xl p-3">
        <TreeNode node={config.root} />
      </div>
    </div>
  );
}
