/**
 * Templates API Endpoint
 * Handle template CRUD operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { TemplateEngine } from '@/lib/templates/template-engine';

const templateEngine = new TemplateEngine();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters from query parameters
    const filters = {
      category: searchParams.get('category') || undefined,
      industry: searchParams.get('industry') || undefined,
      platform: searchParams.get('platform') || undefined,
      type: searchParams.get('type') as any || undefined,
      isPublic: searchParams.get('isPublic') === 'true' ? true : searchParams.get('isPublic') === 'false' ? false : undefined,
      isPremium: searchParams.get('isPremium') === 'true' ? true : searchParams.get('isPremium') === 'false' ? false : undefined,
      difficulty: searchParams.get('difficulty') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      author: searchParams.get('author') || undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      minDownloads: searchParams.get('minDownloads') ? parseInt(searchParams.get('minDownloads')!) : undefined,
      dateRange: searchParams.get('startDate') && searchParams.get('endDate') ? {
        start: searchParams.get('startDate')!,
        end: searchParams.get('endDate')!
      } : undefined
    };

    const templates = templateEngine.getTemplates(filters);
    const categories = templateEngine.getCategories();
    const industries = templateEngine.getIndustries();
    const stats = templateEngine.getTemplateStats();

    return NextResponse.json({
      success: true,
      templates,
      categories,
      industries,
      stats,
      total: templates.length
    });

  } catch (error) {
    console.error('Get templates error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get templates',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const templateData = await request.json();

    // Validate required fields
    if (!templateData.name || !templateData.category || !templateData.industry) {
      return NextResponse.json({
        success: false,
        message: 'Name, category, and industry are required'
      }, { status: 400 });
    }

    const template = templateEngine.createTemplate(templateData);

    return NextResponse.json({
      success: true,
      template,
      message: 'Template created successfully'
    });

  } catch (error) {
    console.error('Create template error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create template',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Template ID is required'
      }, { status: 400 });
    }

    const template = templateEngine.updateTemplate(id, updates);

    if (!template) {
      return NextResponse.json({
        success: false,
        message: 'Template not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      template,
      message: 'Template updated successfully'
    });

  } catch (error) {
    console.error('Update template error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update template',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Template ID is required'
      }, { status: 400 });
    }

    const success = templateEngine.deleteTemplate(id);

    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Template not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    });

  } catch (error) {
    console.error('Delete template error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to delete template',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
