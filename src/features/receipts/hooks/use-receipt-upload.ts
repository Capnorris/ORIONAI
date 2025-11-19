import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { compressImage } from '../utils/compression';

export function useReceiptUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const uploadReceipt = async (file: File, userId: string): Promise<string | null> => {
        setUploading(true);
        setError(null);

        try {
            // 1. Compress
            const compressedBlob = await compressImage(file);
            const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });

            // 2. Upload
            const fileName = `${userId}/${Date.now()}_${compressedFile.name}`;
            const { data, error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(fileName, compressedFile);

            if (uploadError) {
                throw uploadError;
            }

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('receipts')
                .getPublicUrl(fileName);

            return publicUrl;

        } catch (err: any) {
            console.error('Receipt upload failed:', err);
            setError(err.message || 'Upload failed');
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadReceipt, uploading, error };
}
