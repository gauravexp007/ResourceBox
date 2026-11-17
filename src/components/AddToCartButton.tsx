import React from 'react';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
  isAdded: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Animated Add to Cart button inspired by Uiverse "catraco/plastic-moth-91":
 * features a rotated translucent backing layer that straightens on hover,
 * subtle scale lift, and a sliding SVG icon.
 */
export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  isAdded,
  onClick,
  size = 'sm',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isAdded}
      aria-label={isAdded ? 'Remove from saved cart' : 'Add to cart'}
      className={`catraco-cart-btn ${isAdded ? 'is-added' : ''} ${
        size === 'md' ? 'catraco-cart-btn--md' : 'catraco-cart-btn--sm'
      } ${className}`}
    >
      <span className="catraco-cart-btn__inner">
        <span className="catraco-cart-btn__label">
          {isAdded ? 'SAVED IN CART' : 'ADD TO CART'}
        </span>
        <span className="catraco-cart-btn__icon" aria-hidden="true">
          {isAdded ? (
            <Check className="w-4 h-4 stroke-[2.75]" />
          ) : (
            <ShoppingCart className="w-4 h-4 stroke-[2.25]" />
          )}
        </span>
      </span>
    </button>
  );
};
