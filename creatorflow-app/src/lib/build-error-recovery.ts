// Build error recovery system
import { createError, ErrorCodes, logError } from './error-handler';

interface BuildError {
  type: 'module_not_found' | 'compilation_error' | 'import_error' | 'type_error';
  message: string;
  file?: string;
  line?: number;
  column?: number;
  module?: string;
  originalError?: string;
}

export class BuildErrorRecovery {
  private static instance: BuildErrorRecovery;
  private errorCache = new Map<string, BuildError[]>();
  private recoveryAttempts = new Map<string, number>();

  private constructor() {}

  public static getInstance(): BuildErrorRecovery {
    if (!BuildErrorRecovery.instance) {
      BuildErrorRecovery.instance = new BuildErrorRecovery();
    }
    return BuildErrorRecovery.instance;
  }

  // Handle module not found errors
  public handleModuleNotFound(module: string, file?: string): BuildError {
    const error: BuildError = {
      type: 'module_not_found',
      message: `Module not found: ${module}`,
      module,
      file,
    };

    this.cacheError(module, error);
    this.attemptRecovery(module, error);
    
    return error;
  }

  // Handle compilation errors
  public handleCompilationError(message: string, file?: string, line?: number, column?: number): BuildError {
    const error: BuildError = {
      type: 'compilation_error',
      message,
      file,
      line,
      column,
    };

    this.cacheError(file || 'unknown', error);
    this.attemptRecovery(file || 'unknown', error);
    
    return error;
  }

  // Handle import errors
  public handleImportError(importPath: string, originalError: string, file?: string): BuildError {
    const error: BuildError = {
      type: 'import_error',
      message: `Failed to import ${importPath}: ${originalError}`,
      module: importPath,
      file,
      originalError,
    };

    this.cacheError(importPath, error);
    this.attemptRecovery(importPath, error);
    
    return error;
  }

  // Handle type errors
  public handleTypeError(message: string, file?: string, line?: number, column?: number): BuildError {
    const error: BuildError = {
      type: 'type_error',
      message,
      file,
      line,
      column,
    };

    this.cacheError(file || 'unknown', error);
    this.attemptRecovery(file || 'unknown', error);
    
    return error;
  }

  // Cache error for analysis
  private cacheError(key: string, error: BuildError): void {
    if (!this.errorCache.has(key)) {
      this.errorCache.set(key, []);
    }
    this.errorCache.get(key)!.push(error);
  }

  // Attempt recovery strategies
  private attemptRecovery(key: string, error: BuildError): void {
    const attempts = this.recoveryAttempts.get(key) || 0;
    this.recoveryAttempts.set(key, attempts + 1);

    if (attempts >= 3) {
      logError(createError.build(`Max recovery attempts reached for ${key}`), 'BuildRecovery');
      return;
    }

    switch (error.type) {
      case 'module_not_found':
        this.recoverModuleNotFound(error);
        break;
      case 'compilation_error':
        this.recoverCompilationError(error);
        break;
      case 'import_error':
        this.recoverImportError(error);
        break;
      case 'type_error':
        this.recoverTypeError(error);
        break;
    }
  }

  // Recovery strategies
  private recoverModuleNotFound(error: BuildError): void {
    if (!error.module) return;

    // Common module replacements
    const moduleReplacements: Record<string, string> = {
      '@mui/icons-material/Target': '@mui/icons-material/GpsFixed',
      '@mui/icons-material/Search': '@mui/icons-material/Search',
      './vendor-chunks/next-auth.js': 'next-auth',
      './4996.js': 'webpack-chunk',
    };

    const replacement = moduleReplacements[error.module];
    if (replacement) {
      console.log(`🔄 Build Recovery: Suggesting replacement for ${error.module} -> ${replacement}`);
    }
  }

  private recoverCompilationError(error: BuildError): void {
    // Common compilation error fixes
    if (error.message.includes('Duplicate export')) {
      console.log('🔄 Build Recovery: Duplicate export detected, check for duplicate imports');
    }
    
    if (error.message.includes('Cannot find module')) {
      console.log('🔄 Build Recovery: Module not found, check import paths and dependencies');
    }
    
    if (error.message.includes('Module parse failed')) {
      console.log('🔄 Build Recovery: Module parse failed, check syntax and file format');
    }
  }

  private recoverImportError(error: BuildError): void {
    if (!error.module) return;

    // Common import fixes
    if (error.module.includes('@mui/icons-material')) {
      console.log('🔄 Build Recovery: MUI icon import issue, check icon name and availability');
    }
    
    if (error.module.includes('vendor-chunks')) {
      console.log('🔄 Build Recovery: Vendor chunk issue, try clearing .next directory');
    }
  }

  private recoverTypeError(error: BuildError): void {
    // Common type error fixes
    if (error.message.includes('Property does not exist')) {
      console.log('🔄 Build Recovery: Property does not exist, check type definitions');
    }
    
    if (error.message.includes('Type is not assignable')) {
      console.log('🔄 Build Recovery: Type mismatch, check type compatibility');
    }
  }

  // Get error statistics
  public getErrorStats(): Record<string, any> {
    const stats: Record<string, any> = {
      totalErrors: 0,
      errorTypes: {},
      topErrors: [],
      recoveryAttempts: Object.fromEntries(this.recoveryAttempts),
    };

    for (const [key, errors] of this.errorCache) {
      stats.totalErrors += errors.length;
      
      for (const error of errors) {
        stats.errorTypes[error.type] = (stats.errorTypes[error.type] || 0) + 1;
      }
    }

    // Get top errors by frequency
    const errorCounts = new Map<string, number>();
    for (const errors of this.errorCache.values()) {
      for (const error of errors) {
        const key = `${error.type}:${error.message}`;
        errorCounts.set(key, (errorCounts.get(key) || 0) + 1);
      }
    }

    stats.topErrors = Array.from(errorCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([error, count]) => ({ error, count }));

    return stats;
  }

  // Clear error cache
  public clearCache(): void {
    this.errorCache.clear();
    this.recoveryAttempts.clear();
  }

  // Get recovery suggestions
  public getRecoverySuggestions(): string[] {
    const suggestions: string[] = [];
    const stats = this.getErrorStats();

    if (stats.errorTypes.module_not_found > 0) {
      suggestions.push('Check import paths and ensure all dependencies are installed');
      suggestions.push('Verify module names and case sensitivity');
    }

    if (stats.errorTypes.compilation_error > 0) {
      suggestions.push('Clear .next directory and rebuild');
      suggestions.push('Check for syntax errors and TypeScript issues');
    }

    if (stats.errorTypes.import_error > 0) {
      suggestions.push('Verify import statements and module availability');
      suggestions.push('Check for circular dependencies');
    }

    if (stats.errorTypes.type_error > 0) {
      suggestions.push('Check TypeScript type definitions');
      suggestions.push('Verify type compatibility and interfaces');
    }

    return suggestions;
  }
}

// Global instance
export const buildErrorRecovery = BuildErrorRecovery.getInstance();

// Utility functions
export function handleBuildError(error: any, context?: string): BuildError {
  const recovery = buildErrorRecovery;
  
  if (error.code === 'MODULE_NOT_FOUND') {
    return recovery.handleModuleNotFound(error.message, context);
  }
  
  if (error.message?.includes('Module parse failed')) {
    return recovery.handleCompilationError(error.message, context);
  }
  
  if (error.message?.includes('Cannot find module')) {
    return recovery.handleImportError(error.message, error.message, context);
  }
  
  if (error.message?.includes('Type error')) {
    return recovery.handleTypeError(error.message, context);
  }
  
  // Default to compilation error
  return recovery.handleCompilationError(error.message || 'Unknown build error', context);
}

// Build health check
export function checkBuildHealth(): { healthy: boolean; issues: string[] } {
  const stats = buildErrorRecovery.getErrorStats();
  const issues: string[] = [];
  
  if (stats.totalErrors > 10) {
    issues.push('High number of build errors detected');
  }
  
  if (stats.errorTypes.module_not_found > 5) {
    issues.push('Multiple module not found errors');
  }
  
  if (stats.errorTypes.compilation_error > 5) {
    issues.push('Multiple compilation errors');
  }
  
  return {
    healthy: issues.length === 0,
    issues,
  };
}
