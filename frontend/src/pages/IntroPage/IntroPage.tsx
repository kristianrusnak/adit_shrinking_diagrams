import styles from './IntroPage.module.css';
import PixelBlast from './PixelBlast';
import TextType from './TextType';

export default function IntroPage() {
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
            pixelSize={6}
            color="#B19EEF"
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
        <div className={styles.changing_header_container}>
          <TextType
            text={["Shrinking UML diagrams", "Smaller is Better!", "Developed by OK team"]}
            typingSpeed={70}
            pauseDuration={5000}
            deletingSpeed={40}
            showCursor={true}
            cursorCharacter="_"
            className={styles.changing_header}
          />
        </div>
      </>
    );
}
