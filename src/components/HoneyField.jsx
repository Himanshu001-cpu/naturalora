import Antigravity from "./Antigravity";

export default function HoneyField() {
  return (
    <div className="honey-field">
      <Antigravity
        count={120}                 // reduce density → premium, not noisy
        magnetRadius={6}            // softer cursor pull
        ringRadius={7.5}            // tighter field cohesion
        waveSpeed={0.15}            // slow, viscous motion (important)
        waveAmplitude={0.4}         // subtle movement, not chaotic
        particleSize={1}            // smaller = more refined
        lerpSpeed={0.04}            // slow response → “under surface” feel
        color={"#f6c453"}           // muted honey gold (not neon)
        autoAnimate={true}
        particleVariance={0.3}      // consistency > randomness
        particleShape="hexagon"
        fieldStrength={6}           // gentle interaction, not magnetic chaos
      />
    </div>
  );
}
