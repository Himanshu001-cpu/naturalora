import { useState, useEffect } from 'react';

export function useDeviceCapability() {
  const [capability, setCapability] = useState({
    isLowEnd: false,
    isMobile: false,
    hardwareConcurrency: 4,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent);
    const isLowEnd = cores <= 2 || memory <= 2 || isMobile;

    setCapability({
      isLowEnd,
      isMobile,
      hardwareConcurrency: cores,
    });
  }, []);

  return capability;
}

export default useDeviceCapability;
