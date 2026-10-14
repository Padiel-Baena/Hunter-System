export interface RankInfo {
  name: string;
  color: string;
  nextThreshold: number;
  progressPercent: number;
}

export const calculateHunterRank = (completedCount: number): RankInfo => {
  // Umbrales acumulativos por cantidad de obras completadas
  if (completedCount >= 240) {
    return {
      name: "NACIONAL",
      color: "text-p5-gold border-p5-gold bg-p5-gold/10",
      nextThreshold: 240,
      progressPercent: 100,
    };
  } else if (completedCount >= 170) {
    return {
      name: "SSS",
      color: "text-p5-blood border-p5-blood bg-p5-blood/10",
      nextThreshold: 240,
      progressPercent: ((completedCount - 170) / (240 - 170)) * 100,
    };
  } else if (completedCount >= 120) {
    return {
      name: "SS",
      color: "text-p5-blood border-p5-blood bg-p5-blood/10",
      nextThreshold: 170,
      progressPercent: ((completedCount - 120) / (170 - 120)) * 100,
    };
  } else if (completedCount >= 80) {
    return {
      name: "S",
      color: "text-sl-cyan border-sl-cyan bg-sl-cyan/10",
      nextThreshold: 120,
      progressPercent: ((completedCount - 80) / (120 - 80)) * 100,
    };
  } else if (completedCount >= 50) {
    return {
      name: "A",
      color: "text-sl-purple border-sl-purple bg-sl-purple/10",
      nextThreshold: 80,
      progressPercent: ((completedCount - 50) / (80 - 50)) * 100,
    };
  } else if (completedCount >= 30) {
    return {
      name: "B",
      color: "text-sl-purple border-sl-purple bg-sl-purple/10",
      nextThreshold: 50,
      progressPercent: ((completedCount - 30) / (50 - 30)) * 100,
    };
  } else if (completedCount >= 15) {
    return {
      name: "C",
      color: "text-sl-purple border-sl-purple bg-sl-purple/10",
      nextThreshold: 30,
      progressPercent: ((completedCount - 15) / (30 - 15)) * 100,
    };
  } else if (completedCount >= 5) {
    return {
      name: "D",
      color: "text-sl-cyan border-sl-cyan bg-sl-cyan/10",
      nextThreshold: 15,
      progressPercent: ((completedCount - 5) / (15 - 5)) * 100,
    };
  } else {
    return {
      name: "E",
      color: "text-gray-400 border-gray-400 bg-gray-400/10",
      nextThreshold: 5,
      progressPercent: (completedCount / 5) * 100,
    };
  }
};
