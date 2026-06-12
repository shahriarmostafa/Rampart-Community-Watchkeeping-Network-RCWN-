"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { EyeOff, Phone, ShieldCheck } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { EmergencyStrip } from "@/components/safeWalk/emergencyStrip";
import { RiskControls } from "@/components/safeWalk/riskControls";
import {
  completeSession,
  updateSessionLocation,
  updateSessionRisk,
} from "@/features/safeWalk/safeWalkService";
import { useSafeWalkStore } from "@/features/safeWalk/safeWalkStore";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { RiskLevel } from "@/types/safeWalk";

// Location push frequency (ms) per risk level
const LOCATION_INTERVAL: Record<RiskLevel, number> = {
  safe: 60_000,
  uncomfortable: 30_000,
  scared: 15_000,
  danger: 5_000,
};

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const riskBannerTone: Record<RiskLevel, "safe" | "info" | "warn" | "danger"> = {
  safe: "safe",
  uncomfortable: "warn",
  scared: "warn",
  danger: "danger",
};

const riskLabel: Record<RiskLevel, string> = {
  safe: "Status: Safe.",
  uncomfortable: "Status: Uncomfortable. Watchers notified.",
  scared: "Status: Scared. Nearby watchers alerted.",
  danger: "DANGER — Emergency mode. Exact location shared. Calling 999.",
};

export function ActiveSafeWalkView() {
  const router = useRouter();
  const { activeSession, setActiveSession, setRiskLevel, clearSession } = useSafeWalkStore();
  const { coordinates } = useGeolocation(true); // continuous GPS watch
  const [elapsed, setElapsed] = useState(0);
  const [completing, setCompleting] = useState(false);
  const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkInIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Redirect if no active session
  useEffect(() => {
    if (!activeSession || activeSession.status !== "active") {
      router.replace("/safe-walk");
    }
  }, [activeSession, router]);

  // Elapsed time counter
  useEffect(() => {
    if (!activeSession?.startedAt) return;
    const start = new Date(activeSession.startedAt).getTime();

    elapsedIntervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => {
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    };
  }, [activeSession?.startedAt]);

  // Push location to backend on interval — frequency scales with risk level
  useEffect(() => {
    if (!activeSession?._id || !coordinates) return;

    const interval = LOCATION_INTERVAL[activeSession.riskLevel ?? "safe"];

    if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);

    // Push immediately on mount or risk change, then on interval
    void updateSessionLocation(activeSession._id, {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    }).catch(() => null);

    locationIntervalRef.current = setInterval(() => {
      void updateSessionLocation(activeSession._id, {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      }).catch(() => null);
    }, interval);

    return () => {
      if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?._id, activeSession?.riskLevel, coordinates?.latitude, coordinates?.longitude]);

  // 10-minute check-in prompt (spec: stationary 10+ min → soft ping)
  useEffect(() => {
    checkInIntervalRef.current = setInterval(async () => {
      const result = await Swal.fire({
        title: "Are you okay?",
        text: "Just checking in — confirm you are still safe.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "I'm safe",
        cancelButtonText: "I need help",
        confirmButtonColor: "#0f766e",
        cancelButtonColor: "#dc2626",
        timer: 60_000,
        timerProgressBar: true,
        reverseButtons: true,
      });

      if (result.dismiss === Swal.DismissReason.timer || result.isDismissed) {
        // No response → escalate to scared
        await handleRiskSelect("scared");
      }
    }, 10 * 60 * 1000);

    return () => {
      if (checkInIntervalRef.current) clearInterval(checkInIntervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?._id]);

  async function handleRiskSelect(level: RiskLevel) {
    if (!activeSession?._id) return;

    // Arrived safely is mapped to completing the walk
    if (level === "safe" && activeSession.riskLevel !== "safe") {
      await handleComplete();
      return;
    }

    try {
      const updated = await updateSessionRisk(activeSession._id, level);
      setActiveSession(updated);
      setRiskLevel(level);
    } catch {
      // silent — local state already reflects intent
    }
  }

  async function handleComplete() {
    const result = await Swal.fire({
      title: "End Safe Walk?",
      text: "Confirm you have arrived safely at your destination.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, I arrived safely",
      cancelButtonText: "Not yet",
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!result.isConfirmed || !activeSession?._id) return;

    setCompleting(true);
    try {
      const completed = await completeSession(activeSession._id);
      clearSession();
      const params = new URLSearchParams({
        duration: String(completed.durationMinutes ?? 0),
        start: activeSession.startAddress ?? "",
        destination: activeSession.destinationAddress ?? "",
        peak: completed.peakRiskLevel ?? "safe",
      });
      router.replace(`/safe-walk/summary?${params.toString()}`);
    } catch {
      setCompleting(false);
      void Swal.fire({
        title: "Error",
        text: "Could not complete your journey. Please try again.",
        icon: "error",
        confirmButtonColor: "#0f766e",
      });
    }
  }

  if (!activeSession) return null;

  const risk = activeSession.riskLevel ?? "safe";

  return (
    <div className="grid gap-4">
      <RouteHeader
        title="Live Journey"
        subtitle={`${formatElapsed(elapsed)} elapsed`}
      />

      <NoticeBanner icon={ShieldCheck} tone={riskBannerTone[risk]}>
        <strong>{riskLabel[risk]}</strong>
        {activeSession.destinationAddress && (
          <span className="block mt-1 text-xs opacity-80">
            Heading to: {activeSession.destinationAddress}
          </span>
        )}
      </NoticeBanner>

      {/* Location */}
      {coordinates && (
        <AppCard className="py-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            Live — {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
            {activeSession.blockCode && (
              <span className="ml-auto font-semibold text-slate-700">
                Block {activeSession.blockCode}
              </span>
            )}
          </div>
        </AppCard>
      )}

      <SectionLabel>How are you feeling right now?</SectionLabel>
      <RiskControls
        currentRisk={risk}
        disabled={completing}
        onSelect={handleRiskSelect}
      />

      {/* Complete button — always visible per spec */}
      <button
        className="w-full rounded-lg border-2 border-teal-700 bg-white py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50 disabled:opacity-50"
        disabled={completing}
        onClick={handleComplete}
        type="button"
      >
        {completing ? "Completing…" : "Complete Journey"}
      </button>

      {/* Silent SOS */}
      <AppCard className="border-dashed">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-rose-50 text-rose-700">
            <EyeOff aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-bold text-slate-950">Silent SOS (Duress Mode)</div>
            <div className="text-xs text-slate-500">
              Appears to end journey and secretly sends emergency alert to your circle.
            </div>
          </div>
        </div>
      </AppCard>

      <SectionLabel>Emergency</SectionLabel>
      <EmergencyStrip />

      <p className="pb-2 text-center text-xs text-slate-500">
        <Phone aria-hidden className="mr-1 inline h-3 w-3" />
        Emergency calls remain available throughout your journey.
      </p>
    </div>
  );
}
