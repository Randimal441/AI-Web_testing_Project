import { Schema, model, Document, Types } from 'mongoose';

// ─────────────────────────────────────────────────────────────────────────────
// Scan — Mongoose Model
// ─────────────────────────────────────────────────────────────────────────────

// ── Sub-document interfaces ───────────────────────────────────────────────────
export interface IScanIssue {
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  selector?: string;
  screenshot?: string;
  pageUrl: string;
  timestamp: Date;
}

export interface IScanResult {
  totalPages: number;
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  issues: IScanIssue[];
  duration: number; // ms
}

// ── Main document interface ───────────────────────────────────────────────────
export interface IScan extends Document {
  _id: Types.ObjectId;
  url: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'cancelled';
  label?: string;
  result?: IScanResult;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── Sub-schemas ───────────────────────────────────────────────────────────────
const ScanIssueSchema = new Schema<IScanIssue>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'info'],
      required: true,
    },
    selector: { type: String },
    screenshot: { type: String },
    pageUrl: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true },
);

const ScanResultSchema = new Schema<IScanResult>(
  {
    totalPages: { type: Number, default: 0 },
    totalIssues: { type: Number, default: 0 },
    criticalCount: { type: Number, default: 0 },
    highCount: { type: Number, default: 0 },
    mediumCount: { type: Number, default: 0 },
    lowCount: { type: Number, default: 0 },
    infoCount: { type: Number, default: 0 },
    issues: { type: [ScanIssueSchema], default: [] },
    duration: { type: Number, default: 0 },
  },
  { _id: false },
);

// ── Main schema ───────────────────────────────────────────────────────────────
const ScanSchema = new Schema<IScan>(
  {
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      validate: {
        validator: (v: string) => {
          try {
            const url = new URL(v);
            return url.protocol === 'http:' || url.protocol === 'https:';
          } catch {
            return false;
          }
        },
        message: 'URL must be a valid http or https URL',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'passed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    label: { type: String, trim: true, maxlength: 100 },
    result: { type: ScanResultSchema },
    error: { type: String },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  {
    timestamps: true,      // adds createdAt, updatedAt
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Indexes ───────────────────────────────────────────────────────────────────
ScanSchema.index({ createdAt: -1 });
ScanSchema.index({ status: 1, createdAt: -1 });
ScanSchema.index({ url: 1 });

// ── Model ─────────────────────────────────────────────────────────────────────
export const Scan = model<IScan>('Scan', ScanSchema);
export default Scan;
