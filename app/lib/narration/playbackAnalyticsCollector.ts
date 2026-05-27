import {
  playbackTelemetryEngine,
} from "./playbackTelemetryEngine";

import {
  playbackMetrics,
} from "./playbackMetrics";

import {
  playbackHealthMonitor,
} from "./playbackHealthMonitor";

type AnalyticsReport = {
  generatedAt: number;

  metrics: ReturnType<
    typeof playbackMetrics.getMetrics
  >;

  health: ReturnType<
    typeof playbackHealthMonitor.getHealthReport
  >;

  telemetry: ReturnType<
    typeof playbackTelemetryEngine.getPlaybackAnalytics
  >;
};

class PlaybackAnalyticsCollector {
  generateReport(): AnalyticsReport {
    return {
      generatedAt: Date.now(),

      metrics:
        playbackMetrics.getMetrics(),

      health:
        playbackHealthMonitor.getHealthReport(),

      telemetry:
        playbackTelemetryEngine.getPlaybackAnalytics(),
    };
  }

  logReport() {
    const report =
      this.generateReport();

    console.group(
      "Playback Analytics Report"
    );

    console.table(report.metrics);

    console.table(report.health);

    console.table(report.telemetry);

    console.groupEnd();

    return report;
  }

  exportReport() {
    return JSON.stringify(
      this.generateReport(),
      null,
      2
    );
  }
}

export const playbackAnalyticsCollector =
  new PlaybackAnalyticsCollector();