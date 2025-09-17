/**
 * Content Version Control
 * Track content changes and iterations
 */

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  title: string;
  description: string;
  content: string;
  metadata: {
    author: string;
    createdAt: string;
    changes: string[];
    fileSize: number;
    checksum: string;
  };
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  tags: string[];
  isCurrent: boolean;
  parentVersion?: number;
  childVersions: number[];
}

export interface VersionDiff {
  version1: ContentVersion;
  version2: ContentVersion;
  changes: {
    added: string[];
    removed: string[];
    modified: string[];
  };
  summary: string;
  confidence: number;
}

export interface VersionHistory {
  contentId: string;
  versions: ContentVersion[];
  currentVersion: number;
  totalVersions: number;
  createdAt: string;
  lastModified: string;
  authors: string[];
  status: 'active' | 'archived' | 'deleted';
}

export interface VersionComparison {
  version1: ContentVersion;
  version2: ContentVersion;
  diff: VersionDiff;
  performance: {
    version1: {
      views: number;
      engagement: number;
      conversion: number;
    };
    version2: {
      views: number;
      engagement: number;
      conversion: number;
    };
    improvement: number;
  };
}

export interface VersionBranch {
  id: string;
  name: string;
  contentId: string;
  baseVersion: number;
  currentVersion: number;
  description: string;
  author: string;
  createdAt: string;
  status: 'active' | 'merged' | 'abandoned';
  versions: ContentVersion[];
}

export interface MergeRequest {
  id: string;
  sourceBranch: string;
  targetBranch: string;
  contentId: string;
  title: string;
  description: string;
  changes: VersionDiff;
  status: 'open' | 'approved' | 'rejected' | 'merged';
  author: string;
  reviewers: string[];
  createdAt: string;
  updatedAt: string;
  comments: Array<{
    author: string;
    content: string;
    timestamp: string;
  }>;
}

export class ContentVersionControl {
  private versions: Map<string, ContentVersion[]> = new Map();
  private branches: Map<string, VersionBranch[]> = new Map();
  private mergeRequests: Map<string, MergeRequest[]> = new Map();

  // Create new version
  async createVersion(
    contentId: string,
    content: string,
    title: string,
    description: string,
    author: string,
    changes: string[]
  ): Promise<ContentVersion> {
    const existingVersions = this.versions.get(contentId) || [];
    const newVersionNumber = existingVersions.length + 1;

    // Mark previous versions as not current
    existingVersions.forEach(version => {
      version.isCurrent = false;
    });

    const newVersion: ContentVersion = {
      id: `version_${contentId}_${newVersionNumber}`,
      contentId,
      version: newVersionNumber,
      title,
      description,
      content,
      metadata: {
        author,
        createdAt: new Date().toISOString(),
        changes,
        fileSize: content.length,
        checksum: this.calculateChecksum(content)
      },
      status: 'draft',
      tags: [],
      isCurrent: true,
      parentVersion: existingVersions.length > 0 ? existingVersions[existingVersions.length - 1].version : undefined,
      childVersions: []
    };

    // Update parent version's child versions
    if (newVersion.parentVersion) {
      const parentVersion = existingVersions.find(v => v.version === newVersion.parentVersion);
      if (parentVersion) {
        parentVersion.childVersions.push(newVersion.version);
      }
    }

    existingVersions.push(newVersion);
    this.versions.set(contentId, existingVersions);

    return newVersion;
  }

  // Get version
  async getVersion(contentId: string, versionNumber: number): Promise<ContentVersion | null> {
    const versions = this.versions.get(contentId);
    if (!versions) {
      return null;
    }

    return versions.find(v => v.version === versionNumber) || null;
  }

  // Get current version
  async getCurrentVersion(contentId: string): Promise<ContentVersion | null> {
    const versions = this.versions.get(contentId);
    if (!versions) {
      return null;
    }

    return versions.find(v => v.isCurrent) || null;
  }

  // Get version history
  async getVersionHistory(contentId: string): Promise<VersionHistory> {
    const versions = this.versions.get(contentId) || [];
    const currentVersion = versions.find(v => v.isCurrent);
    const authors = [...new Set(versions.map(v => v.metadata.author))];

    return {
      contentId,
      versions: versions.sort((a, b) => b.version - a.version),
      currentVersion: currentVersion?.version || 0,
      totalVersions: versions.length,
      createdAt: versions[0]?.metadata.createdAt || new Date().toISOString(),
      lastModified: versions[versions.length - 1]?.metadata.createdAt || new Date().toISOString(),
      authors,
      status: 'active'
    };
  }

  // Compare versions
  async compareVersions(
    contentId: string,
    version1: number,
    version2: number
  ): Promise<VersionComparison> {
    const v1 = await this.getVersion(contentId, version1);
    const v2 = await this.getVersion(contentId, version2);

    if (!v1 || !v2) {
      throw new Error('One or both versions not found');
    }

    const diff = this.calculateDiff(v1, v2);
    const performance = await this.getVersionPerformance(contentId, version1, version2);

    return {
      version1: v1,
      version2: v2,
      diff,
      performance
    };
  }

  // Revert to version
  async revertToVersion(contentId: string, versionNumber: number): Promise<ContentVersion> {
    const versions = this.versions.get(contentId);
    if (!versions) {
      throw new Error('Content not found');
    }

    const targetVersion = versions.find(v => v.version === versionNumber);
    if (!targetVersion) {
      throw new Error('Version not found');
    }

    // Create new version based on target version
    const newVersion = await this.createVersion(
      contentId,
      targetVersion.content,
      targetVersion.title,
      `Reverted to version ${versionNumber}`,
      'system',
      [`Reverted to version ${versionNumber}`]
    );

    return newVersion;
  }

  // Create branch
  async createBranch(
    contentId: string,
    branchName: string,
    baseVersion: number,
    description: string,
    author: string
  ): Promise<VersionBranch> {
    const baseVersionData = await this.getVersion(contentId, baseVersion);
    if (!baseVersionData) {
      throw new Error('Base version not found');
    }

    const branchId = `branch_${contentId}_${branchName}`;
    const newBranch: VersionBranch = {
      id: branchId,
      name: branchName,
      contentId,
      baseVersion,
      currentVersion: baseVersion,
      description,
      author,
      createdAt: new Date().toISOString(),
      status: 'active',
      versions: [baseVersionData]
    };

    const branches = this.branches.get(contentId) || [];
    branches.push(newBranch);
    this.branches.set(contentId, branches);

    return newBranch;
  }

  // Add version to branch
  async addVersionToBranch(
    contentId: string,
    branchName: string,
    content: string,
    title: string,
    description: string,
    author: string,
    changes: string[]
  ): Promise<ContentVersion> {
    const branches = this.branches.get(contentId) || [];
    const branch = branches.find(b => b.name === branchName);
    
    if (!branch) {
      throw new Error('Branch not found');
    }

    const newVersion = await this.createVersion(
      contentId,
      content,
      title,
      description,
      author,
      changes
    );

    branch.versions.push(newVersion);
    branch.currentVersion = newVersion.version;

    return newVersion;
  }

  // Merge branch
  async mergeBranch(
    contentId: string,
    sourceBranch: string,
    targetBranch: string,
    author: string
  ): Promise<ContentVersion> {
    const branches = this.branches.get(contentId) || [];
    const source = branches.find(b => b.name === sourceBranch);
    const target = branches.find(b => b.name === targetBranch);

    if (!source || !target) {
      throw new Error('One or both branches not found');
    }

    const sourceCurrentVersion = source.versions[source.versions.length - 1];
    const targetCurrentVersion = target.versions[target.versions.length - 1];

    // Create merge version
    const mergeVersion = await this.createVersion(
      contentId,
      sourceCurrentVersion.content,
      `Merge: ${sourceBranch} into ${targetBranch}`,
      `Merged ${sourceBranch} into ${targetBranch}`,
      author,
      [`Merged from ${sourceBranch}`]
    );

    // Update branch status
    source.status = 'merged';
    target.currentVersion = mergeVersion.version;

    return mergeVersion;
  }

  // Create merge request
  async createMergeRequest(
    contentId: string,
    sourceBranch: string,
    targetBranch: string,
    title: string,
    description: string,
    author: string,
    reviewers: string[]
  ): Promise<MergeRequest> {
    const branches = this.branches.get(contentId) || [];
    const source = branches.find(b => b.name === sourceBranch);
    const target = branches.find(b => b.name === targetBranch);

    if (!source || !target) {
      throw new Error('One or both branches not found');
    }

    const sourceCurrentVersion = source.versions[source.versions.length - 1];
    const targetCurrentVersion = target.versions[target.versions.length - 1];
    const diff = this.calculateDiff(targetCurrentVersion, sourceCurrentVersion);

    const mergeRequest: MergeRequest = {
      id: `mr_${contentId}_${Date.now()}`,
      sourceBranch,
      targetBranch,
      contentId,
      title,
      description,
      changes: diff,
      status: 'open',
      author,
      reviewers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };

    const mergeRequests = this.mergeRequests.get(contentId) || [];
    mergeRequests.push(mergeRequest);
    this.mergeRequests.set(contentId, mergeRequests);

    return mergeRequest;
  }

  // Get merge requests
  async getMergeRequests(contentId: string): Promise<MergeRequest[]> {
    return this.mergeRequests.get(contentId) || [];
  }

  // Approve merge request
  async approveMergeRequest(contentId: string, mergeRequestId: string, approver: string): Promise<boolean> {
    const mergeRequests = this.mergeRequests.get(contentId) || [];
    const mergeRequest = mergeRequests.find(mr => mr.id === mergeRequestId);

    if (!mergeRequest) {
      return false;
    }

    if (!mergeRequest.reviewers.includes(approver)) {
      return false;
    }

    mergeRequest.status = 'approved';
    mergeRequest.updatedAt = new Date().toISOString();

    return true;
  }

  // Add comment to merge request
  async addMergeRequestComment(
    contentId: string,
    mergeRequestId: string,
    author: string,
    content: string
  ): Promise<boolean> {
    const mergeRequests = this.mergeRequests.get(contentId) || [];
    const mergeRequest = mergeRequests.find(mr => mr.id === mergeRequestId);

    if (!mergeRequest) {
      return false;
    }

    mergeRequest.comments.push({
      author,
      content,
      timestamp: new Date().toISOString()
    });

    mergeRequest.updatedAt = new Date().toISOString();

    return true;
  }

  // Get version statistics
  async getVersionStatistics(contentId: string): Promise<{
    totalVersions: number;
    activeBranches: number;
    openMergeRequests: number;
    averageChangesPerVersion: number;
    mostActiveAuthor: string;
    versionDistribution: Array<{
      author: string;
      count: number;
    }>;
  }> {
    const versions = this.versions.get(contentId) || [];
    const branches = this.branches.get(contentId) || [];
    const mergeRequests = this.mergeRequests.get(contentId) || [];

    const authorCounts = new Map<string, number>();
    let totalChanges = 0;

    versions.forEach(version => {
      const count = authorCounts.get(version.metadata.author) || 0;
      authorCounts.set(version.metadata.author, count + 1);
      totalChanges += version.metadata.changes.length;
    });

    const mostActiveAuthor = Array.from(authorCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

    const versionDistribution = Array.from(authorCounts.entries())
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalVersions: versions.length,
      activeBranches: branches.filter(b => b.status === 'active').length,
      openMergeRequests: mergeRequests.filter(mr => mr.status === 'open').length,
      averageChangesPerVersion: versions.length > 0 ? totalChanges / versions.length : 0,
      mostActiveAuthor,
      versionDistribution
    };
  }

  // Private helper methods
  private calculateChecksum(content: string): string {
    // Simple checksum calculation - in production, use crypto.createHash
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private calculateDiff(version1: ContentVersion, version2: ContentVersion): VersionDiff {
    const content1 = version1.content.split('\n');
    const content2 = version2.content.split('\n');

    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];

    // Simple diff algorithm - in production, use a proper diff library
    const maxLines = Math.max(content1.length, content2.length);
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = content1[i] || '';
      const line2 = content2[i] || '';

      if (i >= content1.length) {
        added.push(line2);
      } else if (i >= content2.length) {
        removed.push(line1);
      } else if (line1 !== line2) {
        modified.push(`Line ${i + 1}: "${line1}" → "${line2}"`);
      }
    }

    const summary = `Added ${added.length} lines, removed ${removed.length} lines, modified ${modified.length} lines`;
    const confidence = Math.max(0, 1 - (added.length + removed.length + modified.length) / maxLines);

    return {
      version1,
      version2,
      changes: { added, removed, modified },
      summary,
      confidence
    };
  }

  private async getVersionPerformance(
    contentId: string,
    version1: number,
    version2: number
  ): Promise<VersionComparison['performance']> {
    // Mock performance data - in production, fetch from analytics
    const v1Performance = {
      views: Math.floor(Math.random() * 1000),
      engagement: Math.random() * 100,
      conversion: Math.random() * 10
    };

    const v2Performance = {
      views: Math.floor(Math.random() * 1000),
      engagement: Math.random() * 100,
      conversion: Math.random() * 10
    };

    const improvement = ((v2Performance.engagement - v1Performance.engagement) / v1Performance.engagement) * 100;

    return {
      version1: v1Performance,
      version2: v2Performance,
      improvement: Math.round(improvement * 100) / 100
    };
  }
}
