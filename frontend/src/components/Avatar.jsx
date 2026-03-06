import { useState } from 'react';
import { MdPerson } from 'react-icons/md';

/**
 * Avatar – renders an <img>. If it fails to load, shows a person icon fallback.
 * Pass `className` and `style` exactly as you would to an <img>.
 */
const Avatar = ({ src, alt = '', className = '', style = {} }) => {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <div
        className={`avatar-fallback ${className}`}
        style={style}
        role="img"
        aria-label={alt}
      >
        <MdPerson />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setErr(true)}
    />
  );
};

export default Avatar;
