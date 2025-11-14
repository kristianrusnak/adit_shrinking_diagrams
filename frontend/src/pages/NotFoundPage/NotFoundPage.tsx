import FuzzyText from './FuzzyText';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <>
      <title>404 - Page Not Found</title>
      <div
      className={styles.not_found_page_container}
      >
        <FuzzyText
        baseIntensity={0.25}
        hoverIntensity={0.5}
        enableHover={true}
        >
          404
        </FuzzyText>
        <FuzzyText
          baseIntensity={0.25}
          hoverIntensity={0.5}
          enableHover={true}
          fontSize='80px'
        >
          Page Not Found
        </FuzzyText>
      </div>
    </>
  );
}
