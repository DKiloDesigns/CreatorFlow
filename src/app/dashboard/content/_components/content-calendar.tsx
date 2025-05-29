const classes = {
  // ... existing class definitions ...
} as const;

type ContentItem = {
  id: string;
  title: string;
  content: string;
  scheduledAt: Date;
};

// Remove unused contentText variable
// const contentText = content.content;

// ... existing code ... 