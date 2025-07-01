'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Search,
  Filter,
  Star,
  Download,
  Edit,
  Copy,
  Heart,
  Share2,
  Calendar,
  Hash,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Sparkles
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'social' | 'marketing' | 'product' | 'event' | 'promotional';
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
  type: 'post' | 'story' | 'reel' | 'video' | 'carousel';
  tags: string[];
  preview: string;
  isPremium: boolean;
  isFavorite: boolean;
  usageCount: number;
  rating: number;
  variables: TemplateVariable[];
}

interface TemplateVariable {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'image' | 'color' | 'number';
  defaultValue: string;
  required: boolean;
  placeholder: string;
}

interface UseTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateUsed?: (templateData: any) => void;
}

export function UseTemplateModal({ open, onOpenChange, onTemplateUsed }: UseTemplateModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);

  // Sample templates
  const templates: Template[] = [
    {
      id: '1',
      name: 'Product Launch Announcement',
      description: 'Eye-catching template for announcing new products with compelling visuals and copy.',
      category: 'product',
      platform: 'instagram',
      type: 'post',
      tags: ['product', 'launch', 'announcement', 'marketing'],
      preview: '/api/templates/preview1.jpg',
      isPremium: false,
      isFavorite: true,
      usageCount: 1247,
      rating: 4.8,
      variables: [
        { id: 'product_name', name: 'Product Name', type: 'text', defaultValue: '', required: true, placeholder: 'Enter product name' },
        { id: 'product_description', name: 'Product Description', type: 'text', defaultValue: '', required: true, placeholder: 'Brief product description' },
        { id: 'product_image', name: 'Product Image', type: 'image', defaultValue: '', required: true, placeholder: 'Upload product image' },
        { id: 'cta_text', name: 'Call to Action', type: 'text', defaultValue: 'Shop Now', required: false, placeholder: 'Call to action text' },
        { id: 'brand_color', name: 'Brand Color', type: 'color', defaultValue: '#3B82F6', required: false, placeholder: 'Choose brand color' }
      ]
    },
    {
      id: '2',
      name: 'Behind the Scenes Story',
      description: 'Authentic template for sharing behind-the-scenes content that builds connection.',
      category: 'social',
      platform: 'instagram',
      type: 'story',
      tags: ['behind-scenes', 'authentic', 'connection', 'story'],
      preview: '/api/templates/preview2.jpg',
      isPremium: false,
      isFavorite: false,
      usageCount: 892,
      rating: 4.6,
      variables: [
        { id: 'behind_scenes_text', name: 'Behind the Scenes Text', type: 'text', defaultValue: '', required: true, placeholder: 'What\'s happening behind the scenes?' },
        { id: 'team_photo', name: 'Team Photo', type: 'image', defaultValue: '', required: true, placeholder: 'Upload team or process photo' },
        { id: 'emoji', name: 'Emoji', type: 'text', defaultValue: '✨', required: false, placeholder: 'Add relevant emoji' }
      ]
    },
    {
      id: '3',
      name: 'Event Promotion Video',
      description: 'Dynamic video template for promoting events with countdown and excitement.',
      category: 'event',
      platform: 'tiktok',
      type: 'video',
      tags: ['event', 'promotion', 'video', 'countdown'],
      preview: '/api/templates/preview3.jpg',
      isPremium: true,
      isFavorite: false,
      usageCount: 567,
      rating: 4.9,
      variables: [
        { id: 'event_name', name: 'Event Name', type: 'text', defaultValue: '', required: true, placeholder: 'Event name' },
        { id: 'event_date', name: 'Event Date', type: 'text', defaultValue: '', required: true, placeholder: 'Event date' },
        { id: 'event_location', name: 'Event Location', type: 'text', defaultValue: '', required: false, placeholder: 'Event location' },
        { id: 'event_image', name: 'Event Image', type: 'image', defaultValue: '', required: true, placeholder: 'Upload event image' },
        { id: 'ticket_link', name: 'Ticket Link', type: 'text', defaultValue: '', required: false, placeholder: 'Ticket purchase link' }
      ]
    },
    {
      id: '4',
      name: 'Customer Testimonial Post',
      description: 'Professional template for sharing customer testimonials and reviews.',
      category: 'marketing',
      platform: 'linkedin',
      type: 'post',
      tags: ['testimonial', 'customer', 'review', 'professional'],
      preview: '/api/templates/preview4.jpg',
      isPremium: false,
      isFavorite: true,
      usageCount: 2341,
      rating: 4.7,
      variables: [
        { id: 'customer_name', name: 'Customer Name', type: 'text', defaultValue: '', required: true, placeholder: 'Customer name' },
        { id: 'customer_title', name: 'Customer Title', type: 'text', defaultValue: '', required: false, placeholder: 'Customer job title' },
        { id: 'testimonial_text', name: 'Testimonial', type: 'text', defaultValue: '', required: true, placeholder: 'Customer testimonial' },
        { id: 'customer_photo', name: 'Customer Photo', type: 'image', defaultValue: '', required: false, placeholder: 'Customer photo' },
        { id: 'company_logo', name: 'Company Logo', type: 'image', defaultValue: '', required: false, placeholder: 'Customer company logo' }
      ]
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'social', label: 'Social' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'product', label: 'Product' },
    { value: 'event', label: 'Event' },
    { value: 'promotional', label: 'Promotional' }
  ];

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || template.platform === selectedPlatform;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesPlatform && matchesSearch;
  });

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    // Initialize variables with default values
    const initialVariables: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialVariables[variable.id] = variable.defaultValue;
    });
    setTemplateVariables(initialVariables);
  };

  const handleVariableChange = (variableId: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variableId]: value
    }));
  };

  const handleUseTemplate = async () => {
    if (!selectedTemplate) return;

    // Validate required variables
    const missingRequired = selectedTemplate.variables
      .filter(variable => variable.required && !templateVariables[variable.id])
      .map(variable => variable.name);

    if (missingRequired.length > 0) {
      toast.error(`Please fill in required fields: ${missingRequired.join(', ')}`);
      return;
    }

    setIsCreating(true);
    try {
      // Simulate template processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const templateData = {
        template: selectedTemplate,
        variables: templateVariables,
        createdAt: new Date().toISOString()
      };
      
      onTemplateUsed?.(templateData);
      toast.success(`Template "${selectedTemplate.name}" applied successfully!`);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to apply template');
    } finally {
      setIsCreating(false);
    }
  };

  const handleFavoriteToggle = (templateId: string) => {
    // In a real app, this would update the database
    toast.success('Favorite status updated');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Use Template</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col lg:flex-row gap-6 h-[85vh]">
          {/* Template Browser */}
          <div className="flex-1 flex flex-col">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Template Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {/* Template Preview */}
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Template Preview</p>
                      </div>
                    </div>
                    
                    {/* Template Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{template.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {template.isPremium && (
                            <Badge variant="secondary" className="text-xs">PRO</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(template.id);
                            }}
                          >
                            <Heart className={`h-4 w-4 ${template.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Tags and Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">{template.platform}</Badge>
                          <Badge variant="outline" className="text-xs">{template.type}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{template.rating}</span>
                          <span>•</span>
                          <span>{template.usageCount} uses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Template Customization */}
          {selectedTemplate && (
            <div className="w-full lg:w-96 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Customize Template</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Back to Browse
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4">
                {/* Template Preview */}
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Live Preview</p>
                  </div>
                </div>
                
                {/* Template Variables */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Customize Content</h4>
                  
                  {selectedTemplate.variables.map(variable => (
                    <div key={variable.id} className="space-y-2">
                      <Label className="text-sm">
                        {variable.name}
                        {variable.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      
                      {variable.type === 'text' && (
                        <Input
                          value={templateVariables[variable.id] || ''}
                          onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                          placeholder={variable.placeholder}
                          className="text-sm"
                        />
                      )}
                      
                      {variable.type === 'textarea' && (
                        <Textarea
                          value={templateVariables[variable.id] || ''}
                          onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                          placeholder={variable.placeholder}
                          className="text-sm"
                          rows={3}
                        />
                      )}
                      
                      {variable.type === 'color' && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={templateVariables[variable.id] || '#000000'}
                            onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            value={templateVariables[variable.id] || ''}
                            onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                            placeholder={variable.placeholder}
                            className="text-sm flex-1"
                          />
                        </div>
                      )}
                      
                      {variable.type === 'image' && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">{variable.placeholder}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Upload Image
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="pt-4 border-t space-y-2">
                <Button
                  onClick={handleUseTemplate}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use Template
                    </>
                  )}
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 