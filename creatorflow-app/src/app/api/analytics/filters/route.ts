/**
 * Advanced Filters API Endpoint
 * Handle filter operations for analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdvancedFilters } from '@/lib/analytics/advanced-filters';

const advancedFilters = new AdvancedFilters();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    let responseData: any = {};

    switch (type) {
      case 'groups':
        responseData = {
          filterGroups: advancedFilters.getFilterGroups(),
          stats: advancedFilters.getFilterStats()
        };
        break;
      
      case 'presets':
        responseData = {
          presets: advancedFilters.getPresets(),
          stats: advancedFilters.getFilterStats()
        };
        break;
      
      case 'datePresets':
        responseData = {
          datePresets: advancedFilters.getDatePresets()
        };
        break;
      
      case 'all':
      default:
        responseData = {
          filterGroups: advancedFilters.getFilterGroups(),
          presets: advancedFilters.getPresets(),
          datePresets: advancedFilters.getDatePresets(),
          stats: advancedFilters.getFilterStats()
        };
        break;
    }

    return NextResponse.json({
      success: true,
      ...responseData
    });

  } catch (error) {
    console.error('Get filters error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get filters',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'createPreset':
        if (!data.name || !data.filters) {
          return NextResponse.json({
            success: false,
            message: 'Name and filters are required'
          }, { status: 400 });
        }

        const preset = advancedFilters.createPreset(data);
        return NextResponse.json({
          success: true,
          preset,
          message: 'Preset created successfully'
        });

      case 'updatePreset':
        if (!data.id) {
          return NextResponse.json({
            success: false,
            message: 'Preset ID is required'
          }, { status: 400 });
        }

        const updatedPreset = advancedFilters.updatePreset(data.id, data.updates);
        if (!updatedPreset) {
          return NextResponse.json({
            success: false,
            message: 'Preset not found'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          preset: updatedPreset,
          message: 'Preset updated successfully'
        });

      case 'deletePreset':
        if (!data.id) {
          return NextResponse.json({
            success: false,
            message: 'Preset ID is required'
          }, { status: 400 });
        }

        const deleted = advancedFilters.deletePreset(data.id);
        if (!deleted) {
          return NextResponse.json({
            success: false,
            message: 'Preset not found'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          message: 'Preset deleted successfully'
        });

      case 'applyFilters':
        if (!data.filters || !data.data) {
          return NextResponse.json({
            success: false,
            message: 'Filters and data are required'
          }, { status: 400 });
        }

        const validation = advancedFilters.validateFilters(data.filters);
        if (!validation.valid) {
          return NextResponse.json({
            success: false,
            message: 'Invalid filters',
            errors: validation.errors
          }, { status: 400 });
        }

        const filteredData = advancedFilters.applyFilters(data.data, data.filters);
        return NextResponse.json({
          success: true,
          filteredData,
          originalCount: data.data.length,
          filteredCount: filteredData.length,
          message: 'Filters applied successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Filter operation error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Filter operation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
