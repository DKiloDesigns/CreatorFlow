import { Counter, Histogram, Registry } from 'prom-client';

class MetricsRegistry {
  private registry: Registry;
  private counters: Map<string, Counter<string>>;
  private histograms: Map<string, Histogram<string>>;

  constructor() {
    this.registry = new Registry();
    this.counters = new Map();
    this.histograms = new Map();
  }

  counter(name: string, help: string, labelNames: string[] = []): Counter<string> {
    if (!this.counters.has(name)) {
      const counter = new Counter({
        name,
        help,
        labelNames,
        registers: [this.registry],
      });
      this.counters.set(name, counter);
    }
    return this.counters.get(name)!;
  }

  histogram(name: string, help: string, labelNames: string[] = []): Histogram<string> {
    if (!this.histograms.has(name)) {
      const histogram = new Histogram({
        name,
        help,
        labelNames,
        registers: [this.registry],
      });
      this.histograms.set(name, histogram);
    }
    return this.histograms.get(name)!;
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}

export const metrics = new MetricsRegistry(); 