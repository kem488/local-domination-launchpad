interface LoadTestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  concurrency: number;
  duration: number; // in seconds
  headers?: Record<string, string>;
  body?: any;
}

interface LoadTestResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  errors: string[];
  percentiles: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

interface StressTestMetrics {
  cpuUsage: number[];
  memoryUsage: number[];
  networkLatency: number[];
  errorRate: number;
  throughput: number;
}

class LoadTester {
  private results: number[] = [];
  private errors: string[] = [];
  private startTime: number = 0;

  // Simulate concurrent users
  async runLoadTest(config: LoadTestConfig): Promise<LoadTestResult> {
    console.log(`Starting load test: ${config.concurrency} concurrent users for ${config.duration}s`);
    
    this.results = [];
    this.errors = [];
    this.startTime = Date.now();
    
    const endTime = this.startTime + (config.duration * 1000);
    const promises: Promise<void>[] = [];

    // Create concurrent user sessions
    for (let i = 0; i < config.concurrency; i++) {
      promises.push(this.simulateUser(config, endTime));
    }

    await Promise.all(promises);
    
    return this.calculateResults();
  }

  // Simulate a single user's behavior
  private async simulateUser(config: LoadTestConfig, endTime: number): Promise<void> {
    while (Date.now() < endTime) {
      try {
        const startTime = performance.now();
        
        const response = await fetch(config.url, {
          method: config.method,
          headers: {
            'Content-Type': 'application/json',
            ...config.headers
          },
          body: config.body ? JSON.stringify(config.body) : undefined
        });

        const responseTime = performance.now() - startTime;
        this.results.push(responseTime);

        if (!response.ok) {
          this.errors.push(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Random delay between requests (0.5-2 seconds)
        await this.delay(500 + Math.random() * 1500);
        
      } catch (error) {
        this.errors.push(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  // Calculate test results
  private calculateResults(): LoadTestResult {
    const totalRequests = this.results.length;
    const successfulRequests = totalRequests - this.errors.length;
    const failedRequests = this.errors.length;
    
    if (totalRequests === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        requestsPerSecond: 0,
        errors: this.errors,
        percentiles: { p50: 0, p90: 0, p95: 0, p99: 0 }
      };
    }

    const sortedResults = [...this.results].sort((a, b) => a - b);
    const testDuration = (Date.now() - this.startTime) / 1000;

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: this.results.reduce((sum, time) => sum + time, 0) / totalRequests,
      minResponseTime: Math.min(...this.results),
      maxResponseTime: Math.max(...this.results),
      requestsPerSecond: totalRequests / testDuration,
      errors: [...new Set(this.errors)], // Remove duplicates
      percentiles: {
        p50: this.getPercentile(sortedResults, 50),
        p90: this.getPercentile(sortedResults, 90),
        p95: this.getPercentile(sortedResults, 95),
        p99: this.getPercentile(sortedResults, 99)
      }
    };
  }

  // Calculate percentile
  private getPercentile(sortedArray: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[index] || 0;
  }

  // Stress test the application
  async runStressTest(baseConfig: LoadTestConfig): Promise<StressTestMetrics> {
    console.log('Starting stress test with increasing load...');
    
    const metrics: StressTestMetrics = {
      cpuUsage: [],
      memoryUsage: [],
      networkLatency: [],
      errorRate: 0,
      throughput: 0
    };

    // Gradually increase load
    const loadLevels = [5, 10, 20, 50, 100];
    let totalErrors = 0;
    let totalRequests = 0;

    for (const concurrency of loadLevels) {
      console.log(`Testing with ${concurrency} concurrent users...`);
      
      const config = { ...baseConfig, concurrency, duration: 30 };
      const result = await this.runLoadTest(config);
      
      totalErrors += result.failedRequests;
      totalRequests += result.totalRequests;
      
      // Monitor system metrics
      metrics.networkLatency.push(result.averageResponseTime);
      metrics.cpuUsage.push(await this.getCPUUsage());
      metrics.memoryUsage.push(await this.getMemoryUsage());
      
      // Break if error rate is too high
      const currentErrorRate = result.failedRequests / result.totalRequests;
      if (currentErrorRate > 0.1) { // 10% error rate
        console.log(`High error rate detected (${currentErrorRate * 100}%), stopping stress test`);
        break;
      }
      
      // Wait between tests
      await this.delay(5000);
    }

    metrics.errorRate = totalErrors / totalRequests;
    metrics.throughput = totalRequests / (loadLevels.length * 30); // Average RPS
    
    return metrics;
  }

  // Monitor CPU usage (approximation)
  private async getCPUUsage(): Promise<number> {
    const start = performance.now();
    
    // Perform CPU-intensive task
    for (let i = 0; i < 10000; i++) {
      Math.random();
    }
    
    const duration = performance.now() - start;
    
    // Normalize to percentage (rough approximation)
    return Math.min(duration / 10, 100);
  }

  // Monitor memory usage
  private async getMemoryUsage(): Promise<number> {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    }
    return 0;
  }

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate load test report
  generateReport(result: LoadTestResult, config: LoadTestConfig): string {
    return `
LOAD TEST REPORT
================
Test Configuration:
- URL: ${config.url}
- Method: ${config.method}
- Concurrency: ${config.concurrency}
- Duration: ${config.duration}s

Results:
- Total Requests: ${result.totalRequests}
- Successful: ${result.successfulRequests}
- Failed: ${result.failedRequests}
- Success Rate: ${((result.successfulRequests / result.totalRequests) * 100).toFixed(2)}%

Performance:
- Average Response Time: ${result.averageResponseTime.toFixed(2)}ms
- Min Response Time: ${result.minResponseTime.toFixed(2)}ms
- Max Response Time: ${result.maxResponseTime.toFixed(2)}ms
- Requests/Second: ${result.requestsPerSecond.toFixed(2)}

Percentiles:
- 50th percentile: ${result.percentiles.p50.toFixed(2)}ms
- 90th percentile: ${result.percentiles.p90.toFixed(2)}ms
- 95th percentile: ${result.percentiles.p95.toFixed(2)}ms
- 99th percentile: ${result.percentiles.p99.toFixed(2)}ms

${result.errors.length > 0 ? `\nErrors:\n${result.errors.join('\n')}` : ''}
    `.trim();
  }
}

export const loadTester = new LoadTester();

// Predefined test configurations
export const testConfigs = {
  businessScan: {
    url: '/api/scan-business',
    method: 'POST' as const,
    concurrency: 10,
    duration: 60,
    body: {
      businessName: 'Test Business',
      location: 'London, UK'
    }
  },
  
  homepage: {
    url: '/',
    method: 'GET' as const,
    concurrency: 20,
    duration: 30
  },
  
  recommendations: {
    url: '/api/generate-recommendations',
    method: 'POST' as const,
    concurrency: 5,
    duration: 45,
    body: {
      scanId: 'test-scan-id'
    }
  }
};

// Easy-to-use test runner functions
export const runQuickLoadTest = () => loadTester.runLoadTest(testConfigs.homepage);
export const runBusinessScanTest = () => loadTester.runLoadTest(testConfigs.businessScan);
export const runStressTest = () => loadTester.runStressTest(testConfigs.homepage);