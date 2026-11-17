import React from 'react';

interface ViewDetailsButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  className?: string;
}

/**
 * Animated View Details button inspired by Uiverse "cssbuttons-io/massive-mayfly-74":
 * a circular arrow badge on the left smoothly expands across the button on hover
 * while sliding the arrow forward and inverting label contrast.
 */
export const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({
  onClick,
  label = 'View Details',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mayfly-details-btn ${className}`}
    >
      <span className="mayfly-circle" aria-hidden="true">
        <span className="mayfly-icon mayfly-arrow" />
      </span>
      <span className="mayfly-text">{label}</span>
    </button>
  );
};
