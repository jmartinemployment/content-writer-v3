# Content Writer V3 — API Reference Guide

**Base URL**: `http://localhost:5000/api/content-writer/v3` (local)  
**Production**: `https://api.geekatyourspot.com/api/content-writer/v3`

**Authentication**: 
- Bearer token (from `/auth/me`) in `Authorization: Bearer {token}` header
- OR API Key in `X-API-Key: {key}` header (backend testing)

---

## Campaigns

### Get Campaign by ID
```
GET /campaigns/{id}
Parameters: id (guid)
Response: ContentCampaignDto
```

### List Campaigns by Client
```
GET /campaigns?clientId={clientId}
Parameters: clientId (guid)
Response: List<ContentCampaignDto>
```

### Create Campaign
```
POST /campaigns
Body: { clientId, name }
Response: ContentCampaignDto
```

### Update Campaign Status
```
PATCH /campaigns/{id}/status
Body: { status }
Response: ContentCampaignDto
```

---

## Assets

### Get Asset by ID
```
GET /assets/{id}
Parameters: id (guid)
Response: ContentAssetDto
```

### List Assets by Campaign
```
GET /assets?campaignId={campaignId}
Parameters: campaignId (guid)
Response: List<ContentAssetDto>
```

### Create Asset
```
POST /assets
Body: { campaignId, name, type }
Response: ContentAssetDto
```

### Delete Asset
```
DELETE /assets/{id}
Parameters: id (guid)
Response: 204 No Content
```

---

## Drafts (ContentAssetVersion)

### Get Draft by ID
```
GET /drafts/{id}
Parameters: id (guid)
Response: ContentAssetVersionDto
```

### List Drafts for Asset
```
GET /drafts?assetId={assetId}
Parameters: assetId (guid)
Response: List<ContentAssetVersionDto>
```

### Create Draft
```
POST /drafts
Body: { assetId, bodyDocumentJson }
Response: ContentAssetVersionDto
```

### Update Draft
```
PATCH /drafts/{id}
Body: { bodyDocumentJson }
Response: ContentAssetVersionDto
```

---

## Keywords

### Get Keyword by ID
```
GET /keywords/{id}
Parameters: id (guid)
Response: KeywordCandidateDto
```

### List Keywords by Client
```
GET /keywords?clientId={clientId}
Parameters: clientId (guid)
Response: List<KeywordCandidateDto>
```

### Create Keyword
```
POST /keywords
Body: { clientId, keyword, difficulty, volume }
Response: KeywordCandidateDto
```

### Update Keyword Status
```
PATCH /keywords/{id}/status
Body: { status }
Response: KeywordCandidateDto
```

---

## Research

### Get Research Run by ID
```
GET /research-runs/{id}
Parameters: id (guid)
Response: ResearchRunDto
```

### List Research Runs by Campaign
```
GET /research-runs?campaignId={campaignId}
Parameters: campaignId (guid)
Response: List<ResearchRunDto>
```

### Create Research Run
```
POST /research-runs
Body: { campaignId, keyword, maxBudget }
Response: ResearchRunDto
```

### Update Research Run Status
```
PATCH /research-runs/{id}/status
Body: { status }
Response: ResearchRunDto
```

### Get Research Source by ID
```
GET /research-sources/{id}
Parameters: id (guid)
Response: ResearchSourceDto
```

### List Research Sources by Run
```
GET /research-sources?researchRunId={researchRunId}
Parameters: researchRunId (guid)
Response: List<ResearchSourceDto>
```

### Create Research Source
```
POST /research-sources
Body: { researchRunId, url, title, relevanceScore }
Response: ResearchSourceDto
```

### Get Research Evidence by ID
```
GET /research-evidence/{id}
Parameters: id (guid)
Response: ResearchEvidenceDto
```

### List Research Evidence by Source
```
GET /research-evidence?sourceId={sourceId}
Parameters: sourceId (guid)
Response: List<ResearchEvidenceDto>
```

### Create Research Evidence
```
POST /research-evidence
Body: { sourceId, quoteText, pageNumber }
Response: ResearchEvidenceDto
```

### Approve Research Evidence
```
POST /research-evidence/{id}/approve
Parameters: id (guid)
Response: ResearchEvidenceDto
```

---

## Reviews

### Get Review Comment by ID
```
GET /review-comments/{id}
Parameters: id (guid)
Response: ReviewCommentDto
```

### List Review Comments by Asset Version
```
GET /review-comments?assetVersionId={assetVersionId}
Parameters: assetVersionId (guid)
Response: List<ReviewCommentDto>
```

### Create Review Comment
```
POST /review-comments
Body: { assetVersionId, userId, sectionPath, content }
Response: ReviewCommentDto
```

### Resolve Review Comment
```
PATCH /review-comments/{id}/resolve
Body: { resolution }
Response: ReviewCommentDto
```

### Get Approval Event by ID
```
GET /approval-events/{id}
Parameters: id (guid)
Response: ApprovalEventDto
```

### List Approval Events by Asset Version
```
GET /approval-events?assetVersionId={assetVersionId}
Parameters: assetVersionId (guid)
Response: List<ApprovalEventDto>
```

### Create Approval Event
```
POST /approval-events
Body: { assetVersionId, userId, action, notes }
Response: ApprovalEventDto
```

---

## Publications

### Get Publication by ID
```
GET /publications/{id}
Parameters: id (guid)
Response: PublicationDto
```

### Create Publication
```
POST /publications
Body: { assetVersionId, targetUrl }
Response: PublicationDto
```

### Update Publication Status
```
PATCH /publications/{id}/status
Body: { status }
Response: PublicationDto
```

### Get Publication Event by ID
```
GET /publication-events/{id}
Parameters: id (guid)
Response: PublicationEventDto
```

### List Publication Events by Publication
```
GET /publication-events?publicationId={publicationId}
Parameters: publicationId (guid)
Response: List<PublicationEventDto>
```

### Create Publication Event
```
POST /publication-events
Body: { publicationId, userId, status, details }
Response: PublicationEventDto
```

---

## Pain Points (Insights)

### Get Pain Point by ID
```
GET /pain-points/{id}
Parameters: id (guid)
Response: PainPointDto
```

### List Pain Points by Client
```
GET /pain-points?clientId={clientId}
Parameters: clientId (guid)
Response: List<PainPointDto>
```

### Create Pain Point
```
POST /pain-points
Body: { clientId, title, description, difficulty, importance }
Response: PainPointDto
```

### Update Pain Point
```
PATCH /pain-points/{id}
Body: { title, description, difficulty, importance }
Response: PainPointDto
```

### Mark Pain Point Stale
```
POST /pain-points/{id}/mark-stale
Parameters: id (guid)
Response: PainPointDto
```

---

## Workspaces & Clients

### Get Workspace by ID
```
GET /workspaces/{id}
Parameters: id (guid)
Response: WorkspaceDto
```

### Create Workspace
```
POST /workspaces
Body: { name }
Response: WorkspaceDto
```

### Get Client by ID
```
GET /clients/{id}
Parameters: id (guid)
Response: ClientDto
```

### List Clients by Workspace
```
GET /clients?workspaceId={workspaceId}
Parameters: workspaceId (guid)
Response: List<ClientDto>
```

### Create Client
```
POST /clients
Body: { workspaceId, name }
Response: ClientDto
```

---

## Client Profiles

### Get Client Profile by ID
```
GET /client-profiles/{id}
Parameters: id (guid)
Response: ClientProfileDto
```

### Get Client Profile by Client ID
```
GET /client-profiles/by-client/{clientId}
Parameters: clientId (guid)
Response: ClientProfileDto
```

### Create Client Profile
```
POST /client-profiles
Body: { clientId, name }
Response: ClientProfileDto
```

### Get Client Profile Version by ID
```
GET /client-profile-versions/{id}
Parameters: id (guid)
Response: ClientProfileVersionDto
```

### List Client Profile Versions
```
GET /client-profile-versions?profileId={profileId}
Parameters: profileId (guid)
Response: List<ClientProfileVersionDto>
```

### Create Client Profile Version
```
POST /client-profile-versions
Body: { profileId, approvedFacts, prohibitedClaims }
Response: ClientProfileVersionDto
```

### Get Client Brand Voice Link by ID
```
GET /client-brand-voice-links/{id}
Parameters: id (guid)
Response: ClientBrandVoiceLinkDto
```

### List Client Brand Voice Links
```
GET /client-brand-voice-links?profileVersionId={profileVersionId}
Parameters: profileVersionId (guid)
Response: List<ClientBrandVoiceLinkDto>
```

### Create Client Brand Voice Link
```
POST /client-brand-voice-links
Body: { profileVersionId, brandVoiceId }
Response: ClientBrandVoiceLinkDto
```

---

## Reconciliation

### Get Reconciliation Proposal by ID
```
GET /reconciliation/{id}
Parameters: id (guid)
Response: ReconciliationProposalDto
```

### List Reconciliation Proposals by Research Run
```
GET /reconciliation?researchRunId={researchRunId}
Parameters: researchRunId (guid)
Response: List<ReconciliationProposalDto>
```

### Create Reconciliation Proposal
```
POST /reconciliation
Body: { researchRunId, proposalType, painPointId, proposedData }
Response: ReconciliationProposalDto
```

### Approve Reconciliation Proposal
```
PATCH /reconciliation/{id}/approve
Body: { userId }
Response: ReconciliationProposalDto
```

### Dismiss Reconciliation Proposal
```
PATCH /reconciliation/{id}/dismiss
Body: { userId }
Response: ReconciliationProposalDto
```

---

## Jobs

### Get Job by ID
```
GET /jobs/{id}
Parameters: id (guid)
Response: JobDto
```

### List Jobs by Status
```
GET /jobs/by-status/{status}?limit={limit}
Parameters: status (string), limit (int, default: 100)
Response: List<JobDto>
```

### Create Job
```
POST /jobs
Body: { jobType, payloadJson, idempotencyKey }
Response: JobDto
```

### Lease Job
```
POST /jobs/{id}/lease
Body: { leaseOwner, leaseDuration }
Response: JobDto
```

### Release Job Lease
```
POST /jobs/{id}/release-lease
Parameters: id (guid)
Response: JobDto
```

---

## Authentication

### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer {token}
Response: { id, email, clientId, workspaceId }
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "status": 400,
  "message": "Error description",
  "errors": {
    "field": ["error message"]
  }
}
```

### Common Status Codes

- `200` — Success (GET, PATCH, POST with response body)
- `204` — No Content (DELETE, successful with no body)
- `400` — Bad Request (validation error)
- `401` — Unauthorized (missing/invalid auth)
- `404` — Not Found (resource doesn't exist)
- `500` — Server Error (unexpected error)

---

## Response Pagination

Endpoints returning lists do not currently implement pagination. For large datasets, consider:
1. Adding `?limit=` parameter (already supported on some endpoints)
2. Implement offset-based pagination
3. Implement cursor-based pagination

**Future Enhancement**: Add pagination support to all list endpoints.

---

## Rate Limiting

Currently: No rate limiting implemented.

**Production Recommendation**: Add rate limiting:
- 1000 requests/minute per IP
- 100 requests/minute per API key
- Implement exponential backoff on client side

---

## Timeouts

- Default HTTP timeout: 30 seconds
- Database query timeout: 30 seconds
- Recommended client retry: 3 attempts with exponential backoff

---

## Example Requests

### Using curl (with API Key)
```bash
curl -H "X-API-Key: your-api-key" \
  "http://localhost:5000/api/content-writer/v3/campaigns?clientId=123e4567-e89b-12d3-a456-426614174000"
```

### Using curl (with Bearer Token)
```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  "http://localhost:5000/api/content-writer/v3/campaigns?clientId=123e4567-e89b-12d3-a456-426614174000"
```

### Using JavaScript/Fetch
```javascript
const response = await fetch(
  'http://localhost:5000/api/content-writer/v3/campaigns?clientId=...',
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);
const data = await response.json();
```

### Using TypeScript/Frontend Client
```typescript
import { apiClient } from '@/lib/api';

const campaigns = await apiClient.get<ContentCampaign[]>(
  `/content-writer/v3/campaigns?clientId=${clientId}`
);
```

---

## Testing Endpoints

### Using Postman
1. Import collection (TODO: Create Postman collection)
2. Set variables: `base_url`, `token`, `api_key`
3. Run individual requests or full test suite

### Using Thunder Client (VS Code)
1. Copy examples above into Thunder Client
2. Set headers: `Authorization: Bearer {token}`
3. Test each endpoint

### Using curl Scripts
```bash
#!/bin/bash
BASE_URL="http://localhost:5000/api/content-writer/v3"
API_KEY="dev-api-key"

# Get campaigns
curl -H "X-API-Key: $API_KEY" \
  "$BASE_URL/campaigns?clientId=..."
```

---

## API Changelog

### Version 1.0 (Initial Release - July 28, 2026)
- All 45 endpoints implemented
- Bearer token authentication
- API key authentication
- CORS enabled
- Error handling standardized

### Planned Future Versions
- [ ] Pagination on all list endpoints
- [ ] Rate limiting
- [ ] Webhook support
- [ ] Batch operations endpoint
- [ ] GraphQL support (optional)

---

## Support & Issues

**Documentation**: See `/content-writer-v3/DEPLOYMENT.md`  
**Quick Start**: See `/content-writer-v3/QUICKSTART.md`  
**Troubleshooting**: See `/content-writer-v3/DEPLOYMENT.md` (troubleshooting section)

**For API-specific issues**:
1. Check response status code and error message
2. Verify authentication headers
3. Confirm request body format matches specification
4. Check backend logs for detailed error
5. Review DEPLOYMENT.md troubleshooting guide
