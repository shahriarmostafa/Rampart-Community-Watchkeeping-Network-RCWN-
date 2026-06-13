"use client";

import Link from "next/link";
import { Award, Camera, LocateFixed, MapPinned, UsersRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { LeafletBlockPreview } from "@/components/common/leafletBlockPreview";
import { LeafletCoordinatePicker } from "@/components/common/leafletCoordinatePicker";
import { RoleBadge, roleLabel } from "@/components/common/roleBadge";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { ProfileHero } from "@/components/profile/profileHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/useAuth";
import { listCircleMembers } from "@/features/circle/circleService";
import { listGeoBlocks, resolveGeoBlockLocation } from "@/features/geoBlocks/geoBlockService";
import { uploadProfilePhoto } from "@/features/users/profilePhotoStorage";
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

  const friendly = [
    block.placeName,
    block.neighbourhood,
    "city" in block ? block.city : null,
  ]
    .filter(Boolean)
    .join(", ");

  if (friendly) {
    return friendly;
  }

  if (block.displayAddress) {
    return block.displayAddress;
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

function isOfficialRole(role: AppUser["role"]) {
  return role === "watcher" || role === "truth_keeper" || role === "guardian";
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
  const [matchingBlocks, setMatchingBlocks] = useState<GeoBlock[]>([]);
  const [selectedMatchBlockCode, setSelectedMatchBlockCode] = useState("");
  const [showOfficialArea, setShowOfficialArea] = useState(false);
  const [isChangingOfficialArea, setIsChangingOfficialArea] = useState(false);
  const [availableBlocks, setAvailableBlocks] = useState<GeoBlock[]>([]);
  const [selectedOfficialBlockCode, setSelectedOfficialBlockCode] = useState("");
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);
  const [circleMembers, setCircleMembers] = useState<CircleMember[]>([]);
  const [circleMax, setCircleMax] = useState(15);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileName, setEditProfileName] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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
      setMatchingBlocks([]);
      setSelectedMatchBlockCode("");
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

  function userBlockFromGeoBlock(block: GeoBlock): NonNullable<AppUser["block"]> {
    return {
      blockCode: block.blockCode,
      areaName: block.areaName,
      displayAddress: block.displayAddress,
      placeName: block.placeName,
      neighbourhood: block.neighbourhood,
      city: block.city,
      postcode: block.postcode,
      center: block.center,
    };
  }

  async function loadAvailableBlocks() {
    setIsLoadingBlocks(true);
    try {
      const blocks = (await listGeoBlocks()).filter((block) => block.isActive !== false);
      setAvailableBlocks(blocks);
      setSelectedOfficialBlockCode(displayProfile.block?.blockCode || "");
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load available blocks.");
    } finally {
      setIsLoadingBlocks(false);
    }
  }

  function startProfileEdit() {
    setEditProfileName(displayProfile.name);
    setProfilePhotoFile(null);
    setIsEditingProfile(true);
    setMessage(null);
  }

  async function saveBasicProfile() {
    if (!user) {
      return;
    }

    const name = editProfileName.trim();

    if (!name) {
      setMessage("Name is required.");
      return;
    }

    setIsSavingProfile(true);

    try {
      let photoUrl = displayProfile.photoUrl;

      if (profilePhotoFile) {
        const uploadedPhoto = await uploadProfilePhoto({
          file: profilePhotoFile,
          firebaseUid: user.uid,
        });
        photoUrl = uploadedPhoto.publicUrl;
      }

      const nextProfile = await updateUserProfile({
        firebaseUid: user.uid,
        name,
        email: displayProfile.email || user.email || `${user.uid}@rcwn.local`,
        photoUrl,
        dutyStatus: displayProfile.dutyStatus,
        address: displayProfile.address,
        location: displayProfile.location,
        block: displayProfile.block,
      });

      setProfile(nextProfile);
      setIsEditingProfile(false);
      setProfilePhotoFile(null);
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function saveLocationProfile() {
    if (!user) {
      return;
    }

    try {
      const resolved = await resolveGeoBlockLocation({
        lat: location.lat,
        lng: location.lng,
      });

      if (resolved.status === "unavailable") {
        await Swal.fire({
          confirmButtonColor: "#0f766e",
          confirmButtonText: "Okay",
          icon: "info",
          text: "The app is not available in your area yet.",
          title: "Area not available",
        });
        return;
      }

      if (resolved.status === "multiple_matches" && !selectedMatchBlockCode) {
        setMatchingBlocks(resolved.blocks);
        setMessage("This location is inside more than one RCWN block. Select the correct block, then save again.");
        return;
      }

      const block =
        resolved.status === "matched"
          ? resolved.block
          : resolved.blocks.find((item) => item.blockCode === selectedMatchBlockCode);

      if (!block) {
        setMessage("Please select one matching block before saving.");
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
          ...userBlockFromGeoBlock(block),
        },
      });

      setProfile(nextProfile);
      setProfileBlockDetails(block);
      setMatchingBlocks([]);
      setSelectedMatchBlockCode("");
      setIsEditingAddress(false);
      setMessage(`Profile saved in block ${block.blockCode}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save profile location.");
    }
  }

  async function updateDutyStatus(dutyStatus: NonNullable<AppUser["dutyStatus"]>) {
    if (!user || !isOfficialRole(displayProfile.role)) {
      return;
    }

    try {
      const nextProfile = await updateUserProfile({
        firebaseUid: user.uid,
        name: displayProfile.name,
        email: displayProfile.email || user.email || `${user.uid}@rcwn.local`,
        photoUrl: displayProfile.photoUrl,
        dutyStatus,
        address: displayProfile.address,
        location: displayProfile.location,
        block: displayProfile.block,
      });

      setProfile(nextProfile);
      setMessage(dutyStatus === "on_duty" ? "You are now on duty." : "You are now off duty.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update duty status.");
    }
  }

  async function startOfficialAreaChange() {
    setIsChangingOfficialArea(true);
    await loadAvailableBlocks();
  }

  async function saveOfficialAreaChange() {
    if (!user || !isOfficialRole(displayProfile.role)) {
      return;
    }

    const block = availableBlocks.find((item) => item.blockCode === selectedOfficialBlockCode);
    if (!block) {
      setMessage("Select an available block before saving your area.");
      return;
    }

    try {
      const nextProfile = await updateUserProfile({
        firebaseUid: user.uid,
        name: displayProfile.name,
        email: displayProfile.email || user.email || `${user.uid}@rcwn.local`,
        photoUrl: displayProfile.photoUrl,
        dutyStatus: displayProfile.dutyStatus,
        address: displayProfile.address,
        location: block.center,
        block: userBlockFromGeoBlock(block),
      });

      setProfile(nextProfile);
      setProfileBlockDetails(block);
      setLocation(block.center);
      setIsChangingOfficialArea(false);
      setShowOfficialArea(true);
      setMessage(`Your duty area is now ${blockPlaceLabel(block)} / ${block.blockCode}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not change your official area.");
    }
  }

  return (
    <div className="grid gap-4">
      <RouteHeader title="My Profile" subtitle="Account, saved block, and official duty area." />
      <ProfileHero
        initials={initialsFor(displayProfile.name)}
        label={`Verified ${roleLabel(displayProfile.role)}`}
        name={displayProfile.name}
        detail={displayProfile.block ? `${blockPlaceLabel(profileBlockDetails || displayProfile.block)} / ${displayProfile.block.blockCode}` : displayProfile.email}
        photoUrl={displayProfile.photoUrl}
      />
      <SectionLabel>Account</SectionLabel>
      <AppCard>
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-950">Profile details</h2>
            <p className="mt-1 text-xs text-slate-500">Update your display name and profile photo.</p>
          </div>
          <Button className="flex-none gap-2" onClick={startProfileEdit} type="button" variant="secondary">
            <Camera aria-hidden className="h-4 w-4" />
            Edit profile
          </Button>
        </div>
        {isEditingProfile ? (
          <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-teal-950">Edit profile</h3>
                <p className="mt-1 text-xs text-teal-800">Photos are stored in your own Supabase profile folder.</p>
              </div>
              <button
                aria-label="Close edit profile"
                className="grid h-8 w-8 flex-none place-items-center rounded-md text-teal-900 transition hover:bg-white/70"
                onClick={() => {
                  setIsEditingProfile(false);
                  setProfilePhotoFile(null);
                }}
                type="button"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 grid gap-3">
              <label className="grid gap-2 text-sm font-bold text-slate-900">
                Name
                <Input
                  onChange={(event) => setEditProfileName(event.target.value)}
                  placeholder="Your full name"
                  value={editProfileName}
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-900">
                Profile picture
                <Input
                  accept="image/*"
                  onChange={(event) => setProfilePhotoFile(event.target.files?.[0] ?? null)}
                  type="file"
                />
              </label>
              {profilePhotoFile ? (
                <p className="text-xs font-semibold text-teal-900">Selected: {profilePhotoFile.name}</p>
              ) : null}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                disabled={isSavingProfile}
                onClick={() => {
                  setIsEditingProfile(false);
                  setProfilePhotoFile(null);
                }}
                type="button"
                variant="secondary"
              >
                Cancel
              </Button>
              <Button disabled={isSavingProfile} onClick={saveBasicProfile} type="button">
                {isSavingProfile ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        ) : null}
        {[
          ["Verification status", <AppChip key="verified" tone="navy">Verified</AppChip>],
          ["Role", <RoleBadge key="role" role={displayProfile.role} />],
          ["Name", <strong key="name">{displayProfile.name}</strong>],
          ["Email", <strong key="email">{displayProfile.email || "Not available"}</strong>],
          ["Block", <strong key="block">{displayProfile.block?.blockCode || "Not set"}</strong>],
        ].map(([label, value]) => (
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2 last:border-b-0" key={String(label)}>
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-right text-sm font-bold capitalize text-slate-950">{value}</span>
          </div>
        ))}
        {isOfficialRole(displayProfile.role) ? (
          <div className="border-t border-slate-100 pt-3">
            <div className="text-sm font-bold text-slate-950">Duty status</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                ["on_duty", "On duty"],
                ["off_duty", "Off duty"],
              ].map(([value, label]) => (
                <label
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
                  key={value}
                >
                  <input
                    checked={(displayProfile.dutyStatus ?? "on_duty") === value}
                    className="h-4 w-4 accent-teal-700"
                    name="dutyStatus"
                    onChange={() => void updateDutyStatus(value as NonNullable<AppUser["dutyStatus"]>)}
                    type="radio"
                    value={value}
                  />
                  {label}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Off duty officials are hidden from watcher availability, block support, and official block counts.
            </p>
          </div>
        ) : null}
      </AppCard>
      <SectionLabel>{isOfficialRole(displayProfile.role) ? "Duty Area" : "Address & Block"}</SectionLabel>
      <AppCard>
        {!isEditingAddress && displayProfile.block ? (
          <div>
            {[
              [isOfficialRole(displayProfile.role) ? "Assigned duty area" : "Area", blockPlaceLabel(profileBlockDetails || displayProfile.block)],
              ...(!isOfficialRole(displayProfile.role) ? ([["Saved address", displayProfile.address || "Not set"]] as [string, string][]) : []),
              ["Block code", displayProfile.block.blockCode],
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
            {isOfficialRole(displayProfile.role) ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button className="gap-2" onClick={() => setShowOfficialArea((current) => !current)} type="button" variant="secondary">
                  <MapPinned aria-hidden className="h-4 w-4" />
                  {showOfficialArea ? "Hide duty area" : "See my duty area"}
                </Button>
                <Button className="gap-2" onClick={() => void startOfficialAreaChange()} type="button" variant="secondary">
                  <LocateFixed aria-hidden className="h-4 w-4" />
                  Change duty area
                </Button>
              </div>
            ) : null}
            {showOfficialArea && profileBlockDetails ? (
              <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-3">
                <div className="mb-3 text-sm font-bold text-teal-950">{blockPlaceLabel(profileBlockDetails)}</div>
                <LeafletBlockPreview block={profileBlockDetails} />
              </div>
            ) : null}
            {isChangingOfficialArea ? (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <label className="grid gap-2 text-sm font-bold text-slate-900">
                  Select duty area
                  <select
                    className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                    disabled={isLoadingBlocks}
                    onChange={(event) => setSelectedOfficialBlockCode(event.target.value)}
                    value={selectedOfficialBlockCode}
                  >
                    <option value="">{isLoadingBlocks ? "Loading blocks..." : "Choose a duty block"}</option>
                    {availableBlocks.map((block) => (
                      <option key={block.blockCode} value={block.blockCode}>
                        {blockPlaceLabel(block)} / {block.blockCode}
                      </option>
                    ))}
                  </select>
                </label>
                {selectedOfficialBlockCode ? (
                  <div className="mt-3">
                    {availableBlocks
                      .filter((block) => block.blockCode === selectedOfficialBlockCode)
                      .map((block) => (
                        <div className="rounded-lg border border-teal-200 bg-white p-3" key={block.blockCode}>
                          <div className="mb-2 text-xs font-bold text-teal-800">
                            {(block.stats?.citizens ?? 0)} citizens / {(block.stats?.watchers ?? 0)} watchers / {(block.stats?.truthKeepers ?? 0)} truth keepers / {(block.stats?.guardians ?? 0)} guardians
                          </div>
                          <LeafletBlockPreview block={block} />
                        </div>
                      ))}
                  </div>
                ) : null}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Button onClick={() => setIsChangingOfficialArea(false)} type="button" variant="secondary">
                    Cancel
                  </Button>
                  <Button disabled={!selectedOfficialBlockCode} onClick={saveOfficialAreaChange} type="button">
                    Save area
                  </Button>
                </div>
              </div>
            ) : null}
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
                <Input
                  onChange={(event) => {
                    setMatchingBlocks([]);
                    setSelectedMatchBlockCode("");
                    setLocation((current) => ({ ...current, lat: Number(event.target.value) }));
                  }}
                  type="number"
                  value={location.lat}
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-900">
                Longitude
                <Input
                  onChange={(event) => {
                    setMatchingBlocks([]);
                    setSelectedMatchBlockCode("");
                    setLocation((current) => ({ ...current, lng: Number(event.target.value) }));
                  }}
                  type="number"
                  value={location.lng}
                />
              </label>
            </div>
            <div className="mt-3">
              <LeafletCoordinatePicker
                lat={location.lat}
                lng={location.lng}
                onChange={(nextLocation) => {
                  setMatchingBlocks([]);
                  setSelectedMatchBlockCode("");
                  setLocation(nextLocation);
                }}
              />
            </div>
            {matchingBlocks.length ? (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <label className="grid gap-2 text-sm font-bold text-amber-950">
                  Select your block
                  <select
                    className="h-11 rounded-md border border-amber-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                    onChange={(event) => setSelectedMatchBlockCode(event.target.value)}
                    value={selectedMatchBlockCode}
                  >
                    <option value="">Choose matching block</option>
                    {matchingBlocks.map((block) => (
                      <option key={block.blockCode} value={block.blockCode}>
                        {blockPlaceLabel(block)} / {block.blockCode}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="mt-3 grid gap-2">
                  {matchingBlocks.map((block) => (
                    <div className="rounded-md bg-white p-2 text-xs text-amber-950" key={block.blockCode}>
                      <div className="font-bold">{blockPlaceLabel(block)} / {block.blockCode}</div>
                      <div className="mt-1 text-amber-800">
                        {(block.stats?.citizens ?? 0)} citizens / {(block.stats?.watchers ?? 0)} watchers
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
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
                    {member.relationship}
                  </div>
                  <RoleBadge className="mt-1" role={member.memberRole} size="xs" />
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
