'use client';

import { useState, FormEvent } from 'react';
import { Button, Input } from '@/components/ui';
import { isValidBarcode, sanitizeBarcode } from '@/lib/utils/validators';

interface ManualEntryProps {
  onSubmit: (barcode: string) => void;
  loading?: boolean;
}

export default function ManualEntry({ onSubmit, loading = false }: ManualEntryProps) {
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const sanitized = sanitizeBarcode(barcode);

    if (!sanitized) {
      setError('Please enter a barcode');
      return;
    }

    if (!isValidBarcode(sanitized)) {
      setError('Invalid barcode format. Please enter 8-14 digits.');
      return;
    }

    onSubmit(sanitized);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Barcode Number"
        placeholder="Enter barcode (e.g., 3017620422003)"
        value={barcode}
        onChange={(e) => {
          setBarcode(e.target.value);
          setError('');
        }}
        error={error}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={14}
        disabled={loading}
      />
      <Button type="submit" fullWidth loading={loading}>
        Search Product
      </Button>
    </form>
  );
}
