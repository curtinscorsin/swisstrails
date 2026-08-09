# Swiss Trails location audit

`location-audit-2026-08-09.csv` is the editorial status table for the supplied
100-place master list. A blank value is intentional: it means the field has not
yet been verified and must not be published as fact.

The eight rows marked `published_source_checked` are the only places currently
visible in the PWA. The other 92 rows remain hidden until their map object,
access, current rules and photograph have been reviewed manually against
official sources.

The CSV can be regenerated from the GeoAdmin candidate-audit JSON with
`apps/app/scripts/write-location-audit-csv.mjs`. Automated search results are
research leads only and never count as publication approval.
