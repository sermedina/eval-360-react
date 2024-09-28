import React from 'react';

interface AlertProps {
  message: string;
  type: 'error' | 'success';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  return (
    <div
  className={`p-3 rounded-md mb-2 ${
    type === 'error'
      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }`}
>
  {message}
</div>
  );
};

export default Alert;