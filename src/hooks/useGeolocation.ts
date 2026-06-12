"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Coordinates } from "@/features/safeWalk/safeWalkTypes";

export function useGeolocation(watchContinuous = false) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (positionError) => setError(positionError.message),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 5_000 },
    );
  }, []);

  // Continuous GPS watch — used during an active safe walk
  useEffect(() => {
    if (!watchContinuous) return;

    if (!navigator.geolocation) {
      window.setTimeout(() => setError("Geolocation is not supported."), 0);
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (positionError) => setError(positionError.message),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 5_000 },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [watchContinuous]);

  return { coordinates, error, requestLocation };
}
