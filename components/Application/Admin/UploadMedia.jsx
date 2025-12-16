"use client"
import { Button } from '@/components/ui/button';
import { CldUploadWidget } from 'next-cloudinary';
import { CloudUploadIcon } from 'lucide-react';
import axios from 'axios';
import { showToast } from '@/lib/showToast';

const UploadMedia = ({ isMultiple }) => {

    const handleOnError = (error) => {
        console.log(error);
    };

    const handleOnSuccess = async (result) => {
        const info = result.info;
        if (!info || !info.asset_id) return;

        const uploadedFile = {
            asset_id: info.asset_id,
            public_id: info.public_id,
            secure_url: info.secure_url,
            path: info.path,
            thumbnail_url: info.thumbnail_url || info.secure_url,
            title: info.original_filename,
            alt: info.original_filename
        };

        try {
            const { data: mediaUploadResponse } = await axios.post("/api/media/create", [uploadedFile])
            if (!mediaUploadResponse.success) {
                throw new Error(mediaUploadResponse.message)
            }
            showToast("Media Uploaded Successfully", mediaUploadResponse.message)
        } catch (error) {
            showToast(error.message, "error")
        }
    }


    return (
        <CldUploadWidget
            signatureEndpoint="/api/cloudinarySignature"
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onError={handleOnError}
            onSuccess={handleOnSuccess}
            config={{
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
            }}

            options={{
                multiple: isMultiple,
                sources: ['local', 'url', 'google_drive', 'unplash', 'dropbox']
            }}
        >
            {({ open }) => {
                return (
                    <Button onClick={() => open()}>
                        Upload Media
                        <CloudUploadIcon />
                    </Button>
                );
            }}
        </CldUploadWidget>
    );
};

export default UploadMedia;
