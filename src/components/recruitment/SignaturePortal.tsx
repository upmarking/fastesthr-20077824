import React, { useState, useCallback, useRef } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Upload, Crop, Trash2, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

interface SignaturePortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignatureReady: (signatureData: string) => void;
}

export function SignaturePortal({ isOpen, onClose, onSignatureReady }: SignaturePortalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'crop' | 'preview'>('upload');
  const [preview, setPreview] = useState<string | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result as string);
        setStep('crop');
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const removeBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    // Simple background removal logic: if pixel is close to white, make it transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Threshold for "white" - can be adjusted
      if (r > 200 && g > 200 && b > 200) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const generateCroppedImage = async () => {
    if (!image || !croppedAreaPixels) return;

    setProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = image;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const { x, y, width, height } = croppedAreaPixels;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not get canvas context');

      // Draw the cropped area
      ctx.drawImage(
        img,
        x, y, width, height,
        0, 0, width, height
      );

      // Remove background
      removeBackground(ctx, canvas);

      const finalImage = canvas.toDataURL('image/png');
      setPreview(finalImage);
      setStep('preview');
    } catch (err: any) {
      toast.error("Failed to process signature: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleFinish = () => {
    if (preview) {
      onSignatureReady(preview);
      onClose();
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setStep('upload');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <FileSignature className="h-5 w-5 text-primary" />
            Upload Legal Signature
          </DialogTitle>
          <DialogDescription className="text-xs">
            Upload your handwritten signature image. Signatures are processed locally and never stored as raw images.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-xl bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden relative">
          {step === 'upload' && (
            <div className="text-center p-8">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Click or drag image here</h3>
              <p className="text-xs text-muted-foreground mb-4">PNG, JPG or SVG (Max 5MB)</p>
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileChange}
                accept="image/*"
              />
              <Button variant="outline" size="sm" className="pointer-events-none">
                Browse Files
              </Button>
            </div>
          )}

          {step === 'crop' && image && (
            <div className="relative w-full h-[350px]">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={4 / 1} // Signature shape
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border shadow-lg flex items-center gap-4 z-10 w-[80%]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="zoom-range w-full"
                />
              </div>
            </div>
          )}

          {step === 'preview' && preview && (
            <div className="flex flex-col items-center justify-center p-8 w-full gap-6">
              <div className="p-4 bg-white border rounded shadow-inner w-full flex justify-center items-center min-h-[100px] relative overflow-hidden signature-checkerboard-bg">
                <img src={preview} alt="Signature Preview" className="max-h-[80px] object-contain" />
              </div>
              <p className="text-xs text-muted-foreground italic flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Background removed successfully
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 flex justify-between items-center sm:justify-between">
          <div>
            {step !== 'upload' && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {step === 'crop' && (
              <Button size="sm" onClick={generateCroppedImage} disabled={processing} className="gap-2">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crop className="h-4 w-4" />}
                Finalize Crop
              </Button>
            )}
            {step === 'preview' && (
              <Button size="sm" onClick={handleFinish} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <FileSignature className="h-4 w-4" />
                Use this Signature
              </Button>
            )}
          </div>
        </DialogFooter>

        <style dangerouslySetInnerHTML={{ __html: `
          .signature-checkerboard-bg {
            background-image: 
              linear-gradient(45deg, #f8fafc 25%, transparent 25%),
              linear-gradient(-45deg, #f8fafc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f8fafc 75%),
              linear-gradient(-45deg, transparent 75%, #f8fafc 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          }
        `}} />
      </DialogContent>
    </Dialog>
  );
}

import { FileSignature } from 'lucide-react';
