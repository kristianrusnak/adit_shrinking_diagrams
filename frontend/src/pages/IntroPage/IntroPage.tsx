import styles from './IntroPage.module.css';
import PixelBlast from './PixelBlast';
import BlurText from "./BlurText";
import {useEffect} from "react";

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

export default function IntroPage() {
  useEffect(() => {
    document.title = "Shrinking Diagrams";
  }, []);

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -1
      }}>
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
        onAnimationComplete={handleAnimationComplete}
        className={styles.changing_header_container}
      />
      <BlurText
        text="Turn oversized UML into AI-ready insight. Our app prunes unimportant parts of your models so proprietary LLMs can reason on them—fast, cheap, and within context limits."
        delay={80}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className={styles.changing_description_container}
      />
    </>
  );
}
