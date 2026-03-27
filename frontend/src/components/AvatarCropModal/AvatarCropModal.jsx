import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { motion } from 'framer-motion';
import { MdClose, MdCameraAlt, MdZoomIn, MdZoomOut } from 'react-icons/md';
import './AvatarCropModal.scss';

// ── Helper: load image element ───────────────────────────────────────────────
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });

// ── Helper: canvas crop to Blob ──────────────────────────────────────────────
export const getCroppedBlob = async (imageSrc, croppedAreaPixels, quality = 0.92) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { x, y, width, height } = croppedAreaPixels;
  canvas.width  = width;
  canvas.height = height;
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
  );
};

// ── Component ────────────────────────────────────────────────────────────────
const AvatarCropModal = ({ imageSrc, fileName, onConfirm, onCancel }) => {
  const [crop,              setCrop]              = useState({ x: 0, y: 0 });
  const [zoom,              setZoom]              = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing,      setIsProcessing]      = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      const file = new File([blob], fileName || 'avatar.jpg', { type: 'image/jpeg' });
      onConfirm(file);
    } catch {
      onCancel();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      className="crop-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="crop-modal"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="crop-modal__header">
          <div className="crop-modal__header-left">
            <MdCameraAlt size={20} />
            <div>
              <div className="crop-modal__title">Adjust Profile Photo</div>
              <div className="crop-modal__subtitle">Drag · Pinch / scroll to zoom</div>
            </div>
          </div>
          <button className="crop-modal__close" onClick={onCancel} aria-label="Close">
            <MdClose size={18} />
          </button>
        </div>

        {/* ── Crop canvas ── */}
        <div className="crop-modal__canvas">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* ── Zoom slider ── */}
        <div className="crop-modal__zoom">
          <MdZoomOut size={18} />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="crop-modal__zoom-slider"
            aria-label="Zoom"
          />
          <MdZoomIn size={18} />
          <span className="crop-modal__zoom-label">{Math.round(zoom * 100)}%</span>
        </div>

        {/* ── Actions ── */}
        <div className="crop-modal__actions">
          <button
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            <MdCameraAlt size={16} />
            {isProcessing ? 'Processing…' : 'Crop & Use Photo'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AvatarCropModal;
