# Documentation System Guide

## Overview

The Project Moonshot Documentation System is a structured, versioned, and categorized documentation management system. It helps maintain high-quality documentation across the project by providing clear organization, validation, and tracking capabilities.

## Categories

### Evergreen Documentation

- Core documentation that rarely changes
- Examples: Design system documentation, component documentation, ARIA guidelines
- Location: `docs/evergreen/`

### Living Documentation

- Documentation that evolves with the project
- Examples: Progress reports, roadmap, case studies
- Location: `docs/living/`

### Temporal Documentation

- Time-sensitive documentation
- Examples: Development session summaries, mission control logs
- Location: `docs/temporal/`

## Usage

### Adding New Documentation

1. Create a new markdown file in the appropriate category directory
2. Add metadata using the DocumentationManager:

```typescript
const docManager = DocumentationManager.getInstance();
await docManager.addMetadata('doc-id', {
  id: 'doc-id',
  title: 'Document Title',
  description: 'Document description',
  category: 'evergreen', // or 'living' or 'temporal'
  tags: ['tag1', 'tag2'],
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  status: 'draft',
  dependencies: [],
  progress: {
    completion: 0,
    milestones: [],
  },
});
```

### Updating Documentation

```typescript
await docManager.updateDocumentation('doc-id', 'New content');
```

### Tracking Progress

```typescript
// Add a milestone
await docManager.addMilestone('doc-id', { name: 'Initial Review' });

// Complete a milestone
await docManager.completeMilestone('doc-id', 'Initial Review');
```

## Metadata Structure

```typescript
interface DocumentationMetadata {
  id: string;
  title: string;
  description: string;
  category: 'evergreen' | 'living' | 'temporal';
  tags?: string[];
  version: string;
  lastUpdated: string;
  status: 'draft' | 'review' | 'published';
  dependencies?: string[];
  progress?: {
    completion: number;
    lastReviewed?: string;
    reviewers?: string[];
    milestones?: Array<{
      name: string;
      completed: boolean;
      completedAt?: string;
    }>;
  };
}
```

## Validation Rules

The system enforces the following validation rules:

1. All required fields must be present
2. Category must be one of: evergreen, living, temporal
3. Status must be one of: draft, review, published
4. Version must follow semantic versioning (e.g., 1.0.0)
5. All referenced dependencies must exist

## Best Practices

1. **Version Control**

   - Use semantic versioning for all documentation
   - Update version when making significant changes

2. **Dependencies**

   - Document dependencies between documents
   - Keep dependency chains shallow to avoid circular references

3. **Progress Tracking**

   - Set clear milestones for documentation completion
   - Update progress regularly
   - Include reviewers in the metadata

4. **Content Organization**
   - Place documentation in the most appropriate category
   - Use tags for cross-referencing
   - Keep content focused and well-structured

## Error Handling

The system provides comprehensive error handling for:

- Missing required fields
- Invalid categories
- Invalid status values
- Invalid version formats
- Missing dependencies
- File system operations

## Integration with Mission Control

The documentation system integrates with Mission Control to track:

- Documentation access
- Updates
- Progress changes
- Milestone completions
- Validation errors

## Migration Guide

If you need to migrate existing documentation to the new system, use the migration script:

```bash
npm run migrate-docs
```

This will:

1. Create the new directory structure
2. Move existing documentation to appropriate categories
3. Generate metadata for all documents
4. Validate the migrated content
