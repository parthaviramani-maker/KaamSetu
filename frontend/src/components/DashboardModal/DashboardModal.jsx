import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';

/**
 * Common modal wrapper for Dashboard tools (Topup, Transfer, Bank Link).
 * Uses global `.dash-modal-*` SCSS classes defined in Dashboard.scss.
 */
const DashboardModal = ({ 
  onClose, 
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  footerNode 
}) => {

  useEffect(() => {
    const handler = (e) => { 
      if (e.key === 'Escape') onClose(); 
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      className="dash-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="dash-modal-container"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Teal gradient via CSS class) */}
        <div className="dash-modal-header">
          <div className="modal-title-group">
            {Icon && <Icon size={42} />}
            <div>
              <h3>{title}</h3>
              {subtitle && <p>{subtitle}</p>}
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <MdClose size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="dash-modal-body">
          {children}
        </div>

        {/* Optional slim footer note */}
        {footerNode && (
          <div className="dash-modal-footer-note">
            {footerNode}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DashboardModal;
