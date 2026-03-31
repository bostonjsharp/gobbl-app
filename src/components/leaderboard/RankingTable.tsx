"use client";

import { TurkeyAvatar } from "../gamification/TurkeyAvatar";

export interface RankEntry {
  rank: number;
  id: string;
  username: string;
  xp: number;
  level: number;
  civilityScore: number;
  streak: number;
  longestStreak: number;
  totalDebates: number;
  isCurrentUser: boolean;
}

interface RankingTableProps {
  data: RankEntry[];
  sortBy: string;
}

const RANK_ICONS: Record<number, string> = {
  1: "👑",
  2: "🥈",
  3: "🥉",
};

export function RankingTable({ data, sortBy }: RankingTableProps) {
  const getHighlight = (entry: RankEntry) => {
    switch (sortBy) {
      case "civility":
        return entry.civilityScore.toFixed(1);
      case "streak":
        return `${entry.longestStreak} days`;
      default:
        return `${entry.xp.toLocaleString()} 🪶`;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-roost-200 text-left text-roost-500 dark:border-roost-700">
            <th className="px-3 py-3 font-medium">#</th>
            <th className="px-3 py-3 font-medium">Turkey</th>
            <th className="px-3 py-3 font-medium text-right">
              {sortBy === "civility" ? "Civility" : sortBy === "streak" ? "Migration" : "Feathers"}
            </th>
            <th className="hidden px-3 py-3 font-medium text-right sm:table-cell">Level</th>
            <th className="hidden px-3 py-3 font-medium text-right md:table-cell">Debates</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr
              key={entry.id}
              className={`border-b border-roost-100 transition-colors dark:border-roost-800
                ${entry.isCurrentUser ? "bg-gobbl-50 dark:bg-gobbl-900/10" : "hover:bg-roost-50 dark:hover:bg-roost-800/50"}`}
            >
              <td className="px-3 py-3">
                {entry.rank <= 3 ? (
                  <span className="text-lg">{RANK_ICONS[entry.rank]}</span>
                ) : (
                  <span className="text-roost-500">{entry.rank}</span>
                )}
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <TurkeyAvatar level={entry.level} size="xs" animate={false} />
                  <span className={`font-medium ${entry.isCurrentUser ? "text-gobbl-600 dark:text-gobbl-400" : ""}`}>
                    {entry.username}
                    {entry.isCurrentUser && " (you)"}
                  </span>
                </div>
              </td>
              <td className="px-3 py-3 text-right font-semibold">{getHighlight(entry)}</td>
              <td className="hidden px-3 py-3 text-right sm:table-cell">{entry.level}</td>
              <td className="hidden px-3 py-3 text-right md:table-cell">{entry.totalDebates}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-12 text-center text-roost-500">
          No turkeys in the flock yet. Be the first to strut!
        </div>
      )}
    </div>
  );
}
