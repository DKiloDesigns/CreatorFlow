# AI Agent Documentation Guidelines (Duplicate)

This is a test to see if the validation system catches duplicate documentation.

## Core Rules for AI Agents

1. **Documentation Creation**

   - ALWAYS check existing documentation first
   - NEVER recreate existing documentation
   - ALWAYS place new documentation in the correct category
   - ALWAYS include required metadata

2. **Category Selection**

   - **Evergreen**: For permanent, rarely-changing documentation
   - **Living**: For evolving project documentation
   - **Temporal**: For time-specific documentation

3. **Required Metadata**

   ```typescript
   {
     id: string;          // Unique identifier
     title: string;       // Clear, descriptive title
     description: string; // Brief summary
     category: 'evergreen' | 'living' | 'temporal';
     tags: string[];      // Relevant tags
     version: string;     // Semantic versioning
     lastUpdated: string; // ISO date
     status: 'draft' | 'review' | 'published';
     dependencies?: string[]; // Related docs
     progress?: {
       completion: number;
       milestones: Array<{
         name: string;
         completed: boolean;
         completedAt?: string;
       }>;
     }
   }
   ```

4. **Validation Steps**

   - Check for existing documentation
   - Validate metadata completeness
   - Verify category appropriateness
   - Check dependencies exist
   - Ensure proper versioning

5. **Documentation Updates**
   - Update version numbers
   - Update lastUpdated timestamp
   - Track changes in Mission Control
   - Maintain dependency integrity

## AI Agent Workflow

1. **Before Creating Documentation**

   ```typescript
   // 1. Check existing docs
   const existingDocs = await docManager.searchByTitle(title);

   // 2. Validate category
   if (!isValidCategory(category)) {
     throw new ValidationError('Invalid category');
   }

   // 3. Check dependencies
   await validateDependencies(dependencies);
   ```

2. **During Documentation Creation**

   ```typescript
   // 1. Add metadata
   await docManager.addMetadata(docId, {
     // ... required metadata
   });

   // 2. Add content
   await docManager.updateDocumentation(docId, content);

   // 3. Set initial progress
   await docManager.updateProgress(docId, 0);
   ```

3. **After Documentation Creation**

   ```typescript
   // 1. Verify completeness
   await validateDocumentation(docId);

   // 2. Log to Mission Control
   await logToMissionControl({
     type: 'documentation_created',
     docId,
     metadata: {...}
   });

   // 3. Update status
   await docManager.updateStatus(docId, 'draft');
   ```

## Common Pitfalls to Avoid

1. **Documentation Duplication**

   - Always search before creating
   - Use existing documentation when possible
   - Extend rather than recreate

2. **Category Misplacement**

   - Double-check category selection
   - Consider document lifecycle
   - Review similar existing docs

3. **Metadata Incompleteness**

   - Use metadata templates
   - Validate all required fields
   - Keep versions updated

4. **Dependency Issues**
   - Verify all dependencies exist
   - Avoid circular dependencies
   - Update dependent docs when needed

## Integration with Mission Control

1. **Logging Requirements**

   ```typescript
   interface MissionControlLog {
     type: 'documentation_created' | 'documentation_updated' | 'milestone_completed';
     docId: string;
     timestamp: string;
     agentId: string;
     changes?: {
       field: string;
       oldValue: any;
       newValue: any;
     }[];
   }
   ```

2. **Progress Tracking**

   - Log all documentation changes
   - Track milestone completions
   - Monitor dependency updates

3. **Error Reporting**
   - Log validation errors
   - Report missing dependencies
   - Track version conflicts

## Best Practices

1. **Documentation Creation**

   - Use templates for consistency
   - Follow established patterns
   - Include examples where appropriate

2. **Updates and Maintenance**

   - Regular validation checks
   - Dependency verification
   - Version management

3. **Quality Assurance**
   - Content completeness
   - Metadata accuracy
   - Dependency integrity

## Example Implementation

```typescript
class AIAgentDocumentationHandler {
  async createDocumentation(params: DocumentationParams) {
    // 1. Pre-validation
    await this.validateParams(params);

    // 2. Check existing docs
    const existing = await this.checkExisting(params.title);
    if (existing) {
      throw new DuplicateError('Documentation already exists');
    }

    // 3. Create documentation
    const docId = await this.createDoc(params);

    // 4. Post-validation
    await this.validateDocumentation(docId);

    // 5. Log to Mission Control
    await this.logToMissionControl(docId);

    return docId;
  }

  async updateDocumentation(docId: string, updates: DocumentationUpdates) {
    // 1. Validate updates
    await this.validateUpdates(updates);

    // 2. Apply updates
    await this.applyUpdates(docId, updates);

    // 3. Update metadata
    await this.updateMetadata(docId);

    // 4. Log changes
    await this.logChanges(docId, updates);
  }
}
```
