/**
 * Toast Helper - Simple wrapper untuk shadcn toast
 * Biar gak ribet pake toast, syntax jadi simple
 */

import { toast } from "@/hooks/use-toast";

export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Fungsi helper buat trigger toast dengan syntax simple
 * 
 * @example
 * showToast('Berhasil!', 'success');
 * showToast('Gagal!', 'error');
 * showToast('Hati-hati!', 'warning');
 * showToast('Info penting', 'info');
 */
export function showToast(message: string, type: ToastType = 'info') {
  const config = {
    success: {
      title: '✓ Berhasil',
      variant: 'default' as const,
      className: 'bg-green-50 border-green-200 text-green-800',
    },
    error: {
      title: '✗ Gagal',
      variant: 'destructive' as const,
      className: 'bg-red-50 border-red-200 text-red-800',
    },
    warning: {
      title: '⚠ Peringatan',
      variant: 'default' as const,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    },
    info: {
      title: 'ℹ Info',
      variant: 'default' as const,
      className: 'bg-blue-50 border-blue-200 text-blue-800',
    },
  };

  const { title, variant, className } = config[type];

  toast({
    title,
    description: message,
    variant,
    className,
  });
}