'use client';

import React, { useState } from 'react';
import {
  // Base Components
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Typography,
  Icon,
  IconButton,
  IconText,
  
  // Layout Components
  Container,
  Grid,
  GridItem,
  Stack,
  VStack,
  HStack,
  StackItem,
  Divider,
  
  // Feedback Components
  Alert,
  Badge,
  Progress,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonRectangle,
  SkeletonRounded,
  
  // Navigation Components
  Breadcrumb,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Pagination,
} from './index';

export default function ComponentDemo() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState('overview');
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Components', href: '/components' },
    { label: 'UI Library', href: '/components/ui' },
  ];

  const handleAlertDismiss = (id: string) => {
    setDismissedAlerts(prev => new Set(prev).add(id));
  };

  return (
    <Container size="xl" className="py-8">
      <VStack spacing={8}>
        {/* Header */}
        <div className="text-center">
          <Typography variant="h1" size="4xl" className="mb-4">
            CreatorFlow UI Component Library
          </Typography>
          <Typography variant="p" size="lg" color="muted">
            A comprehensive collection of accessible, customizable components built with Tailwind CSS
          </Typography>
        </div>

        {/* Breadcrumb Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Components</CardTitle>
            <CardDescription>Breadcrumbs, tabs, and pagination</CardDescription>
          </CardHeader>
          <CardContent>
            <VStack spacing={6}>
              <div>
                <Typography variant="h4" className="mb-3">Breadcrumb</Typography>
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Tabs</Typography>
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="components">Components</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <Typography>Overview content goes here...</Typography>
                  </TabsContent>
                  <TabsContent value="components">
                    <Typography>Components content goes here...</Typography>
                  </TabsContent>
                  <TabsContent value="examples">
                    <Typography>Examples content goes here...</Typography>
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Pagination</Typography>
                <Pagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={setCurrentPage}
                  maxVisiblePages={5}
                />
              </div>
            </VStack>
          </CardContent>
        </Card>

        {/* Base Components Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Base Components</CardTitle>
            <CardDescription>Fundamental building blocks</CardDescription>
          </CardHeader>
          <CardContent>
            <VStack spacing={6}>
              <div>
                <Typography variant="h4" className="mb-3">Buttons</Typography>
                <HStack spacing={3} wrap>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </HStack>
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Button Sizes</Typography>
                <HStack spacing={3} wrap>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </HStack>
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Button with Icons</Typography>
                <HStack spacing={3} wrap>
                  <Button leftIcon={<Icon name="Plus" />}>Add Item</Button>
                  <Button rightIcon={<Icon name="ArrowRight" />}>Continue</Button>
                  <Button loading>Loading</Button>
                </HStack>
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Input Fields</Typography>
                <VStack spacing={3} className="max-w-md">
                  <Input placeholder="Default input" />
                  <Input variant="outlined" placeholder="Outlined input" />
                  <Input variant="filled" placeholder="Filled input" />
                  <Input variant="minimal" placeholder="Minimal input" />
                  <Input
                    variant="outlined"
                    leftIcon={<Icon name="Search" />}
                    placeholder="Search..."
                    searchable
                  />
                  <Input
                    variant="outlined"
                    type="password"
                    placeholder="Password"
                    password
                  />
                </VStack>
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Typography</Typography>
                <VStack spacing={2}>
                  <H1>Heading 1</H1>
                  <H2>Heading 2</H2>
                  <H3>Heading 3</H3>
                  <H4>Heading 4</H4>
                  <P>This is a paragraph with regular text.</P>
                  <Typography variant="span" color="muted">Muted text</Typography>
                </VStack>
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Icons</Typography>
                <HStack spacing={4} wrap>
                  <Icon name="Heart" size="lg" color="error" />
                  <Icon name="Star" size="xl" color="warning" />
                  <Icon name="CheckCircle" size="2xl" color="success" />
                  <IconButton name="Settings" variant="outline" />
                  <IconText name="User" text="Profile" />
                </HStack>
              </div>
            </VStack>
          </CardContent>
        </Card>

        {/* Layout Components Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Layout Components</CardTitle>
            <CardDescription>Structure and organization</CardDescription>
          </CardHeader>
          <CardContent>
            <VStack spacing={6}>
              <div>
                <Typography variant="h4" className="mb-3">Grid System</Typography>
                <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={4}>
                  <GridItem>
                    <Card variant="outlined">
                      <CardContent className="p-4">
                        <Typography>Grid Item 1</Typography>
                      </CardContent>
                    </Card>
                  </GridItem>
                  <GridItem>
                    <Card variant="outlined">
                      <CardContent className="p-4">
                        <Typography>Grid Item 2</Typography>
                      </CardContent>
                    </Card>
                  </GridItem>
                  <GridItem>
                    <Card variant="outlined">
                      <CardContent className="p-4">
                        <Typography>Grid Item 3</Typography>
                      </CardContent>
                    </Card>
                  </GridItem>
                </Grid>
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Stack Layouts</Typography>
                <HStack spacing={6}>
                  <VStack spacing={3} className="flex-1">
                    <Typography variant="h5">Vertical Stack</Typography>
                    <Card variant="outlined">
                      <CardContent className="p-3">
                        <Typography>Item 1</Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined">
                      <CardContent className="p-3">
                        <Typography>Item 2</Typography>
                      </CardContent>
                    </Card>
                  </VStack>
                  
                  <VStack spacing={3} className="flex-1">
                    <Typography variant="h5">Horizontal Stack</Typography>
                    <HStack spacing={3}>
                      <Card variant="outlined">
                        <CardContent className="p-3">
                          <Typography>Left</Typography>
                        </CardContent>
                      </Card>
                      <Card variant="outlined">
                        <CardContent className="p-3">
                          <Typography>Right</Typography>
                        </CardContent>
                      </Card>
                    </HStack>
                  </VStack>
                </HStack>
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Dividers</Typography>
                <VStack spacing={4}>
                  <Divider />
                  <Divider variant="dashed" />
                  <Divider variant="dotted" />
                  <Divider withLabel labelContent="Section Break" />
                  <Divider orientation="vertical" className="h-20" />
                </VStack>
              </div>
            </VStack>
          </CardContent>
        </Card>

        {/* Feedback Components Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Components</CardTitle>
            <CardDescription>User feedback and status indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <VStack spacing={6}>
              <div>
                <Typography variant="h4" className="mb-3">Alerts</Typography>
                <VStack spacing={3}>
                  {!dismissedAlerts.has('info') && (
                    <Alert
                      variant="info"
                      title="Information"
                      description="This is an informational alert with a title and description."
                      dismissible
                      onDismiss={() => handleAlertDismiss('info')}
                    />
                  )}
                  {!dismissedAlerts.has('success') && (
                    <Alert
                      variant="success"
                      title="Success!"
                      description="Operation completed successfully."
                      dismissible
                      onDismiss={() => handleAlertDismiss('success')}
                    />
                  )}
                  {!dismissedAlerts.has('warning') && (
                    <Alert
                      variant="warning"
                      title="Warning"
                      description="Please review your input before proceeding."
                      dismissible
                      onDismiss={() => handleAlertDismiss('warning')}
                    />
                  )}
                  {!dismissedAlerts.has('error') && (
                    <Alert
                      variant="error"
                      title="Error"
                      description="Something went wrong. Please try again."
                      dismissible
                      onDismiss={() => handleAlertDismiss('error')}
                    />
                  )}
                </VStack>
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Badges</Typography>
                <HStack spacing={3} wrap>
                  <Badge>Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge dismissible onDismiss={() => console.log('Dismissed')}>
                    Dismissible
                  </Badge>
                </HStack>
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Progress Bars</Typography>
                <VStack spacing={4} className="max-w-md">
                  <Progress value={25} label="Basic Progress" />
                  <Progress value={50} variant="success" label="Success Progress" />
                  <Progress value={75} variant="warning" label="Warning Progress" />
                  <Progress value={90} variant="error" label="Error Progress" />
                  <Progress
                    value={60}
                    variant="info"
                    label="Animated Progress"
                    animated
                    striped
                  />
                </VStack>
              </div>

              <div>
                <Typography variant="h4" className="mb-3">Skeletons</Typography>
                <VStack spacing={4}>
                  <HStack spacing={4}>
                    <SkeletonCircle size="lg" />
                    <VStack spacing={2} className="flex-1">
                      <SkeletonText lines={2} />
                    </VStack>
                  </HStack>
                  <SkeletonRectangle height={100} />
                  <SkeletonRounded height={60} />
                </VStack>
              </div>
            </VStack>
          </CardContent>
        </Card>

        {/* Container Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Container System</CardTitle>
            <CardDescription>Responsive width management</CardDescription>
          </CardHeader>
          <CardContent>
            <VStack spacing={4}>
              <Container size="sm" className="bg-muted p-4 rounded">
                <Typography>Small Container (max-w-3xl)</Typography>
              </Container>
              <Container size="md" className="bg-muted p-4 rounded">
                <Typography>Medium Container (max-w-4xl)</Typography>
              </Container>
              <Container size="lg" className="bg-muted p-4 rounded">
                <Typography>Large Container (max-w-6xl)</Typography>
              </Container>
              <Container size="xl" className="bg-muted p-4 rounded">
                <Typography>Extra Large Container (max-w-7xl)</Typography>
              </Container>
            </VStack>
          </CardContent>
        </Card>
      </VStack>
    </Container>
  );
}
