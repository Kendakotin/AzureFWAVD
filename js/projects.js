window.KENDAKS_PROJECTS = [
  {
    "id": "p01-fabric-warehouse",
    "title": "Data Warehousing on Microsoft Fabric (Lakehouse + Warehouse)",
    "category": "Data & Analytics",
    "scenario": "Scenario: A BPO needs a modern analytics platform to consolidate CRM, ticketing, and finance data for daily SLA reporting. Example: 'Kendaks Support' ingests 20+ sources, supports self‑serve Power BI, and enforces governance.",
    "architectureImage": "assets/diagrams/01_fabric_warehouse.svg",
    "lowLevelArchitecture": "<h4>Capacity &amp; workspaces</h4>\n<ul>\n<li><b>Capacities</b>: <code>cap-fabric-npr</code> (DEV/TST), <code>cap-fabric-prd</code> (PRD).</li>\n<li><b>Workspaces</b>: <code>ws-dwh-dev</code>, <code>ws-dwh-tst</code>, <code>ws-dwh-prd</code>.</li>\n<li><b>Entra groups</b> (assign roles via groups only): <code>FAB-DataEngineers</code>, <code>FAB-DataAnalysts</code>, <code>FAB-DataStewards</code>, <code>FAB-ReleaseApprovers</code>. Use PIM for admin roles.</li>\n</ul>\n\n<h4>Data zones in OneLake (medallion)</h4>\n<ul>\n<li><b>Bronze</b>: raw append-only files under <code>/Files/bronze/&lt;source&gt;/&lt;entity&gt;/ingest_date=YYYY-MM-DD/</code>.</li>\n<li><b>Silver</b>: conformed Delta tables <code>/Tables/silver_*</code> (DQ checks + dedupe + standard types).</li>\n<li><b>Gold</b>: business-ready tables <code>/Tables/gold_*</code> feeding the curated Warehouse.</li>\n</ul>\n\n<h4>Core Fabric items (per workspace)</h4>\n<ul>\n<li>Lakehouses: <code>lh_bronze</code>, <code>lh_silver</code>, <code>lh_gold</code>.</li>\n<li>Warehouse: <code>wh_curated</code> (facts/dims; RLS where required).</li>\n<li>Pipelines/Dataflows Gen2: ingestion + transforms; notebooks optional for Spark transforms.</li>\n</ul>\n\n<h4>Connectivity to sources</h4>\n<ul>\n<li><b>SaaS sources</b>: Dataflows Gen2 / Pipeline connectors (incremental where supported).</li>\n<li><b>Azure sources</b>: Pipelines Copy activity (watermark/CDC patterns).</li>\n<li><b>On-prem</b>: hardened Data Gateway nodes (recommend 2 for HA) + secrets in Key Vault + patching via Update Manager.</li>\n</ul>\n\n<h4>Observability &amp; reliability</h4>\n<ul>\n<li>Track pipeline failures, durations, rows processed, refresh success, and capacity utilization.</li>\n<li>Persist DQ results (e.g., null %, duplicates) in a Gold ops table like <code>gold_ops_dq_results</code>, alert on thresholds.</li>\n</ul>\n\n<h4>CI/CD &amp; promotion</h4>\n<ul>\n<li>Git-enabled workspace; promote DEV \u2192 TST \u2192 PRD with approval gates.</li>\n<li>Parameterize connections/workspace IDs; block breaking schema changes with contract + DQ tests.</li>\n</ul>\n\n<h4>DR notes</h4>\n<ul>\n<li>Fabric is managed; DR focuses on reproducibility (Git + pipelines), gateway HA, and recoverable sources.</li>\n</ul>\n\n<h4>Mermaid (copy/paste)</h4>\n<pre><code>flowchart LR\n  subgraph Sources\n    SaaS[SaaS Apps]\n    SQL[(Azure SQL / MI)]\n    OP[(On-Prem DBs)]\n  end\n  subgraph Support\n    GW[Data Gateway (HA)]\n    KV[Key Vault]\n  end\n  subgraph Fabric\n    P[Pipelines / Dataflows]\n    B[OneLake Bronze]\n    S[OneLake Silver]\n    G[OneLake Gold]\n    WH[Warehouse Curated]\n    BI[Power BI Semantic Model]\n    NB[Notebooks (optional)]\n  end\n  OP --> GW --> P\n  KV --> GW\n  SaaS --> P\n  SQL --> P\n  P --> B --> NB --> S --> NB --> G --> WH --> BI</code></pre>",
    "steps": [
      {
        "icon": "plan",
        "title": "Design your warehouse model and domains",
        "body": "<ul><li>Define business domains (Operations, Finance, QA) and data products.</li><li>Choose star schema for BI and medallion (bronze/silver/gold) for lakehouse.</li><li>Agree on refresh SLAs and retention.</li></ul>",
        "code": ""
      },
      {
        "icon": "data",
        "title": "Provision Fabric workspace, OneLake and core items",
        "body": "<ul><li>Create a Fabric workspace and capacity (if required).</li><li>Create a Lakehouse (bronze/silver/gold) and a Warehouse for curated marts.</li><li>Set item permissions using workspace roles.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Ingest data using Data Factory / Fabric pipelines",
        "body": "<ul><li>Use Copy activity for batch loads; incremental via watermarks/CDC where possible.</li><li>Land raw data in OneLake (bronze) and validate schema.</li><li>Document sources and owners in a data catalog.</li></ul>",
        "code": "# Example: incremental load watermark concept\n# source_table WHERE modified_at > @last_watermark\n# store @new_watermark after load"
      },
      {
        "icon": "govern",
        "title": "Govern: naming, access, lineage, and sensitivity labels",
        "body": "<ul><li>Adopt naming: <code>dp-ops-*</code>, <code>dp-fin-*</code>, etc.</li><li>Use Purview or Fabric governance features for catalog and lineage.</li><li>Apply sensitivity labels and enforce least privilege.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Monitoring and reliability",
        "body": "<ul><li>Track pipeline failures, refresh durations, and capacity utilization.</li><li>Set alerts for SLA breaches and data freshness.</li><li>Implement 'data quality gates' before publishing gold tables.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Validate with BI workloads",
        "body": "<ul><li>Build a sample Power BI semantic model on the Warehouse.</li><li>Validate performance: partitioning, aggregations, and caching.</li><li>Run user acceptance tests with operations managers.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Microsoft Fabric documentation",
        "url": "https://learn.microsoft.com/en-us/fabric/"
      },
      {
        "title": "Data Factory in Microsoft Fabric (Pipelines)",
        "url": "https://learn.microsoft.com/en-us/fabric/data-factory/"
      },
      {
        "title": "OneLake overview",
        "url": "https://learn.microsoft.com/en-us/fabric/onelake/onelake-overview"
      }
    ]
  },
  {
    "id": "p02-databricks-lakehouse",
    "title": "Developing a Big Data Solution with Azure Databricks (Lakehouse)",
    "category": "Data & Analytics",
    "scenario": "Scenario: An e-commerce team needs scalable ETL and ML feature pipelines. Example: 'Kendaks Commerce' processes clickstream and order events for near‑real‑time recommendations.",
    "architectureImage": "assets/diagrams/02_databricks_lakehouse.svg",
    "lowLevelArchitecture": "<h4>Subscriptions &amp; resource groups</h4>\n<ul>\n<li>Subscriptions: <code>workloads-data-npr</code>, <code>workloads-data-prd</code>.</li>\n<li>RGs (per env/region): <code>rg-dbx-*-core</code> (workspace), <code>rg-dbx-*-data</code> (ADLS/KV/PE), <code>rg-dbx-*-mon</code> (monitoring). Databricks creates a managed RG automatically.</li>\n</ul>\n\n<h4>Network (hub-spoke, forced egress)</h4>\n<ul>\n<li>Primary VNet: <code>vnet-dbx-prd-eus</code> <code>10.20.0.0/16</code>; Secondary: <code>vnet-dbx-prd-cus</code> <code>10.21.0.0/16</code>.</li>\n<li>Subnets: <code>snet-dbx-private</code> (<code>10.20.1.0/24</code>), optional <code>snet-dbx-public</code> (<code>10.20.2.0/24</code>), <code>snet-pe</code> (<code>10.20.3.0/24</code>).</li>\n<li>UDR on Databricks subnets: <code>0.0.0.0/0</code> \u2192 Hub Azure Firewall (egress allowlist + logging).</li>\n</ul>\n\n<h4>Private endpoints + DNS</h4>\n<ul>\n<li>Private Endpoints (in <code>snet-pe</code>): ADLS Gen2 <code>dfs</code> + <code>blob</code>, Key Vault <code>vault</code> (plus SQL/Cosmos/Event Hubs if used).</li>\n<li>Private DNS zones: <code>privatelink.dfs.core.windows.net</code>, <code>privatelink.blob.core.windows.net</code>, <code>privatelink.vaultcore.azure.net</code>; link to spoke and (optionally) hub VNets.</li>\n</ul>\n\n<h4>Data plane (ADLS Gen2)</h4>\n<ul>\n<li>Storage: HNS-enabled account (e.g., <code>stlkh-prd-eus-001</code>).</li>\n<li>Containers: <code>bronze</code>, <code>silver</code>, <code>gold</code>, <code>checkpoint</code>, <code>logs</code>.</li>\n</ul>\n\n<h4>Governance (Unity Catalog-first)</h4>\n<ul>\n<li>Metastore per environment; catalogs like <code>cat_bronze</code>/<code>cat_silver</code>/<code>cat_gold</code>.</li>\n<li>External locations map to ADLS paths; grant to Entra groups (engineers/analysts) and job identity.</li>\n<li>Cluster policies enforce allowed node types, autoscale limits, init scripts, and logging.</li>\n</ul>\n\n<h4>CI/CD (IaC + workspace objects)</h4>\n<ul>\n<li>IaC (Bicep/Terraform): VNet/subnets/UDR/NSG, private endpoints + DNS, ADLS, Key Vault, Databricks workspace.</li>\n<li>Workspace deploy: Databricks Repos + job definitions as code; promote DEV\u2192TST\u2192PRD with approvals.</li>\n<li>Prefer secretless auth from CI using federated/OIDC where supported; runtime secrets via Key Vault-backed scopes.</li>\n</ul>\n\n<h4>Monitoring &amp; cost controls</h4>\n<ul>\n<li>Cluster/job logs to ADLS <code>logs/</code>; central alerts on job failure, streaming lag, and DBU spikes.</li>\n<li>Budgets + alerts per subscription; cluster policy to prevent oversized instances.</li>\n</ul>\n\n<h4>DR/HA (multi-region)</h4>\n<ul>\n<li>Replicate ADLS using GZRS/RA-GZRS where required; pre-provision secondary workspace and networking.</li>\n<li>Failover runbook: switch schedules to secondary, validate checkpoints, and resume pipelines.</li>\n</ul>\n\n<h4>Mermaid (copy/paste)</h4>\n<pre><code>flowchart TB\n  subgraph Hub[Hub VNet]\n    AFW[Azure Firewall]\n    DNS[Private DNS / Resolver]\n  end\n  subgraph Spoke[vnet-dbx-prd-eus 10.20.0.0/16]\n    DBXSNET[snet-dbx-private]\n    PESNET[snet-pe]\n    DBX[Databricks Workspace]\n    PEADLS[PE: ADLS dfs/blob]\n    PEKV[PE: Key Vault]\n  end\n  ADLS[(ADLS Gen2)]\n  KV[(Key Vault)]\n  DBX -->|UDR 0/0| AFW\n  DBX --> PEADLS --> ADLS\n  DBX --> PEKV --> KV\n  DNS --- Spoke</code></pre>",
    "steps": [
      {
        "icon": "plan",
        "title": "Decide landing zone and governance model",
        "body": "<ul><li>Pick subscription structure (dev/test/prod) and resource groups.</li><li>Decide whether to use Azure managed VNet for Databricks.</li><li>Plan Unity Catalog metastore and data access patterns.</li></ul>",
        "code": ""
      },
      {
        "icon": "network",
        "title": "Secure networking (Private Link where needed)",
        "body": "<ul><li>Deploy Databricks with VNet injection or managed VNet.</li><li>Use private endpoints for storage and key vault.</li><li>Restrict outbound with firewall/NAT and allowlisted FQDNs.</li></ul>",
        "code": ""
      },
      {
        "icon": "data",
        "title": "Create Delta Lake tables and medallion layers",
        "body": "<ul><li>Ingest raw (bronze) from Event Hubs/ADLS.</li><li>Transform to silver (clean) and gold (serving).</li><li>Use Delta features: schema evolution, time travel.</li></ul>",
        "code": "-- Example Delta table\nCREATE TABLE gold.orders\nUSING DELTA\nAS SELECT * FROM silver.orders_clean;"
      },
      {
        "icon": "govern",
        "title": "Implement Unity Catalog + RBAC",
        "body": "<ul><li>Use catalogs/schemas aligned to domains.</li><li>Grant privileges to groups via Unity Catalog.</li><li>Enable audit logs and set retention for compliance.</li></ul>",
        "code": ""
      },
      {
        "icon": "cicd",
        "title": "CI/CD for notebooks and jobs",
        "body": "<ul><li>Store notebooks in Git (Repos) and use deployment pipelines.</li><li>Use job clusters for predictable runs.</li><li>Promote configs via env variables/secret scopes.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Observability and cost controls",
        "body": "<ul><li>Enable cluster policies (limits, node types).</li><li>Track DBU usage and job duration.</li><li>Centralize logs to Log Analytics/SIEM.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Databricks documentation",
        "url": "https://learn.microsoft.com/en-us/azure/databricks/"
      },
      {
        "title": "Unity Catalog",
        "url": "https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/"
      }
    ]
  },
  {
    "id": "p03-hubspoke-firewall-avd",
    "title": "Azure Firewall Hub-and-Spoke Network with Azure Virtual Desktop",
    "category": "Networking & End-user Computing",
    "scenario": "Scenario: A BPO runs 24/7 agents on Azure Virtual Desktop and must enforce centralized egress/ingress inspection. Example: 'Kendaks BPO' uses a hub VNet with Azure Firewall and multiple spoke VNets for AVD host pools.",
    "architectureImage": "assets/diagrams/03_hubspoke_firewall_avd.svg",
    "lowLevelArchitecture": "<h4>Subscriptions &amp; resource groups</h4>\n<ul>\n<li>Hub: <code>hub-shared-prd</code> (network/security). Workload: <code>workloads-euc-prd</code> (AVD).</li>\n<li>Hub RGs (per region): <code>rg-hub-*-net</code>, <code>rg-hub-*-sec</code>, <code>rg-hub-*-dns</code>, <code>rg-hub-*-mon</code>.</li>\n<li>AVD RGs (per region): <code>rg-avd-*-avd</code> (host pool/app groups/workspace), <code>rg-avd-*-hosts</code>, <code>rg-avd-*-storage</code>, <code>rg-avd-*-ops</code>.</li>\n</ul>\n\n<h4>IP plan (2 regions)</h4>\n<ul>\n<li>Hub EUS: <code>vnet-hub-prd-eus</code> <code>10.0.0.0/16</code>; Hub CUS: <code>vnet-hub-prd-cus</code> <code>10.1.0.0/16</code>.</li>\n<li>AVD EUS: <code>vnet-avd-prd-eus</code> <code>10.10.0.0/16</code>; AVD CUS: <code>vnet-avd-prd-cus</code> <code>10.11.0.0/16</code>.</li>\n</ul>\n\n<h4>Hub components (per region)</h4>\n<ul>\n<li>Subnets: <code>AzureFirewallSubnet</code>, <code>AzureFirewallManagementSubnet</code>, <code>GatewaySubnet</code> (optional ER/VPN), <code>AzureBastionSubnet</code> (recommended).</li>\n<li>Azure Firewall (Standard/Premium) + Firewall Policy + diagnostics to Log Analytics.</li>\n<li>Private DNS zones + (optional) DNS Private Resolver for hybrid name resolution.</li>\n</ul>\n\n<h4>Spoke routing (forced egress)</h4>\n<ul>\n<li>Peer spoke VNets to hub (per region).</li>\n<li>UDR on AVD subnets: <code>0.0.0.0/0</code> \u2192 next hop Azure Firewall private IP.</li>\n<li>On-prem prefixes \u2192 next hop ER/VPN gateway (if used).</li>\n</ul>\n\n<h4>Firewall policy structure (recommended)</h4>\n<ul>\n<li><code>rcg-base-egress</code>: Windows Update/Defender endpoints + core SaaS allowlist.</li>\n<li><code>rcg-avd-egress</code>: required AVD service connectivity (maintain allowlist artifact).</li>\n<li><code>rcg-private-endpoints</code>: spoke \u2192 private endpoint IPs (Azure Files/Key Vault/etc.).</li>\n<li><code>rcg-deny-all</code>: deny and log everything else; enable Threat Intelligence.</li>\n</ul>\n\n<h4>AVD objects (per region)</h4>\n<ul>\n<li>Host pools: <code>hp-avd-prd-eus</code>, <code>hp-avd-prd-cus</code>; app groups + workspace.</li>\n<li>Session hosts in <code>snet-avd-sessionhosts</code>; autoscale via scaling plan (recommended).</li>\n</ul>\n\n<h4>Identity / join patterns (include both)</h4>\n<ul>\n<li><b>Pattern A</b> (cloud-first): Entra ID joined session hosts + Intune; Conditional Access enforces MFA + compliant devices.</li>\n<li><b>Pattern B</b> (legacy apps): AD DS / Azure AD DS joined; GPO manages FSLogix and app policies; still enforce Conditional Access for user access.</li>\n</ul>\n\n<h4>Profiles (FSLogix)</h4>\n<ul>\n<li><b>Azure Files</b> (common start): private endpoint (<code>privatelink.file.core.windows.net</code>), backups + snapshots, public access off.</li>\n<li><b>ANF</b> (enterprise DR): cross-region replication for profiles (faster failover).</li>\n</ul>\n\n<h4>Monitoring &amp; ops</h4>\n<ul>\n<li>AVD Insights + session host metrics; alert on connection failures and host health.</li>\n<li>Firewall denies/TI hits + SNAT usage; patch compliance via Update Manager.</li>\n</ul>\n\n<h4>DR/HA</h4>\n<ul>\n<li><b>Active/Passive</b>: CUS warm standby; failover runbook enables scaling and reassigns users.</li>\n<li><b>Active/Active</b>: split users across regions; reduces blast radius.</li>\n</ul>\n\n<h4>Mermaid (copy/paste)</h4>\n<pre><code>flowchart LR\n  subgraph HubEUS[Hub EUS]\n    AFW1[Firewall EUS]\n    DNS1[Private DNS/Resolver]\n    BAS1[Bastion]\n  end\n  subgraph AVDEUS[AVD Spoke EUS]\n    SHEUS[Session Hosts]\n    PEEUS[PE Subnet]\n    FILEEUS[Azure Files/ANF Profiles]\n  end\n  subgraph HubCUS[Hub CUS]\n    AFW2[Firewall CUS]\n  end\n  subgraph AVDCUS[AVD Spoke CUS]\n    SHCUS[Session Hosts]\n    FILECUS[Profiles DR]\n  end\n  Users[Users] --> AVDsvc[AVD Control Plane]\n  AVDsvc --> SHEUS\n  AVDsvc --> SHCUS\n  SHEUS -->|UDR 0/0| AFW1\n  SHCUS -->|UDR 0/0| AFW2\n  SHEUS --> PEEUS --> FILEEUS\n  DNS1 --- AVDEUS</code></pre>",
    "steps": [
      {
        "icon": "plan",
        "title": "Define hub-spoke topology and IP plan",
        "body": "<ul><li>Create hub VNet for shared services (Firewall, Bastion, DNS).</li><li>Create spoke VNets for workloads (AVD, apps, data).</li><li>Reserve subnets for Firewall and future growth.</li></ul>",
        "code": ""
      },
      {
        "icon": "network",
        "title": "Deploy hub components (Firewall, route tables, peering)",
        "body": "<ul><li>Deploy Azure Firewall (or Firewall Manager + policy).</li><li>Peer spoke VNets to hub (no transitive peering without hub routing).</li><li>Create UDRs in spokes to force 0.0.0.0/0 to Firewall.</li></ul>",
        "code": "# Example: set UDR next hop to Azure Firewall\naz network route-table route create -g rg-net -n defaultToFirewall \\\n  --route-table-name rt-spoke --address-prefix 0.0.0.0/0 --next-hop-type VirtualAppliance --next-hop-ip-address <FW_PRIVATE_IP>"
      },
      {
        "icon": "secure",
        "title": "Firewall policy: egress allowlist + TLS inspection (optional)",
        "body": "<ul><li>Create application rules for required SaaS (M365, CRM, ITSM).</li><li>Use FQDN tags where supported to reduce maintenance.</li><li>Enable threat intelligence and logging to Log Analytics.</li></ul>",
        "code": ""
      },
      {
        "icon": "identity",
        "title": "Deploy Azure Virtual Desktop host pool and identity",
        "body": "<ul><li>Create host pool, workspace, and application groups.</li><li>Join session hosts to Entra ID or AD DS/AAD DS based on requirements.</li><li>Apply Conditional Access + MFA for AVD access.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Monitoring: Network Watcher + Firewall logs + AVD insights",
        "body": "<ul><li>Enable Firewall logs (Application/Network) to Log Analytics.</li><li>Use AVD Insights (Azure Monitor) for session metrics.</li><li>Set alerts for SNAT exhaustion and high latency.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Validation: forced tunneling + user experience",
        "body": "<ul><li>Confirm all outbound from AVD flows through the Firewall.</li><li>Run latency tests (ping/rdp round-trip).</li><li>Document break-glass procedures.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Firewall documentation",
        "url": "https://learn.microsoft.com/en-us/azure/firewall/"
      },
      {
        "title": "Azure Virtual Desktop documentation",
        "url": "https://learn.microsoft.com/en-us/azure/virtual-desktop/"
      },
      {
        "title": "Hub-spoke network topology",
        "url": "https://learn.microsoft.com/en-us/azure/architecture/networking/architecture/hub-spoke"
      }
    ]
  },
  {
    "id": "p04-automation",
    "title": "Azure Automation (Runbooks) + Azure Update Manager",
    "category": "Operations",
    "scenario": "Scenario: Ops team needs repeatable remediation for common incidents and patch governance. Example: 'Kendaks Ops' automates VM start/stop schedules and monthly patch windows with audit trails.",
    "architectureImage": "assets/diagrams/04_automation_update_manager.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define operational use cases and guardrails",
        "body": "<ul><li>List automations: start/stop, certificate rotation, log cleanup, user onboarding.</li><li>Decide approvals and change control for production runbooks.</li><li>Use managed identity for least-privileged execution.</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "Create Automation Account and Runtime Environment",
        "body": "<ul><li>Create Automation Account per environment.</li><li>Prefer modern runtime environments; lock down networking if needed.</li><li>Disable public network access when feasible.</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Secrets and credentials",
        "body": "<ul><li>Store secrets in Key Vault, not in runbook variables.</li><li>Grant Automation managed identity access to Key Vault secrets.</li><li>Rotate secrets regularly and log access.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Integrate with Update Manager for patching",
        "body": "<ul><li>Use Azure Update Manager for assessment and scheduled patching.</li><li>Create maintenance configurations and assign to scopes.</li><li>Track compliance dashboards.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Job logs, alerts, and drift detection",
        "body": "<ul><li>Send job streams to Log Analytics.</li><li>Create alerts for job failures and long runtimes.</li><li>Use Azure Policy to detect noncompliant VM settings.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Test in non-prod and promote",
        "body": "<ul><li>Use source control integration for runbooks.</li><li>Promote via pipeline and environment variables.</li><li>Use feature flags / approval gates.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Automation documentation",
        "url": "https://learn.microsoft.com/en-us/azure/automation/"
      },
      {
        "title": "Azure Update Manager documentation",
        "url": "https://learn.microsoft.com/en-us/azure/update-manager/"
      }
    ]
  },
  {
    "id": "p05-logic-apps",
    "title": "Azure Logic Apps for Workflow Automation",
    "category": "Integration",
    "scenario": "Scenario: A service desk automates approvals and notifications across ITSM, email, Teams, and SharePoint. Example: 'Kendaks IT' auto-approves low-risk requests and escalates exceptions.",
    "architectureImage": "assets/diagrams/05_logic_apps.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Choose consumption vs standard and connectors",
        "body": "<ul><li>Use <b>Standard</b> for VNET integration and predictable workloads.</li><li>Inventory required connectors (M365, ServiceNow, SQL, SAP).</li><li>Decide idempotency strategy and retry behavior.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Build the workflow (trigger → actions → conditions)",
        "body": "<ul><li>Use HTTP/webhook or Event Grid trigger.</li><li>Add parallel branches for notifications and record updates.</li><li>Use scopes and try/catch patterns for robust error handling.</li></ul>",
        "code": "// Pseudo-pattern: try/catch\nScope: Try\n  - Do actions\nScope: Catch\n  - Log + notify\nScope: Finally\n  - Close ticket"
      },
      {
        "icon": "secure",
        "title": "Secure the workflow",
        "body": "<ul><li>Use managed identity for Azure resources.</li><li>Use Key Vault references for secrets.</li><li>Limit inbound triggers with IP restrictions or APIM.</li></ul>",
        "code": ""
      },
      {
        "icon": "network",
        "title": "Enterprise integration: Service Bus + API Management",
        "body": "<ul><li>Use Service Bus for decoupling and backpressure.</li><li>Expose APIs through APIM with policies (JWT, rate limits).</li><li>Enable private endpoints where supported.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Monitoring and troubleshooting",
        "body": "<ul><li>Enable diagnostics to Log Analytics.</li><li>Use run history + tracked properties for business telemetry.</li><li>Create alerts for failed runs and DLQ growth.</li></ul>",
        "code": ""
      },
      {
        "icon": "cicd",
        "title": "Deploy via CI/CD",
        "body": "<ul><li>Use ARM/Bicep or Terraform for infra.</li><li>Use GitHub Actions or Azure DevOps for release.</li><li>Parameterize connection strings per environment.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Logic Apps documentation",
        "url": "https://learn.microsoft.com/en-us/azure/logic-apps/"
      },
      {
        "title": "Azure API Management documentation",
        "url": "https://learn.microsoft.com/en-us/azure/api-management/"
      },
      {
        "title": "Azure Service Bus documentation",
        "url": "https://learn.microsoft.com/en-us/azure/service-bus-messaging/"
      }
    ]
  },
  {
    "id": "p06-integrations",
    "title": "Enterprise Integrations (APIM + Service Bus + Event Grid + Logic Apps)",
    "category": "Integration",
    "scenario": "Scenario: Multiple internal apps must exchange events reliably. Example: 'Kendaks Platform' standardizes integrations for onboarding/offboarding and billing events.",
    "architectureImage": "assets/diagrams/06_enterprise_integrations.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define event contracts and integration standards",
        "body": "<ul><li>Define canonical event schema and versioning.</li><li>Decide event vs command patterns.</li><li>Define retry/DLQ and poison message handling.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Provision messaging backbone",
        "body": "<ul><li>Create Event Grid topics for pub/sub.</li><li>Create Service Bus namespaces, queues, topics, subscriptions.</li><li>Enable DLQ and duplicate detection where needed.</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Secure with identities and private networking",
        "body": "<ul><li>Use managed identity for consumers/producers.</li><li>Use Private Link for Service Bus/APIM where required.</li><li>Apply RBAC and minimum sender/receiver roles.</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "Implement workflows and APIs",
        "body": "<ul><li>Use Logic Apps for orchestration and human approvals.</li><li>Expose stable APIs via APIM; keep internal endpoints private.</li><li>Add transformation mappings (JSON ↔ XML) where required.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Observability",
        "body": "<ul><li>Centralize logs to Log Analytics.</li><li>Track message throughput, DLQ depth, and latency.</li><li>Create dashboards for business KPIs (events processed).</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Resilience testing",
        "body": "<ul><li>Chaos test: drop consumers, verify DLQ and retries.</li><li>Load test API gateways and queues.</li><li>Validate schema evolution and backward compatibility.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Event Grid documentation",
        "url": "https://learn.microsoft.com/en-us/azure/event-grid/"
      },
      {
        "title": "Service Bus documentation",
        "url": "https://learn.microsoft.com/en-us/azure/service-bus-messaging/"
      },
      {
        "title": "API Management documentation",
        "url": "https://learn.microsoft.com/en-us/azure/api-management/"
      }
    ]
  },
  {
    "id": "p07-advanced-security",
    "title": "Implementing Advanced Security Solutions (Defender for Cloud + Sentinel + Key Vault)",
    "category": "Security",
    "scenario": "Scenario: A regulated SaaS must implement continuous posture management, centralized logging, and key management. Example: 'Kendaks Secure SaaS' enforces baseline policies and responds to incidents with playbooks.",
    "architectureImage": "assets/diagrams/07_advanced_security.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define security baseline and shared responsibility",
        "body": "<ul><li>Map controls to standards (CIS, PCI, ISO).</li><li>Define ownership: platform vs app teams.</li><li>Create break-glass accounts and emergency access.</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Enable Defender for Cloud and baseline recommendations",
        "body": "<ul><li>Enable Defender plans (Servers, Storage, SQL, Containers as needed).</li><li>Review Secure Score and prioritize high-impact items.</li><li>Turn on continuous export for reporting.</li></ul>",
        "code": ""
      },
      {
        "icon": "govern",
        "title": "Policy-as-code (deny, deployIfNotExists)",
        "body": "<ul><li>Assign initiatives to management groups.</li><li>Use remediation tasks to auto-deploy diagnostics.</li><li>Gate deployments with policy compliance in CI.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Centralize logs in Sentinel (Defender portal) and build detections",
        "body": "<ul><li>Connect data sources (Entra ID, M365, Defender, Azure activity).</li><li>Build analytics rules and incident workflows.</li><li>Standardize investigation using workbooks.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Automate response (SOAR)",
        "body": "<ul><li>Create playbooks (Logic Apps) to isolate hosts, disable accounts, or block IPs.</li><li>Integrate ticketing (ServiceNow/Jira).</li><li>Record actions for auditability.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Validate with attack simulation and tabletop exercises",
        "body": "<ul><li>Run purple-team validation using safe simulation tools.</li><li>Test alert fidelity and escalation.</li><li>Review MTTR and improve runbooks.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Defender for Cloud documentation",
        "url": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/"
      },
      {
        "title": "Microsoft Sentinel in Defender portal",
        "url": "https://learn.microsoft.com/en-us/azure/sentinel/microsoft-sentinel-defender-portal"
      },
      {
        "title": "Azure Key Vault documentation",
        "url": "https://learn.microsoft.com/en-us/azure/key-vault/"
      }
    ]
  },
  {
    "id": "p08-bigdata-solution",
    "title": "Developing a Big Data Solution (Streaming + Lakehouse)",
    "category": "Data & Analytics",
    "scenario": "Scenario: Operations needs near-real-time KPI dashboards (queue length, SLA breaches). Example: 'Kendaks Contact Center' streams call events and agent status into a lakehouse.",
    "architectureImage": "assets/diagrams/08_bigdata_streaming.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define streaming use cases and SLOs",
        "body": "<ul><li>Decide event schema and partition key (customerId/tenantId).</li><li>Define latency SLO (e.g., &lt; 60 seconds).</li><li>Plan retention and replay.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Provision Event Hubs + consumer groups",
        "body": "<ul><li>Enable capture to storage for replay.</li><li>Set throughput units and autoscale if applicable.</li><li>Secure with private endpoints and RBAC.</li></ul>",
        "code": ""
      },
      {
        "icon": "data",
        "title": "Stream processing (Stream Analytics or Spark Structured Streaming)",
        "body": "<ul><li>Implement windowed aggregations (tumbling, hopping windows).</li><li>Write curated outputs to lakehouse tables.</li><li>Handle late arrivals and out-of-order events.</li></ul>",
        "code": ""
      },
      {
        "icon": "govern",
        "title": "Data quality and governance",
        "body": "<ul><li>Validate event schema at ingestion (dead-letter invalid events).</li><li>Apply classifications and PII handling.</li><li>Set access control by domain and least privilege.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Monitoring and alerting",
        "body": "<ul><li>Monitor lag, throughput, and error rates.</li><li>Alert on backlog growth and data freshness issues.</li><li>Create dashboards for business and platform KPIs.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Load test and backpressure validation",
        "body": "<ul><li>Generate event bursts to test autoscale behavior.</li><li>Validate storage write patterns and costs.</li><li>Run DR tests using capture replay.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Event Hubs documentation",
        "url": "https://learn.microsoft.com/en-us/azure/event-hubs/"
      },
      {
        "title": "Azure Stream Analytics documentation",
        "url": "https://learn.microsoft.com/en-us/azure/stream-analytics/"
      }
    ]
  },
  {
    "id": "p09-data-governance",
    "title": "Manage and Govern Data in Azure (Microsoft Purview)",
    "category": "Data Governance",
    "scenario": "Scenario: A company needs a searchable data catalog, lineage, and PII controls. Example: 'Kendaks Data Office' tracks datasets from ingestion to BI and enforces access rules.",
    "architectureImage": "assets/diagrams/09_purview_governance.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define governance operating model",
        "body": "<ul><li>Assign roles: data owners, stewards, custodians.</li><li>Define naming standards and glossary terms.</li><li>Define classification policy (PII, PCI, HR).</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "Deploy Microsoft Purview account",
        "body": "<ul><li>Create Purview account and managed resources.</li><li>Set up private endpoints if required.</li><li>Configure permissions and data plane roles.</li></ul>",
        "code": ""
      },
      {
        "icon": "data",
        "title": "Register sources and run scans",
        "body": "<ul><li>Register ADLS, SQL, Fabric/Databricks where supported.</li><li>Configure scan rulesets and schedules.</li><li>Validate classification results.</li></ul>",
        "code": ""
      },
      {
        "icon": "govern",
        "title": "Glossary, stewardship, and access workflows",
        "body": "<ul><li>Build glossary aligned to the business.</li><li>Assign owners and approve publishing.</li><li>Use access request workflows and audit trails.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Integrate with analytics platforms",
        "body": "<ul><li>Enable lineage from ETL tools where available.</li><li>Link datasets to reports and dashboards.</li><li>Use tags to drive policy enforcement.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Measure adoption and compliance",
        "body": "<ul><li>Track catalog coverage and freshness.</li><li>Review classification accuracy and false positives.</li><li>Report governance KPIs monthly.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Microsoft Purview documentation",
        "url": "https://learn.microsoft.com/en-us/azure/purview/"
      },
      {
        "title": "Purview data map concepts",
        "url": "https://learn.microsoft.com/en-us/azure/purview/concept-data-map"
      }
    ]
  },
  {
    "id": "p10-azure-files",
    "title": "Azure Storage for File Management (Azure Files + Azure File Sync)",
    "category": "Storage",
    "scenario": "Scenario: A hybrid office needs shared file drives with cloud backup. Example: 'Kendaks HQ' migrates on-prem file shares to Azure Files with on-prem caching.",
    "architectureImage": "assets/diagrams/10_azure_files.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Assess shares and permissions",
        "body": "<ul><li>Inventory shares, sizes, ACLs, and access patterns.</li><li>Decide identity: Entra ID Kerberos / AD DS.</li><li>Plan migration waves.</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "Create storage account and Azure file shares",
        "body": "<ul><li>Create Storage Account (enable large file shares if needed).</li><li>Create Azure Files shares and set quota.</li><li>Enable private endpoint for storage.</li></ul>",
        "code": "az storage account create -g rg-storage -n stkendaksfiles --sku Standard_LRS --kind StorageV2"
      },
      {
        "icon": "identity",
        "title": "Set up authentication and RBAC",
        "body": "<ul><li>Configure SMB authentication (AD DS / Entra ID Kerberos as applicable).</li><li>Use RBAC for share access plus NTFS ACLs.</li><li>Enforce MFA/Conditional Access for admin operations.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Deploy Azure File Sync (optional)",
        "body": "<ul><li>Install File Sync agent on on-prem server.</li><li>Create Sync Group and cloud endpoint.</li><li>Enable cloud tiering for cache efficiency.</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Enable backup + protection",
        "body": "<ul><li>Enable soft delete and snapshots.</li><li>Configure Azure Backup for file shares if required.</li><li>Turn on Defender for Storage alerts.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Cutover and validate",
        "body": "<ul><li>Run migration tool (AzCopy/Robocopy) with ACL preservation.</li><li>Validate permissions and performance.</li><li>Document restore procedures.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Files documentation",
        "url": "https://learn.microsoft.com/en-us/azure/storage/files/"
      },
      {
        "title": "Azure File Sync",
        "url": "https://learn.microsoft.com/en-us/azure/storage/file-sync/"
      },
      {
        "title": "AzCopy",
        "url": "https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10"
      }
    ]
  },
  {
    "id": "p11-azure-sql",
    "title": "Setting Up an Azure SQL Database (Security-first)",
    "category": "Databases",
    "scenario": "Scenario: A line-of-business app needs a managed relational database with HA and security. Example: 'Kendaks Billing' runs on Azure SQL with private endpoints and auditing.",
    "architectureImage": "assets/diagrams/11_azure_sql.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Choose deployment model and sizing",
        "body": "<ul><li>Pick single database vs elastic pool.</li><li>Decide service tier (GP/BC) and zone redundancy.</li><li>Plan RPO/RTO and long-term retention.</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "Provision SQL server and database",
        "body": "<ul><li>Create logical server and database.</li><li>Disable public network access if possible.</li><li>Enable zone redundancy for supported regions/tier.</li></ul>",
        "code": "az sql server create -g rg-data -n sql-kendaks -l eastus -u sqladmin -p <PASSWORD>\naz sql db create -g rg-data -s sql-kendaks -n kendaksdb --service-objective GP_S_Gen5_2"
      },
      {
        "icon": "network",
        "title": "Private connectivity",
        "body": "<ul><li>Create Private Endpoint in the app VNet.</li><li>Configure private DNS zone <code>privatelink.database.windows.net</code>.</li><li>Verify resolution from app subnet.</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Security controls",
        "body": "<ul><li>Enable Defender for SQL recommendations.</li><li>Enable auditing to Log Analytics / Storage.</li><li>Enable TDE (default) and optionally CMK via Key Vault.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Performance monitoring",
        "body": "<ul><li>Use Query Store and performance insights.</li><li>Alert on DTU/vCore saturation, deadlocks, long queries.</li><li>Enable auto-tuning where appropriate.</li></ul>",
        "code": ""
      },
      {
        "icon": "dr",
        "title": "Backups and DR strategy",
        "body": "<ul><li>Configure LTR for compliance.</li><li>Implement geo-replication/failover groups for multi-region.</li><li>Test restore quarterly.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure SQL Database documentation",
        "url": "https://learn.microsoft.com/en-us/azure/azure-sql/database/"
      },
      {
        "title": "Private endpoints for Azure SQL",
        "url": "https://learn.microsoft.com/en-us/azure/azure-sql/database/private-endpoint-overview"
      }
    ]
  },
  {
    "id": "p12-cicd",
    "title": "Creating a CI/CD Pipeline (Build, Test, Deploy)",
    "category": "DevOps",
    "scenario": "Scenario: Dev teams want consistent releases with quality gates. Example: 'Kendaks Apps' uses GitHub Actions to deploy web apps and APIs across dev/test/prod.",
    "architectureImage": "assets/diagrams/12_cicd_pipeline.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define environments and release strategy",
        "body": "<ul><li>Use dev/test/prod subscriptions or resource groups.</li><li>Decide branching (trunk-based or GitFlow).</li><li>Define approvals for production.</li></ul>",
        "code": ""
      },
      {
        "icon": "cicd",
        "title": "Implement CI pipeline (build + unit tests)",
        "body": "<ul><li>Run lint, unit tests, SAST, dependency scanning.</li><li>Publish build artifacts with version tags.</li><li>Fail fast on quality issues.</li></ul>",
        "code": "# GitHub Actions (snippet)\n- name: Build\n  run: npm ci && npm test\n- name: Upload artifact\n  uses: actions/upload-artifact@v4\n  with: { name: drop, path: dist }"
      },
      {
        "icon": "test",
        "title": "Add integration tests and staging deployments",
        "body": "<ul><li>Deploy to a staging slot.</li><li>Run smoke tests and contract tests.</li><li>Promote if tests pass.</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "CD: Deploy to Azure with approvals",
        "body": "<ul><li>Use OIDC federated credentials instead of long-lived secrets.</li><li>Use deployment slots and swap.</li><li>Require manual approval for prod stage.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Post-deploy monitoring",
        "body": "<ul><li>Use Application Insights and alerts.</li><li>Monitor error rate, p95 latency, availability.</li><li>Auto-create incident if SLO violated.</li></ul>",
        "code": ""
      },
      {
        "icon": "dr",
        "title": "Rollback strategy",
        "body": "<ul><li>Use slot swap rollback or redeploy previous artifact.</li><li>Maintain release notes and change log.</li><li>Automate database rollback planning (forward-only migrations preferred).</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "GitHub Actions for Azure",
        "url": "https://learn.microsoft.com/en-us/azure/developer/github/"
      },
      {
        "title": "App Service deployment slots",
        "url": "https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots"
      }
    ]
  },
  {
    "id": "p13-serverless",
    "title": "Building a Serverless Architecture (Functions + Event Grid)",
    "category": "Cloud Architecture",
    "scenario": "Scenario: A platform needs event-driven processing with minimal ops overhead. Example: 'Kendaks Notifications' processes events and sends emails/SMS with durable retries.",
    "architectureImage": "assets/diagrams/13_serverless.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define triggers, throughput, and idempotency",
        "body": "<ul><li>Choose triggers (Event Grid, Service Bus, HTTP).</li><li>Design idempotency keys to avoid duplicate processing.</li><li>Choose hosting plan (Consumption/Premium).</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "Provision Function App and supporting services",
        "body": "<ul><li>Create Function App (Linux recommended) and Storage account.</li><li>Enable managed identity.</li><li>Set app settings via IaC.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Implement event routing",
        "body": "<ul><li>Create Event Grid topic/subscriptions.</li><li>Filter events by subject/type.</li><li>Configure dead-letter destination for failed deliveries.</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Secure endpoints and secrets",
        "body": "<ul><li>Use private endpoints and VNet integration where needed.</li><li>Store secrets in Key Vault and use references.</li><li>Use JWT validation for HTTP triggers.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Observability",
        "body": "<ul><li>Enable Application Insights.</li><li>Track function failures and retries.</li><li>Create dashboards and alerts for queue backlog.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Testing and resiliency",
        "body": "<ul><li>Unit test handlers; integration test via test topic.</li><li>Chaos test: drop downstream dependency, validate retries/DLQ.</li><li>Document runbooks for DLQ replay.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Functions documentation",
        "url": "https://learn.microsoft.com/en-us/azure/azure-functions/"
      },
      {
        "title": "Event Grid documentation",
        "url": "https://learn.microsoft.com/en-us/azure/event-grid/"
      },
      {
        "title": "Durable Functions",
        "url": "https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview"
      }
    ]
  },
  {
    "id": "p14-multi-region-dr",
    "title": "Designing a Multi-Region Disaster Recovery (Front Door + Failover)",
    "category": "Reliability",
    "scenario": "Scenario: A customer portal needs DR across regions with low RTO/RPO. Example: 'Kendaks Portal' uses active-passive with automated failover.",
    "architectureImage": "assets/diagrams/14_multi_region_dr.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define RTO/RPO and topology",
        "body": "<ul><li>Decide active-active vs active-passive.</li><li>Define data replication requirements (SQL failover group, Cosmos multi-region).</li><li>Define DR runbook ownership.</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "Deploy global entry (Front Door) and health probes",
        "body": "<ul><li>Configure Front Door routing rules and backend pools.</li><li>Set health probe paths and sensitivity.</li><li>Enable WAF policies.</li></ul>",
        "code": ""
      },
      {
        "icon": "dr",
        "title": "Implement data replication",
        "body": "<ul><li>For SQL: failover groups / geo-replication.</li><li>For Storage: RA-GRS or object replication.</li><li>Ensure secrets replicate (Key Vault backup/restore or multi-region strategy).</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Secure cross-region and access",
        "body": "<ul><li>Use identical policies and RBAC in both regions.</li><li>Keep private connectivity patterns consistent.</li><li>Log and alert on failover actions.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Failover automation and observability",
        "body": "<ul><li>Automate failover through runbooks (Automation/Functions).</li><li>Create dashboards that show regional health and replication lag.</li><li>Alert on probe failures and lag thresholds.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Run DR drills",
        "body": "<ul><li>Quarterly failover tests with documented results.</li><li>Validate DNS/Front Door routing, app behavior, and data integrity.</li><li>Improve runbooks after each test.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Front Door documentation",
        "url": "https://learn.microsoft.com/en-us/azure/frontdoor/"
      },
      {
        "title": "Reliability guidance",
        "url": "https://learn.microsoft.com/en-us/azure/reliability/"
      }
    ]
  },
  {
    "id": "p15-zero-trust",
    "title": "Zero Trust Cloud Security Platform (Entra ID + Conditional Access + Private Access)",
    "category": "Security",
    "scenario": "Scenario: Enterprise requires Zero Trust for cloud apps and admin access. Example: 'Kendaks Enterprise' enforces MFA, device compliance, and least privilege for all workloads.",
    "architectureImage": "assets/diagrams/15_zero_trust.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define identity plane and device posture rules",
        "body": "<ul><li>Define user groups, roles, and privileged access model.</li><li>Decide device compliance requirements (Intune / MDM).</li><li>Identify high-risk apps and admin portals.</li></ul>",
        "code": ""
      },
      {
        "icon": "identity",
        "title": "Implement Conditional Access baseline",
        "body": "<ul><li>Require MFA for all users (exclude break-glass).</li><li>Require compliant devices for sensitive apps.</li><li>Block legacy authentication.</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Privileged Identity Management (PIM)",
        "body": "<ul><li>Make admin roles eligible with just-in-time activation.</li><li>Require approval and MFA for elevation.</li><li>Enable access reviews for critical roles.</li></ul>",
        "code": ""
      },
      {
        "icon": "network",
        "title": "Reduce exposure with Private Link and segmentation",
        "body": "<ul><li>Use private endpoints for PaaS (SQL, Storage, Key Vault).</li><li>Adopt hub-spoke and restrict east-west traffic.</li><li>Apply WAF for public entry points.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Threat detection and response",
        "body": "<ul><li>Send sign-in logs to SIEM.</li><li>Enable identity protection alerts.</li><li>Automate account disable/reset on high risk.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Validate Zero Trust with audits",
        "body": "<ul><li>Run access review reports monthly.</li><li>Test conditional access policies in report-only mode first.</li><li>Document exceptions with expiry.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Microsoft Entra documentation",
        "url": "https://learn.microsoft.com/en-us/entra/"
      },
      {
        "title": "Zero Trust guidance",
        "url": "https://learn.microsoft.com/en-us/security/zero-trust/"
      }
    ]
  },
  {
    "id": "p16-bpo-ha",
    "title": "Multi-Region High Availability BPO Platform",
    "category": "Industry Solutions",
    "scenario": "Scenario: A BPO platform must maintain 99.9%+ availability for agent tooling, CRM integrations, and call routing. Example: 'Kendaks BPO Platform' runs active-active across two regions.",
    "architectureImage": "assets/diagrams/16_bpo_ha.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define SLOs and workloads",
        "body": "<ul><li>Identify critical components (AVD, CRM integration, dialer, ticketing).</li><li>Set availability/error budgets.</li><li>Decide active-active vs active-passive per component.</li></ul>",
        "code": ""
      },
      {
        "icon": "network",
        "title": "Global ingress and security edge",
        "body": "<ul><li>Use Front Door + WAF for global routing.</li><li>Use DDoS protection for VNets.</li><li>Standardize TLS and cert rotation.</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "Deploy compute across regions",
        "body": "<ul><li>Use App Service/AKS depending on workload.</li><li>Keep infrastructure identical via IaC.</li><li>Use zone redundancy where supported.</li></ul>",
        "code": ""
      },
      {
        "icon": "dr",
        "title": "Data strategy",
        "body": "<ul><li>Use SQL failover groups or Cosmos multi-region.</li><li>Define consistency and conflict resolution.</li><li>Replicate secrets and configuration.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Operations and incident response",
        "body": "<ul><li>Centralize logs/metrics; create SLO dashboards.</li><li>Automate failover and paging via action groups.</li><li>Run game days.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Continuity tests",
        "body": "<ul><li>Simulate regional outage and validate recovery.</li><li>Validate agent session continuity and routing.</li><li>Document customer communication templates.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure reliability",
        "url": "https://learn.microsoft.com/en-us/azure/reliability/"
      },
      {
        "title": "Azure Front Door",
        "url": "https://learn.microsoft.com/en-us/azure/frontdoor/"
      }
    ]
  },
  {
    "id": "p17-ai-helpdesk",
    "title": "AI-Driven IT Helpdesk Automation System (Azure AI Foundry + RAG)",
    "category": "AI & Automation",
    "scenario": "Scenario: IT helpdesk wants faster resolution with AI summaries, suggested fixes, and automated actions. Example: 'Kendaks IT Helpdesk' integrates ITSM tickets + internal KB and triggers Logic Apps remediation.",
    "architectureImage": "assets/diagrams/17_ai_helpdesk.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define intents, guardrails, and knowledge sources",
        "body": "<ul><li>Decide supported intents (password reset, VPN, device enrollment).</li><li>Define when AI can act automatically vs ask approval.</li><li>Identify data sources (KB, runbooks, wiki, ticket history).</li></ul>",
        "code": ""
      },
      {
        "icon": "data",
        "title": "Build the knowledge index (RAG)",
        "body": "<ul><li>Ingest documents into Azure AI Search.</li><li>Chunk and enrich content with metadata (system, owner, expiry).</li><li>Enable semantic ranking and filters.</li></ul>",
        "code": ""
      },
      {
        "icon": "ai",
        "title": "Connect Azure AI Foundry model to your data",
        "body": "<ul><li>Deploy a model endpoint and configure 'On your data' with the search index.</li><li>Implement prompt templates for ticket classification and response drafting.</li><li>Return citations/links to KB sources.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Automate actions with Logic Apps / Functions",
        "body": "<ul><li>Create workflows for approved remediations (restart service, disable account).</li><li>Integrate ticket updates back to ITSM.</li><li>Use managed identity and Key Vault for secrets.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Monitoring and safety",
        "body": "<ul><li>Log prompts/responses with redaction.</li><li>Track resolution time and deflection rate.</li><li>Review hallucination/low-confidence responses.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Rollout and continuous improvement",
        "body": "<ul><li>Pilot with Tier-1 agents.</li><li>Collect feedback and retrain/adjust prompts.</li><li>Expand to self-service chatbot after success.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure AI Foundry (Azure OpenAI) docs",
        "url": "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/"
      },
      {
        "title": "Azure OpenAI v1 API lifecycle (Aug 2025)",
        "url": "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/api-version-lifecycle?view=foundry-classic"
      },
      {
        "title": "Azure AI Search documentation",
        "url": "https://learn.microsoft.com/en-us/azure/search/"
      }
    ]
  },
  {
    "id": "p18-soc-automation",
    "title": "SOC Automation & Threat Intelligence Platform (Sentinel + SOAR)",
    "category": "Security",
    "scenario": "Scenario: SOC wants automated enrichment and consistent incident handling. Example: 'Kendaks SOC' ingests TI feeds (TAXII), enriches alerts, and auto-opens tickets.",
    "architectureImage": "assets/diagrams/18_soc_automation.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define SOC use cases and data sources",
        "body": "<ul><li>Identify top alert categories (phishing, malware, impossible travel).</li><li>Choose data connectors and ingestion strategy.</li><li>Define incident severity matrix.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Deploy Sentinel in Defender portal and connect logs",
        "body": "<ul><li>Create Log Analytics workspace and enable Sentinel.</li><li>Connect Entra ID, M365, Defender, Azure Activity.</li><li>Normalize with ASIM where appropriate.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Threat intelligence ingestion",
        "body": "<ul><li>Connect TAXII servers or TI platforms.</li><li>Store TI indicators and expiry dates.</li><li>Correlate indicators with logs.</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Automation playbooks (SOAR)",
        "body": "<ul><li>Use Logic Apps to enrich with WHOIS, geo-IP, TI.</li><li>Automate containment: disable account, block IP, isolate endpoint.</li><li>Record all actions for audit.</li></ul>",
        "code": ""
      },
      {
        "icon": "data",
        "title": "Long-term retention and hunting",
        "body": "<ul><li>Archive logs to Data Lake for cost efficiency.</li><li>Use hunting queries for proactive detection.</li><li>Maintain dashboards for MITRE coverage.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "SOC drills and tuning",
        "body": "<ul><li>Run tabletop exercises and alert simulation (safe).</li><li>Tune analytics rules to reduce noise.</li><li>Review KPIs: MTTD, MTTR, false positive rate.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Microsoft Sentinel in Defender portal",
        "url": "https://learn.microsoft.com/en-us/azure/sentinel/microsoft-sentinel-defender-portal"
      },
      {
        "title": "Azure Logic Apps",
        "url": "https://learn.microsoft.com/en-us/azure/logic-apps/"
      }
    ]
  },
  {
    "id": "p19-cicd-iac",
    "title": "CI/CD Pipeline with Infrastructure as Code (Bicep + GitHub Actions)",
    "category": "DevOps",
    "scenario": "Scenario: Platform team wants repeatable, audited infra deployments. Example: 'Kendaks Platform' provisions VNets, AKS, and PaaS with Bicep modules.",
    "architectureImage": "assets/diagrams/19_cicd_iac.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Modularize your IaC",
        "body": "<ul><li>Create reusable modules (network, storage, identity, monitoring).</li><li>Define parameters per environment.</li><li>Adopt naming and tagging standards.</li></ul>",
        "code": ""
      },
      {
        "icon": "cicd",
        "title": "Validate IaC in CI",
        "body": "<ul><li>Run <code>bicep build</code> and lints.</li><li>Run what-if previews on PRs.</li><li>Require code reviews and approvals.</li></ul>",
        "code": "az deployment sub what-if --location eastus --template-file main.bicep --parameters env=dev"
      },
      {
        "icon": "govern",
        "title": "Policy and guardrails",
        "body": "<ul><li>Use Azure Policy to deny insecure configurations.</li><li>Require diagnostics settings via deployIfNotExists.</li><li>Enforce tags and regions.</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "Deploy with GitHub Actions (OIDC)",
        "body": "<ul><li>Use federated credentials for GitHub → Azure.</li><li>Deploy to dev automatically; gate prod.</li><li>Store deployment outputs for app pipelines.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Post-deploy validation",
        "body": "<ul><li>Run health checks and synthetic tests.</li><li>Validate policy compliance.</li><li>Generate change logs per release.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Disaster recovery of IaC",
        "body": "<ul><li>Back up state (if using Terraform).</li><li>Rebuild environment from scratch periodically.</li><li>Document break-glass deployment procedure.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Bicep documentation",
        "url": "https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/"
      },
      {
        "title": "GitHub Actions for Azure",
        "url": "https://learn.microsoft.com/en-us/azure/developer/github/"
      }
    ]
  },
  {
    "id": "p20-finops",
    "title": "Cloud Cost Optimization & FinOps Platform",
    "category": "FinOps",
    "scenario": "Scenario: Finance and engineering need cost visibility, anomaly detection, and optimization automation. Example: 'Kendaks FinOps' tags costs by client and enforces budgets.",
    "architectureImage": "assets/diagrams/20_finops.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Establish FinOps model",
        "body": "<ul><li>Define chargeback/showback model.</li><li>Standardize tags: costCenter, client, env, owner.</li><li>Set budgets and alert thresholds.</li></ul>",
        "code": ""
      },
      {
        "icon": "data",
        "title": "Set up cost exports to storage",
        "body": "<ul><li>Configure scheduled cost exports (daily).</li><li>Land in a Data Lake with partitioning by date.</li><li>Validate completeness and late-arriving files.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Build analytics layer",
        "body": "<ul><li>Load exports into Fabric/Synapse/Databricks for modeling.</li><li>Build KPIs: unit cost, cost per ticket, cost per tenant.</li><li>Provide self-serve Power BI dashboards.</li></ul>",
        "code": ""
      },
      {
        "icon": "optimize",
        "title": "Optimization automation",
        "body": "<ul><li>Auto-stop non-prod outside business hours.</li><li>Identify idle resources and orphaned disks/ips.</li><li>Recommend reservations/savings plans where applicable.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Anomaly detection and alerts",
        "body": "<ul><li>Alert on sudden cost spikes and tag coverage drops.</li><li>Run weekly optimization reports.</li><li>Track realized vs potential savings.</li></ul>",
        "code": ""
      },
      {
        "icon": "govern",
        "title": "Governance",
        "body": "<ul><li>Enforce tag policies and allowed SKUs via policy.</li><li>Require owner tags for all resources.</li><li>Integrate approvals for high-cost deployments.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Cost Management documentation",
        "url": "https://learn.microsoft.com/en-us/azure/cost-management-billing/"
      },
      {
        "title": "FinOps on Azure (overview)",
        "url": "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/strategy/finops/"
      }
    ]
  },
  {
    "id": "p21-secure-saas",
    "title": "Secure SaaS Application (Private PaaS + Identity + App Gateway/WAF)",
    "category": "Security & Architecture",
    "scenario": "Scenario: A multi-tenant SaaS must isolate tenants and secure PaaS. Example: 'Kendaks SaaS' uses private endpoints, WAF, and strong identity.",
    "architectureImage": "assets/diagrams/21_secure_saas.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Tenant model and isolation",
        "body": "<ul><li>Choose tenant isolation: shared DB with tenantId, or per-tenant DB.</li><li>Define data encryption and key strategy.</li><li>Define onboarding/offboarding process.</li></ul>",
        "code": ""
      },
      {
        "icon": "identity",
        "title": "Identity and access",
        "body": "<ul><li>Use Entra ID for workforce, Entra External ID/B2C for customers if needed.</li><li>Use OAuth scopes and role-based authorization.</li><li>Enable Conditional Access for admins.</li></ul>",
        "code": ""
      },
      {
        "icon": "network",
        "title": "Private PaaS connectivity",
        "body": "<ul><li>Put app in VNet and use private endpoints for SQL, Storage, Key Vault.</li><li>Disable public network access on PaaS.</li><li>Use private DNS zones.</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Edge protection and secrets",
        "body": "<ul><li>Use WAF (Front Door or Application Gateway) for OWASP protection.</li><li>Use Key Vault for secrets and CMK.</li><li>Enable Defender for Cloud plans.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Logging and audit",
        "body": "<ul><li>Centralize logs in Log Analytics.</li><li>Enable SQL auditing and WAF logs.</li><li>Implement tenant-level audit trails.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Pen testing readiness",
        "body": "<ul><li>Run SAST/DAST in CI.</li><li>Use least privilege and test tenant isolation.</li><li>Document incident response and disclosure process.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Application Gateway WAF",
        "url": "https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/ag-overview"
      },
      {
        "title": "Private Link",
        "url": "https://learn.microsoft.com/en-us/azure/private-link/"
      }
    ]
  },
  {
    "id": "p22-hybrid-integration",
    "title": "Hybrid Cloud & On-Prem Integration (Azure Arc + ExpressRoute/VPN)",
    "category": "Hybrid",
    "scenario": "Scenario: An enterprise must manage servers on-prem and in cloud with consistent governance. Example: 'Kendaks Hybrid' uses Arc to apply policy, patching, and monitoring.",
    "architectureImage": "assets/diagrams/22_hybrid_arc.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Connectivity and identity plan",
        "body": "<ul><li>Choose VPN or ExpressRoute.</li><li>Plan DNS resolution across environments.</li><li>Decide identity approach for servers (local vs AD DS).</li></ul>",
        "code": ""
      },
      {
        "icon": "network",
        "title": "Establish hybrid connectivity",
        "body": "<ul><li>Deploy VPN Gateway or ExpressRoute circuit.</li><li>Set routes and firewall rules.</li><li>Validate throughput and latency.</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "Onboard servers with Azure Arc",
        "body": "<ul><li>Install Arc agent on on-prem servers.</li><li>Organize into resource groups by environment.</li><li>Enable extensions for monitoring and policy.</li></ul>",
        "code": ""
      },
      {
        "icon": "govern",
        "title": "Apply governance (Policy) consistently",
        "body": "<ul><li>Assign policy initiatives for security baseline.</li><li>Use guest configuration for compliance.</li><li>Automate remediation where possible.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Central monitoring",
        "body": "<ul><li>Send logs/metrics to Log Analytics.</li><li>Use Workbooks for hybrid dashboards.</li><li>Set alerts for critical services and patch compliance.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Operational drills",
        "body": "<ul><li>Test failover for connectivity.</li><li>Test patching maintenance windows.</li><li>Document runbooks for outages.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Arc documentation",
        "url": "https://learn.microsoft.com/en-us/azure/azure-arc/"
      },
      {
        "title": "ExpressRoute",
        "url": "https://learn.microsoft.com/en-us/azure/expressroute/"
      },
      {
        "title": "VPN Gateway",
        "url": "https://learn.microsoft.com/en-us/azure/vpn-gateway/"
      }
    ]
  },
  {
    "id": "p23-incident-command",
    "title": "Real-Time Monitoring & Incident Command Center (Azure Monitor + Grafana)",
    "category": "Operations",
    "scenario": "Scenario: NOC needs a single pane of glass for services, SLAs, and incidents. Example: 'Kendaks Command Center' uses dashboards, alerts, and war-room workflows.",
    "architectureImage": "assets/diagrams/23_incident_command.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define SLOs and alert strategy",
        "body": "<ul><li>Define key signals: availability, latency, saturation, errors.</li><li>Reduce noise with actionability rules.</li><li>Define severity and on-call rotations.</li></ul>",
        "code": ""
      },
      {
        "icon": "deploy",
        "title": "Centralize telemetry",
        "body": "<ul><li>Create Log Analytics workspace per environment or central.</li><li>Enable diagnostics on key resources.</li><li>Standardize log tables and retention.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Dashboards (Workbooks + Grafana)",
        "body": "<ul><li>Build Azure Monitor Workbooks for platform KPIs.</li><li>Use Managed Grafana for multi-source dashboards.</li><li>Create an incident view: top alerts, services impacted.</li></ul>",
        "code": ""
      },
      {
        "icon": "integrate",
        "title": "Incident automation",
        "body": "<ul><li>Use Action Groups for paging and ITSM creation.</li><li>Automate Teams war-room creation.</li><li>Track incident timeline and postmortems.</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Secure access to monitoring",
        "body": "<ul><li>Use RBAC and least privilege for dashboards.</li><li>Separate reader vs responder roles.</li><li>Audit changes to alert rules.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Run incident simulations",
        "body": "<ul><li>Game days: simulate outage and validate paging.</li><li>Measure time-to-detect and time-to-mitigate.</li><li>Improve runbooks and dashboards.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Monitor",
        "url": "https://learn.microsoft.com/en-us/azure/azure-monitor/"
      },
      {
        "title": "Azure Managed Grafana",
        "url": "https://learn.microsoft.com/en-us/azure/managed-grafana/"
      }
    ]
  },
  {
    "id": "p24-pci-dss",
    "title": "PCI DSS-Compliant Payment Processing Platform (PCI DSS v4.0)",
    "category": "Compliance",
    "scenario": "Scenario: A payment workflow must be segmented, logged, and continuously assessed. Example: 'Kendaks Pay' processes card payments via a PCI zone, tokenizes data, and centralizes audit logs.",
    "architectureImage": "assets/diagrams/24_pci_dss.svg",
    "steps": [
      {
        "icon": "plan",
        "title": "Define PCI scope and segmentation",
        "body": "<ul><li>Minimize scope: tokenize early, avoid storing PAN.</li><li>Create a dedicated PCI subscription/RGs and networks.</li><li>Define network segmentation and jump host access.</li></ul>",
        "code": ""
      },
      {
        "icon": "network",
        "title": "Build PCI network zone",
        "body": "<ul><li>Hub-spoke or isolated VNet with strict NSGs.</li><li>Use Firewall/WAF, DDoS, and restricted outbound.</li><li>Use private endpoints to PaaS.</li></ul>",
        "code": ""
      },
      {
        "icon": "secure",
        "title": "Key management and encryption",
        "body": "<ul><li>Use Key Vault or Managed HSM for keys.</li><li>Enable CMK where required.</li><li>Rotate keys and certificates with auditable procedures.</li></ul>",
        "code": ""
      },
      {
        "icon": "monitor",
        "title": "Logging, monitoring, and retention",
        "body": "<ul><li>Enable diagnostics for all components.</li><li>Centralize logs into SIEM; ensure immutability where required.</li><li>Alert on suspicious activities and access to cardholder systems.</li></ul>",
        "code": ""
      },
      {
        "icon": "govern",
        "title": "Continuous compliance with Azure Policy",
        "body": "<ul><li>Assign the built-in PCI DSS v4.0 initiative.</li><li>Remediate non-compliant resources.</li><li>Generate evidence reports for auditors.</li></ul>",
        "code": ""
      },
      {
        "icon": "test",
        "title": "Security testing and audits",
        "body": "<ul><li>Run vulnerability scans and penetration tests.</li><li>Verify change management and access reviews.</li><li>Conduct annual PCI assessments and quarterly ASV scans.</li></ul>",
        "code": ""
      }
    ],
    "references": [
      {
        "title": "Azure Policy PCI DSS v4.0 built-in initiative",
        "url": "https://learn.microsoft.com/en-us/azure/governance/policy/samples/pci-dss-4-0"
      },
      {
        "title": "Azure security documentation",
        "url": "https://learn.microsoft.com/en-us/azure/security/"
      }
    ]
  }
];
