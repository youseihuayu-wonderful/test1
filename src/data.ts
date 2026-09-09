export type StatusKey = 'shipped' | 'completed' | 'in-progress' | 'paused' | 'planned' | 'proposal'
export type Category = 'Infrastructure' | 'Production' | 'QA' | 'Review' | 'Frontend' | 'Compatibility' | 'Research'

export type WorkLink = {
  label: string
  url: string
  kind: 'Issue' | 'PR' | 'Evidence'
}

export type WorkItem = {
  id: string
  number: number | null
  date: string
  title: string
  shortTitle: string
  repository: string
  category: Category
  status: StatusKey
  statusLabel: string
  source: string
  ownership: string
  counted: boolean
  featured?: boolean
  summary: string
  problem: string
  responsibility: string
  risks: string[]
  actions: string[]
  validation: string[]
  result: string
  skills: string[]
  metrics?: Array<{ value: string; label: string }>
  links: WorkLink[]
  interviewQuestions: string[]
}

export const statusMeta: Record<StatusKey, { label: string; short: string }> = {
  shipped: { label: 'Merged / Shipped', short: 'Shipped' },
  completed: { label: 'QA / Review Complete', short: 'Complete' },
  'in-progress': { label: 'Implemented · Upstream open', short: 'In progress' },
  paused: { label: 'Researched · Paused', short: 'Paused' },
  planned: { label: 'Accepted · Not started', short: 'Planned' },
  proposal: { label: 'Proposal / Initiative', short: 'Proposal' },
}

export const workItems: WorkItem[] = [
  {
    id: 'localstack-1057', number: 10, date: 'Aug 20–26, 2026',
    title: 'Credential-free LocalStack S3 environment', shortTitle: 'LocalStack / S3',
    repository: 'IQSS/dataverse-frontend', category: 'Infrastructure', status: 'shipped', statusLabel: 'Merged · Approved',
    source: 'Philip shared #1053 and added #1056 to the same delivery.', ownership: 'Designed and implemented the shared local, Shibboleth, and fork-CI storage environment.', counted: true, featured: true,
    summary: 'Removed private AWS credentials from the frontend development and fork-CI path by replacing external S3 with a reproducible LocalStack environment.',
    problem: 'Local development and S3-dependent E2E tests required IQSS AWS secrets. External contributors could not test uploads, while exposing credentials to untrusted fork code was unsafe.',
    responsibility: 'Build one credential-free S3 topology for local development, Shibboleth development, and GitHub Actions without weakening fork security.',
    risks: ['Never expose real secrets to fork code.', 'The browser and containers must consume compatible presigned URLs.', 'Container startup is not proof that bucket creation and CORS configuration completed.', 'Persistence was deliberately excluded because LocalStack Community does not provide it safely by configuration alone.'],
    actions: ['Diagnosed the failure as test-infrastructure, not upload-domain, behavior.', 'Added an S3-only LocalStack service and unified development/CI configuration.', 'Solved container-to-browser hostname, path-style access, presigned URL, multipart CORS, and ETag requirements.', 'Added initialization, health checks, a completion marker, stale-marker cleanup, and failure-injection validation.', 'Removed real S3 secrets from examples and GitHub Actions; incorporated Cheng’s readiness review.'],
    validation: ['E2E: 146 total · 139 passing · 7 pre-existing pending · 0 failing.', 'Component tests: 267/267 passing.', 'Single-part, multipart, presigned upload/download, CORS, tags, restart, idempotency, and forced initialization failure.', 'Philip removed his S3 keys and uploaded successfully on his own machine.'],
    result: 'PR #1057 was approved and merged. Contributors and fork CI can exercise file workflows without IQSS AWS credentials.',
    skills: ['CI/CD', 'Docker', 'AWS S3', 'Security', 'Failure injection', 'Cross-team review'],
    metrics: [{ value: '146', label: 'E2E cases' }, { value: '267', label: 'component tests' }, { value: '0', label: 'failures' }],
    links: [
      { label: 'Issue #1053', url: 'https://github.com/IQSS/dataverse-frontend/issues/1053', kind: 'Issue' },
      { label: 'Issue #1056', url: 'https://github.com/IQSS/dataverse-frontend/issues/1056', kind: 'Issue' },
      { label: 'PR #1057', url: 'https://github.com/IQSS/dataverse-frontend/pull/1057', kind: 'PR' },
    ],
    interviewQuestions: ['QA infrastructure improvement', 'Security risks in CI', 'Acting on reviewer feedback', 'Validating a test environment'],
  },
  {
    id: 'guestbook-12220', number: 6, date: 'Aug 11–13, 2026',
    title: 'Guestbook Cancel QA and hidden Terms regression', shortTitle: 'Guestbook / Terms',
    repository: 'IQSS/dataverse', category: 'QA', status: 'completed', statusLabel: 'QA complete · Parent PR open',
    source: 'Assigned directly by Philip for QA.', ownership: 'Independent QA reviewer; found and proved an unrelated regression, then supplied a two-line correction.', counted: true, featured: true,
    summary: 'Separated CI noise from a real Terms of Access regression hidden inside a Guestbook Cancel fix, then proved and restored the affected behavior.',
    problem: 'PR #12220 fixed Guestbook Cancel behavior but also changed the Terms rendering condition and referenced a missing bundle key. A failing JSF job made it easy to blame the correct two-line restoration.',
    responsibility: 'Determine whether the PR was safe to merge, distinguish product regression from unrelated CI failure, and provide reproducible evidence.',
    risks: ['Do not undo a correct fix because an unrelated test failed.', 'Do not approve the requested Cancel behavior while ignoring unrelated diff regressions.', 'Prove whether the failing fixture actually executes or renders the Terms path.'],
    actions: ['Compared the branch diff with develop.', 'Found the condition checked disclaimer instead of termsOfAccess and dropped the restricted-file guard.', 'Found the referenced resource-bundle key did not exist.', 'Inspected traces, fixture data, network requests, and JSF errors to show the failed test never rendered the Terms block.', 'Opened focused PR #12608; the same change was absorbed into parent commit bf019c4, so the focused PR was closed as superseded.'],
    validation: ['Complete JSF suite passed 43/43 twice.', 'Chromium, Firefox, and WebKit passed.', 'Controlled before/after screenshot proved the Terms block returned.', 'Integration and CodeQL checks passed on the restored parent branch.'],
    result: 'The regression correction was absorbed into #12220. Shihua’s QA and fix are complete; parent PR #12220 remains open and is not claimed as his delivery.',
    skills: ['Regression analysis', 'JSF', 'Cross-browser QA', 'CI diagnosis', 'Evidence design'],
    metrics: [{ value: '43/43', label: 'JSF suite' }, { value: '3', label: 'browser engines' }, { value: '2 lines', label: 'production fix' }],
    links: [
      { label: 'Issue #12205', url: 'https://github.com/IQSS/dataverse/issues/12205', kind: 'Issue' },
      { label: 'Parent PR #12220', url: 'https://github.com/IQSS/dataverse/pull/12220', kind: 'PR' },
      { label: 'Focused PR #12608', url: 'https://github.com/IQSS/dataverse/pull/12608', kind: 'PR' },
    ],
    interviewQuestions: ['Defect found during review', 'Flaky test versus product defect', 'Disagreeing with an initial diagnosis', 'Merge-readiness judgment'],
  },
  {
    id: 'map-337', number: 11, date: 'Aug 27, 2026',
    title: 'Production installations map recovery', shortTitle: 'Production Map',
    repository: 'IQSS/dataverse-installations', category: 'Production', status: 'shipped', statusLabel: 'Merged · Deployed',
    source: 'Philip raised the production issue and asked for local screenshots and candidate comparison.', ownership: 'Reproduced, isolated, evaluated alternatives, implemented the smallest fix, and verified production.', counted: true, featured: true,
    summary: 'Replaced broken CARTO tiles showing “API KEY REQUIRED” with OpenStreetMap and verified the public Dataverse installations map after deployment.',
    problem: 'The public map returned HTTP 200 tile responses whose PNG content carried an API-key error watermark, degrading the production site.',
    responsibility: 'Identify the failure boundary, compare viable providers, make a policy-aware minimal change, and verify GitHub Pages and production.',
    risks: ['HTTP 200 does not prove returned content is usable.', 'Avoid misdiagnosing Leaflet, CORS, JavaScript, or coordinate data.', 'Provider choice must account for API keys, attribution, implementation cost, and tile-use policy.'],
    actions: ['Inspected CARTO requests and the actual PNG response content.', 'Confirmed all 150 installation coordinates were valid.', 'Compared OSM Standard, OpenTopoMap, key-based CARTO, and OpenFreeMap.', 'Recommended the key-free OSM Standard option and updated the tile endpoint and attribution after Philip selected it.'],
    validation: ['150 markers loaded.', 'Tiles returned valid HTTP 200 PNG responses with CORS.', 'Popups, zoom, pan, attribution, and a 760px viewport passed.', 'Zero CARTO requests after the change.', 'Verified GitHub Pages and dataverse.org production.'],
    result: 'PR #338 was approved, merged, and deployed the same day. The production watermark disappeared.',
    skills: ['Production support', 'Third-party services', 'Browser verification', 'Deployment validation', 'Option analysis'],
    metrics: [{ value: '150', label: 'markers verified' }, { value: '0', label: 'CARTO calls' }, { value: '1 day', label: 'fix to production' }],
    links: [
      { label: 'Issue #337', url: 'https://github.com/IQSS/dataverse-installations/issues/337', kind: 'Issue' },
      { label: 'PR #338', url: 'https://github.com/IQSS/dataverse-installations/pull/338', kind: 'PR' },
      { label: 'Production map', url: 'https://dataverse.org', kind: 'Evidence' },
    ],
    interviewQuestions: ['Production-facing incident', 'Third-party service failure', 'Post-deployment validation', 'Comparing alternatives'],
  },
  {
    id: 'password-12544', number: 5, date: 'Aug 10–18, 2026',
    title: 'Password-reset internationalization QA', shortTitle: 'Password Reset i18n',
    repository: 'IQSS/dataverse', category: 'QA', status: 'completed', statusLabel: 'QA complete · PR merged',
    source: 'Philip suggested and guided the EN/FR and Maildev environment.', ownership: 'Ran real email-flow QA and identified a deployment-configuration risk outside the default path.', counted: true, featured: true,
    summary: 'Verified French password-reset completion email behavior while identifying a residual upgrade risk for installations using external language directories.',
    problem: 'Hardcoded reset messages moved into bundles. Default EN/FR worked, but dataverse.lang.directory installations could load external packs missing the new keys.',
    responsibility: 'Test the real EN/FR email flow and assess whether the change was safe across installation configurations.',
    risks: ['A passing default path does not prove upgrade safety.', 'Missing external translation keys can return null, roll back a password-change transaction, and leave only a generic error.'],
    actions: ['Established a 6.11 baseline.', 'Started EN/FR demo and Maildev environments.', 'Tested the full reset path against the PR image.', 'Verified the translated French completion email.', 'Traced dataverse.lang.directory and BundleUtil fallback behavior and documented the residual risk.'],
    validation: ['French completion email delivered correctly after translations were added.', 'Separated proven default behavior from the configuration-dependent risk.', 'Recorded the risk without claiming to solve the language-pack architecture.'],
    result: 'QA was completed and the risk recorded; PR #12544 later merged.',
    skills: ['Internationalization', 'Configuration risk', 'Maildev', 'Upgrade testing', 'Risk communication'],
    links: [
      { label: 'Issue #12536', url: 'https://github.com/IQSS/dataverse/issues/12536', kind: 'Issue' },
      { label: 'PR #12544', url: 'https://github.com/IQSS/dataverse/pull/12544', kind: 'PR' },
    ],
    interviewQuestions: ['Edge case others missed', 'Configuration-dependent testing', 'Residual risk after a passing main path'],
  },
  {
    id: 'roles-11919', number: 7, date: 'Aug 18, 2026',
    title: 'Assignable-roles authorization review', shortTitle: 'Authorization Review',
    repository: 'IQSS/dataverse', category: 'Review', status: 'completed', statusLabel: 'Review complete · Parent PR open',
    source: 'Philip asked, assigned, and requested the review.', ownership: 'Reviewed API contract and authorization boundaries; did not implement the parent feature.', counted: true, featured: true,
    summary: 'Found two authorization mismatches between a new “assignable roles” API and the command that actually assigns roles.',
    problem: 'A UI-facing API must return exactly the roles the caller can assign. A mismatch creates bad choices, authorization failures, or a security boundary error.',
    responsibility: 'Compare the API’s role calculation with production authorization, identify mismatches, and issue an evidence-backed review decision.',
    risks: ['Role permissions alone omit required Manage*Permissions.', 'Passing User instead of DataverseRequest can miss IP, mail-domain, and other request-dependent groups.'],
    actions: ['Compared availableRoles with AssignRoleCommand.', 'Identified missing Manage*Permissions.', 'Identified loss of request-dependent permissions when endpoints passed only User.', 'Found a small assertion typo in both integration-test paths.', 'Submitted Changes Requested with exact reproduction logic.'],
    validation: ['Compared production command authorization, service API behavior, and integration tests rather than trusting new tests alone.'],
    result: 'The review and Changes Requested decision are complete. Parent PR #11919 is still open; the API implementation is not claimed as Shihua’s work.',
    skills: ['Authorization', 'Security review', 'API contracts', 'Java', 'Risk-based review'],
    links: [{ label: 'PR #11919', url: 'https://github.com/IQSS/dataverse/pull/11919', kind: 'PR' }],
    interviewQuestions: ['Security risk identified', 'Reviewing unfamiliar code', 'When to request changes'],
  },
  {
    id: 'featured-12381', number: 4, date: 'Aug 4–6, 2026',
    title: 'Featured Items image-permission QA', shortTitle: 'Featured Items API',
    repository: 'IQSS/dataverse', category: 'QA', status: 'completed', statusLabel: 'QA approved · PR merged',
    source: 'Directly assigned by Philip on GitHub.', ownership: 'Validated the real API boundary and issued the merge recommendation.', counted: true,
    summary: 'Proved that creators can read featured-item images for unpublished collections while unrelated authenticated users remain blocked.',
    problem: 'The API needed a creator exception for unpublished collections without widening image access for unrelated users.',
    responsibility: 'Build a local Dataverse environment, exercise both sides of the permission boundary, and give a clear go/no-go recommendation.',
    risks: ['Integration-test success alone does not prove the real creator versus unrelated-user contract.', 'The fix must not broaden access beyond the literal creator.'],
    actions: ['Built the local environment with the Maven Docker profile.', 'Created an unpublished collection and featured image.', 'Tested with creator and unrelated authenticated-user tokens.', 'Ran the targeted integration test.', 'Submitted a formal GitHub Approval.'],
    validation: ['Creator request returned HTTP 200.', 'Unrelated authenticated user returned HTTP 204.', 'DataversesIT#testListFeaturedItems passed locally.'],
    result: 'Approved from an API-QA perspective; PR #12381 subsequently merged.',
    skills: ['API QA', 'Permission boundaries', 'Docker', 'Merge recommendation'],
    metrics: [{ value: '200', label: 'creator response' }, { value: '204', label: 'unrelated user' }],
    links: [
      { label: 'Issue #11537', url: 'https://github.com/IQSS/dataverse/issues/11537', kind: 'Issue' },
      { label: 'PR #12381', url: 'https://github.com/IQSS/dataverse/pull/12381', kind: 'PR' },
    ],
    interviewQuestions: ['Walking through PR QA', 'Testing permissions', 'Communicating go/no-go'],
  },
  {
    id: 'python-247', number: 1, date: 'Jul 15–18, 2026',
    title: 'Python 3.14 async compatibility', shortTitle: 'Python 3.14',
    repository: 'gdcc/pyDataverse', category: 'Compatibility', status: 'shipped', statusLabel: 'Merged · Approved',
    source: 'Philip introduced pyDataverse; Shihua selected the concrete issue.', ownership: 'Reproduced, designed the cross-context fix, migrated callers, and added a version matrix.', counted: true,
    summary: 'Removed a Python 3.14-incompatible global event-loop patch and introduced one loop-aware synchronous coroutine runner across pyDataverse entry points.',
    problem: 'The global nest_asyncio patch raised AsyncLibraryNotFoundError on Python 3.14 across scripts, existing loops, and worker-thread contexts.',
    responsibility: 'Fix the underlying runtime contract across all synchronous API surfaces while retaining Python 3.10–3.13 behavior.',
    risks: ['A one-callsite patch would leave other APIs broken.', 'Import-time global event-loop mutation affects consumers outside pyDataverse.'],
    actions: ['Reproduced on CPython 3.14.5.', 'Removed the import-time patch and dependency.', 'Built a shared loop-aware coroutine runner.', 'Migrated API, domain, metrics, and MCP entry points.', 'Added no-loop, running-loop, worker-thread, and live-constructor coverage.'],
    validation: ['Python 3.10–3.14 Dataverse-backed CI matrix passed.', 'Six focused regression tests passed.', 'Build and Ruff passed.', 'Live Python 3.14 connection loaded 18 metadata blocks.'],
    result: 'PR #247 was approved and merged.',
    skills: ['Python', 'Async runtimes', 'Compatibility matrices', 'Regression testing'],
    metrics: [{ value: '3.10–3.14', label: 'Python matrix' }, { value: '6', label: 'focused regressions' }],
    links: [
      { label: 'Issue #240', url: 'https://github.com/gdcc/pyDataverse/issues/240', kind: 'Issue' },
      { label: 'PR #247', url: 'https://github.com/gdcc/pyDataverse/pull/247', kind: 'PR' },
    ],
    interviewQuestions: ['Automated regression', 'Runtime compatibility', 'Multi-component fix'],
  },
  {
    id: 'metadata-249', number: 2, date: 'Jul 20–21, 2026',
    title: 'Nested controlled-vocabulary serialization', shortTitle: 'Metadata Serialization',
    repository: 'gdcc/pyDataverse', category: 'Compatibility', status: 'shipped', statusLabel: 'Merged · Approved',
    source: 'Philip directly requested reproduction.', ownership: 'Located the typing failure and delivered a minimal general fix with regression coverage.', counted: true,
    summary: 'Fixed opaque ORCID serialization failures without special-casing ORCID or changing stored/API values.',
    problem: 'Annotated controlled-vocabulary types were passed directly to issubclass(), causing TypeError during nested metadata serialization.',
    responsibility: 'Fix the type-system boundary minimally and show that the correction applies beyond a single field.',
    risks: ['Preserve raw values and existing serialization behavior.', 'Avoid an ORCID-only branch for a general Annotated-type problem.'],
    actions: ['Reproduced the ORCID path.', 'Traced Annotated[str, AfterValidator(...)] to the invalid issubclass call.', 'Added an isinstance(dtype, type) guard.', 'Covered ORCID, contributor type, and no-scheme behavior.'],
    validation: ['Four focused regression tests passed.', 'Ruff passed.', 'ControlledVocabulary output and raw values remained correct.'],
    result: 'PR #249 was approved and merged.',
    skills: ['Python typing', 'Metadata', 'Serialization', 'Focused regression'],
    links: [
      { label: 'Issue #241', url: 'https://github.com/gdcc/pyDataverse/issues/241', kind: 'Issue' },
      { label: 'PR #249', url: 'https://github.com/gdcc/pyDataverse/pull/249', kind: 'PR' },
    ],
    interviewQuestions: ['Small fix with strong coverage', 'Avoiding field-specific fixes'],
  },
  {
    id: 'edit-1039', number: 3, date: 'Jul 31–Aug 21, 2026',
    title: 'Historical-version Edit Metadata integrity', shortTitle: 'Edit Latest Metadata',
    repository: 'IQSS/dataverse-frontend', category: 'Frontend', status: 'in-progress', statusLabel: 'Open · Approved',
    source: 'Cheng assigned it in the group DM created by Philip; Philip supplied test context.', ownership: 'Implemented the fix, tests, changelog, review changes, and develop sync.', counted: true,
    summary: 'Made Edit Metadata always pre-populate the latest dataset metadata while preserving historical-version browsing.',
    problem: 'Opening Edit Metadata from an old dataset version reused the old version query parameter, creating a stale-overwrite data-integrity risk.',
    responsibility: 'Keep historical browsing unchanged while forcing the edit flow to load :latest.',
    risks: ['This is data integrity, not merely display behavior.', 'Do not alter ordinary historical version viewing.'],
    actions: ['Traced the route version into EditDatasetMetadataFactory.', 'Compared JSF and Edit Terms behavior.', 'Fixed edit fetches to DatasetNonNumericVersion.LATEST.', 'Added repository-call regressions.', 'Removed review-only docs and comments, added the changelog, and synchronized develop.'],
    validation: ['Focused component tests passed.', 'Component, lint, and accessibility checks passed.', 'Edit Dataset Metadata E2E passed 4/4 after fork workflows were repaired.', 'Confirmed old version never reaches the edit metadata fetch.'],
    result: 'Implementation is complete and approved, but PR #1039 remains open/blocked; it is not described as merged.',
    skills: ['React', 'Data integrity', 'Routing', 'Regression tests', 'Scope preservation'],
    links: [
      { label: 'Issue #1024', url: 'https://github.com/IQSS/dataverse-frontend/issues/1024', kind: 'Issue' },
      { label: 'PR #1039', url: 'https://github.com/IQSS/dataverse-frontend/pull/1039', kind: 'PR' },
    ],
    interviewQuestions: ['Data-integrity risk', 'Preserving existing behavior'],
  },
  {
    id: 'scroll-1050', number: 8, date: 'Aug 17–19, 2026',
    title: 'Collection infinite-scroll page bounds', shortTitle: 'Infinite Scroll Bounds',
    repository: 'IQSS/dataverse-frontend', category: 'Frontend', status: 'in-progress', statusLabel: 'Open · Changes requested',
    source: 'Cheng offered it in the group DM; Shihua accepted.', ownership: 'Reproduced, implemented the narrow CSS correction, and created stateful regression coverage.', counted: true,
    summary: 'Stopped the Collection Page from scrolling below its footer after repeated infinite-scroll loads without redesigning the layout architecture.',
    problem: 'Repeated list loads expanded the page-level scroll range beyond visible content and the footer.',
    responsibility: 'Find the smallest defensible correction while protecting sticky controls and search/sort/filter reset behavior.',
    risks: ['A large CSS rewrite would hide rather than isolate the issue.', 'Avoid asserting an unverified browser-internal root cause.', 'Layout-pixel assertions can become browser-dependent and flaky.'],
    actions: ['Reproduced repeated loading and page bounds.', 'Exercised sticky header, Sort, footer, and empty/small/large result sets.', 'Established .items-list as the needed local positioning context.', 'Added only position: relative to production CSS.', 'Added repeated-loading and reset tests.'],
    validation: ['94 related component tests passed.', 'Targeted Cypress E2E, typecheck, lint, and production build passed.', 'Reviewer requested 1px tolerance in two environment-sensitive tests and a changelog entry.'],
    result: 'The minimal fix and local verification are complete. PR #1050 remains open with Changes Requested.',
    skills: ['React', 'CSS layout', 'Infinite scroll', 'State transitions', 'Scope control'],
    metrics: [{ value: '1 line', label: 'production change' }, { value: '94', label: 'component tests' }],
    links: [
      { label: 'Issue #1030', url: 'https://github.com/IQSS/dataverse-frontend/issues/1030', kind: 'Issue' },
      { label: 'PR #1050', url: 'https://github.com/IQSS/dataverse-frontend/pull/1050', kind: 'PR' },
    ],
    interviewQuestions: ['Minimal-risk fix', 'Stateful UI regression', 'Controlling scope'],
  },
  {
    id: 'relations-1048', number: 9, date: 'Aug 17–21, 2026',
    title: 'Human-readable publication relation labels', shortTitle: 'Relation Type Labels',
    repository: 'IQSS/dataverse-frontend', category: 'Frontend', status: 'in-progress', statusLabel: 'Open · Changes requested',
    source: 'Cheng offered it in the group DM; Shihua accepted.', ownership: 'Completed the first implementation and i18n revision; further architectural review remains.', counted: true,
    summary: 'Separated readable, localized relation labels from raw stored/API values to protect metadata compatibility.',
    problem: 'The UI displayed values such as IsSupplementedBy, but changing raw values would break stored metadata and DataCite-compatible behavior.',
    responsibility: 'Localize display labels in edit and view flows while submitting the original raw vocabulary values.',
    risks: ['Never mutate the stored/API controlled-vocabulary value.', 'Avoid hardcoded English.', 'Follow the repository’s translation-at-component convention.'],
    actions: ['Mapped all six relation types.', 'Used separate value and label options in the form.', 'Localized dataset metadata rendering.', 'Kept raw submission and unknown-value fallback.', 'Moved labels into EN/ES resources after review; a later review requested translation directly in components.'],
    validation: ['All six values, two languages, raw submission, rendering, fallback, and unrelated vocabularies covered.', '80 relevant component/regression tests, typecheck, lint, and build passed.'],
    result: 'First implementation and i18n revision are complete. PR #1048 remains open with Changes Requested for translation architecture.',
    skills: ['i18n', 'Controlled vocabularies', 'React forms', 'Backward compatibility', 'Review iteration'],
    metrics: [{ value: '6', label: 'relation values' }, { value: '2', label: 'languages' }, { value: '80', label: 'tests' }],
    links: [
      { label: 'Issue #1041', url: 'https://github.com/IQSS/dataverse-frontend/issues/1041', kind: 'Issue' },
      { label: 'PR #1048', url: 'https://github.com/IQSS/dataverse-frontend/pull/1048', kind: 'PR' },
    ],
    interviewQuestions: ['Localization testing', 'Presentation versus stored values', 'Ongoing reviewer feedback'],
  },
  {
    id: 'previewers', number: 12, date: 'Sep 1–4, 2026',
    title: 'Previewers, local CSV baseline, and NcML side quest', shortTitle: 'Previewers / NcML',
    repository: 'gdcc/dataverse-previewers', category: 'Research', status: 'paused', statusLabel: 'Researched · Paused by agreement',
    source: 'Philip requested a local CSV baseline and newest image; NcML was explicitly a nice-to-have side quest.', ownership: 'Produced reproducible NcML findings but over-expanded before completing the simple CSV baseline.', counted: true,
    summary: 'A technically useful research track that became a scope-control lesson: the harder NcML branch was explored before the requested CSV baseline was closed.',
    problem: 'The original ask was to prove a simple local CSV Previewer and understand how to package recent Previewers; NcML later appeared as a low-priority side quest.',
    responsibility: 'Establish the smallest baseline first, then decide whether provider comparison and image delivery were warranted.',
    risks: ['Technical depth can obscure the stakeholder’s actual acceptance criterion.', 'Bundled assets are not proof of browser-level behavior.', 'Draft auxiliary access has different authorization from published content.'],
    actions: ['Compared three NcML provider approaches.', 'Used real NetCDF/HDF5 files to prove published NcML rendering.', 'Found draft auxiliary requests returned HTTP 403.', 'Kept unverified assets and prototypes out of production-ready claims.', 'Accepted Philip’s feedback and agreed to pause the direction.'],
    validation: ['Published NetCDF/HDF5 NcML rendered locally.', 'Draft NcML returned 403.', 'Simple non-NcML CSV visual acceptance was not completed.'],
    result: 'Research evidence exists, but the original CSV acceptance was incomplete. The work was paused on Sep 4 and is used as an honest scope-management story.',
    skills: ['Exploratory testing', 'Docker images', 'File previewers', 'Scope control', 'Stakeholder feedback'],
    links: [{ label: 'Related issue #90', url: 'https://github.com/gdcc/dataverse-previewers/issues/90', kind: 'Issue' }],
    interviewQuestions: ['Feedback received', 'Over-scoped task', 'What would you do differently?', 'Responsible AI use'],
  },
  {
    id: 'search-1062', number: 13, date: 'Sep 2, 2026',
    title: 'Search by folder or directory name', shortTitle: 'Folder Search',
    repository: 'IQSS/dataverse-frontend', category: 'Frontend', status: 'planned', statusLabel: 'Accepted · Not started',
    source: 'Philip suggested beginning with reproduction.', ownership: 'No implementation or QA delivery yet.', counted: true,
    summary: 'Active depositor request: searching “Figure1” does not return a folder with that name.',
    problem: 'The Modern Frontend search bar does not appear to query file directory names.',
    responsibility: 'Planned first step is to reproduce and identify whether the gap is frontend query construction, API capability, or indexing.',
    risks: ['Do not claim delivery before reproduction.', 'Do not start while higher-value open work remains unresolved.'],
    actions: ['Accepted as a possible next item; deliberately not started.'],
    validation: ['None yet.'],
    result: 'Open issue #1062. Kept visible in the ledger, but excluded from completed-work claims.',
    skills: ['Search', 'Issue reproduction', 'Prioritization'],
    links: [{ label: 'Issue #1062', url: 'https://github.com/IQSS/dataverse-frontend/issues/1062', kind: 'Issue' }],
    interviewQuestions: ['Prioritization', 'Defining acceptance criteria before implementation'],
  },
  {
    id: 'localization-1063', number: 14, date: 'Sep 2, 2026',
    title: 'Dynamic values and search-facet localization', shortTitle: 'Modern UI Localization',
    repository: 'IQSS/dataverse-frontend', category: 'Frontend', status: 'planned', statusLabel: 'Accepted · Not started',
    source: 'Philip asked Cheng whether it was suitable; Cheng confirmed.', ownership: 'No implementation or QA delivery yet.', counted: true,
    summary: 'Spanish UI exposes untranslated dynamic values, dates, file labels, subject vocabularies, facet headings, and number formatting.',
    problem: 'Static text localizes, but Dataverse-controlled dynamic labels and locale-sensitive values remain English or unformatted.',
    responsibility: 'Potential scope includes reproduction and separating localizable system values from user-authored metadata and version identifiers.',
    risks: ['User-entered names and affiliations must remain unchanged.', 'Dataset version identifiers such as 4.0 are identifiers, not locale-formatted decimals.', 'This is broad and needs slice-level acceptance criteria.'],
    actions: ['Accepted as a future item; deliberately not started.'],
    validation: ['Issue report documents Spanish examples for 180.3 KB, dates, facet headings, controlled subjects, and counts.'],
    result: 'Open issue #1063. Visible as planned work only.',
    skills: ['i18n', 'Locale formatting', 'Product QA', 'Scope slicing'],
    links: [{ label: 'Issue #1063', url: 'https://github.com/IQSS/dataverse-frontend/issues/1063', kind: 'Issue' }],
    interviewQuestions: ['Prioritization', 'Localization strategy', 'Breaking down broad issues'],
  },
  {
    id: 'dataverse-jl-38', number: null, date: 'Aug 14, 2026',
    title: 'Isolated CI and actionable API errors for Dataverse.jl', shortTitle: 'Dataverse.jl CI',
    repository: 'gdcc/Dataverse.jl', category: 'Infrastructure', status: 'shipped', statusLabel: 'Merged · Self-directed initiative',
    source: 'Philip shared the issue as interesting; the implementation was self-directed, not a formal Philip assignment.', ownership: 'Separated client error handling from CI isolation and delivered both.', counted: false,
    summary: 'Removed test dependence on Harvard’s production service and replaced opaque JSON failures with actionable HTTP diagnostics.',
    problem: 'Harvard’s WAF returned HTTP 202 HTML or empty bodies; the library attempted JSON parsing and surfaced UnexpectedEOF while CI depended on a production service.',
    responsibility: 'Make base URLs configurable, validate responses before JSON parsing, and create deterministic local integration fixtures.',
    risks: ['Automated tests should not rely on production availability or access policy.', 'HTTP status, body, and content type must be checked before parsing.'],
    actions: ['Reproduced WAF behavior.', 'Added configurable base URLs to REST, download, and JSON-LD paths.', 'Validated status, body, content type, and malformed JSON.', 'Used gdcc/dataverse-action for isolated CI.', 'Created and published dynamic collections, datasets, and files; made docs deterministic and offline.'],
    validation: ['Julia 1.9 and latest CI passed.', 'Integration covered create, upload, publish, list, and download.', 'Errors covered 202, empty body, non-JSON, and malformed JSON.'],
    result: 'PR #38 merged. CI no longer depends on Harvard production.',
    skills: ['Julia', 'CI isolation', 'API errors', 'Dynamic fixtures', 'Production dependency removal'],
    links: [
      { label: 'Issue #36', url: 'https://github.com/gdcc/Dataverse.jl/issues/36', kind: 'Issue' },
      { label: 'PR #38', url: 'https://github.com/gdcc/Dataverse.jl/pull/38', kind: 'PR' },
    ],
    interviewQuestions: ['Reproducible CI', 'Removing production dependencies', 'Improving diagnosability'],
  },
  {
    id: 'validation-254', number: null, date: 'Jul 28–30, 2026',
    title: 'Pre-flight metadata validation proposal', shortTitle: 'Validation Proposal',
    repository: 'gdcc/pyDataverse', category: 'Research', status: 'proposal', statusLabel: 'Open proposal · Scope narrowed',
    source: 'Self-directed proposal; not assigned by Philip.', ownership: 'Opened the design discussion, researched existing behavior, and narrowed the proposal after maintainer feedback.', counted: false,
    summary: 'Proposed a structured, non-throwing metadata-validation surface, then corrected assumptions and reduced scope to a thin wrapper plus Unicode round-trip coverage.',
    problem: 'Metadata failures can surface as late tracebacks or prose, making batch and CI consumers harder to integrate.',
    responsibility: 'Seek maintainer alignment before implementation and avoid introducing a second schema system.',
    risks: ['Do not hardcode metadata blocks that vary by installation.', 'Do not add LLM dependencies.', 'Do not claim a design proposal as delivered functionality.'],
    actions: ['Connected several metadata issues into one proposed validation gap.', 'Suggested structured findings and draft-only automation boundaries.', 'Investigated downloadable JSON Schema and server-side two-stage validation.', 'Accepted that model_validate already provides one-pass collection.', 'Dropped cached-schema/offline claims and narrowed the idea to wrapping ValidationError plus non-Latin round-trip tests.'],
    validation: ['Public maintainer discussion documents the corrected assumptions, remaining API shape, and open ownership questions.'],
    result: 'Issue #254 remains an open, narrowed proposal with no implementation claim.',
    skills: ['API design', 'Metadata validation', 'Unicode', 'Maintainer alignment', 'Scope reduction'],
    links: [{ label: 'Issue #254', url: 'https://github.com/gdcc/pyDataverse/issues/254', kind: 'Issue' }],
    interviewQuestions: ['Process improvement proposal', 'Scoping ambiguity', 'Seeking alignment before implementation'],
  },
]

export const tenDayPlan = [
  ['Day 1', 'Evidence matrix', 'Map every role requirement to verified evidence, strength, gap, and interview wording.'],
  ['Day 2', 'Core narrative', 'Practice a 90-second introduction and “Why IQSS / Dataverse?”'],
  ['Day 3', 'STAR library', 'Write five two-minute stories: LocalStack, #12220, #337, #12544, and OnePlus.'],
  ['Day 4', 'QA judgment', 'Practice test plans, regression strategy, severity, and automation-selection questions.'],
  ['Day 5', 'Production response', 'Practice the first 15 minutes of an outage: impact, signals, mitigation, owners, communication.'],
  ['Day 6', 'Technical gaps', 'Review Dataverse release flow, PostgreSQL backup/restore, and JMeter fundamentals.'],
  ['Day 7', 'Manager lens', 'Practice prioritization, conflict, WIP limits, stakeholder communication, and quality metrics.'],
  ['Day 8', 'Mock interview I', 'Run a full English mock; capture weak answers without adding new projects.'],
  ['Day 9', 'Targeted repair', 'Strengthen only the weak answers and the evidence behind them.'],
  ['Day 10', 'Mock interview II', 'Final rehearsal, questions for IQSS, Zoom, audio, and interview environment.'],
] as const

export const capabilityEvidence = [
  { name: 'QA design & execution', evidence: 7, note: '#12381, #12544, #12220, LocalStack, Frontend regressions' },
  { name: 'Issue triage & root cause', evidence: 8, note: '#337, #12220, #240, #241, #1030' },
  { name: 'Test infrastructure & CI', evidence: 4, note: 'LocalStack, Dataverse.jl, fork workflows, cross-version matrix' },
  { name: 'Risk & authorization', evidence: 5, note: '#11919, #12220, #12544, #1039, fork secrets' },
  { name: 'Production support', evidence: 2, note: '#337 plus a real OnePlus incident still to document' },
  { name: 'Localization', evidence: 3, note: '#12544, #1048, planned #1063' },
  { name: 'Release engineering', evidence: 3, note: 'CI, image QA, deployment validation; no Dataverse release ownership claim' },
  { name: 'Stakeholder coordination', evidence: 6, note: 'Philip, Cheng, maintainers, reviewer feedback, scope reset' },
]

export const roleRequirements = [
  ['QA process design', 'Core', 'LocalStack, PR QA, repeatable evidence templates', 'Formal policy ownership is not yet proven'],
  ['Functional / regression / visual / automated testing', 'Core', '#12381, #12544, #12220, #1050, #247', 'Strong evidence'],
  ['Issue triage', 'Core', '#337, #12220, #240, #241', 'Strong evidence'],
  ['Production support', 'Core', 'Production map incident and OnePlus background', 'Prepare one fully factual OnePlus incident'],
  ['Release engineering', 'Core', 'CI workflows, preview images, post-deploy verification', 'No formal Dataverse release ownership'],
  ['Test infrastructure', 'Core', 'LocalStack and isolated Dataverse.jl CI', 'Strong evidence'],
  ['Risk assessment', 'Core', 'Authorization, language packs, data integrity, fork secrets', 'Strong evidence'],
  ['Database & performance', 'Important', 'General SQL background', 'PostgreSQL restore and JMeter are preparation gaps'],
  ['Web technologies', 'Important', 'REST, React, Cypress, GitHub Actions, Docker, Unix', 'Strong evidence'],
  ['Communication & coordination', 'Core', 'Reviews, go/no-go language, scope lesson', 'Direct-report management not yet claimed'],
] as const

export const kpiFramework = [
  ['Release quality', 'Escaped high-severity defects; risk found before merge; rollback rate'],
  ['Incident response', 'MTTA, MTTR, service restoration time, repeat-incident rate'],
  ['QA predictability', 'Plan completion, explicit go/no-go decisions, evidence quality'],
  ['Automation value', 'High-risk flow coverage and manual effort removed—not raw test count'],
  ['CI reliability', 'Flake rate, environment startup success, actionable failures'],
  ['Support health', 'Response/resolution time, aging backlog, recurrence'],
  ['Documentation', 'Runnable test steps, release notes, incident records, runbooks'],
] as const

export const definitionsOfDone = [
  { type: 'Development', steps: ['Reproduce', 'Confirm root cause', 'Minimal fix', 'Regression coverage', 'CI green', 'Reviewer accepts', 'Merge', 'Production check if needed'] },
  { type: 'QA', steps: ['Understand requirement', 'Identify risk', 'Build environment', 'Exercise main + boundary paths', 'Capture evidence', 'Approve or request changes', 'Track blockers'] },
  { type: 'Production support', steps: ['Confirm impact', 'Restore or mitigate', 'Find root cause', 'Verify correction', 'Prevent recurrence', 'Record the incident'] },
]

export const interviewMap = [
  ['QA infrastructure', 'LocalStack #1057', 'Dataverse.jl #38'],
  ['Production support', 'Installations #337', 'OnePlus factual incident'],
  ['Hidden regression', 'Guestbook / Terms #12220', 'Password reset #12544'],
  ['CI noise vs defect', 'Guestbook / Terms #12220', 'LocalStack readiness'],
  ['Security / authorization', 'Assignable roles #11919', 'LocalStack fork secrets'],
  ['PR QA', 'Featured Items #12381', 'Password reset #12544'],
  ['Automated regression', 'Python 3.14 #247', 'Metadata #249'],
  ['Minimal-risk fix', 'Infinite scroll #1050', 'Metadata #249'],
  ['Data integrity', 'Edit latest metadata #1039', 'Relation raw values #1048'],
  ['Reviewer feedback', 'LocalStack #1057', 'Relation labels #1048'],
  ['Failure / learning', 'Previewers / NcML', 'OnePlus factual incident'],
  ['Initiative', 'Validation proposal #254', 'Dataverse.jl #38'],
] as const

export const scopeBoundaries = [
  { label: 'Not counted as Philip-assigned delivery', items: ['Dataverse.jl #36 / PR #38 — self-directed after Philip shared it', 'pyDataverse #254 — self-directed proposal', 'Initial pyDataverse dataset creation — onboarding exercise'] },
  { label: 'Interest, not assignment', items: ['Training Resources greenfield app — strongest area of interest, but no formal scope yet'] },
  { label: 'No delivery evidence', items: ['Frontend PRs #997, #1012, and #944 — QA candidates only', 'Frontend #1062 and #1063 — accepted but not started'] },
]

export const intro = `Hi, I’m Shihua Yu. My background combines software quality assurance, automation, technical triage, and software engineering. At OnePlus, I tested user-facing software, built Python-based validation and reporting workflows, and coordinated complex issues across QA, product, and engineering teams.

More recently, I’ve contributed directly to Dataverse through backend and frontend QA, authorization and regression reviews, CI infrastructure, and production-facing fixes. My most relevant work includes building the LocalStack development and CI environment, identifying a Terms of Access regression during QA, and resolving the installations map problem through production verification.

I’m interested in this role because it combines the areas I enjoy most: structured QA, troubleshooting, release reliability, and collaboration around open research infrastructure.`
