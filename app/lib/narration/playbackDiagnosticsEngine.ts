import {
  playbackHealthMonitor,
} from "./playbackHealthMonitor";

import {
  playbackMetrics,
} from "./playbackMetrics";

import {
  playbackTelemetryEngine,
} from "./playbackTelemetryEngine";

import {
  playbackAnalyticsCollector,
} from "./playbackAnalyticsCollector";

type DiagnosticsResult = {
  generatedAt: number;

  status:
    | "healthy"
    | "warning"
    | "critical";

  healthScore: number;

  problems: string[];

  recommendations: string[];

  metrics: ReturnType<
    typeof playbackMetrics.getMetrics
  >;

  telemetry: ReturnType<
    typeof playbackTelemetryEngine.getPlaybackAnalytics
  >;
};

class PlaybackDiagnosticsEngine {
  runDiagnostics(): DiagnosticsResult {
    const health =
      playbackHealthMonitor.getHealthReport();

    const metrics =
      playbackMetrics.getMetrics();

    const telemetry =
      playbackTelemetryEngine.getPlaybackAnalytics();

    const problems: string[] = [];

    const recommendations: string[] =
      [];

    let status:
      | "healthy"
      | "warning"
      | "critical" =
      "healthy";

    if (
      health.totalBufferingEvents >= 5
    ) {
      problems.push(
        "High buffering frequency"
      );

      recommendations.push(
        "Increase prebuffer chunk count"
      );

      status = "warning";
    }

    if (
      health.healthScore < 60
    ) {
      problems.push(
        "Playback health degraded"
      );

      recommendations.push(
        "Trigger playback recovery"
      );

      status = "critical";
    }

    if (
      metrics.totalVoiceSwitches >= 10
    ) {
      recommendations.push(
        "Preload alternate voices"
      );
    }

    if (
      telemetry.averageChunkPlaybackTime <
      5
    ) {
      recommendations.push(
        "Increase chunk duration"
      );
    }

    return {
      generatedAt: Date.now(),

      status,

      healthScore:
        health.healthScore,

      problems,

      recommendations,

      metrics,

      telemetry,
    };
  }

  logDiagnostics() {
    const result =
      this.runDiagnostics();

    console.group(
      "Playback Diagnostics"
    );

    console.table(result);

    console.groupEnd();

    return result;
  }

  exportDiagnostics() {
    return JSON.stringify(
      this.runDiagnostics(),
      null,
      2
    );
  }

  generateFullReport() {
    return {
      diagnostics:
        this.runDiagnostics(),

      analytics:
        playbackAnalyticsCollector.generateReport(),
    };
  }
}

export const playbackDiagnosticsEngine =
  new PlaybackDiagnosticsEngine();