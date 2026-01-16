# Screenshots folder (reference + replaceable)

This guide shows **one screenshot per step**.

✅ This folder now ships with **portal-like reference screenshots** generated for documentation consistency.

> Note: These are **not captured from your tenant**. Replace them with your own Azure/Fabric/Databricks portal captures whenever you want “actual implementation” images.

## Folder structure

Screenshots live at:

```
assets/screens/<project-id>/step-XX.png
```

Where:
- `<project-id>` matches an ID in `js/projects.js` (example: `p03-hubspoke-firewall-avd`)
- `XX` is the 2-digit step number (example: `step-03.png`)

## Example

```
assets/screens/p03-hubspoke-firewall-avd/step-01.png
assets/screens/p03-hubspoke-firewall-avd/step-02.png
assets/screens/p03-hubspoke-firewall-avd/step-03.png
...
```

## Tips for real implementation screenshots

- Use your own tenant/subscription so screenshots match your naming standards/policies.
- Blur/remove sensitive info (subscription IDs, emails, IPs, secrets).
- Capture the **exact blade** referenced by the step (Overview, Networking, Diagnostics, etc.).
- Keep the same filename so the site swaps automatically.

If an image is missing, the UI will fall back to `assets/screens/placeholder.png`.
