/**
 * Help System Testing Suite
 * Comprehensive tests for all help system components
 */

export interface TestResult {
  testName: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  duration: number;
  details?: any;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
  timestamp: string;
}

export class HelpSystemTester {
  private results: TestResult[] = [];

  async runAllTests(): Promise<TestSuite> {
    const startTime = Date.now();
    this.results = [];

    console.log('🧪 Starting Help System Tests...');

    // Test API endpoints
    await this.testHelpSearchAPI();
    await this.testTutorialsAPI();
    await this.testVideosAPI();
    await this.testEnterpriseAPI();
    await this.testOnboardingAPI();

    // Test UI components
    await this.testHelpArticles();
    await this.testTutorials();
    await this.testVideoLibrary();
    await this.testEnterpriseDocs();
    await this.testOnboardingProgress();

    // Test integrations
    await this.testSearchFunctionality();
    await this.testContextualTips();
    await this.testResponsiveDesign();

    const endTime = Date.now();
    const duration = endTime - startTime;

    const passedTests = this.results.filter(r => r.status === 'pass').length;
    const failedTests = this.results.filter(r => r.status === 'fail').length;
    const skippedTests = this.results.filter(r => r.status === 'skip').length;

    const testSuite: TestSuite = {
      name: 'Help System Test Suite',
      tests: this.results,
      totalTests: this.results.length,
      passedTests,
      failedTests,
      skippedTests,
      duration,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Test Suite Complete: ${passedTests}/${this.results.length} tests passed`);
    console.log(`⏱️  Total Duration: ${duration}ms`);

    return testSuite;
  }

  private async testHelpSearchAPI(): Promise<void> {
    const testName = 'Help Search API';
    const startTime = Date.now();

    try {
      const response = await fetch('/api/help/search?q=getting+started');
      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.articles)) {
        this.addResult({
          testName,
          status: 'pass',
          message: `API returned ${data.articles.length} articles`,
          duration: Date.now() - startTime,
          details: { articleCount: data.articles.length }
        });
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'API response invalid',
          duration: Date.now() - startTime,
          details: { response: data }
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `API request failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testTutorialsAPI(): Promise<void> {
    const testName = 'Tutorials API';
    const startTime = Date.now();

    try {
      const response = await fetch('/api/tutorials?featured=true');
      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.tutorials)) {
        this.addResult({
          testName,
          status: 'pass',
          message: `API returned ${data.tutorials.length} tutorials`,
          duration: Date.now() - startTime,
          details: { tutorialCount: data.tutorials.length }
        });
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'API response invalid',
          duration: Date.now() - startTime,
          details: { response: data }
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `API request failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testVideosAPI(): Promise<void> {
    const testName = 'Videos API';
    const startTime = Date.now();

    try {
      const response = await fetch('/api/videos?featured=true');
      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.videos)) {
        this.addResult({
          testName,
          status: 'pass',
          message: `API returned ${data.videos.length} videos`,
          duration: Date.now() - startTime,
          details: { videoCount: data.videos.length }
        });
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'API response invalid',
          duration: Date.now() - startTime,
          details: { response: data }
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `API request failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testEnterpriseAPI(): Promise<void> {
    const testName = 'Enterprise API';
    const startTime = Date.now();

    try {
      const response = await fetch('/api/enterprise?featured=true');
      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.docs)) {
        this.addResult({
          testName,
          status: 'pass',
          message: `API returned ${data.docs.length} enterprise docs`,
          duration: Date.now() - startTime,
          details: { docCount: data.docs.length }
        });
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'API response invalid',
          duration: Date.now() - startTime,
          details: { response: data }
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `API request failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testOnboardingAPI(): Promise<void> {
    const testName = 'Onboarding API';
    const startTime = Date.now();

    try {
      const response = await fetch('/api/onboarding/progress');
      const data = await response.json();

      if (response.ok && data.success && data.progress) {
        this.addResult({
          testName,
          status: 'pass',
          message: 'Onboarding API working correctly',
          duration: Date.now() - startTime,
          details: { 
            currentStep: data.currentStep?.id,
            progressPercentage: data.completionStats?.progressPercentage
          }
        });
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'Onboarding API response invalid',
          duration: Date.now() - startTime,
          details: { response: data }
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `Onboarding API request failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testHelpArticles(): Promise<void> {
    const testName = 'Help Articles Content';
    const startTime = Date.now();

    try {
      const response = await fetch('/api/help/search?q=getting+started');
      const data = await response.json();

      if (data.success && data.articles.length > 0) {
        const article = data.articles[0];
        const hasRequiredFields = article.id && article.title && article.content && article.category;
        
        if (hasRequiredFields) {
          this.addResult({
            testName,
            status: 'pass',
            message: 'Help articles have required fields',
            duration: Date.now() - startTime,
            details: { 
              articleId: article.id,
              title: article.title,
              category: article.category
            }
          });
        } else {
          this.addResult({
            testName,
            status: 'fail',
            message: 'Help articles missing required fields',
            duration: Date.now() - startTime,
            details: { article }
          });
        }
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'No help articles found',
          duration: Date.now() - startTime
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `Help articles test failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testTutorials(): Promise<void> {
    const testName = 'Tutorials Content';
    const startTime = Date.now();

    try {
      const response = await fetch('/api/tutorials?featured=true');
      const data = await response.json();

      if (data.success && data.tutorials.length > 0) {
        const tutorial = data.tutorials[0];
        const hasRequiredFields = tutorial.id && tutorial.title && tutorial.steps && Array.isArray(tutorial.steps);
        
        if (hasRequiredFields && tutorial.steps.length > 0) {
          this.addResult({
            testName,
            status: 'pass',
            message: `Tutorial has ${tutorial.steps.length} steps`,
            duration: Date.now() - startTime,
            details: { 
              tutorialId: tutorial.id,
              title: tutorial.title,
              stepCount: tutorial.steps.length
            }
          });
        } else {
          this.addResult({
            testName,
            status: 'fail',
            message: 'Tutorial missing required fields or steps',
            duration: Date.now() - startTime,
            details: { tutorial }
          });
        }
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'No tutorials found',
          duration: Date.now() - startTime
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `Tutorials test failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testVideoLibrary(): Promise<void> {
    const testName = 'Video Library Content';
    const startTime = Date.now();

    try {
      const response = await fetch('/api/videos?featured=true');
      const data = await response.json();

      if (data.success && data.videos.length > 0) {
        const video = data.videos[0];
        const hasRequiredFields = video.id && video.title && video.url && video.thumbnail && video.duration;
        
        if (hasRequiredFields) {
          this.addResult({
            testName,
            status: 'pass',
            message: `Video has all required fields (${video.duration}s duration)`,
            duration: Date.now() - startTime,
            details: { 
              videoId: video.id,
              title: video.title,
              duration: video.duration,
              category: video.category
            }
          });
        } else {
          this.addResult({
            testName,
            status: 'fail',
            message: 'Video missing required fields',
            duration: Date.now() - startTime,
            details: { video }
          });
        }
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'No videos found',
          duration: Date.now() - startTime
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `Video library test failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testEnterpriseDocs(): Promise<void> {
    const testName = 'Enterprise Documentation';
    const startTime = Date.now();

    try {
      const response = await fetch('/api/enterprise?featured=true');
      const data = await response.json();

      if (data.success && data.docs.length > 0) {
        const doc = data.docs[0];
        const hasRequiredFields = doc.id && doc.title && doc.content && doc.category && doc.audience;
        
        if (hasRequiredFields) {
          this.addResult({
            testName,
            status: 'pass',
            message: `Enterprise doc has all required fields (${doc.estimatedReadTime} min read)`,
            duration: Date.now() - startTime,
            details: { 
              docId: doc.id,
              title: doc.title,
              category: doc.category,
              audience: doc.audience,
              readTime: doc.estimatedReadTime
            }
          });
        } else {
          this.addResult({
            testName,
            status: 'fail',
            message: 'Enterprise doc missing required fields',
            duration: Date.now() - startTime,
            details: { doc }
          });
        }
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'No enterprise docs found',
          duration: Date.now() - startTime
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `Enterprise docs test failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testOnboardingProgress(): Promise<void> {
    const testName = 'Onboarding Progress Tracking';
    const startTime = Date.now();

    try {
      const response = await fetch('/api/onboarding/progress');
      const data = await response.json();

      if (data.success && data.progress) {
        const progress = data.progress;
        const hasRequiredFields = progress.userId && progress.currentStep && Array.isArray(progress.completedSteps);
        
        if (hasRequiredFields) {
          this.addResult({
            testName,
            status: 'pass',
            message: `Onboarding progress tracking working (${progress.progressPercentage}% complete)`,
            duration: Date.now() - startTime,
            details: { 
              userId: progress.userId,
              currentStep: progress.currentStep,
              completedSteps: progress.completedSteps.length,
              progressPercentage: progress.progressPercentage
            }
          });
        } else {
          this.addResult({
            testName,
            status: 'fail',
            message: 'Onboarding progress missing required fields',
            duration: Date.now() - startTime,
            details: { progress }
          });
        }
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'Onboarding progress API failed',
          duration: Date.now() - startTime,
          details: { response: data }
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `Onboarding progress test failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testSearchFunctionality(): Promise<void> {
    const testName = 'Search Functionality';
    const startTime = Date.now();

    try {
      // Test help search
      const helpResponse = await fetch('/api/help/search?q=ai');
      const helpData = await helpResponse.json();

      // Test tutorial search
      const tutorialResponse = await fetch('/api/tutorials?search=content');
      const tutorialData = await tutorialResponse.json();

      // Test video search
      const videoResponse = await fetch('/api/videos?search=getting');
      const videoData = await videoResponse.json();

      const allSearchesWorking = helpData.success && tutorialData.success && videoData.success;

      if (allSearchesWorking) {
        this.addResult({
          testName,
          status: 'pass',
          message: 'All search functionality working',
          duration: Date.now() - startTime,
          details: { 
            helpResults: helpData.articles?.length || 0,
            tutorialResults: tutorialData.tutorials?.length || 0,
            videoResults: videoData.videos?.length || 0
          }
        });
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'Some search functionality not working',
          duration: Date.now() - startTime,
          details: { 
            helpSuccess: helpData.success,
            tutorialSuccess: tutorialData.success,
            videoSuccess: videoData.success
          }
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `Search functionality test failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testContextualTips(): Promise<void> {
    const testName = 'Contextual Tips System';
    const startTime = Date.now();

    try {
      // Test if contextual tips component can be imported
      const tipsModule = await import('@/components/ui/contextual-tips');
      
      if (tipsModule.ContextualTips) {
        this.addResult({
          testName,
          status: 'pass',
          message: 'Contextual tips component available',
          duration: Date.now() - startTime,
          details: { componentName: 'ContextualTips' }
        });
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: 'Contextual tips component not found',
          duration: Date.now() - startTime
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `Contextual tips test failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testResponsiveDesign(): Promise<void> {
    const testName = 'Responsive Design';
    const startTime = Date.now();

    try {
      // Test if pages load without errors
      const pages = [
        '/support',
        '/tutorials',
        '/enterprise'
      ];

      const results = await Promise.allSettled(
        pages.map(page => fetch(`http://localhost:3001${page}`))
      );

      const successfulPages = results.filter(result => 
        result.status === 'fulfilled' && result.value.ok
      ).length;

      if (successfulPages === pages.length) {
        this.addResult({
          testName,
          status: 'pass',
          message: `All ${pages.length} help pages load successfully`,
          duration: Date.now() - startTime,
          details: { 
            pages: pages,
            successfulPages
          }
        });
      } else {
        this.addResult({
          testName,
          status: 'fail',
          message: `Only ${successfulPages}/${pages.length} pages load successfully`,
          duration: Date.now() - startTime,
          details: { 
            pages: pages,
            successfulPages,
            results: results.map(r => r.status)
          }
        });
      }
    } catch (error) {
      this.addResult({
        testName,
        status: 'fail',
        message: `Responsive design test failed: ${error}`,
        duration: Date.now() - startTime
      });
    }
  }

  private addResult(result: TestResult): void {
    this.results.push(result);
    console.log(`${result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⏭️'} ${result.testName}: ${result.message}`);
  }

  // Utility methods
  getResults(): TestResult[] {
    return [...this.results];
  }

  getPassedTests(): TestResult[] {
    return this.results.filter(r => r.status === 'pass');
  }

  getFailedTests(): TestResult[] {
    return this.results.filter(r => r.status === 'fail');
  }

  getSkippedTests(): TestResult[] {
    return this.results.filter(r => r.status === 'skip');
  }

  getTestSummary(): {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    passRate: number;
  } {
    const total = this.results.length;
    const passed = this.getPassedTests().length;
    const failed = this.getFailedTests().length;
    const skipped = this.getSkippedTests().length;
    const passRate = total > 0 ? (passed / total) * 100 : 0;

    return { total, passed, failed, skipped, passRate };
  }
}

// Export utility functions
export function createHelpSystemTester(): HelpSystemTester {
  return new HelpSystemTester();
}

export async function runHelpSystemTests(): Promise<TestSuite> {
  const tester = createHelpSystemTester();
  return await tester.runAllTests();
}
