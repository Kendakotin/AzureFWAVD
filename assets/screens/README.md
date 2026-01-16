# Screenshots folder (bring your own real portal captures)

This website is designed to show **one screenshot per step**.

## Folder structure

Place screenshots in:

```
assets/screens/<project-id>/step-XX.png
```

Where:
- `<project-id>` is one of the IDs in `js/projects.js` (example: `p03-hubspoke-firewall-avd`)
- `XX` is the 2-digit step number (example: `step-03.png`)

## Example

```
assets/screens/p03-hubspoke-firewall-avd/step-01.png
assets/screens/p03-hubspoke-firewall-avd/step-02.png
assets/screens/p03-hubspoke-firewall-avd/step-03.png
...
```

## Tips for "real" implementation screenshots

- Use your own tenant/subscription, so screenshots match your naming standards and policies.
- Remove or blur sensitive data (subscription IDs, emails, public IPs, secrets).
- Capture the *exact blade* referenced by the step (Overview, Networking, Diagnostics settings, etc.).

If a screenshot is missing, the UI will show a placeholder image.
