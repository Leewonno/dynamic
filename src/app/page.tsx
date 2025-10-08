import { HomeNavigationWidget, HomeWelcomeWidget } from "@/widgets";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <HomeWelcomeWidget />
      </section>
      <section className={styles.section}>
        <HomeNavigationWidget />
      </section>
    </div>
  );
}
