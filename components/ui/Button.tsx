import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-accent text-white hover:bg-accent-hover shadow-md hover:shadow-lg active:scale-95',
      secondary: 'bg-white text-foreground border-2 border-slate-300 hover:border-accent hover:text-accent shadow-sm hover:shadow-md active:scale-95',
      ghost: 'text-foreground hover:bg-slate-100 active:scale-95',
    };
    
    const sizes = {
      sm: 'h-10 px-5 text-sm rounded-lg',
      md: 'h-12 px-7 text-base rounded-lg',
      lg: 'h-14 px-9 text-lg rounded-xl',
    };
    
    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
    
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
