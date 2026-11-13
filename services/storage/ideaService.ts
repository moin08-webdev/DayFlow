import { Idea, RoadmapStep } from '../../constants/types';
import { storageClient } from './asyncStorageClient';

const IDEAS_STORAGE_KEY = '@dayflow_ideas';

const DEFAULT_IDEAS: Idea[] = [
  {
    id: 'idea-1',
    title: 'DayFlow Native Mobile App',
    tag: 'Mobile App',
    description: 'All-in-one daily planner, routine manager, expense tracker, and ideas hub built with React Native & Expo.',
    status: 'In Progress',
    targetDate: '2026-11-20',
    createdAt: new Date().toISOString(),
    roadmap: [
      {
        id: 'step-1-1',
        title: 'Design modern 3D UI & theme engine',
        description: 'Layered cards, soft shadows, and light/dark theme toggle',
        completed: true,
        order: 1,
      },
      {
        id: 'step-1-2',
        title: 'Daily timetable with auto-reset checkins',
        description: 'Automatic checkmark reset every morning at midnight',
        completed: true,
        order: 2,
      },
      {
        id: 'step-1-3',
        title: 'Remaining tasks with priority badges',
        description: 'High, medium, low priority filters and done archive',
        completed: true,
        order: 3,
      },
      {
        id: 'step-1-4',
        title: 'Weekly day-wise routines & copy tool',
        description: 'Monday through Sunday schedules with 1-tap copy',
        completed: true,
        order: 4,
      },
      {
        id: 'step-1-5',
        title: 'Money tracker with SVG donut chart',
        description: 'Expenses in ₹ with category breakdowns and summaries',
        completed: true,
        order: 5,
      },
      {
        id: 'step-1-6',
        title: 'Idea roadmap & personal info vault',
        description: 'Milestone tracking and encrypted table hub for tools and keys',
        completed: true,
        order: 6,
      },
      {
        id: 'step-1-7',
        title: 'Generate standalone APK with EAS Build',
        description: 'Production installable APK for permanent phone usage',
        completed: false,
        order: 7,
      },
    ],
  },
  {
    id: 'idea-2',
    title: 'AI Code Review Bot',
    tag: 'SaaS',
    description: 'Autonomous GitHub App that reviews PRs for bugs, security leaks, and architecture smells in real-time.',
    status: 'Brainstorming',
    targetDate: '2026-12-15',
    createdAt: new Date().toISOString(),
    roadmap: [
      {
        id: 'step-2-1',
        title: 'Research GitHub Apps API & Webhooks',
        description: 'Explore webhook verification and permissions',
        completed: true,
        order: 1,
      },
      {
        id: 'step-2-2',
        title: 'Prompt engineering for code diff analysis',
        description: 'Fine-tune AST analysis prompts with structured JSON output',
        completed: false,
        order: 2,
      },
      {
        id: 'step-2-3',
        title: 'Build serverless webhook processor',
        description: 'Deploy Cloudflare worker or AWS Lambda',
        completed: false,
        order: 3,
      },
      {
        id: 'step-2-4',
        title: 'Beta test on open-source repositories',
        description: 'Gather feedback from developer community',
        completed: false,
        order: 4,
      },
    ],
  },
  {
    id: 'idea-3',
    title: 'YouTube Dev & Tech Channel',
    tag: 'Content',
    description: 'High-production tutorials on building real-world AI applications, system architecture, and mobile apps.',
    status: 'In Progress',
    targetDate: '2026-12-01',
    createdAt: new Date().toISOString(),
    roadmap: [
      {
        id: 'step-3-1',
        title: 'Studio Setup & Audio Gear',
        description: 'Shure mic, key lights, and 4K camera setup',
        completed: true,
        order: 1,
      },
      {
        id: 'step-3-2',
        title: 'Script first 5 comprehensive episodes',
        description: 'React Native 2026 guide, Expo EAS secrets, and AI agent workflows',
        completed: true,
        order: 2,
      },
      {
        id: 'step-3-3',
        title: 'Record & edit pilot video',
        description: 'Add animations, b-roll, and clean sound design',
        completed: false,
        order: 3,
      },
      {
        id: 'step-3-4',
        title: 'Launch channel with trailer & community link',
        description: 'Publish on YouTube and share on Twitter/X and LinkedIn',
        completed: false,
        order: 4,
      },
    ],
  },
];

export const ideaService = {
  async getIdeas(): Promise<Idea[]> {
    const ideas = await storageClient.get<Idea[] | null>(IDEAS_STORAGE_KEY, null);
    if (!ideas || ideas.length === 0) {
      await storageClient.set(IDEAS_STORAGE_KEY, DEFAULT_IDEAS);
      return DEFAULT_IDEAS;
    }
    return ideas;
  },

  async getIdeaById(id: string): Promise<Idea | null> {
    const ideas = await this.getIdeas();
    return ideas.find((i) => i.id === id) || null;
  },

  async addIdea(ideaData: Omit<Idea, 'id' | 'createdAt' | 'roadmap'> & { initialSteps?: string[] }): Promise<Idea[]> {
    const ideas = await this.getIdeas();
    const newId = `idea-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    
    const initialRoadmap: RoadmapStep[] = (ideaData.initialSteps || []).map((title, index) => ({
      id: `step-${Date.now()}-${index}`,
      title,
      completed: false,
      order: index + 1,
    }));

    const newIdea: Idea = {
      id: newId,
      title: ideaData.title,
      tag: ideaData.tag,
      description: ideaData.description,
      status: ideaData.status,
      targetDate: ideaData.targetDate,
      roadmap: initialRoadmap,
      createdAt: new Date().toISOString(),
    };

    const updated = [newIdea, ...ideas];
    await storageClient.set(IDEAS_STORAGE_KEY, updated);
    return updated;
  },

  async updateIdea(id: string, updates: Partial<Omit<Idea, 'id' | 'createdAt' | 'roadmap'>>): Promise<Idea[]> {
    const ideas = await this.getIdeas();
    const updated = ideas.map((item) => (item.id === id ? { ...item, ...updates } : item));
    await storageClient.set(IDEAS_STORAGE_KEY, updated);
    return updated;
  },

  async deleteIdea(id: string): Promise<Idea[]> {
    const ideas = await this.getIdeas();
    const updated = ideas.filter((item) => item.id !== id);
    await storageClient.set(IDEAS_STORAGE_KEY, updated);
    return updated;
  },

  // Roadmap Operations
  async addRoadmapStep(ideaId: string, stepData: Omit<RoadmapStep, 'id' | 'completed' | 'order'>): Promise<Idea | null> {
    const ideas = await this.getIdeas();
    const targetIdea = ideas.find((i) => i.id === ideaId);
    if (!targetIdea) return null;

    const newStep: RoadmapStep = {
      ...stepData,
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      completed: false,
      order: targetIdea.roadmap.length + 1,
    };

    targetIdea.roadmap.push(newStep);
    await storageClient.set(IDEAS_STORAGE_KEY, ideas);
    return targetIdea;
  },

  async toggleRoadmapStep(ideaId: string, stepId: string): Promise<Idea | null> {
    const ideas = await this.getIdeas();
    const targetIdea = ideas.find((i) => i.id === ideaId);
    if (!targetIdea) return null;

    targetIdea.roadmap = targetIdea.roadmap.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s));

    // If all steps completed, automatically prompt or update status to 'Shipped' if desired
    const allDone = targetIdea.roadmap.length > 0 && targetIdea.roadmap.every((s) => s.completed);
    if (allDone && targetIdea.status !== 'Shipped') {
      targetIdea.status = 'Shipped';
    }

    await storageClient.set(IDEAS_STORAGE_KEY, ideas);
    return targetIdea;
  },

  async updateRoadmapStep(ideaId: string, stepId: string, updates: Partial<RoadmapStep>): Promise<Idea | null> {
    const ideas = await this.getIdeas();
    const targetIdea = ideas.find((i) => i.id === ideaId);
    if (!targetIdea) return null;

    targetIdea.roadmap = targetIdea.roadmap.map((s) => (s.id === stepId ? { ...s, ...updates } : s));
    await storageClient.set(IDEAS_STORAGE_KEY, ideas);
    return targetIdea;
  },

  async deleteRoadmapStep(ideaId: string, stepId: string): Promise<Idea | null> {
    const ideas = await this.getIdeas();
    const targetIdea = ideas.find((i) => i.id === ideaId);
    if (!targetIdea) return null;

    targetIdea.roadmap = targetIdea.roadmap.filter((s) => s.id !== stepId);
    await storageClient.set(IDEAS_STORAGE_KEY, ideas);
    return targetIdea;
  },

  calculateProgress(idea: Idea): { completed: number; total: number; percentage: number } {
    const total = idea.roadmap.length;
    const completed = idea.roadmap.filter((s) => s.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  },
};
