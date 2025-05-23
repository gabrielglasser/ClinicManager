import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    icon,
    type = 'text',
    className = '',
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={`${styles.inputContainer} ${className}`}>
        <label className={styles.label}>{label}</label>
        <div className={`${styles.inputWrapper} ${error ? styles.error : ''}`}>
          {icon && <div className={styles.icon}>{icon}</div>}
          <input
            ref={ref}
            type={inputType}
            className={`${styles.input} ${icon ? styles.withIcon : ''}`}
            {...props}
          />
          {type === 'password' && (
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;