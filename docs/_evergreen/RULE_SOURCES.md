# Rule Source Management

**Status:** 🟢 Active
**Last Updated:** March 26, 2024
**Product:** DevFlow AI™

## Overview

DevFlow AI™ manages multiple sources of development rules and instructions through a priority-based system. This document explains how different rule sources interact and how potential conflicts are resolved.

## Rule Source Hierarchy

```
Priority 1: DevFlow AI Core Rules
└── Tier 1 (Evergreen)
    ├── SPECIAL_INSTRUCTIONS.md
    ├── WORKFLOW_RULES.md
    └── SACA_STANDARDS.md

Priority 2: IDE/Tool Rules
└── IDE-specific rules
    ├── Cursor User Rules
    ├── VS Code Settings
    └── Other IDE configurations

Priority 3: Project Rules
└── Project-specific rules
    ├── CONTEXT_ENTRY.md
    ├── Custom workflows
    └── Team standards
```

## Rule Types

### 1. Core Rules (Priority 1)

- DevFlow AI system rules
- SACA design standards
- Workflow mandates
- Documentation requirements

### 2. IDE Rules (Priority 2)

- Editor-specific configurations
- Custom user instructions
- Extension settings
- Keyboard shortcuts

### 3. Project Rules (Priority 3)

- Project-specific guidelines
- Team conventions
- Custom workflows
- Local standards

## Rule Resolution

When multiple rules exist for the same concern:

1. **Complementary Rules** 🟢

   - Rules that enhance each other
   - Example: IDE's "check context" rule reinforces DevFlow's context management

2. **Overlapping Rules** 🟡

   - Rules that cover the same area differently
   - Resolution: Follow higher priority unless explicitly overridden

3. **Conflicting Rules** 🔴
   - Rules that contradict each other
   - Resolution: Higher priority wins, document override if needed

## Common Scenarios

### SACA Integration

```typescript
// Priority 1: DevFlow AI SACA Rule
'Never recreate SACA components';

// Priority 2: IDE Rule
'Check for existing components';

// Result: 🟢 Complementary
// Both rules enforce component reuse
```

### Context Management

```typescript
// Priority 1: DevFlow AI Context Rule
'Use tiered documentation system';

// Priority 2: IDE Rule
'Check CONTEXT_ENTRY';

// Result: 🟢 Complementary
// IDE rule reinforces DevFlow's context system
```

### Workflow Management

```typescript
// Priority 1: DevFlow AI Workflow
'Follow tiered documentation';

// Priority 2: IDE Rule
'Document in WORKFLOW_RULES.md';

// Result: 🟡 Overlapping
// Use DevFlow's tiered system, reference in WORKFLOW_RULES.md
```

## Integration with Mission Control

The Mission Control Dashboard provides:

1. **Rule Source Overview**

   - Active rule sources
   - Priority levels
   - Conflict status

2. **Rule Analytics**

   - Rule adherence metrics
   - Conflict frequency
   - Override patterns

3. **Rule Management**
   - Source priority adjustment
   - Conflict resolution
   - Custom rule creation

## Best Practices

1. **Rule Addition**

   - Document new rules in appropriate tier
   - Check for existing similar rules
   - Specify priority level
   - Add to Mission Control tracking

2. **Conflict Resolution**

   - Follow priority system
   - Document overrides
   - Update affected documentation
   - Monitor in Mission Control

3. **Rule Maintenance**
   - Regular rule review
   - Remove outdated rules
   - Update priorities as needed
   - Keep documentation current

## Monetization Integration 💰

### Basic Tier (Free)

- Basic rule conflict detection
- Simple priority system
- Manual rule management

### Pro Tier ($29/month)

- Advanced conflict detection
- Automated rule harmonization
- Rule analytics dashboard
- Custom rule creation

### Enterprise Tier ($299/month)

- Custom rule engines
- Multi-IDE integration
- Team rule management
- Priority customization
- Custom analytics

## Next Steps

1. [ ] Set up rule monitoring in Mission Control
2. [ ] Create rule conflict detection system
3. [ ] Implement rule analytics tracking
4. [ ] Build custom rule creation interface

---

_"Rules don't restrict creativity; they channel it." - DevFlow AI™_
