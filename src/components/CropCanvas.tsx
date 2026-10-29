import React, { useState, useRef, useEffect } from 'react';
import { Crop, RotateCw, ZoomIn, ZoomOut, Check, Sliders, Sparkles, Image as ImageIcon } from 'lucide-react';

interface CropCanvasProps {
  imageSrc: string;
  onConfirmCrop: (croppedBase64: string) => void;
  onCancel?: () => void;
}

export const CropCanvas: React.FC<CropCanvasProps> = ({ imageSrc, onConfirmCrop, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [enhanceFilter, setEnhanceFilter] = useState<boolean>(true);

  // Crop box normalized coordinates (0 to 1)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0.1,
    y: 0.15,
    w: 0.8,
    h: 0.7,
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragMode, setDragMode] = useState<'move' | 'nw' | 'ne' | 'se' | 'sw' | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cropBoxAtDragStart, setCropBoxAtDragStart] = useState({ x: 0.1, y: 0.15, w: 0.8, h: 0.7 });

  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageObj(img);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Handle pointer down on crop box or handles
  const handlePointerDown = (e: React.PointerEvent, mode: 'move' | 'nw' | 'ne' | 'se' | 'sw') => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    setDragMode(mode);
    setDragStart({ x: e.clientX, y: e.clientY });
    setCropBoxAtDragStart({ ...cropBox });
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !containerRef.current || !dragMode) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = (e.clientX - dragStart.x) / rect.width;
      const dy = (e.clientY - dragStart.y) / rect.height;

      const initial = cropBoxAtDragStart;

      if (dragMode === 'move') {
        const newX = Math.max(0, Math.min(1 - initial.w, initial.x + dx));
        const newY = Math.max(0, Math.min(1 - initial.h, initial.y + dy));
        setCropBox((prev) => ({ ...prev, x: newX, y: newY }));
      } else if (dragMode === 'se') {
        const newW = Math.max(0.1, Math.min(1 - initial.x, initial.w + dx));
        const newH = Math.max(0.1, Math.min(1 - initial.y, initial.h + dy));
        setCropBox((prev) => ({ ...prev, w: newW, h: newH }));
      } else if (dragMode === 'sw') {
        const rawX = initial.x + dx;
        const newX = Math.max(0, Math.min(initial.x + initial.w - 0.1, rawX));
        const newW = initial.w + (initial.x - newX);
        const newH = Math.max(0.1, Math.min(1 - initial.y, initial.h + dy));
        setCropBox({ x: newX, y: initial.y, w: newW, h: newH });
      } else if (dragMode === 'nw') {
        const rawX = initial.x + dx;
        const newX = Math.max(0, Math.min(initial.x + initial.w - 0.1, rawX));
        const newW = initial.w + (initial.x - newX);
        const rawY = initial.y + dy;
        const newY = Math.max(0, Math.min(initial.y + initial.h - 0.1, rawY));
        const newH = initial.h + (initial.y - newY);
        setCropBox({ x: newX, y: newY, w: newW, h: newH });
      } else if (dragMode === 'ne') {
        const newW = Math.max(0.1, Math.min(1 - initial.x, initial.w + dx));
        const rawY = initial.y + dy;
        const newY = Math.max(0, Math.min(initial.y + initial.h - 0.1, rawY));
        const newH = initial.h + (initial.y - newY);
        setCropBox({ x: initial.x, y: newY, w: newW, h: newH });
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDragMode(null);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, dragMode, dragStart, cropBoxAtDragStart]);

  // Render crop export
  const handleExecuteCrop = () => {
    if (!imageObj) return;

    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Calculate source rect relative to image orientation
    const naturalW = imageObj.naturalWidth;
    const naturalH = imageObj.naturalHeight;

    const cropPixelX = cropBox.x * naturalW;
    const cropPixelY = cropBox.y * naturalH;
    const cropPixelW = cropBox.w * naturalW;
    const cropPixelH = cropBox.h * naturalH;

    exportCanvas.width = cropPixelW;
    exportCanvas.height = cropPixelH;

    if (enhanceFilter) {
      ctx.filter = 'contrast(1.25) brightness(1.05) saturate(1.1)';
    }

    ctx.drawImage(
      imageObj,
      cropPixelX,
      cropPixelY,
      cropPixelW,
      cropPixelH,
      0,
      0,
      cropPixelW,
      cropPixelH
    );

    const base64 = exportCanvas.toDataURL('image/jpeg', 0.92);
    onConfirmCrop(base64);
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl border border-slate-800">
      {/* Header and Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Crop className="w-5 h-5 text-indigo-400" />
            Soru Kırpma ve Odaklama Arayüzü
          </h3>
          <p className="text-xs text-slate-400">
            Kutuyu sürükleyerek veya köşelerinden tutarak çözülmesini istediğin soruyu çerçeve içine al.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition text-xs flex items-center gap-1.5"
            title="90° Döndür"
          >
            <RotateCw className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Döndür</span>
          </button>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
            title="Uzaklaştır"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-400 px-1">{Math.round(zoom * 100)}%</span>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
            title="Yakınlaştır"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => setEnhanceFilter((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              enhanceFilter
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{enhanceFilter ? 'OCR Filtresi Aktif' : 'Normal'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Crop Viewport */}
      <div className="my-5 flex items-center justify-center overflow-hidden bg-slate-950/80 rounded-xl p-4 border border-slate-800 min-h-[380px] max-h-[520px]">
        <div
          ref={containerRef}
          className="relative inline-block select-none shadow-2xl"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease',
          }}
        >
          {/* Base Image */}
          <img
            src={imageSrc}
            alt="Kırpılacak soru"
            className="max-h-[440px] max-w-full block rounded-lg pointer-events-none object-contain"
            style={{
              filter: enhanceFilter ? 'contrast(1.2) brightness(1.05)' : 'none',
            }}
          />

          {/* Semi-transparent dark overlay */}
          <div className="absolute inset-0 pointer-events-none bg-black/50" />

          {/* Highlighted Crop Area Box */}
          <div
            className="absolute border-2 border-indigo-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] cursor-move transition-shadow"
            style={{
              left: `${cropBox.x * 100}%`,
              top: `${cropBox.y * 100}%`,
              width: `${cropBox.w * 100}%`,
              height: `${cropBox.h * 100}%`,
            }}
            onPointerDown={(e) => handlePointerDown(e, 'move')}
          >
            {/* Grid Lines inside crop box for alignment */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-indigo-400/30">
              <div className="border-r border-b border-indigo-400/20" />
              <div className="border-r border-b border-indigo-400/20" />
              <div className="border-b border-indigo-400/20" />
              <div className="border-r border-b border-indigo-400/20" />
              <div className="border-r border-b border-indigo-400/20" />
              <div className="border-b border-indigo-400/20" />
              <div className="border-r border-indigo-400/20" />
              <div className="border-r border-indigo-400/20" />
              <div />
            </div>

            {/* Corner Resize Handles */}
            <div
              className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm cursor-nwse-resize shadow"
              onPointerDown={(e) => handlePointerDown(e, 'nw')}
            />
            <div
              className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm cursor-nesw-resize shadow"
              onPointerDown={(e) => handlePointerDown(e, 'ne')}
            />
            <div
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm cursor-nesw-resize shadow"
              onPointerDown={(e) => handlePointerDown(e, 'sw')}
            />
            <div
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm cursor-nwse-resize shadow"
              onPointerDown={(e) => handlePointerDown(e, 'se')}
            />

            {/* Focal indicator tag */}
            <div className="absolute top-2 left-2 bg-indigo-600/90 text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded shadow pointer-events-none">
              Odaklanan Soru Alanı
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Otomatik gölge ve kontrast temizleme aktif
        </div>

        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              İptal / Farklı Görsel
            </button>
          )}

          <button
            type="button"
            onClick={handleExecuteCrop}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 text-sm"
          >
            <Check className="w-4 h-4" />
            Kırpmayı Onayla & OCR'a Gönder
          </button>
        </div>
      </div>
    </div>
  );
};
