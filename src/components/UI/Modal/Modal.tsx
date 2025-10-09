import type { FC, ReactNode } from "react";
import styles from "./Modal.module.css";

interface IModalProps {
  active: boolean;
  setActive: (arg: boolean) => void;
  children: ReactNode
}

const Modal: FC<IModalProps> = ({ active, setActive, children }) => {
  return (
    <div
      className={`${styles.modal} ${active ? styles.active : ""}`}
      onClick={() => setActive(false)}
    >
      <div
        className={styles.modal__content}
        onClick={(e) => e.stopPropagation()}
      >{children}</div>
    </div>
  );
};

export default Modal;
