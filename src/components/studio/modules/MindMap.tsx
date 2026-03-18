"use client";
import React, { useState, useMemo } from "react";
import { MindMapConfig } from "@/lib/schema/module-configs/mind-map";

interface Props {
  config: MindMapConfig;
  computed?: Record<string, any>;
  slot?: string;
}

const BRANCH_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"];

export function MindMap({ config }: Props) {
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  const branches = config.branches.map((branch, i) => ({
    ...branch,
    color: branch.color ?? BRANCH_COLORS[i % BRANCH_COLORS.length],
  }));

  const activeBranchData = activeBranch ? branches.find((b) => b.id === activeBranch) : null;

  const cx = 200, cy = 160;
  const radius = 100;

  const branchPositions = useMemo(() => {
    return branches.map((_, i) => {
      const angle = (i / branches.length) * Math.PI * 2 - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        angle,
      };
    });
  }, [branches.length]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">{config.title}</h2>
        {config.description && <p className="text-sm text-gray-400 mt-1">{config.description}</p>}
      </div>

      <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center">
        <svg width="400" height="320" viewBox="0 0 400 320" className="w-full max-w-md">
          {branches.map((branch, i) => {
            const pos = branchPositions[i];
            return (
              <line
                key={branch.id}
                x1={cx} y1={cy}
                x2={pos.x} y2={pos.y}
                stroke={branch.color}
                strokeWidth={activeBranch === branch.id ? 3 : 1.5}
                strokeOpacity={activeBranch && activeBranch !== branch.id ? 0.3 : 0.8}
              />
            );
          })}

          <circle cx={cx} cy={cy} r={40} fill="#1e293b" stroke="#475569" strokeWidth={2} />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="bold">
            {config.centerLabel.slice(0, 18)}
          </text>

          {branches.map((branch, i) => {
            const pos = branchPositions[i];
            const isActive = activeBranch === branch.id;
            return (
              <g key={branch.id} onClick={() => setActiveBranch(isActive ? null : branch.id)} style={{ cursor: "pointer" }}>
                <circle cx={pos.x} cy={pos.y} r={28} fill={isActive ? branch.color : "#1e293b"} stroke={branch.color} strokeWidth={1.5} opacity={activeBranch && !isActive ? 0.4 : 1} />
                <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fill={isActive ? "white" : branch.color} fontSize="9" fontWeight="600">
                  {branch.label.slice(0, 12)}
                </text>
              </g>
            );
          })}
        </svg>

        {activeBranchData && (
          <div className="w-full mt-2 p-3 bg-gray-700/50 rounded-lg">
            <div className="text-xs font-semibold mb-2" style={{ color: activeBranchData.color }}>
              {activeBranchData.label}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeBranchData.topics.map((topic) => (
                <span key={topic.id} className="text-xs bg-gray-600 text-gray-200 px-2 py-0.5 rounded-full">
                  {topic.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
