import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  CircleX,
  ExternalLink,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import type { CoordinateType, Coordinates, RouteVerification } from "@/types";
import { cn, formatDuration } from "@/lib/utils";

interface RouteVerificationProps {
  verification: RouteVerification;
  destination?: Coordinates;
  destinationName?: string;
  destinationType?: CoordinateType;
  className?: string;
}

const statusStyle = {
  open: {
    label: "Open when checked",
    icon: CheckCircle2,
    className: "border-alpine-700/60 bg-alpine-950/40 text-alpine-300",
  },
  "open-with-advisory": {
    label: "Check advisory",
    icon: AlertTriangle,
    className: "border-amber-700/50 bg-amber-950/35 text-amber-300",
  },
  closed: {
    label: "Closed when checked",
    icon: CircleX,
    className: "border-red-800/60 bg-red-950/40 text-red-300",
  },
  "check-current": {
    label: "Check current status",
    icon: AlertTriangle,
    className: "border-amber-700/50 bg-amber-950/35 text-amber-300",
  },
} as const;

function formatCheckedDate(date: string) {
  return new Intl.DateTimeFormat("en-CH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}

function coordinateLabel(lat: number, lng: number) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function mapUrl(lat: number, lng: number) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}

export function RouteVerificationDetails({
  verification,
  destination,
  destinationName = "Published map point",
  destinationType,
  className,
}: RouteVerificationProps) {
  const status = statusStyle[verification.status];
  const StatusIcon = status.icon;
  const destinationOnly = Boolean(
    destination &&
      verification.start.coordinates.lat === destination.lat &&
      verification.start.coordinates.lng === destination.lng
  );

  return (
    <section className={cn("space-y-5", className)} aria-labelledby="verified-route-heading">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="t-eyebrow">{destinationOnly ? "Sourced destination record" : "Source-checked visit"}</p>
          <h2 id="verified-route-heading" className="mt-1 text-lg font-semibold text-fg">
            {destinationOnly ? "Known and unresolved" : "Planning details"}
          </h2>
        </div>
        <span
          className={cn(
            "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium",
            status.className
          )}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
        <div className="flex items-start gap-2.5">
          <CalendarCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-fg-muted" />
          <div>
            <p className="text-sm font-medium text-stone-200">
              Checked {formatCheckedDate(verification.checkedAt)}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-stone-400">
              {verification.statusNote} Conditions can change; {destinationOnly
                ? "check the responsible local authority before departure."
                : "use the official status link below immediately before departure."}
            </p>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Datum label="Visit type" value={verification.routeType} />
        <Datum label="Season" value={verification.season} />
        {verification.distanceKm != null && (
          <Datum label="Distance" value={`${verification.distanceKm} km`} />
        )}
        {verification.durationMinutes != null && (
          <Datum label="Walking time" value={formatDuration(verification.durationMinutes)} />
        )}
        <Datum
          label="Ascent"
          value={verification.ascentM == null ? "Not separately stated" : `${verification.ascentM} m`}
        />
        <Datum
          label="Descent"
          value={verification.descentM == null ? "Not separately stated" : `${verification.descentM} m`}
        />
        {verification.sacGrade && <Datum label="Grade" value={verification.sacGrade} />}
      </dl>

      {verification.elevationNote && (
        <p className="rounded-lg border border-amber-800/30 bg-amber-950/20 px-3 py-2 text-xs leading-relaxed text-amber-200/80">
          {verification.elevationNote}
        </p>
      )}

      <div className="space-y-3">
        {destination && (
          <InfoBlock title={destinationName} icon={<MapPinned className="h-4 w-4" />}>
            <a
              href={mapUrl(destination.lat, destination.lng)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-alpine-300 hover:text-alpine-200"
            >
              {coordinateLabel(destination.lat, destination.lng)}
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="mt-1">
              Coordinate type: {formatCoordinateType(destinationType)}. This point identifies
              the named place; {destinationOnly
                ? "it is not presented as a verified trailhead or entrance."
                : "the separate access coordinate below is where the documented visit begins."}
            </p>
          </InfoBlock>
        )}

        <InfoBlock title={destinationOnly ? "Access status" : "Start and transport"} icon={<MapPinned className="h-4 w-4" />}>
          <p className="font-medium text-stone-200">{verification.start.name}</p>
          <a
            href={mapUrl(
              verification.start.coordinates.lat,
              verification.start.coordinates.lng
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-alpine-300 hover:text-alpine-200"
          >
            {coordinateLabel(
              verification.start.coordinates.lat,
              verification.start.coordinates.lng
            )}
            <ExternalLink className="h-3 w-3" />
          </a>
          <p className="mt-2">
            <span className="text-stone-300">Public transport:</span>{" "}
            {verification.start.publicTransport}
          </p>
          <p className="mt-1">
            <span className="text-stone-300">Parking:</span> {verification.start.parking}
          </p>
          {verification.finish && (
            <p className="mt-1">
              <span className="text-stone-300">Finish:</span> {verification.finish}
            </p>
          )}
        </InfoBlock>

        <InfoBlock title="Access and cost" icon={<ShieldCheck className="h-4 w-4" />}>
          <p>
            <span className="text-stone-300">Accessibility:</span>{" "}
            {verification.accessibility}
          </p>
          <p className="mt-1">
            <span className="text-stone-300">Fees:</span> {verification.feeInfo}
          </p>
        </InfoBlock>
      </div>

      <RuleList title="Local rules" items={verification.restrictions} />
      <RuleList title="Safety" items={verification.safety} />

      {verification.uncertainties.length > 0 && (
        <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-amber-200">
            <AlertTriangle className="h-4 w-4" />
            Not fully verified
          </p>
          <ul className="mt-2 space-y-1.5">
            {verification.uncertainties.map((item) => (
              <li key={item} className="text-xs leading-relaxed text-amber-100/70">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-fg-muted">
          Sources
        </p>
        <ul className="mt-2 divide-y divide-white/[0.06] rounded-xl border border-white/[0.07]">
          {verification.sources.map((source) => (
            <li key={`${source.label}-${source.url}`}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center justify-between gap-3 px-3 py-2 text-xs text-stone-300 transition-colors hover:bg-white/[0.04] hover:text-fg"
              >
                <span>{source.label}</span>
                <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-fg-muted" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function formatCoordinateType(type?: CoordinateType) {
  if (!type) return "not specified";
  return type.replaceAll("_", " ");
}

function Datum({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.04] px-3 py-2.5">
      <dt className="text-[11px] leading-none text-fg-muted">{label}</dt>
      <dd className="mt-1.5 text-sm font-medium leading-snug text-stone-200">{value}</dd>
    </div>
  );
}

function InfoBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] p-4">
      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-200">
        <span className="text-fg-muted">{icon}</span>
        {title}
      </p>
      <div className="text-xs leading-relaxed text-stone-400">{children}</div>
    </div>
  );
}

function RuleList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-fg-muted">
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-xs leading-relaxed text-stone-400">
            <span className="mt-1.5 h-px w-2 flex-shrink-0 bg-alpine-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
