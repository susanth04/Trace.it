import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false, 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 border border-transparent",
    secondary: "bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/30 border border-transparent",
    outline: "bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10",
    ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-xl"
  };

  // Using inline styles for now to map to our CSS variables if Tailwind isn't fully set up, 
  // but the classNames suggest a Tailwind-like utility approach which we can support via index.css utilities 
  // or by mapping these classes to the variables we defined.
  // For this implementation, I will use style objects to ensure it works with the CSS variables I defined.

  const getStyle = () => {
    const style = {
      cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
      opacity: (disabled || isLoading) ? 0.6 : 1,
    };

    // Map variants to CSS variables
    if (variant === 'primary') {
      style.backgroundColor = 'var(--primary)';
      style.color = '#fff';
      style.border = 'none';
      style.boxShadow = 'var(--shadow-glow)';
    } else if (variant === 'secondary') {
      style.backgroundColor = 'var(--secondary)';
      style.color = '#fff';
      style.border = 'none';
    } else if (variant === 'outline') {
      style.backgroundColor = 'transparent';
      style.color = 'var(--primary)';
      style.border = '1px solid var(--primary)';
    } else if (variant === 'ghost') {
      style.backgroundColor = 'transparent';
      style.color = 'var(--text-muted)';
    }

    return style;
  };

  return (
    <button
      className={`btn ${variant} ${size} ${className}`}
      style={getStyle()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;
