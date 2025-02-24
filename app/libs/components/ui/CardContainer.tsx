import styles from "./CardContainer.module.css";

type Props = {
  children: React.ReactNode;
};

export const CardContainer = ({ children }: Props) => {
  return (
    <div className={styles.topScreen}>
      <div className={styles.card}>
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
};
