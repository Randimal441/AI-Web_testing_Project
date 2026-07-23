import React, { useState } from 'react';
import { Globe, PlayCircle, Info } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCreateScan } from '../../hooks/useScans';
import { isValidUrl } from '@autoqa/shared';

// ─────────────────────────────────────────────────────────────────────────────
// ScanForm Component
// Accepts a URL, validates it, and submits to the API.
// The actual scan is handled by the playwright-engine (future integration).
// ─────────────────────────────────────────────────────────────────────────────

export const ScanForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [urlError, setUrlError] = useState('');
  const { mutate: createScan, isPending } = useCreateScan();

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setUrlError('URL is required');
      return false;
    }
    if (!isValidUrl(value.trim())) {
      setUrlError('Please enter a valid URL (e.g. https://example.com)');
      return false;
    }
    setUrlError('');
    return true;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (urlError) validateUrl(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(url)) return;

    createScan(
      { url: url.trim(), label: label.trim() || undefined },
      {
        onSuccess: () => {
          setUrl('');
          setLabel('');
          setUrlError('');
        },
      },
    );
  };

  return (
    <Card id="scan-form-card" padding="md">
      <CardHeader
        title="New Scan"
        description="Enter a URL to queue an automated QA scan"
        icon={<Globe className="w-4 h-4" />}
      />

      <form
        id="scan-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Create new scan"
        className="space-y-4"
      >
        <Input
          id="scan-url-input"
          type="url"
          placeholder="https://your-website.com"
          value={url}
          onChange={handleUrlChange}
          onBlur={() => url && validateUrl(url)}
          error={urlError}
          label="Target URL"
          leftIcon={<Globe className="w-4 h-4" />}
          autoComplete="url"
          required
          aria-required="true"
        />

        <Input
          id="scan-label-input"
          type="text"
          placeholder="e.g. Production smoke test (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          label="Label"
          maxLength={100}
        />

        {/* Info notice */}
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-brand-600/10 border border-brand-500/15">
          <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Scans are queued with status <span className="text-amber-400 font-medium">pending</span>.
            The <span className="text-brand-300 font-medium">playwright-engine</span> will pick them
            up and execute autonomously (coming soon).
          </p>
        </div>

        <Button
          id="start-scan-btn"
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isPending}
          leftIcon={<PlayCircle className="w-5 h-5" />}
          className="w-full"
          aria-label="Queue scan"
        >
          {isPending ? 'Queueing Scan…' : 'Start Scan'}
        </Button>
      </form>
    </Card>
  );
};

export default ScanForm;
