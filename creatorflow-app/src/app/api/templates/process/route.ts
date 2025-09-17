/**
 * Template Processing API Endpoint
 * Process templates with variables
 */

import { NextRequest, NextResponse } from 'next/server';
import { TemplateEngine } from '@/lib/templates/template-engine';

const templateEngine = new TemplateEngine();

export async function POST(request: NextRequest) {
  try {
    const { templateId, variables } = await request.json();

    if (!templateId) {
      return NextResponse.json({
        success: false,
        message: 'Template ID is required'
      }, { status: 400 });
    }

    // Validate template variables
    const validation = templateEngine.validateTemplateVariables(templateId, variables || {});
    
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        message: 'Template validation failed',
        errors: validation.errors
      }, { status: 400 });
    }

    // Process template
    const processedContent = templateEngine.processTemplate(templateId, variables || {});
    const template = templateEngine.getTemplate(templateId);

    if (!template) {
      return NextResponse.json({
        success: false,
        message: 'Template not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      processedContent,
      template: {
        id: template.id,
        name: template.name,
        platform: template.platform,
        type: template.type
      },
      variables: template.variables,
      message: 'Template processed successfully'
    });

  } catch (error) {
    console.error('Process template error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to process template',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
