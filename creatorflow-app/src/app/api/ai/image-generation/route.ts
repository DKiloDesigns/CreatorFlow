/**
 * AI Image Generation API Endpoint
 * Handle AI-powered image generation requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIImageGenerator } from '@/lib/ai/image-generation';

const imageGenerator = new AIImageGenerator(
  process.env.OPENAI_API_KEY || 'mock-key',
  process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
);

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'generate_image':
        if (!data.prompt || !data.platform || !data.style || !data.aspectRatio) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: prompt, platform, style, aspectRatio'
          }, { status: 400 });
        }

        const image = await imageGenerator.generateImage(data);
        return NextResponse.json({
          success: true,
          data: image,
          message: 'Image generated successfully'
        });

      case 'generate_variations':
        if (!data.prompt || !data.platform || !data.style || !data.aspectRatio) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: prompt, platform, style, aspectRatio'
          }, { status: 400 });
        }

        const variations = await imageGenerator.generateVariations(data, data.count || 4);
        return NextResponse.json({
          success: true,
          data: variations,
          message: 'Image variations generated successfully'
        });

      case 'generate_from_template':
        if (!data.templateId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: templateId'
          }, { status: 400 });
        }

        const templateImage = await imageGenerator.generateFromTemplate(
          data.templateId,
          data.customizations || {}
        );
        return NextResponse.json({
          success: true,
          data: templateImage,
          message: 'Image generated from template successfully'
        });

      case 'upscale_image':
        if (!data.imageId || !data.targetSize) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: imageId, targetSize'
          }, { status: 400 });
        }

        const upscaledImage = await imageGenerator.upscaleImage(data.imageId, data.targetSize);
        return NextResponse.json({
          success: true,
          data: upscaledImage,
          message: 'Image upscaled successfully'
        });

      case 'apply_filters':
        if (!data.imageId || !data.filters) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: imageId, filters'
          }, { status: 400 });
        }

        const filteredImage = await imageGenerator.applyFilters(data.imageId, data.filters);
        return NextResponse.json({
          success: true,
          data: filteredImage,
          message: 'Filters applied successfully'
        });

      case 'get_templates':
        const templates = await imageGenerator.getTemplates(data.platform, data.category);
        return NextResponse.json({
          success: true,
          data: templates,
          message: 'Templates retrieved successfully'
        });

      case 'get_brand_kit':
        if (!data.brandId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: brandId'
          }, { status: 400 });
        }

        const brandKit = await imageGenerator.getBrandKit(data.brandId);
        return NextResponse.json({
          success: true,
          data: brandKit,
          message: 'Brand kit retrieved successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('AI image generation error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Image generation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
