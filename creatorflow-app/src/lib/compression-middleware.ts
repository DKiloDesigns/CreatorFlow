import { NextRequest, NextResponse } from 'next/server';
import { gzip, deflate, brotliCompress } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const deflateAsync = promisify(deflate);
const brotliCompressAsync = promisify(brotliCompress);

export interface CompressionOptions {
  threshold?: number; // Minimum size to compress (in bytes)
  level?: number; // Compression level (1-9)
  types?: string[]; // Content types to compress
}

const defaultOptions: CompressionOptions = {
  threshold: 1024, // 1KB
  level: 6,
  types: [
    'application/json',
    'application/javascript',
    'application/xml',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/xml',
  ],
};

export function withCompression(options: CompressionOptions = {}) {
  const opts = { ...defaultOptions, ...options };

  return function (handler: (req: NextRequest) => Promise<NextResponse>) {
    return async function (req: NextRequest): Promise<NextResponse> {
      const response = await handler(req);

      // Check if response should be compressed
      if (!shouldCompress(response, opts)) {
        return response;
      }

      try {
        const body = await response.clone().text();
        
        // Check if body is large enough to compress
        if (body.length < opts.threshold!) {
          return response;
        }

        // Get the best compression method supported by the client
        const acceptEncoding = req.headers.get('accept-encoding') || '';
        const compressionMethod = getBestCompression(acceptEncoding);

        if (!compressionMethod) {
          return response;
        }

        // Compress the response
        const compressed = await compressBody(body, compressionMethod, opts.level!);
        
        // Create new response with compressed body
        const compressedResponse = new NextResponse(compressed, {
          status: response.status,
          statusText: response.statusText,
          headers: new Headers(response.headers),
        });

        // Set compression headers
        compressedResponse.headers.set('Content-Encoding', compressionMethod);
        compressedResponse.headers.set('Content-Length', compressed.length.toString());
        compressedResponse.headers.set('Vary', 'Accept-Encoding');
        compressedResponse.headers.set('X-Compression-Ratio', 
          (compressed.length / body.length).toFixed(2)
        );

        return compressedResponse;
      } catch (error) {
        console.error('Compression error:', error);
        return response; // Return original response if compression fails
      }
    };
  };
}

function shouldCompress(response: NextResponse, options: CompressionOptions): boolean {
  const contentType = response.headers.get('content-type') || '';
  
  // Check if content type should be compressed
  if (!options.types!.some(type => contentType.includes(type))) {
    return false;
  }

  // Check if already compressed
  if (response.headers.get('content-encoding')) {
    return false;
  }

  // Check if response is successful
  if (response.status < 200 || response.status >= 300) {
    return false;
  }

  return true;
}

function getBestCompression(acceptEncoding: string): string | null {
  if (acceptEncoding.includes('br')) {
    return 'br';
  }
  if (acceptEncoding.includes('gzip')) {
    return 'gzip';
  }
  if (acceptEncoding.includes('deflate')) {
    return 'deflate';
  }
  return null;
}

async function compressBody(
  body: string, 
  method: string, 
  level: number
): Promise<Buffer> {
  const buffer = Buffer.from(body, 'utf8');

  switch (method) {
    case 'br':
      return await brotliCompressAsync(buffer, { params: { [1]: level } });
    case 'gzip':
      return await gzipAsync(buffer, { level });
    case 'deflate':
      return await deflateAsync(buffer, { level });
    default:
      throw new Error(`Unsupported compression method: ${method}`);
  }
}

// Utility function to get compression stats
export function getCompressionStats(originalSize: number, compressedSize: number) {
  const ratio = compressedSize / originalSize;
  const savings = originalSize - compressedSize;
  const savingsPercent = ((savings / originalSize) * 100).toFixed(2);

  return {
    originalSize,
    compressedSize,
    ratio: ratio.toFixed(3),
    savings,
    savingsPercent: `${savingsPercent}%`,
  };
}
