import { useEffect } from "react";
import FuzzyText from './FuzzyText';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 Not Found";
  }, []);

  return (
    <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}>
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
  );
}
