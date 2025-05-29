import React from 'react';

export default function TailwindTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="bg-red-500 text-white p-10 mb-8 text-2xl font-bold rounded-lg">If you see this red box, Tailwind is working!</div>
      <h1 className="text-3xl font-bold text-primary mb-6">Tailwind CSS Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Color Tests */}
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Color Tests</h2>
          <div className="space-y-2">
            <div className="p-3 bg-primary text-primary-foreground rounded">Primary</div>
            <div className="p-3 bg-secondary text-secondary-foreground rounded">Secondary</div>
            <div className="p-3 bg-accent text-accent-foreground rounded">Accent</div>
            <div className="p-3 bg-muted text-muted-foreground rounded">Muted</div>
            <div className="p-3 bg-destructive text-white rounded">Destructive</div>
          </div>
        </div>
        
        {/* Typography Tests */}
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Typography Tests</h2>
          <div className="space-y-2">
            <p className="text-4xl font-bold">Heading 1</p>
            <p className="text-3xl font-bold">Heading 2</p>
            <p className="text-2xl font-bold">Heading 3</p>
            <p className="text-xl font-semibold">Heading 4</p>
            <p className="text-lg font-medium">Heading 5</p>
            <p className="text-base">Regular text</p>
            <p className="text-sm text-muted-foreground">Small muted text</p>
          </div>
        </div>
        
        {/* Spacing & Layout Tests */}
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Spacing & Layout</h2>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-primary rounded"></div>
              <div className="w-8 h-8 bg-secondary rounded"></div>
              <div className="w-8 h-8 bg-accent rounded"></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 bg-primary/20 rounded"></div>
              <div className="h-8 bg-primary/40 rounded"></div>
              <div className="h-8 bg-primary/60 rounded"></div>
              <div className="h-8 bg-primary/80 rounded"></div>
              <div className="h-8 bg-primary rounded"></div>
              <div className="h-8 bg-primary-foreground rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Border & Shadow Tests */}
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Borders & Shadows</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-sm">Rounded Small</div>
            <div className="p-4 border rounded-md">Rounded Medium</div>
            <div className="p-4 border rounded-lg">Rounded Large</div>
            <div className="p-4 border-2 border-primary rounded">Border Primary</div>
            <div className="p-4 shadow-sm rounded">Shadow Small</div>
            <div className="p-4 shadow-md rounded">Shadow Medium</div>
            <div className="p-4 shadow-lg rounded">Shadow Large</div>
          </div>
        </div>
        
        {/* Utility Classes */}
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Utility Classes</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <span>Centered with Flex</span>
              <span className="text-primary">→</span>
            </div>
            <div className="relative p-3 bg-muted rounded">
              <span>Relative Parent</span>
              <div className="absolute top-0 right-0 p-1 bg-primary text-primary-foreground text-xs rounded">
                Absolute Child
              </div>
            </div>
            <div className="p-3 bg-muted rounded truncate">
              This text is very long and should be truncated with an ellipsis when it reaches the end of its container
            </div>
          </div>
        </div>
        
        {/* Responsive Tests */}
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Responsive Tests</h2>
          <div className="space-y-4">
            <div className="p-3 bg-blue-100 sm:bg-green-100 md:bg-yellow-100 lg:bg-red-100 xl:bg-purple-100 rounded">
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                Resize the window to see changes
              </p>
            </div>
            <div className="hidden sm:block p-3 bg-muted rounded">
              Visible from SM up
            </div>
            <div className="hidden md:block p-3 bg-muted rounded">
              Visible from MD up
            </div>
            <div className="block md:hidden p-3 bg-muted rounded">
              Visible only on mobile
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-card rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Animation Test</h2>
        <div className="flex space-x-4">
          <div className="w-16 h-16 bg-primary rounded-full animate-pulse"></div>
          <div className="w-16 h-16 bg-secondary rounded-full animate-bounce"></div>
          <div className="w-16 h-16 bg-accent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}