import React from 'react';

interface AlertProps {
  message: string;
  type: 'error' | 'success';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  return (
    <div
      style={{
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: type === 'error' ? '#f8d7da' : '#d4edda',
        color: type === 'error' ? '#721c24' : '#155724',
        marginBottom: '10px',
      }}
    >
      {message}
    </div>
  );
};

export default Alert;