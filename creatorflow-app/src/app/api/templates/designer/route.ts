/**
 * Template Designer API Endpoint
 * Handle template creation and management requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { TemplateDesigner } from '@/lib/templates/template-designer';

const templateDesigner = new TemplateDesigner();

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'create_template':
        if (!data.name || !data.platform || !data.category || !data.dimensions || !data.elements) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: name, platform, category, dimensions, elements'
          }, { status: 400 });
        }

        const template = await templateDesigner.createTemplate(data);
        return NextResponse.json({
          success: true,
          data: template,
          message: 'Template created successfully'
        });

      case 'update_template':
        if (!data.templateId || !data.updates) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: templateId, updates'
          }, { status: 400 });
        }

        const updatedTemplate = await templateDesigner.updateTemplate(data.templateId, data.updates);
        return NextResponse.json({
          success: true,
          data: updatedTemplate,
          message: 'Template updated successfully'
        });

      case 'duplicate_template':
        if (!data.templateId || !data.newName) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: templateId, newName'
          }, { status: 400 });
        }

        const duplicatedTemplate = await templateDesigner.duplicateTemplate(data.templateId, data.newName);
        return NextResponse.json({
          success: true,
          data: duplicatedTemplate,
          message: 'Template duplicated successfully'
        });

      case 'get_template':
        if (!data.templateId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: templateId'
          }, { status: 400 });
        }

        const templateData = await templateDesigner.getTemplate(data.templateId);
        return NextResponse.json({
          success: true,
          data: templateData,
          message: 'Template retrieved successfully'
        });

      case 'get_templates_by_category':
        if (!data.category) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: category'
          }, { status: 400 });
        }

        const categoryTemplates = await templateDesigner.getTemplatesByCategory(data.category, data.platform);
        return NextResponse.json({
          success: true,
          data: categoryTemplates,
          message: 'Category templates retrieved successfully'
        });

      case 'get_templates_by_platform':
        if (!data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: platform'
          }, { status: 400 });
        }

        const platformTemplates = await templateDesigner.getTemplatesByPlatform(data.platform);
        return NextResponse.json({
          success: true,
          data: platformTemplates,
          message: 'Platform templates retrieved successfully'
        });

      case 'search_templates':
        const searchResults = await templateDesigner.searchTemplates(
          data.query || '',
          data.filters
        );
        return NextResponse.json({
          success: true,
          data: searchResults,
          message: 'Template search completed successfully'
        });

      case 'get_categories':
        const categories = await templateDesigner.getCategories();
        return NextResponse.json({
          success: true,
          data: categories,
          message: 'Categories retrieved successfully'
        });

      case 'get_assets':
        const assets = await templateDesigner.getAssets(data.type, data.category);
        return NextResponse.json({
          success: true,
          data: assets,
          message: 'Assets retrieved successfully'
        });

      case 'add_asset':
        if (!data.asset) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: asset'
          }, { status: 400 });
        }

        const newAsset = await templateDesigner.addAsset(data.asset);
        return NextResponse.json({
          success: true,
          data: newAsset,
          message: 'Asset added successfully'
        });

      case 'get_template_history':
        if (!data.templateId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: templateId'
          }, { status: 400 });
        }

        const history = await templateDesigner.getTemplateHistory(data.templateId);
        return NextResponse.json({
          success: true,
          data: history,
          message: 'Template history retrieved successfully'
        });

      case 'publish_template':
        if (!data.templateId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: templateId'
          }, { status: 400 });
        }

        const publishedTemplate = await templateDesigner.publishTemplate(data.templateId, data.isPublic);
        return NextResponse.json({
          success: true,
          data: publishedTemplate,
          message: 'Template published successfully'
        });

      case 'delete_template':
        if (!data.templateId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: templateId'
          }, { status: 400 });
        }

        const deleted = await templateDesigner.deleteTemplate(data.templateId);
        return NextResponse.json({
          success: deleted,
          message: deleted ? 'Template deleted successfully' : 'Template not found'
        });

      case 'rate_template':
        if (!data.templateId || data.rating === undefined) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: templateId, rating'
          }, { status: 400 });
        }

        const ratedTemplate = await templateDesigner.rateTemplate(data.templateId, data.rating);
        return NextResponse.json({
          success: true,
          data: ratedTemplate,
          message: 'Template rated successfully'
        });

      case 'increment_usage':
        if (!data.templateId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: templateId'
          }, { status: 400 });
        }

        await templateDesigner.incrementUsage(data.templateId);
        return NextResponse.json({
          success: true,
          message: 'Usage incremented successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Template designer error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Template operation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
