import { Scan } from '../models/Scan';
import { DashboardStats } from '../../../shared/src/types';

// ─────────────────────────────────────────────────────────────────────────────
// Stats Service — Dashboard Aggregations
// ─────────────────────────────────────────────────────────────────────────────

export const statsService = {
  /**
   * Retrieve aggregated statistics for the dashboard.
   * All data comes from real MongoDB aggregation pipelines — no fake data.
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const [statusCounts, issueStats] = await Promise.all([
      // ── Count scans grouped by status ──────────────────────────────────────
      Scan.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // ── Sum issues and average duration from completed scans ───────────────
      Scan.aggregate<{
        totalIssues: number;
        avgDuration: number;
      }>([
        {
          $match: {
            status: { $in: ['passed', 'failed'] },
            'result.totalIssues': { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            totalIssues: { $sum: '$result.totalIssues' },
            avgDuration: { $avg: '$result.duration' },
          },
        },
      ]),
    ]);

    // Map status counts into a lookup
    const statusMap = statusCounts.reduce<Record<string, number>>(
      (acc, { _id, count }) => ({ ...acc, [_id]: count }),
      {},
    );

    const issueData = issueStats[0] ?? { totalIssues: 0, avgDuration: 0 };

    const totalScans = Object.values(statusMap).reduce((s, c) => s + c, 0);

    return {
      totalScans,
      passedScans: statusMap['passed'] ?? 0,
      failedScans: statusMap['failed'] ?? 0,
      runningScans: statusMap['running'] ?? 0,
      pendingScans: statusMap['pending'] ?? 0,
      cancelledScans: statusMap['cancelled'] ?? 0,
      totalIssues: issueData.totalIssues,
      avgScanDuration: Math.round(issueData.avgDuration ?? 0),
    };
  },
};

export default statsService;
