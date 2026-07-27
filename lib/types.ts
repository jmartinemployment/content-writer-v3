// Phase 0: Foundation entities
export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  workspaceId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfile {
  id: string;
  clientId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfileVersion {
  id: string;
  profileId: string;
  version: number;
  approvedFactsJson: Record<string, unknown>;
  prohibitedClaimsJson: Record<string, unknown>;
  createdAt: string;
  rowVersion: number;
}

export interface ClientBrandVoiceLink {
  id: string;
  profileVersionId: string;
  brandVoiceId: string;
  createdAt: string;
}

export interface ContentCampaign {
  id: string;
  clientId: string;
  name: string;
  keyword: string;
  status: 'draft' | 'research' | 'strategy' | 'drafting' | 'published' | 'archived';
  profileVersionId: string;
  createdAt: string;
  updatedAt: string;
  rowVersion: number;
}

export interface ContentAsset {
  id: string;
  campaignId: string;
  type: 'pillar' | 'companion';
  name: string;
  status: 'draft' | 'readyForApproval' | 'approved' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface ContentAssetVersion {
  id: string;
  assetId: string;
  versionNumber: number;
  bodyDocument: ContentDocument;
  rowVersion: number;
  createdAt: string;
}

export interface ContentDocument {
  lede: string;
  sections: Section[];
}

export interface Section {
  heading: string;
  paragraphs: Paragraph[];
  children?: Section[];
}

export type Paragraph = TextParagraph | ListParagraph;

export interface TextParagraph {
  $type: 'text';
  runs: Run[];
}

export interface ListParagraph {
  $type: 'list';
  ordered: boolean;
  items: Run[][];
}

export interface Run {
  text: string;
  bold?: boolean;
  italic?: boolean;
  linkUrl?: string;
}

export interface ResearchRun {
  id: string;
  campaignId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface PainPoint {
  id: string;
  clientId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrategyBrief {
  id: string;
  campaignId: string;
  painPointId: string;
  audienceProfile: string;
  buyingStage: string;
  angle: string;
  callToAction: string;
  status: 'draft' | 'approved' | 'rejected';
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface Publication {
  id: string;
  assetVersionId: string;
  status: 'draft' | 'published' | 'failed';
  responseSnapshot?: Record<string, unknown>;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job<T = unknown> {
  id: string;
  jobType: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  payloadJson: T;
  idempotencyKey: string;
  attemptCount: number;
  leaseOwner?: string;
  leaseExpiresAt?: string;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  requeuedByUserId?: string;
  requeuedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
