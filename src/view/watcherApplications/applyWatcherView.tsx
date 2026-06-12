"use client";

import { useForm } from "@tanstack/react-form";
import { BadgeCheck, CheckCircle2, IdCard, ImagePlus, MapPinned, RefreshCcw, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { AppCard } from "@/components/common/appCard";
import { LeafletBlockPreview } from "@/components/common/leafletBlockPreview";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/useAuth";
import { listGeoBlocks } from "@/features/geoBlocks/geoBlockService";
import { submitWatcherApplication } from "@/features/watcherApplications/watcherApplicationService";
import type { GeoBlock } from "@/types/geoBlock";
import { watcherApplicationSchema, type WatcherApplicationInput } from "@/validators/watcherApplication.schema";

function firstError(errors: unknown[]) {
  return errors[0] ? String(errors[0]) : null;
}

function blockPlaceLabel(block: GeoBlock) {
  return [block.areaName, block.ward ? `Ward ${block.ward}` : null, block.upazila, block.district]
    .filter(Boolean)
    .join(", ");
}

function blockOptionLabel(block: GeoBlock) {
  const place = blockPlaceLabel(block);
  return `${place || block.blockCode} - ${block.area.widthKm}km x ${block.area.heightKm}km - ${block.target.watchers} watcher target`;
}

export function ApplyWatcherView() {
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<GeoBlock[]>([]);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState<GeoBlock | null>(null);
  const form = useForm({
    defaultValues: {
      fullName: user?.displayName || "",
      gender: "prefer_not_to_say",
      phone: "",
      area: "",
      address: "",
      blockCode: "",
      blockAreaName: "",
      blockCenter: undefined,
      availability: "",
      reason: "",
      experience: "",
      userPhoto: null,
      idCardPhoto: null,
    } satisfies WatcherApplicationInput,
    onSubmit: async ({ value }) => {
      const parsed = watcherApplicationSchema.safeParse(value);

      if (!parsed.success || !user) {
        setMessage("Please complete the required fields before submitting.");
        return;
      }

      if (!selectedBlock) {
        setMessage("Please select an available block before submitting.");
        return;
      }

      try {
        await submitWatcherApplication({
          userId: user.uid,
          firebaseUid: user.uid,
          fullName: parsed.data.fullName,
          gender: parsed.data.gender,
          phone: parsed.data.phone,
          area: selectedBlock.areaName,
          blockCode: selectedBlock.blockCode,
          blockAreaName: selectedBlock.areaName,
          blockCenter: selectedBlock.center,
          availability: parsed.data.availability,
          reason: parsed.data.reason,
          experience: parsed.data.experience,
          userPhotoFileName: parsed.data.userPhoto?.name,
          idCardPhotoFileName: parsed.data.idCardPhoto?.name,
        });
        setMessage("Application submitted. Admin review will decide watcher access.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not submit watcher application.");
      }
    },
  });

  async function loadBlocks() {
    setIsLoadingBlocks(true);
    try {
      setBlocks((await listGeoBlocks()).filter((block) => block.isActive !== false));
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load available blocks.");
    } finally {
      setIsLoadingBlocks(false);
    }
  }

  function selectBlock(blockCode: string) {
    const block = blocks.find((item) => item.blockCode === blockCode) || null;
    setSelectedBlock(block);
    form.setFieldValue("area", block?.areaName || "");
    form.setFieldValue("blockCode", block?.blockCode || "");
    form.setFieldValue("blockAreaName", block?.areaName || "");
    form.setFieldValue("blockCenter", block?.center);
  }

  useEffect(() => {
    window.setTimeout(() => {
      void loadBlocks();
    }, 0);
  }, []);

  return (
    <div className="apply-watcher grid gap-4">
      <RouteHeader
        title="Apply as a Watcher"
        subtitle="Select the block where you can safely respond, then submit your identity and availability for admin review."
      />
      <AppCard>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-teal-50 text-teal-700">
            <BadgeCheck aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-950">Citizen first</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              New users are saved as citizens. Approval promotes the backend user role to watcher.
            </p>
          </div>
        </div>
      </AppCard>
      <form
        className="apply-watcher__form rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <SectionLabel>Identity</SectionLabel>
        <div className="mt-3 grid gap-4">
          <form.Field
            name="fullName"
            validators={{
              onBlur: ({ value }) => {
                const parsed = watcherApplicationSchema.shape.fullName.safeParse(value);
                return parsed.success ? undefined : "Enter your full name.";
              },
            }}
          >
            {(field) => (
              <label className="grid gap-2 text-sm font-bold text-slate-900">
                Full name
                <Input name={field.name} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} value={field.state.value} />
                {firstError(field.state.meta.errors) ? <span className="text-xs text-red-600">{firstError(field.state.meta.errors)}</span> : null}
              </label>
            )}
          </form.Field>
          <form.Field name="phone">
            {(field) => (
              <label className="grid gap-2 text-sm font-bold text-slate-900">
                Phone
                <Input name={field.name} onChange={(event) => field.handleChange(event.target.value)} placeholder="+880..." value={field.state.value} />
              </label>
            )}
          </form.Field>
          <form.Field name="gender">
            {(field) => (
              <label className="grid gap-2 text-sm font-bold text-slate-900">
                Gender
                <select
                  className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  name={field.name}
                  onChange={(event) => field.handleChange(event.target.value as WatcherApplicationInput["gender"])}
                  value={field.state.value}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </label>
            )}
          </form.Field>
        </div>
        <SectionLabel>Block selection</SectionLabel>
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 flex items-start gap-3 rounded-lg bg-white p-3">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-md bg-blue-50 text-blue-800">
              <MapPinned aria-hidden className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-950">Choose your watcher block</h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                Select one available RCWN block. The map and details below will show the area you are applying to cover.
              </p>
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-900">
            Available blocks
            <select
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              disabled={isLoadingBlocks}
              onChange={(event) => selectBlock(event.target.value)}
              value={selectedBlock?.blockCode || ""}
            >
              <option value="">{isLoadingBlocks ? "Loading blocks..." : "Select a block"}</option>
              {blocks.map((block) => (
                <option key={block.blockCode} value={block.blockCode}>
                  {blockOptionLabel(block)}
                </option>
              ))}
            </select>
          </label>
          {selectedBlock ? (
            <div className="mt-3 rounded-lg border border-teal-200 bg-teal-50 p-3">
              <div className="flex items-center gap-2 text-sm font-bold text-teal-800">
                <CheckCircle2 aria-hidden className="h-4 w-4" />
                Block selected
              </div>
              <div className="mt-3">
                <LeafletBlockPreview block={selectedBlock} />
              </div>
              <div className="mt-2 grid gap-1 text-xs text-teal-900">
                <div className="flex justify-between gap-3">
                  <span>Place</span>
                  <strong>{blockPlaceLabel(selectedBlock) || selectedBlock.areaName}</strong>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Block code</span>
                  <strong>{selectedBlock.blockCode}</strong>
                </div>
                <div className="flex justify-between gap-3">
                  <span>District</span>
                  <strong>{[selectedBlock.district, selectedBlock.division].filter(Boolean).join(", ") || "Not set"}</strong>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Center</span>
                  <strong>{selectedBlock.center.lat}, {selectedBlock.center.lng}</strong>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Target</span>
                  <strong>
                    {selectedBlock.target.watchers} watchers / {selectedBlock.target.truthKeepers} truth keepers / {selectedBlock.target.guardians} guardians
                  </strong>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Size</span>
                  <strong>{selectedBlock.area.widthKm}km x {selectedBlock.area.heightKm}km</strong>
                </div>
              </div>
            </div>
          ) : null}
          {!isLoadingBlocks && blocks.length === 0 ? (
            <p className="mt-3 rounded-md bg-white p-3 text-xs font-semibold text-slate-600">
              No active blocks are available yet. Please check again after admins add coverage blocks.
            </p>
          ) : null}
          <Button className="mt-3 w-full gap-2" onClick={loadBlocks} type="button" variant="secondary">
            <RefreshCcw aria-hidden className="h-4 w-4" />
            Refresh blocks
          </Button>
        </div>
        <SectionLabel>Documents</SectionLabel>
        <div className="mt-3 grid gap-3">
          <form.Field name="userPhoto">
            {(field) => (
              <label className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-bold text-slate-900">
                <span className="flex items-center gap-2"><ImagePlus aria-hidden className="h-4 w-4 text-teal-700" /> User photo</span>
                <Input className="mt-3 bg-white" onChange={(event) => field.handleChange(event.target.files?.[0] ?? null)} type="file" accept="image/*" />
              </label>
            )}
          </form.Field>
          <form.Field name="idCardPhoto">
            {(field) => (
              <label className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-bold text-slate-900">
                <span className="flex items-center gap-2"><IdCard aria-hidden className="h-4 w-4 text-blue-800" /> ID card photo</span>
                <Input className="mt-3 bg-white" onChange={(event) => field.handleChange(event.target.files?.[0] ?? null)} type="file" accept="image/*" />
              </label>
            )}
          </form.Field>
        </div>
        <SectionLabel>Watcher fit</SectionLabel>
        <div className="mt-3 grid gap-4">
          <form.Field name="availability">
            {(field) => (
              <label className="grid gap-2 text-sm font-bold text-slate-900">
                Availability
                <Input name={field.name} onChange={(event) => field.handleChange(event.target.value)} placeholder="Evenings, weekends, or emergency-only" value={field.state.value} />
              </label>
            )}
          </form.Field>
          <form.Field name="reason">
            {(field) => (
              <label className="grid gap-2 text-sm font-bold text-slate-900">
                Why do you want to be a watcher?
                <textarea
                  className="min-h-28 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  name={field.name}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Share your motivation and boundaries."
                  value={field.state.value}
                />
              </label>
            )}
          </form.Field>
          <form.Field name="experience">
            {(field) => (
              <label className="grid gap-2 text-sm font-bold text-slate-900">
                Relevant experience
                <textarea
                  className="min-h-24 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  name={field.name}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Community work, training, support roles, or leave blank."
                  value={field.state.value}
                />
              </label>
            )}
          </form.Field>
        </div>
        {message ? <p className="mt-4 text-sm font-semibold text-slate-600">{message}</p> : null}
        <Button className="mt-5 w-full gap-2" disabled={!selectedBlock} type="submit">
          <Send aria-hidden className="h-4 w-4" />
          Submit application
        </Button>
      </form>
    </div>
  );
}
