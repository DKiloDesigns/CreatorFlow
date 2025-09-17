/**
 * Brand Kit Manager API Endpoint
 * Handle brand kit management requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { BrandKitManager } from '@/lib/brand/brand-kit-manager';

const brandKitManager = new BrandKitManager();

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'create_brand_kit':
        if (!data.name || !data.colors || !data.fonts || !data.logos) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: name, colors, fonts, logos'
          }, { status: 400 });
        }

        const brandKit = await brandKitManager.createBrandKit(data);
        return NextResponse.json({
          success: true,
          data: brandKit,
          message: 'Brand kit created successfully'
        });

      case 'get_brand_kit':
        if (!data.id) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: id'
          }, { status: 400 });
        }

        const brandKitData = await brandKitManager.getBrandKit(data.id);
        return NextResponse.json({
          success: true,
          data: brandKitData,
          message: 'Brand kit retrieved successfully'
        });

      case 'get_all_brand_kits':
        const allBrandKits = await brandKitManager.getAllBrandKits();
        return NextResponse.json({
          success: true,
          data: allBrandKits,
          message: 'All brand kits retrieved successfully'
        });

      case 'get_active_brand_kit':
        const activeBrandKit = await brandKitManager.getActiveBrandKit();
        return NextResponse.json({
          success: true,
          data: activeBrandKit,
          message: 'Active brand kit retrieved successfully'
        });

      case 'update_brand_kit':
        if (!data.id || !data.updates) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: id, updates'
          }, { status: 400 });
        }

        const updatedBrandKit = await brandKitManager.updateBrandKit(data.id, data.updates);
        return NextResponse.json({
          success: true,
          data: updatedBrandKit,
          message: 'Brand kit updated successfully'
        });

      case 'set_active_brand_kit':
        if (!data.id) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: id'
          }, { status: 400 });
        }

        const activeKit = await brandKitManager.setActiveBrandKit(data.id);
        return NextResponse.json({
          success: true,
          data: activeKit,
          message: 'Active brand kit set successfully'
        });

      case 'add_color':
        if (!data.brandKitId || !data.color) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: brandKitId, color'
          }, { status: 400 });
        }

        const newColor = await brandKitManager.addColor(data.brandKitId, data.color);
        return NextResponse.json({
          success: true,
          data: newColor,
          message: 'Color added successfully'
        });

      case 'add_font':
        if (!data.brandKitId || !data.font) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: brandKitId, font'
          }, { status: 400 });
        }

        const newFont = await brandKitManager.addFont(data.brandKitId, data.font);
        return NextResponse.json({
          success: true,
          data: newFont,
          message: 'Font added successfully'
        });

      case 'add_logo':
        if (!data.brandKitId || !data.logo) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: brandKitId, logo'
          }, { status: 400 });
        }

        const newLogo = await brandKitManager.addLogo(data.brandKitId, data.logo);
        return NextResponse.json({
          success: true,
          data: newLogo,
          message: 'Logo added successfully'
        });

      case 'add_pattern':
        if (!data.brandKitId || !data.pattern) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: brandKitId, pattern'
          }, { status: 400 });
        }

        const newPattern = await brandKitManager.addPattern(data.brandKitId, data.pattern);
        return NextResponse.json({
          success: true,
          data: newPattern,
          message: 'Pattern added successfully'
        });

      case 'add_icon':
        if (!data.brandKitId || !data.icon) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: brandKitId, icon'
          }, { status: 400 });
        }

        const newIcon = await brandKitManager.addIcon(data.brandKitId, data.icon);
        return NextResponse.json({
          success: true,
          data: newIcon,
          message: 'Icon added successfully'
        });

      case 'remove_asset':
        if (!data.brandKitId || !data.assetType || !data.assetId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: brandKitId, assetType, assetId'
          }, { status: 400 });
        }

        const removed = await brandKitManager.removeAsset(data.brandKitId, data.assetType, data.assetId);
        return NextResponse.json({
          success: removed,
          message: removed ? 'Asset removed successfully' : 'Asset not found'
        });

      case 'get_analytics':
        if (!data.brandKitId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: brandKitId'
          }, { status: 400 });
        }

        const analytics = await brandKitManager.getBrandKitAnalytics(data.brandKitId);
        return NextResponse.json({
          success: true,
          data: analytics,
          message: 'Brand kit analytics retrieved successfully'
        });

      case 'track_usage':
        if (!data.brandKitId || !data.templateId || !data.templateName || !data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: brandKitId, templateId, templateName, platform'
          }, { status: 400 });
        }

        await brandKitManager.trackUsage(data.brandKitId, data.templateId, data.templateName, data.platform);
        return NextResponse.json({
          success: true,
          message: 'Usage tracked successfully'
        });

      case 'export_brand_kit':
        if (!data.brandKitId || !data.format) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: brandKitId, format'
          }, { status: 400 });
        }

        const exportUrl = await brandKitManager.exportBrandKit(data.brandKitId, data.format);
        return NextResponse.json({
          success: true,
          data: { url: exportUrl },
          message: 'Brand kit exported successfully'
        });

      case 'import_brand_kit':
        if (!data.file) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: file'
          }, { status: 400 });
        }

        const importedBrandKit = await brandKitManager.importBrandKit(data.file);
        return NextResponse.json({
          success: true,
          data: importedBrandKit,
          message: 'Brand kit imported successfully'
        });

      case 'delete_brand_kit':
        if (!data.id) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: id'
          }, { status: 400 });
        }

        const deleted = await brandKitManager.deleteBrandKit(data.id);
        return NextResponse.json({
          success: deleted,
          message: deleted ? 'Brand kit deleted successfully' : 'Brand kit not found'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Brand kit manager error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Brand kit operation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
