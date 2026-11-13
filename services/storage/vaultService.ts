import { VaultFile, VaultRow } from '../../constants/types';
import { storageClient } from './asyncStorageClient';

const VAULT_FILES_KEY = '@dayflow_vault_files';
const VAULT_ROWS_KEY = '@dayflow_vault_rows';

const DEFAULT_FILES: VaultFile[] = [
  {
    id: 'file-tools',
    name: 'Dev & AI Tools',
    icon: 'construct-outline',
    description: 'Favorite developer utilities, platforms, and links',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'file-keys',
    name: 'API Keys & Secrets',
    icon: 'key-outline',
    description: 'Tokens, environments, and private credentials',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'file-personal',
    name: 'Personal & Accounts',
    icon: 'shield-checkmark-outline',
    description: 'Private notes, Wi-Fi info, and important handles',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_ROWS: VaultRow[] = [
  // Dev Tools
  {
    id: 'row-1',
    fileId: 'file-tools',
    name: 'Supabase',
    value: 'https://supabase.com',
    description: 'Open source Firebase alternative with Postgres database & auth',
    tag: 'Database',
    isSecret: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'row-2',
    fileId: 'file-tools',
    name: 'Expo EAS Build',
    value: 'https://expo.dev/eas',
    description: 'Cloud build system for Android APKs, iOS builds, and OTA updates',
    tag: 'Mobile',
    isSecret: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'row-3',
    fileId: 'file-tools',
    name: 'Claude Code',
    value: 'https://docs.anthropic.com/en/docs/agents-and-tools/claude-code',
    description: 'Agentic command line coding workflow & refactoring',
    tag: 'AI',
    isSecret: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'row-4',
    fileId: 'file-tools',
    name: 'v0 by Vercel',
    value: 'https://v0.dev',
    description: 'Generative UI builder with React and Tailwind code generation',
    tag: 'Design',
    isSecret: false,
    createdAt: new Date().toISOString(),
  },
  // API Keys
  {
    id: 'row-5',
    fileId: 'file-keys',
    name: 'OpenAI Production Key',
    value: 'sk-proj-prod-839210-9284902840921',
    description: 'Primary API token for GPT-4o inference & image models',
    tag: 'AI Key',
    isSecret: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'row-6',
    fileId: 'file-keys',
    name: 'Gemini Interactions API',
    value: 'AIzaSyB3910xKlm8392-live9281',
    description: 'Multimodal vision and ultra-fast Flash 2.5 streaming',
    tag: 'Google Cloud',
    isSecret: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'row-7',
    fileId: 'file-keys',
    name: 'GitHub Personal Token',
    value: 'ghp_92019481903840294820948',
    description: 'Repo, gist and workflow automation scopes',
    tag: 'GitHub',
    isSecret: true,
    createdAt: new Date().toISOString(),
  },
  // Personal
  {
    id: 'row-8',
    fileId: 'file-personal',
    name: 'Home Fiber Wi-Fi',
    value: 'SSID: Fiber-5G-Mesh / Pass: FlowDay#2026',
    description: 'High-speed 1Gbps dual-band router in office',
    tag: 'Network',
    isSecret: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'row-9',
    fileId: 'file-personal',
    name: 'Personal Portfolio Link',
    value: 'https://github.com/moin08-webdev',
    description: 'GitHub repositories and developer portfolio showcase',
    tag: 'Portfolio',
    isSecret: false,
    createdAt: new Date().toISOString(),
  },
];

export const vaultService = {
  async getFiles(): Promise<VaultFile[]> {
    const files = await storageClient.get<VaultFile[] | null>(VAULT_FILES_KEY, null);
    if (!files || files.length === 0) {
      await storageClient.set(VAULT_FILES_KEY, DEFAULT_FILES);
      return DEFAULT_FILES;
    }
    return files;
  },

  async addFile(fileData: Omit<VaultFile, 'id' | 'createdAt'>): Promise<VaultFile[]> {
    const files = await this.getFiles();
    const newFile: VaultFile = {
      ...fileData,
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...files, newFile];
    await storageClient.set(VAULT_FILES_KEY, updated);
    return updated;
  },

  async deleteFile(fileId: string): Promise<VaultFile[]> {
    const files = await this.getFiles();
    const updated = files.filter((f) => f.id !== fileId);
    await storageClient.set(VAULT_FILES_KEY, updated);

    // Also remove rows associated with this file
    const rows = await this.getAllRows();
    const filteredRows = rows.filter((r) => r.fileId !== fileId);
    await storageClient.set(VAULT_ROWS_KEY, filteredRows);

    return updated;
  },

  async getAllRows(): Promise<VaultRow[]> {
    const rows = await storageClient.get<VaultRow[] | null>(VAULT_ROWS_KEY, null);
    if (!rows || rows.length === 0) {
      await storageClient.set(VAULT_ROWS_KEY, DEFAULT_ROWS);
      return DEFAULT_ROWS;
    }
    return rows;
  },

  async getRowsByFile(fileId: string): Promise<VaultRow[]> {
    const all = await this.getAllRows();
    return all.filter((r) => r.fileId === fileId);
  },

  async addRow(rowData: Omit<VaultRow, 'id' | 'createdAt'>): Promise<VaultRow[]> {
    const rows = await this.getAllRows();
    const newRow: VaultRow = {
      ...rowData,
      id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRow, ...rows];
    await storageClient.set(VAULT_ROWS_KEY, updated);
    return updated;
  },

  async updateRow(id: string, updates: Partial<Omit<VaultRow, 'id' | 'createdAt'>>): Promise<VaultRow[]> {
    const rows = await this.getAllRows();
    const updated = rows.map((r) => (r.id === id ? { ...r, ...updates } : r));
    await storageClient.set(VAULT_ROWS_KEY, updated);
    return updated;
  },

  async deleteRow(id: string): Promise<VaultRow[]> {
    const rows = await this.getAllRows();
    const updated = rows.filter((r) => r.id !== id);
    await storageClient.set(VAULT_ROWS_KEY, updated);
    return updated;
  },
};
