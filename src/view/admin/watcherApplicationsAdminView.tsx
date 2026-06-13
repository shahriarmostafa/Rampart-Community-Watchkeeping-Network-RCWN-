"use client";

import { useEffect, useState } from "react";
import { Check, FileImage, RefreshCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/layout/appHeader";
import {
  listWatcherApplications,
  reviewWatcherApplication,
} from "@/features/watcherApplications/watcherApplicationService";
import type { WatcherApplication } from "@/types/watcherApplication";

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700",
  approved: "bg-teal-50 text-teal-700",
  rejected: "bg-rose-50 text-rose-700",
};

export function WatcherApplicationsAdminView() {
  const [applications, setApplications] = useState<WatcherApplication[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadApplications() {
    setIsLoading(true);
    try {
      setApplications(await listWatcherApplications());
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load applications.");
    } finally {
      setIsLoading(false);
    }
  }

  async function review(applicationId: string, status: "approved" | "rejected") {
    try {
      const updated = await reviewWatcherApplication(applicationId, status);
      setApplications((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      setMessage(status === "approved" ? "Watcher application approved." : "Watcher application rejected.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not review application.");
    }
  }

  useEffect(() => {
    window.setTimeout(() => {
      void loadApplications();
    }, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Admin review</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Watcher applications</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Approving an application promotes the user to watcher and assigns the selected block as their duty area.
            </p>
          </div>
          <Button className="gap-2" onClick={loadApplications} type="button" variant="secondary">
            <RefreshCcw aria-hidden className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        {message ? <p className="mt-5 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-600">{message}</p> : null}
        <section className="mt-6 grid gap-4">
          {isLoading ? <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Loading applications...</div> : null}
          {!isLoading && applications.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">No watcher applications yet.</div>
          ) : null}
          {applications.map((application) => (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={application._id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-950">{application.fullName}</h2>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusStyles[application.status]}`}>
                      {application.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{application.area} / {application.phone}</p>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{application.reason}</p>
                  <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <div>
                      <dt className="font-bold text-slate-950">Gender</dt>
                      <dd className="mt-1 capitalize text-slate-600">{application.gender.replaceAll("_", " ")}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-950">Availability</dt>
                      <dd className="mt-1 text-slate-600">{application.availability}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-950">Block</dt>
                      <dd className="mt-1 text-slate-600">{application.blockCode || "Not selected"}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-950">Experience</dt>
                      <dd className="mt-1 text-slate-600">{application.experience || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-950">Files</dt>
                      <dd className="mt-1 flex flex-col gap-1 text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <FileImage aria-hidden className="h-4 w-4" />
                          {application.userPhotoFileName || "User photo not attached"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FileImage aria-hidden className="h-4 w-4" />
                          {application.idCardPhotoFileName || "ID card not attached"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="gap-2"
                    disabled={application.status !== "pending"}
                    onClick={() => void review(application._id, "approved")}
                    type="button"
                  >
                    <Check aria-hidden className="h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    className="gap-2"
                    disabled={application.status !== "pending"}
                    onClick={() => void review(application._id, "rejected")}
                    type="button"
                    variant="secondary"
                  >
                    <X aria-hidden className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
