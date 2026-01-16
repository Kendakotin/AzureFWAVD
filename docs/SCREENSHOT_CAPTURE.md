# Screenshot capture plan (real Azure portal images)

You asked for **real implementation screenshots** for every step.
This repo can’t generate those automatically because they depend on **your tenant, subscription, and configuration**.

## What to capture per step

For each step in each project, capture a screenshot showing:
1. The **Azure portal blade** where you performed the action (or the relevant UI in Fabric/Databricks).
2. The **resulting state** (e.g., resource created, policy assigned, diagnostic settings enabled, pipeline run succeeded).

## Naming convention

Put your screenshots here:

```
assets/screens/<project-id>/step-XX.png
```

Examples:
- `assets/screens/p01-fabric-warehouse/step-01.png`
- `assets/screens/p03-hubspoke-firewall-avd/step-04.png`

## Minimum “proof” shots (recommended)

Even if you later refine the guide, these shots make the walkthrough credible:
- **Create** screen (wizard page)
- **Review + create** (validation passed)
- **Deployment** page (Succeeded)
- **Resource Overview** page (shows name/resource group/region)
- **Key settings** blades (Networking, Identity, Monitoring/Diagnostics, Security)

## Sanitization

Before committing or sharing screenshots:
- Blur emails, subscription IDs, tenant IDs, public IPs, secrets/keys, and customer names.
- Prefer using **test subscriptions** and **non-production data**.

## Tip: capture faster

- Use the Azure portal “Copy link” feature to return to the same blade for re-capture.
- Use browser extensions to blur/box sensitive areas.
- Keep your browser at a consistent zoom (100%) so the website layout stays uniform.
