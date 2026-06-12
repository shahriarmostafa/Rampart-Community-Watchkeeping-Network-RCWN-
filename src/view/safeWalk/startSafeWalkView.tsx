"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, LocateFixed, MapPin, PlayCircle, ShieldCheck, TriangleAlert, Venus } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { ToggleRow } from "@/components/common/toggleRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/useAuth";
import { startSafeWalk } from "@/features/safeWalk/safeWalkService";
import { useSafeWalkStore } from "@/features/safeWalk/safeWalkStore";
import { useGeolocation } from "@/hooks/useGeolocation";

export function StartSafeWalkView() {
  const router = useRouter();
  const { user } = useAuth();
  const { coordinates, error: locationError, requestLocation } = useGeolocation();
  const { shareWith, updateShareWith, setActiveSession, activeSession } = useSafeWalkStore();
  const [destination, setDestination] = useState("");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resume active session if one exists in the store
  useEffect(() => {
    if (activeSession?.status === "active") {
      router.push("/safe-walk/active");
    }
  }, [activeSession, router]);

  // Request location immediately on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  async function handleStart() {
    if (!user || !coordinates) return;

    setStarting(true);
    setError(null);

    try {
      const session = await startSafeWalk({
        firebaseUid: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "RCWN Citizen",
        destinationAddress: destination.trim() || undefined,
        location: { lat: coordinates.latitude, lng: coordinates.longitude },
        shareWith,
      });

      setActiveSession(session);
      router.push("/safe-walk/active");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start safe walk. Please try again.");
    } finally {
      setStarting(false);
    }
  }

  const locationGranted = !!coordinates;
  const locationDenied = !!locationError;

  return (
    <div className="grid gap-4">
      <RouteHeader title="Safe Walk" subtitle="Start a shared journey with trusted responders." />

      <NoticeBanner icon={ShieldCheck} tone="safe">
        Your live location is shared only with people you choose. Location data is automatically deleted when your journey ends.
      </NoticeBanner>

      {/* Location gate — must be granted before walk can start */}
      {!locationGranted ? (
        <AppCard className={locationDenied ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-amber-50"}>
          <div className="flex items-start gap-3">
            <AlertCircle
              aria-hidden
              className={`mt-0.5 h-5 w-5 flex-none ${locationDenied ? "text-rose-600" : "text-amber-600"}`}
            />
            <div>
              <p className={`text-sm font-bold ${locationDenied ? "text-rose-900" : "text-amber-900"}`}>
                {locationDenied ? "Location access denied" : "Location required to start"}
              </p>
              <p className={`mt-1 text-xs leading-5 ${locationDenied ? "text-rose-700" : "text-amber-700"}`}>
                {locationDenied
                  ? "Please enable location in your browser or device settings, then refresh."
                  : "Allow location access so watchers can find and help you during your walk."}
              </p>
              {!locationDenied && (
                <Button
                  className="mt-3 h-9 gap-2 text-xs"
                  onClick={requestLocation}
                  type="button"
                  variant="secondary"
                >
                  <LocateFixed aria-hidden className="h-4 w-4" />
                  Allow location
                </Button>
              )}
            </div>
          </div>
        </AppCard>
      ) : (
        <AppCard className="border-teal-200 bg-teal-50">
          <div className="flex items-center gap-2 text-sm font-semibold text-teal-800">
            <LocateFixed aria-hidden className="h-4 w-4" />
            Location ready
            <span className="ml-auto text-xs font-normal text-teal-600">
              {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
            </span>
          </div>
        </AppCard>
      )}

      <label className="grid gap-2 text-sm font-bold text-slate-900">
        Destination
        <div className="relative">
          <MapPin aria-hidden className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            className="pl-9"
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Optional — e.g. Mirpur 10, Home"
            value={destination}
          />
        </div>
        <p className="text-xs font-normal text-slate-500">
          Leave blank if you don&apos;t want route tracking.
        </p>
      </label>

      <p className="text-sm font-bold text-slate-900">Who can follow this journey?</p>
      <AppCard>
        <ToggleRow
          description="Your trusted family and friends"
          enabled={shareWith.circle}
          onToggle={(v) => updateShareWith({ circle: v })}
          title="My Guardian Circle"
        />
        <ToggleRow
          description="Vetted local volunteers in your block"
          enabled={shareWith.watchers}
          onToggle={(v) => updateShareWith({ watchers: v })}
          title="Nearby Verified Watchers"
        />
      </AppCard>

      {shareWith.watchers && (
        <>
          <p className="text-sm font-bold text-slate-900">Responder preference</p>
          <AppCard>
            <ToggleRow
              description="Only female-verified watchers will see and respond"
              enabled={shareWith.femaleOnly}
              icon={Venus}
              onToggle={(v) => updateShareWith({ femaleOnly: v })}
              title="Female watchers only"
            />
          </AppCard>
        </>
      )}

      <NoticeBanner icon={TriangleAlert} tone="warn">
        If no watchers are reachable, your circle will be notified and you will be connected directly to 999.
      </NoticeBanner>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <Button
        className="h-12 gap-2"
        disabled={!locationGranted || starting}
        onClick={handleStart}
        type="button"
      >
        <PlayCircle aria-hidden className="h-5 w-5" />
        {starting ? "Starting…" : "Start Safe Walk"}
      </Button>

      <p className="pb-2 text-center text-xs text-slate-500">
        <Venus aria-hidden className="mr-1 inline h-3 w-3" />
        Tap status buttons during your journey so we know you are okay.
      </p>
    </div>
  );
}
