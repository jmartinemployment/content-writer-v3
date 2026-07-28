# Content Writer V3 — Monitoring & Operations Guide

**Purpose**: Help operations team monitor and maintain Content Writer V3 system in production

---

## 📊 Key Metrics to Monitor

### Application Health

| Metric | Normal Range | Alert Threshold | Check Interval |
|--------|--------------|-----------------|-----------------|
| **Error Rate** | <0.1% | >1% | 5 minutes |
| **API Latency (p95)** | <200ms | >1000ms | 5 minutes |
| **API Latency (p99)** | <500ms | >2000ms | 5 minutes |
| **Requests/sec** | 10-100 | >1000 | 5 minutes |
| **Database Connections** | 5-20 | >80 | 5 minutes |
| **Memory Usage** | <60% | >85% | 5 minutes |
| **CPU Usage** | <40% | >80% | 5 minutes |
| **Disk Space (DB)** | <70% | >90% | 15 minutes |

### Business Metrics

| Metric | Meaning | Where to Find |
|--------|---------|---------------|
| **Active Users** | Users currently using the app | Vercel Analytics |
| **Page Load Time** | Frontend load time | Vercel Analytics + APM |
| **API Success Rate** | % of API calls that succeed | Datadog/NewRelic |
| **Database Query Time** | Avg time per DB query | Datadog/NewRelic |

---

## 🔴 Alert Configuration

### Critical Alerts (Immediate Page)

```
Error Rate > 5%
API Latency > 2000ms
Database Down
Service Unreachable
Disk Space > 90%
Memory Leak Detected
```

**Action**: Page on-call engineer immediately  
**Response Time**: <5 minutes

### Warning Alerts (Slack Notification)

```
Error Rate > 1%
API Latency > 1000ms
Memory Usage > 80%
Database Connections > 80
Slow Query (>1s)
Failed Deployment
```

**Action**: Monitor and log  
**Response Time**: <15 minutes

### Info Alerts (Log Only)

```
High Traffic (>500 req/sec)
Slow Startup (>5s)
Memory Fragmentation
Cache Miss Rate > 50%
API Key Approaching Expiry
```

**Action**: Log for analysis  
**Response Time**: None

---

## 📈 Dashboards to Create

### 1. Operations Dashboard (Real-time Status)

**For**: On-call engineers, ops team

**Panels**:
- Service health (up/down)
- Error rate (trending)
- API latency (p50, p95, p99)
- Database connections
- Memory/CPU usage
- Recent errors (top 10)
- Deployment history

**Refresh Rate**: 30 seconds

### 2. Performance Dashboard (Optimization)

**For**: Platform/performance team

**Panels**:
- Request latency distribution
- Database query breakdown (by resource)
- Slow endpoint list
- N+1 query detection
- Cache hit rate
- Network latency (API → DB)
- External service latency

**Refresh Rate**: 5 minutes

### 3. Business Metrics Dashboard

**For**: Product/business stakeholders

**Panels**:
- Daily active users
- Successful operations (create campaign, etc.)
- Failed operations (errors)
- Popular endpoints
- User geography
- Browser/device breakdown
- Feature usage (if tracked)

**Refresh Rate**: 1 hour

### 4. Capacity Planning Dashboard

**For**: Platform team

**Panels**:
- Database size growth
- API request volume trend
- Storage utilization forecast
- Connection pool utilization
- Memory trend
- Cost per request
- Infrastructure usage

**Refresh Rate**: 1 hour

---

## 🔍 Common Issues & Solutions

### Issue 1: High Error Rate (>1%)

**Diagnosis**:
1. Check error type distribution
   - Database errors? → Check DB health
   - API errors? → Check logs
   - Client errors? → Check browser console
2. Check affected endpoints
3. Check recent changes
4. Check third-party services

**Solutions**:
- If DB down: Restart PostgreSQL
- If API down: Restart GeekAPI service
- If frontend down: Check Vercel deployment
- If code issue: Rollback last deployment

### Issue 2: High API Latency (>1000ms)

**Diagnosis**:
1. Is database slow? → Check query times
2. Is network slow? → Check network traces
3. Is service overloaded? → Check CPU/memory
4. Are there many slow queries? → Check slow query log

**Solutions**:
- Add database index for slow query
- Optimize query logic
- Scale service (add replicas)
- Enable caching
- Enable CDN

### Issue 3: Database Connections Exhausted

**Diagnosis**:
1. Check active connections
2. Check idle connections
3. Check connection pool settings
4. Check for connection leaks

**Solutions**:
- Increase connection pool size
- Kill idle connections
- Close unused database connections
- Deploy connection pooler (PgBouncer)

### Issue 4: Memory Leak

**Diagnosis**:
1. Monitor memory usage over time
2. Check for increasing heap size
3. Look for unclosed connections
4. Check for event listener leaks

**Solutions**:
- Restart service (temporary)
- Find memory leak in code
- Increase memory allocation (temporary)
- Deploy fix and redeploy

### Issue 5: Slow Database

**Diagnosis**:
1. Check query execution plans
2. Check for missing indexes
3. Check for N+1 queries
4. Check table sizes

**Solutions**:
- Add missing indexes
- Optimize slow queries
- Enable query caching
- Archive old data
- Scale database (upgrade instance)

---

## 📋 Runbooks

### Runbook 1: Database Down

**Symptoms**: Database connection errors in logs

**Steps**:
1. SSH to database server
2. Check if PostgreSQL is running: `systemctl status postgresql`
3. If stopped: `systemctl start postgresql`
4. Check database: `psql -d content_writer_v3 -c "SELECT 1"`
5. If failed, check logs: `/var/log/postgresql/postgresql.log`
6. Restart services if needed

**Escalation**: If still down, contact database provider

### Runbook 2: API Service Down

**Symptoms**: 502 Bad Gateway, connection refused

**Steps**:
1. Check service status on Railway dashboard
2. Check recent deployments
3. Check application logs
4. Try restarting service: Railway UI → Restart
5. Check health endpoint: `curl https://api.geekatyourspot.com/health`
6. If health endpoint works but app is slow, restart service

**Escalation**: If restart doesn't fix, check recent code changes

### Runbook 3: High Error Rate

**Symptoms**: Error rate > 1%, alerts triggered

**Steps**:
1. Check error logs for patterns
2. Check which endpoints are failing
3. Is it a specific resource? → Check that service
4. Is it all endpoints? → Check authentication
5. Check recent deployments
6. If recent deployment → Consider rollback
7. Look at error messages for root cause

**Escalation**: Ping on-call engineer, prepare rollback

### Runbook 4: Rollback Procedure

**When to Rollback**: 
- Critical errors (>5%)
- Service unavailable (>30 min)
- Data corruption
- Security issue

**Steps**:
1. Alert stakeholders on Slack/email
2. Verify rollback plan with team lead
3. Rollback frontend: Vercel → Deployments → Previous version → Promote
4. Rollback GeekAPI: Railway → Deployments → Previous version
5. Rollback GeekRepository: Railway → Deployments → Previous version
6. Verify system health
7. Announce rollback completion
8. Plan re-deployment for next day

**Time Estimate**: 15-30 minutes

### Runbook 5: Database Emergency Backup

**When to Backup**:
- Before major changes
- Regular scheduled backups
- Before deployments

**Steps**:
1. SSH to database server
2. Run backup: `pg_dump -Fc content_writer_v3 > backup.dump`
3. Upload to secure storage (S3/GCS)
4. Verify backup: `pg_restore -l backup.dump | head`

**Restore**:
1. Create new database: `createdb content_writer_v3_restore`
2. Restore from backup: `pg_restore -d content_writer_v3_restore backup.dump`
3. Verify: `psql -d content_writer_v3_restore -c "SELECT count(*) FROM campaigns"`

---

## 🔐 Security Monitoring

### API Key Rotation Schedule
- **Rotation Interval**: 90 days
- **Before Rotation**: Generate new key
- **During Rotation**: Update environment variables
- **After Rotation**: Revoke old key after 24 hours

### Database Password Rotation
- **Rotation Interval**: 180 days
- **Process**: Change password on Railway, update env vars, restart services

### Certificate Monitoring
- **Check Expiry**: Monthly
- **Renew Before**: 30 days before expiry
- **Auto-renew**: Enable Let's Encrypt auto-renewal

### Security Logging
- **Log Failed Auth Attempts**: Yes
- **Log API Key Usage**: Yes (anonymized)
- **Log Data Access**: Yes (for compliance)
- **Retention**: 90 days

---

## 📞 Support Escalation

### Tier 1: Initial Response (On-Call Engineer)
- Acknowledge alert
- Triage issue
- Check logs and dashboards
- Attempt fix if obvious
- If not obvious → escalate to Tier 2

**Response Time**: 5-15 minutes  
**SLA**: Acknowledge within 5 min

### Tier 2: Advanced Troubleshooting (Lead Engineer)
- Deep dive into issue
- Complex debugging
- Coordinate with team
- Make major decisions (rollback, etc.)
- Notify stakeholders

**Response Time**: 15-30 minutes  
**Availability**: During business hours + on-call rotation

### Tier 3: Strategic Decisions (VP Engineering)
- Customer communication decisions
- Escalation beyond technical team
- Resource allocation
- Post-mortem decisions

**Response Time**: As needed  
**Availability**: Business hours

---

## 📊 Daily Operations Checklist

### Start of Day (9 AM)
- [ ] Check overnight alerts
- [ ] Review error logs
- [ ] Check dashboard for anomalies
- [ ] Verify no deployments failed
- [ ] Check database size/growth
- [ ] Check SSL certificate expiry

### Mid-Day (12 PM)
- [ ] Review performance metrics
- [ ] Check any slow endpoints
- [ ] Verify backups completed
- [ ] Check for growth trends

### End of Day (5 PM)
- [ ] Document any issues
- [ ] Update runbooks if needed
- [ ] Handoff to night shift
- [ ] Verify monitoring is working
- [ ] Check tomorrow's scheduled tasks

### Weekly (Friday)
- [ ] Review all metrics for week
- [ ] Update capacity planning
- [ ] Review incidents that occurred
- [ ] Plan optimizations for next week

### Monthly (1st of Month)
- [ ] Full system health review
- [ ] Rotate credentials
- [ ] Review and update runbooks
- [ ] Capacity planning update
- [ ] Cost analysis
- [ ] Security audit checklist

---

## 🎯 Performance Baselines

### Establish & Track These Metrics

**Baseline (Should Measure On Day 1)**:
- API response time: _______
- Database query time: _______
- Frontend load time: _______
- Error rate: _______

**These metrics allow you to detect degradation**:
- Compare week-over-week
- Compare month-over-month
- Trend over time
- Correlate with deployments

---

## 📱 Notification Channels

### Slack Channels
- `#content-writer-production` — All prod alerts
- `#content-writer-incidents` — Critical incidents only
- `#content-writer-deployments` — Deployment notifications

### Email Distribution List
- `content-writer-on-call@company.com` — Emergency escalation
- `content-writer-engineers@company.com` — General updates

### PagerDuty (Recommended)
- Set up on-call rotations
- Escalation policies
- SMS/phone alerts for critical

### Status Page (for customers)
- https://status.geekatyourspot.com
- Update during incidents
- Post-mortem documentation

---

## 🔄 Regular Maintenance Tasks

### Daily
- Monitor error rates
- Check for anomalies
- Review logs

### Weekly
- Performance review
- Capacity check
- Database maintenance

### Monthly
- Credential rotation
- Security audit
- Capacity planning
- Cost review

### Quarterly
- Full audit
- Performance optimization review
- Disaster recovery test
- Training update

---

## 📞 Useful Links

- **Datadog Dashboard**: https://app.datadoghq.com (your account)
- **Railway Dashboard**: https://railway.app (your account)
- **Vercel Dashboard**: https://vercel.com (your account)
- **Status Page**: https://status.geekatyourspot.com
- **GitHub Repo**: https://github.com/your-org/content-writer-v3
- **Documentation**: https://docs.geekatyourspot.com

---

## ✅ Quick Reference Card (Print & Post)

```
CRITICAL ALERT → Page on-call immediately
- Error rate > 5%
- API down
- Database down
- No backups

WARNING ALERT → Log and monitor
- Error rate > 1%
- High latency
- Memory high
- Slow queries

KEY CONTACTS:
On-Call: ________________
Lead: _________________
VP: __________________
DB Support: ____________

EMERGENCY PROCEDURES:
- Rollback: See Runbook 4
- Restart Services: Railway UI
- DB Emergency: See Runbook 5
- Network Down: Contact provider
```

---

**Last Updated**: July 28, 2026  
**Review Schedule**: Monthly  
**Next Review Date**: August 28, 2026
