export type Level = 1 | 2 | 3;
export type Section = 'listening' | 'reading' | 'writing';
export type Picture = { sheet: 'basic' | 'daily' | 'advanced'; cell: number };
export type Option = { id: string; text?: string; picture?: Picture };
export type Question = {
  id: string; level: Level; section: Section; part: string; kind: 'choice' | 'character' | 'sentence';
  instruction: string; instructionZh: string; stem: string; options?: Option[]; picture?: Picture;
  keyword?: string; audio?: string; group?: string; topic: string;
};
export type PrivateQuestion = Question & { correct: string; transcript?: string; explanation: string; models?: string[] };
export type Answer = { value: string; flagged?: boolean; plays?: number; seconds?: number };
export type ReviewItem = { id: string; correct: string; user: string; earned: number | null; explanation: string; transcript?: string; models?: string[] };
export type ExamResult = { items: ReviewItem[]; scores: { section: Section; correct: number; total: number; pending: number; percent: number }[]; objectiveCorrect: number; objectiveTotal: number; pending: number };
export type Form = { level: Level; seed: string; questions: Question[] };
export const SECTION_LABELS: Record<Section,string> = { listening: '听力 · Compreensão auditiva', reading: '阅读 · Leitura', writing: '书写 · Escrita' };
export const PROFILES: Record<Level,{ total: number; global: number; minutes: Record<Section,number>; counts: Record<Section,number>; vocabulary: number }> = {
  1: { total:40,global:40,minutes:{listening:12,reading:20,writing:0},counts:{listening:20,reading:20,writing:0},vocabulary:300 },
  2: { total:60,global:60,minutes:{listening:17,reading:25,writing:10},counts:{listening:25,reading:25,writing:10},vocabulary:500 },
  3: { total:70,global:83,minutes:{listening:23,reading:30,writing:20},counts:{listening:30,reading:30,writing:10},vocabulary:1000 },
};
