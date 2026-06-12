"use client";

import Link from "next/link";
import { Award, LocateFixed, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { LeafletCoordinatePicker } from "@/components/common/leafletCoordinatePicker";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { ProfileHero } from "@/components/profile/profileHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/useAuth";
import { listCircleMembers } from "@/features/circle/circleService";
import { detectGeoBlock, listGeoBlocks } from "@/features/geoBlocks/geoBlockService";
import { getUserProfile, updateUserProfile } from "@/features/users/userService";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { CircleMember } from "@/types/circle";
import type { GeoBlock } from "@/types/geoBlock";
import type { AppUser } from "@/types/user";

const fallbackLocation = {
  lat: 23.8067,
  lng: 90.3686,
};

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "RC";
}

function blockPlaceLabel(block: GeoBlock | AppUser["block"]) {
  if (!block) {
    return "Not set";
  }

  if ("ward" in block || "district" in block || "upazila" in block) {
    return [block.areaName, block.ward ? `Ward ${block.ward}` : null, block.upazila, block.district]
      .filter(Boolean)
      .join(", ");
  }

  return block.areaName;
}

function circleInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

export function ProfileView() {
  const { user } = useAuth();
  const { coordinates, error: locationError, requestLocation } = useGeolocation();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(fallbackLocation);
  const [message, setMessage] = useState<string | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [profileBlockDetails, setProfileBlockDetails] = useState<GeoBlock | null>(null);
  const [circleMembers, setCircleMembers] = useState<CircleMember[]>([]);
  const [circleMax, setCircleMax] = useState(15);

  useEffect(() => {
    if (!user) {
      return;
    }

    window.setTimeout(() => {
      void listCircleMembers(user.uid)
        .then((data) => {
          setCircleMembers(data.members);
          setCircleMax(data.max);
        })
        .catch(() => undefined);

      void getUserProfile(user.uid)
        .then((nextProfile) => {
          setProfile(nextProfile);
          setAddress(nextProfile.address || "");
          setLocation(nextProfile.location || nextProfile.block?.center || fallbackLocation);
          setIsEditingAddress(!nextProfile.block);

          if (nextProfile.block?.blockCode) {
            void listGeoBlocks()
              .then((blocks) => {
                const fullBlock = blocks.find((block) => block.blockCode === nextProfile.block?.blockCode) || null;
                setProfileBlockDetails(fullBlock);
              })
              .catch(() => setProfileBlockDetails(null));
          }
        })
        .catch(() => {
          setProfile({
            firebaseUid: user.uid,
            name: user.displayName || user.email?.split("@")[0] || "RCWN Citizen",
            email: user.email || "",
            role: "citizen",
            photoUrl: user.photoURL || undefined,
          });
        });
    }, 0);
  }, [user]);

  useEffect(() => {
    if (!coordinates) {
      return;
    }

    window.setTimeout(() => {
      setLocation({
        lat: Number(coordinates.latitude.toFixed(6)),
        lng: Number(coordinates.longitude.toFixed(6)),
      });
      setMessage("Location selected. Save profile to store your block.");
    }, 0);
  }, [coordinates]);

  const displayProfile = useMemo<AppUser>(() => {
    return (
      profile || {
        firebaseUid: user?.uid,
        name: user?.displayName || user?.email?.split("@")[0] || "RCWN Citizen",
        email: user?.email || "",
        role: "citizen",
        photoUrl: user?.photoURL || undefined,
      }
    );
  }, [profile, user]);

  async function saveLocationProfile() {
    if (!user) {
      return;
    }

    try {
      const block = await detectGeoBlock({
        lat: location.lat,
        lng: location.lng,
        areaName: address || "Current area",
        precision: 6,
        type: "urban",
        area: { widthKm: 2, heightKm: 3 },
        target: { watchers: 40, truthKeepers: 10, guardians: 2 },
      });

      if (!block.isAvailable) {
        await Swal.fire({
          confirmButtonColor: "#0f766e",
          confirmButtonText: "Okay",
          icon: "info",
          text: "The app is not available in your area yet.",
          title: "Area not available",
        });
        return;
      }

      const nextProfile = await updateUserProfile({
        firebaseUid: user.uid,
        name: displayProfile.name,
        email: displayProfile.email || user.email || `${user.uid}@rcwn.local`,
        photoUrl: displayProfile.photoUrl,
        address,
        location,
        block: {
          blockCode: block.blockCode,
          areaName: block.areaName,
          center: block.center,
        },
      });

      setProfile(nextProfile);
      setProfileBlockDetails(block);
      setIsEditingAddress(false);
      setMessage(`Profile saved in block ${block.blockCode}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save profile location.");
    }
  }

  return (
    <div className="grid gap-4">
      <RouteHeader title="My Profile" subtitle="Account, address, location, and block." />
      <ProfileHero
        initials={initialsFor(displayProfile.name)}
        label={`Verified ${displayProfile.role.replace("_", " ")}`}
        name={displayProfile.name}
        detail={displayProfile.block ? `${displayProfile.block.areaName} / ${displayProfile.block.blockCode}` : displayProfile.email}
      />
      <SectionLabel>Account</SectionLabel>
      <AppCard>
        {[
          ["Verification status", <AppChip key="verified" tone="navy">Verified</AppChip>],
          ["Role", <strong key="role">{displayProfile.role.replace("_", " ")}</strong>],
          ["Email", <strong key="email">{displayProfile.email || "Not available"}</strong>],
          ["Block", <strong key="block">{displayProfile.block?.blockCode || "Not set"}</strong>],
        ].map(([label, value]) => (
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2 last:border-b-0" key={String(label)}>
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-right text-sm font-bold capitalize text-slate-950">{value}</span>
          </div>
        ))}
      </AppCard>
      <SectionLabel>Address & Block</SectionLabel>
      <AppCard>
        {!isEditingAddress && displayProfile.block ? (
          <div>
            {[
              ["Address", displayProfile.address || blockPlaceLabel(profileBlockDetails || displayProfile.block)],
              ["Place", blockPlaceLabel(profileBlockDetails || displayProfile.block)],
              ["Block code", displayProfile.block.blockCode],
              ["District", profileBlockDetails ? [profileBlockDetails.district, profileBlockDetails.division].filter(Boolean).join(", ") || "Not set" : "Not set"],
              [
                "Citizens",
                profileBlockDetails
                  ? `${profileBlockDetails.stats?.citizens ?? 0} registered`
                  : "Not set",
              ],
              [
                "Watchers",
                profileBlockDetails
                  ? `${profileBlockDetails.stats?.watchers ?? 0} active / ${profileBlockDetails.target.watchers}`
                  : "Not set",
              ],
              [
                "Truth keepers",
                profileBlockDetails
                  ? `${profileBlockDetails.stats?.truthKeepers ?? 0} active / ${profileBlockDetails.target.truthKeepers} `
                  : "Not set",
              ],
              [
                "Guardians",
                profileBlockDetails
                  ? `${profileBlockDetails.stats?.guardians ?? 0} active / ${profileBlockDetails.target.guardians}`
                  : "Not set",
              ],
              ["Center", `${displayProfile.block.center.lat}, ${displayProfile.block.center.lng}`],
            ].map(([label, value]) => (
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2 last:border-b-0" key={label}>
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-right text-sm font-bold text-slate-950">{value}</span>
              </div>
            ))}
            {message ? <p className="mt-3 text-sm font-semibold text-slate-600">{message}</p> : null}
            <Button className="mt-4 w-full" onClick={() => setIsEditingAddress(true)} type="button" variant="secondary">
              Edit address
            </Button>
          </div>
        ) : (
          <>
            <label className="grid gap-2 text-sm font-bold text-slate-900">
              Address
              <Input onChange={(event) => setAddress(event.target.value)} placeholder="House, road, area" value={address} />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="grid gap-2 text-sm font-bold text-slate-900">
                Latitude
                <Input onChange={(event) => setLocation((current) => ({ ...current, lat: Number(event.target.value) }))} type="number" value={location.lat} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-900">
                Longitude
                <Input onChange={(event) => setLocation((current) => ({ ...current, lng: Number(event.target.value) }))} type="number" value={location.lng} />
              </label>
            </div>
            <div className="mt-3">
              <LeafletCoordinatePicker lat={location.lat} lng={location.lng} onChange={setLocation} />
            </div>
            {locationError ? <p className="mt-3 text-xs font-semibold text-red-600">{locationError}</p> : null}
            {message ? <p className="mt-3 text-sm font-semibold text-slate-600">{message}</p> : null}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button className="gap-2" onClick={requestLocation} type="button" variant="secondary">
                <LocateFixed aria-hidden className="h-4 w-4" />
                Use location
              </Button>
              <Button onClick={saveLocationProfile} type="button">
                Save profile
              </Button>
            </div>
          </>
        )}
      </AppCard>
      <SectionLabel>Quick Links</SectionLabel>
      <Link href="/circle">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <span className="grid h-12 w-12 flex-none place-items-center rounded-md bg-blue-50 text-blue-800">
            <UsersRound aria-hidden className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-950">Edit my circle</div>
            <div className="mt-1 text-xs text-slate-500">Manage family, friends, watchers, and trusted authorities</div>
          </div>
        </div>
      </Link>
      <Link href="/apply-watcher">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <span className="grid h-12 w-12 flex-none place-items-center rounded-md bg-yellow-50 text-yellow-700">
            <Award aria-hidden className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-950">Become a Watcher</div>
            <div className="mt-1 text-xs text-slate-500">Apply to help protect your selected block</div>
          </div>
        </div>
      </Link>
      <AppCard>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-950">Circle members</h2>
            <p className="mt-1 text-xs text-slate-500">
              {circleMembers.length} of {circleMax} added
            </p>
          </div>
          <Link className="text-xs font-bold text-teal-700" href="/circle">
            Edit
          </Link>
        </div>
        {circleMembers.length ? (
          <div className="mt-4 grid gap-3">
            {circleMembers.slice(0, 4).map((member) => (
              <div className="flex items-center gap-3" key={member._id}>
                <span className="grid h-10 w-10 flex-none place-items-center rounded-md bg-blue-50 text-xs font-bold text-blue-800">
                  {circleInitials(member.memberName)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-slate-950">{member.memberName}</div>
                  <div className="mt-0.5 text-xs capitalize text-slate-500">
                    {member.relationship} / {member.memberRole.replace("_", " ")}
                  </div>
                </div>
              </div>
            ))}
            {circleMembers.length > 4 ? (
              <p className="text-xs font-semibold text-slate-500">+{circleMembers.length - 4} more in your circle</p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No circle members added yet.</p>
        )}
      </AppCard>
    </div>
  );
}
