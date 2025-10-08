import React from 'react';
import styles from './Loading.module.css';

interface SpinnerProps {
  isLoading: boolean;
}

const Loading: React.FC<SpinnerProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loading;
