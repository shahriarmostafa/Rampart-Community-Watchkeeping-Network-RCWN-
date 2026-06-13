"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LocateFixed, MapPin, Shield, ShieldCheck, Users } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { resolveGeoBlockLocation } from "@/features/geoBlocks/geoBlockService";
import { updateUserProfile } from "@/features/users/userService";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { GeoBlock } from "@/types/geoBlock";

type Step = "welcome" | "location" | "done";

function StepDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <span
      className={`h-2 w-2 rounded-full transition ${
        done ? "bg-teal-700" : active ? "bg-slate-800" : "bg-slate-300"
      }`}
    />
  );
}

export function OnboardingView() {
  const router = useRouter();
  const { user, appUser } = useAuth();
  const { coordinates, error: locationError, requestLocation } = useGeolocation();

  const [step, setStep] = useState<Step>("welcome");
  const [resolving, setResolving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [block, setBlock] = useState<GeoBlock | null>(null);
  const [multipleBlocks, setMultipleBlocks] = useState<GeoBlock[]>([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [notAvailable, setNotAvailable] = useState(false);

  // Already onboarded — go home
  useEffect(() => {
    if (appUser?.block?.blockCode) {
      router.replace("/home");
    }
  }, [appUser, router]);

  // Auto-resolve block as soon as GPS coords come in
  useEffect(() => {
    if (!coordinates || step !== "location" || resolving || block) return;

    setResolving(true);
    setStatusMsg(null);
    setNotAvailable(false);

    void resolveGeoBlockLocation({ lat: coordinates.latitude, lng: coordinates.longitude })
      .then((result) => {
        if (result.status === "matched") {
          setBlock(result.block);
          setMultipleBlocks([]);
        } else if (result.status === "multiple_matches") {
          setMultipleBlocks(result.blocks);
          setSelectedCode(result.blocks[0]?.blockCode ?? "");
          setStatusMsg("Your location sits on the border of two blocks. Choose the one that matches your address best.");
        } else {
          setNotAvailable(true);
          setStatusMsg("RCWN is not available in your area yet. You can still use the app and set your block later from Profile.");
        }
      })
      .catch(() => setStatusMsg("Could not detect your location. Please try again."))
      .finally(() => setResolving(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, step]);

  async function handleSaveBlock(chosen: GeoBlock) {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfile({
        firebaseUid: user.uid,
        name: user.displayName || appUser?.name || "RCWN Citizen",
        email: user.email || `${user.uid}@rcwn.local`,
        photoUrl: user.photoURL || undefined,
        address: appUser?.address,
        location: { lat: chosen.center.lat, lng: chosen.center.lng },
        block: {
          blockCode: chosen.blockCode,
          areaName: chosen.areaName,
          displayAddress: chosen.displayAddress,
          placeName: chosen.placeName,
          neighbourhood: chosen.neighbourhood,
          city: chosen.city,
          postcode: chosen.postcode,
          center: chosen.center,
        },
      });
      setStep("done");
    } catch {
      setStatusMsg("Could not save your block. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function confirmMultipleBlock() {
    const chosen = multipleBlocks.find((b) => b.blockCode === selectedCode);
    if (chosen) void handleSaveBlock(chosen);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex flex-1 flex-col px-5 pb-10 pt-12">
        {/* Progress dots */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {(["welcome", "location", "done"] as Step[]).map((s) => (
            <StepDot key={s} active={step === s} done={["location", "done"].includes(step) && s === "welcome" || step === "done" && s === "location"} />
          ))}
        </div>

        {/* ── STEP 1: WELCOME ── */}
        {step === "welcome" && (
          <div className="flex flex-1 flex-col gap-5">
            <div className="text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-teal-700 text-white shadow">
                <Shield aria-hidden className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-950">Welcome to RCWN</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">Real Community Watch Network</p>
            </div>

            <div className="grid gap-3">
              {[
                { icon: ShieldCheck, title: "Safe Walk", body: "Start a journey and nearby watchers quietly keep you safe." },
                { icon: Users, title: "Community Reports", body: "File safety concerns. Truth keepers verify before any action." },
                { icon: MapPin, title: "Block System", body: "Everything is local — watchers, TKs and guardians serve your block." },
              ].map(({ icon: Icon, title, body }) => (
                <AppCard className="flex gap-3" key={title}>
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-md bg-teal-50 text-teal-700">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-slate-950">{title}</div>
                    <div className="mt-0.5 text-xs leading-5 text-slate-500">{body}</div>
                  </div>
                </AppCard>
              ))}
            </div>

            <Button
              className="mt-auto h-12"
              onClick={() => {
                setStep("location");
                requestLocation();
              }}
              type="button"
            >
              Get started
            </Button>
          </div>
        )}

        {/* ── STEP 2: LOCATION ── */}
        {step === "location" && (
          <div className="flex flex-1 flex-col gap-5">
            <div className="text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-blue-700 text-white shadow">
                <LocateFixed aria-hidden className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-950">Find your block</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your block determines which watchers and truth keepers serve your area.
              </p>
            </div>

            {/* GPS status */}
            {!coordinates && !locationError && (
              <AppCard className="border-amber-200 bg-amber-50">
                <div className="flex items-center gap-3">
                  <LocateFixed aria-hidden className="h-5 w-5 flex-none text-amber-600 animate-pulse" />
                  <div>
                    <div className="text-sm font-semibold text-amber-900">Waiting for location…</div>
                    <div className="mt-0.5 text-xs text-amber-700">Allow location access when your browser asks.</div>
                  </div>
                </div>
                <Button className="mt-3 h-9 text-xs gap-2" onClick={requestLocation} type="button" variant="secondary">
                  <LocateFixed aria-hidden className="h-4 w-4" /> Allow location
                </Button>
              </AppCard>
            )}

            {locationError && (
              <NoticeBanner icon={LocateFixed} tone="danger">
                Location was denied. Enable it in browser settings and tap retry.
                <Button className="mt-2 h-8 text-xs" onClick={requestLocation} type="button" variant="secondary">
                  Retry
                </Button>
              </NoticeBanner>
            )}

            {coordinates && resolving && (
              <AppCard className="border-blue-200 bg-blue-50">
                <div className="flex items-center gap-3 text-sm font-semibold text-blue-800">
                  <MapPin aria-hidden className="h-4 w-4 animate-pulse" />
                  Detecting your block…
                </div>
              </AppCard>
            )}

            {block && !resolving && (
              <AppCard className="border-teal-200 bg-teal-50">
                <div className="text-sm font-bold text-teal-900">Block found</div>
                <div className="mt-1 text-xs text-slate-600">
                  {[block.placeName, block.neighbourhood, block.areaName].filter(Boolean).join(", ")}
                </div>
                <div className="mt-1 font-mono text-xs text-teal-700">{block.blockCode}</div>
                {block.stats && (
                  <div className="mt-2 text-xs text-slate-500">
                    {block.stats.watchers} watchers · {block.stats.truthKeepers} truth keepers · {block.stats.guardians} guardians
                  </div>
                )}
              </AppCard>
            )}

            {multipleBlocks.length > 0 && !resolving && (
              <AppCard className="border-amber-200">
                <div className="text-sm font-bold text-amber-900">Choose your block</div>
                <p className="mt-1 text-xs text-slate-500">{statusMsg}</p>
                <select
                  className="mt-3 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-teal-700"
                  onChange={(e) => setSelectedCode(e.target.value)}
                  value={selectedCode}
                >
                  {multipleBlocks.map((b) => (
                    <option key={b.blockCode} value={b.blockCode}>
                      {[b.placeName, b.areaName].filter(Boolean).join(", ")} / {b.blockCode}
                    </option>
                  ))}
                </select>
              </AppCard>
            )}

            {notAvailable && (
              <NoticeBanner icon={MapPin} tone="warn">
                {statusMsg}
              </NoticeBanner>
            )}

            {statusMsg && !notAvailable && !multipleBlocks.length && (
              <p className="text-sm font-semibold text-red-600">{statusMsg}</p>
            )}

            <div className="mt-auto grid gap-3">
              {block && (
                <Button
                  className="h-12 gap-2"
                  disabled={saving}
                  onClick={() => void handleSaveBlock(block)}
                  type="button"
                >
                  <CheckCircle2 aria-hidden className="h-5 w-5" />
                  {saving ? "Saving…" : `Join ${block.areaName}`}
                </Button>
              )}

              {multipleBlocks.length > 0 && (
                <Button
                  className="h-12"
                  disabled={!selectedCode || saving}
                  onClick={confirmMultipleBlock}
                  type="button"
                >
                  {saving ? "Saving…" : "Confirm block"}
                </Button>
              )}

              <Button
                className="h-10 text-sm"
                onClick={() => router.replace("/home")}
                type="button"
                variant="secondary"
              >
                Skip for now — set block from Profile later
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: DONE ── */}
        {step === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-teal-700 text-white shadow-lg">
              <CheckCircle2 aria-hidden className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-950">You're all set!</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your block is saved. Watchers and truth keepers in your area are now linked to your account.
              </p>
            </div>
            <Button
              className="h-12 w-full"
              onClick={() => router.replace("/home")}
              type="button"
            >
              Go to dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
