import styles from './IntroPage.module.css';
import PixelBlast from './PixelBlast';
import BlurText from "./BlurText";

export default function IntroPage() {
  return (
    <>
      <title>Shrinking Diagrams</title>
      <div
        className={styles.pixel_blast_container}
      >
        <PixelBlast
          variant="circle"
          pixelSize={11}
          color="#63b3ed"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent={false}
        />
      </div>

      <BlurText
        text="Smaller is Better — Shrinking Diagrams"
        delay={300}
        animateBy="words"
        direction="top"
        className={styles.changing_header_container}
      />
      <BlurText
        text="Turn oversized UML into AI-ready insight. Our app prunes unimportant parts of your models so proprietary LLMs can reason on them—fast, cheap, and within context limits."
        delay={80}
        animateBy="words"
        direction="top"
        className={styles.changing_description_container}
      />
    </>
  );
}
