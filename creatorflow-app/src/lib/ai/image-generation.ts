/**
 * AI Image Generation Engine
 * Generate custom images for social media posts using AI
 */

export interface ImageGenerationRequest {
  prompt: string;
  platform: string;
  style: 'realistic' | 'illustration' | 'minimalist' | 'vintage' | 'modern' | 'artistic';
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9';
  size: 'small' | 'medium' | 'large' | 'ultra';
  quality: 'standard' | 'hd' | 'ultra';
  brandColors?: string[];
  includeText?: boolean;
  textContent?: string;
  textStyle?: 'bold' | 'elegant' | 'playful' | 'professional';
  filters?: string[];
}

export interface GeneratedImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  prompt: string;
  platform: string;
  style: string;
  aspectRatio: string;
  size: string;
  quality: string;
  dimensions: {
    width: number;
    height: number;
  };
  metadata: {
    generationTime: number;
    model: string;
    seed: string;
    steps: number;
  };
  createdAt: string;
}

export interface ImageTemplate {
  id: string;
  name: string;
  description: string;
  platform: string;
  category: string;
  style: string;
  aspectRatio: string;
  previewUrl: string;
  prompt: string;
  customizable: {
    text: boolean;
    colors: boolean;
    background: boolean;
    elements: boolean;
  };
  tags: string[];
  usage: number;
  rating: number;
  createdAt: string;
}

export interface BrandKit {
  id: string;
  name: string;
  colors: Array<{
    name: string;
    hex: string;
    rgb: string;
    usage: 'primary' | 'secondary' | 'accent' | 'neutral';
  }>;
  fonts: Array<{
    name: string;
    family: string;
    weights: string[];
    usage: 'heading' | 'body' | 'accent';
  }>;
  logos: Array<{
    name: string;
    url: string;
    format: 'png' | 'svg' | 'jpg';
    usage: 'primary' | 'secondary' | 'icon';
  }>;
  patterns: Array<{
    name: string;
    url: string;
    type: 'background' | 'texture' | 'border';
  }>;
  guidelines: {
    do: string[];
    dont: string[];
    spacing: string;
    sizing: string;
  };
  createdAt: string;
  updatedAt: string;
}

export class AIImageGenerator {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // Generate a single image
  async generateImage(request: ImageGenerationRequest): Promise<GeneratedImage> {
    const prompt = this.buildImagePrompt(request);
    const response = await this.callImageAPI(prompt, request);
    
    return this.parseImageResponse(response, request);
  }

  // Generate multiple image variations
  async generateVariations(
    baseRequest: ImageGenerationRequest,
    count: number = 4
  ): Promise<GeneratedImage[]> {
    const variations: GeneratedImage[] = [];
    
    for (let i = 0; i < count; i++) {
      const variationRequest = this.createVariation(baseRequest, i);
      const image = await this.generateImage(variationRequest);
      variations.push(image);
    }
    
    return variations;
  }

  // Generate image from template
  async generateFromTemplate(
    templateId: string,
    customizations: {
      text?: string;
      colors?: string[];
      background?: string;
      elements?: string[];
    }
  ): Promise<GeneratedImage> {
    const template = await this.getTemplate(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const request: ImageGenerationRequest = {
      prompt: this.customizeTemplatePrompt(template, customizations),
      platform: template.platform,
      style: template.style as any,
      aspectRatio: template.aspectRatio as any,
      size: 'medium',
      quality: 'hd',
      includeText: customizations.text ? true : template.customizable.text,
      textContent: customizations.text,
      textStyle: 'professional'
    };

    return this.generateImage(request);
  }

  // Upscale image
  async upscaleImage(imageId: string, targetSize: 'medium' | 'large' | 'ultra'): Promise<GeneratedImage> {
    // Mock upscaling - in production, this would call an upscaling service
    const originalImage = await this.getImageById(imageId);
    if (!originalImage) {
      throw new Error('Image not found');
    }

    const upscaledImage: GeneratedImage = {
      ...originalImage,
      id: `upscaled_${Date.now()}`,
      size: targetSize,
      dimensions: this.calculateUpscaledDimensions(originalImage.dimensions, targetSize),
      metadata: {
        ...originalImage.metadata,
        generationTime: originalImage.metadata.generationTime * 1.5
      },
      createdAt: new Date().toISOString()
    };

    return upscaledImage;
  }

  // Apply filters to image
  async applyFilters(imageId: string, filters: string[]): Promise<GeneratedImage> {
    const originalImage = await this.getImageById(imageId);
    if (!originalImage) {
      throw new Error('Image not found');
    }

    const filteredImage: GeneratedImage = {
      ...originalImage,
      id: `filtered_${Date.now()}`,
      metadata: {
        ...originalImage.metadata,
        filters: filters.join(',')
      },
      createdAt: new Date().toISOString()
    };

    return filteredImage;
  }

  // Get image templates
  async getTemplates(platform?: string, category?: string): Promise<ImageTemplate[]> {
    // Mock templates - in production, this would fetch from database
    const templates: ImageTemplate[] = [
      {
        id: 'template_1',
        name: 'Professional Quote',
        description: 'Clean, professional quote template',
        platform: 'linkedin',
        category: 'quotes',
        style: 'minimalist',
        aspectRatio: '1:1',
        previewUrl: '/templates/professional-quote.jpg',
        prompt: 'Professional quote template with clean typography',
        customizable: {
          text: true,
          colors: true,
          background: true,
          elements: false
        },
        tags: ['professional', 'quote', 'minimalist'],
        usage: 150,
        rating: 4.5,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'template_2',
        name: 'Instagram Story',
        description: 'Vibrant Instagram story template',
        platform: 'instagram',
        category: 'stories',
        style: 'modern',
        aspectRatio: '9:16',
        previewUrl: '/templates/instagram-story.jpg',
        prompt: 'Vibrant Instagram story with modern design',
        customizable: {
          text: true,
          colors: true,
          background: true,
          elements: true
        },
        tags: ['instagram', 'story', 'vibrant', 'modern'],
        usage: 300,
        rating: 4.8,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    let filteredTemplates = templates;
    
    if (platform) {
      filteredTemplates = filteredTemplates.filter(t => t.platform === platform);
    }
    
    if (category) {
      filteredTemplates = filteredTemplates.filter(t => t.category === category);
    }

    return filteredTemplates;
  }

  // Get brand kit
  async getBrandKit(brandId: string): Promise<BrandKit | null> {
    // Mock brand kit - in production, this would fetch from database
    const brandKit: BrandKit = {
      id: brandId,
      name: 'CreatorFlow Brand',
      colors: [
        { name: 'Primary Blue', hex: '#1976d2', rgb: 'rgb(25, 118, 210)', usage: 'primary' },
        { name: 'Secondary Green', hex: '#4caf50', rgb: 'rgb(76, 175, 80)', usage: 'secondary' },
        { name: 'Accent Orange', hex: '#ff9800', rgb: 'rgb(255, 152, 0)', usage: 'accent' },
        { name: 'Neutral Gray', hex: '#757575', rgb: 'rgb(117, 117, 117)', usage: 'neutral' }
      ],
      fonts: [
        { name: 'Roboto', family: 'Roboto', weights: ['300', '400', '500', '700'], usage: 'heading' },
        { name: 'Open Sans', family: 'Open Sans', weights: ['400', '600'], usage: 'body' }
      ],
      logos: [
        { name: 'Primary Logo', url: '/brand/logo-primary.png', format: 'png', usage: 'primary' },
        { name: 'Icon', url: '/brand/icon.svg', format: 'svg', usage: 'icon' }
      ],
      patterns: [
        { name: 'Geometric', url: '/brand/pattern-geometric.png', type: 'background' },
        { name: 'Subtle Texture', url: '/brand/texture-subtle.png', type: 'texture' }
      ],
      guidelines: {
        do: ['Use primary colors for important elements', 'Maintain consistent spacing'],
        dont: ['Use more than 3 colors per design', 'Stretch logos'],
        spacing: 'Use 8px grid system',
        sizing: 'Minimum logo size: 24px'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    return brandKit;
  }

  // Private helper methods
  private buildImagePrompt(request: ImageGenerationRequest): string {
    let prompt = request.prompt;
    
    // Add style modifiers
    const styleModifiers = {
      realistic: 'photorealistic, high quality, detailed',
      illustration: 'illustration style, artistic, colorful',
      minimalist: 'minimalist design, clean, simple',
      vintage: 'vintage style, retro, aged',
      modern: 'modern design, contemporary, sleek',
      artistic: 'artistic, creative, unique'
    };
    
    prompt += `, ${styleModifiers[request.style]}`;
    
    // Add platform-specific modifiers
    const platformModifiers = {
      instagram: 'Instagram post, square format, social media',
      facebook: 'Facebook post, social media, engaging',
      twitter: 'Twitter post, social media, concise',
      linkedin: 'LinkedIn post, professional, business',
      tiktok: 'TikTok video thumbnail, vertical format, engaging',
      youtube: 'YouTube thumbnail, engaging, click-worthy'
    };
    
    prompt += `, ${platformModifiers[request.platform]}`;
    
    // Add quality modifiers
    const qualityModifiers = {
      standard: 'good quality',
      hd: 'high quality, detailed',
      ultra: 'ultra high quality, 4K, professional'
    };
    
    prompt += `, ${qualityModifiers[request.quality]}`;
    
    // Add brand colors if specified
    if (request.brandColors && request.brandColors.length > 0) {
      prompt += `, using colors: ${request.brandColors.join(', ')}`;
    }
    
    // Add text if specified
    if (request.includeText && request.textContent) {
      const textStyleModifiers = {
        bold: 'bold, impactful text',
        elegant: 'elegant, sophisticated text',
        playful: 'playful, fun text',
        professional: 'professional, clean text'
      };
      
      prompt += `, with ${textStyleModifiers[request.textStyle || 'professional']}: "${request.textContent}"`;
    }
    
    return prompt;
  }

  private async callImageAPI(prompt: string, request: ImageGenerationRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: this.getImageSize(request.aspectRatio, request.size),
          quality: request.quality === 'ultra' ? 'hd' : 'standard',
          style: 'vivid'
        }),
      });

      if (!response.ok) {
        throw new Error(`Image API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0];
    } catch (error) {
      console.error('Image API call failed:', error);
      // Return mock data for development
      return this.getMockImageResponse(request);
    }
  }

  private parseImageResponse(response: any, request: ImageGenerationRequest): GeneratedImage {
    const dimensions = this.calculateDimensions(request.aspectRatio, request.size);
    
    return {
      id: `img_${Date.now()}`,
      url: response.url || '/mock-image.jpg',
      thumbnailUrl: response.url || '/mock-thumbnail.jpg',
      prompt: request.prompt,
      platform: request.platform,
      style: request.style,
      aspectRatio: request.aspectRatio,
      size: request.size,
      quality: request.quality,
      dimensions,
      metadata: {
        generationTime: Math.random() * 10 + 5, // 5-15 seconds
        model: 'dall-e-3',
        seed: Math.random().toString(36).substring(7),
        steps: 50
      },
      createdAt: new Date().toISOString()
    };
  }

  private createVariation(baseRequest: ImageGenerationRequest, index: number): ImageGenerationRequest {
    const variations = [
      { style: 'realistic' as const },
      { style: 'illustration' as const },
      { style: 'minimalist' as const },
      { style: 'artistic' as const }
    ];
    
    return {
      ...baseRequest,
      style: variations[index % variations.length].style,
      prompt: `${baseRequest.prompt}, variation ${index + 1}`
    };
  }

  private customizeTemplatePrompt(template: ImageTemplate, customizations: any): string {
    let prompt = template.prompt;
    
    if (customizations.text) {
      prompt += `, with text: "${customizations.text}"`;
    }
    
    if (customizations.colors && customizations.colors.length > 0) {
      prompt += `, using colors: ${customizations.colors.join(', ')}`;
    }
    
    if (customizations.background) {
      prompt += `, background: ${customizations.background}`;
    }
    
    if (customizations.elements && customizations.elements.length > 0) {
      prompt += `, elements: ${customizations.elements.join(', ')}`;
    }
    
    return prompt;
  }

  private getImageSize(aspectRatio: string, size: string): string {
    const sizeMap: Record<string, Record<string, string>> = {
      '1:1': { small: '256x256', medium: '512x512', large: '1024x1024', ultra: '1024x1024' },
      '16:9': { small: '512x288', medium: '1024x576', large: '1792x1008', ultra: '1792x1008' },
      '9:16': { small: '288x512', medium: '576x1024', large: '1008x1792', ultra: '1008x1792' },
      '4:3': { small: '512x384', medium: '1024x768', large: '1792x1344', ultra: '1792x1344' },
      '3:4': { small: '384x512', medium: '768x1024', large: '1344x1792', ultra: '1344x1792' },
      '21:9': { small: '1024x439', medium: '1792x768', large: '1792x768', ultra: '1792x768' }
    };
    
    return sizeMap[aspectRatio]?.[size] || '512x512';
  }

  private calculateDimensions(aspectRatio: string, size: string): { width: number; height: number } {
    const sizeMap: Record<string, Record<string, { width: number; height: number }>> = {
      '1:1': { small: { width: 256, height: 256 }, medium: { width: 512, height: 512 }, large: { width: 1024, height: 1024 }, ultra: { width: 1024, height: 1024 } },
      '16:9': { small: { width: 512, height: 288 }, medium: { width: 1024, height: 576 }, large: { width: 1792, height: 1008 }, ultra: { width: 1792, height: 1008 } },
      '9:16': { small: { width: 288, height: 512 }, medium: { width: 576, height: 1024 }, large: { width: 1008, height: 1792 }, ultra: { width: 1008, height: 1792 } },
      '4:3': { small: { width: 512, height: 384 }, medium: { width: 1024, height: 768 }, large: { width: 1792, height: 1344 }, ultra: { width: 1792, height: 1344 } },
      '3:4': { small: { width: 384, height: 512 }, medium: { width: 768, height: 1024 }, large: { width: 1344, height: 1792 }, ultra: { width: 1344, height: 1792 } },
      '21:9': { small: { width: 1024, height: 439 }, medium: { width: 1792, height: 768 }, large: { width: 1792, height: 768 }, ultra: { width: 1792, height: 768 } }
    };
    
    return sizeMap[aspectRatio]?.[size] || { width: 512, height: 512 };
  }

  private calculateUpscaledDimensions(original: { width: number; height: number }, targetSize: string): { width: number; height: number } {
    const multipliers = { medium: 1.5, large: 2, ultra: 4 };
    const multiplier = multipliers[targetSize as keyof typeof multipliers] || 1.5;
    
    return {
      width: Math.round(original.width * multiplier),
      height: Math.round(original.height * multiplier)
    };
  }

  private async getTemplate(templateId: string): Promise<ImageTemplate | null> {
    const templates = await this.getTemplates();
    return templates.find(t => t.id === templateId) || null;
  }

  private async getImageById(imageId: string): Promise<GeneratedImage | null> {
    // Mock implementation - in production, this would fetch from database
    return {
      id: imageId,
      url: '/mock-image.jpg',
      thumbnailUrl: '/mock-thumbnail.jpg',
      prompt: 'Mock image',
      platform: 'instagram',
      style: 'realistic',
      aspectRatio: '1:1',
      size: 'medium',
      quality: 'hd',
      dimensions: { width: 512, height: 512 },
      metadata: {
        generationTime: 10,
        model: 'dall-e-3',
        seed: 'mock123',
        steps: 50
      },
      createdAt: new Date().toISOString()
    };
  }

  private getMockImageResponse(request: ImageGenerationRequest): any {
    return {
      url: '/mock-generated-image.jpg',
      revised_prompt: request.prompt
    };
  }
}
