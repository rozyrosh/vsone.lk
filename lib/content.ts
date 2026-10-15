export const LOGO = "/vsone-logo.png";

export const PHONE_DISPLAY = "+94 112 592 121";
export const PHONE_TEL = "+94112592121";
export const EMAIL = "info@vsone.lk";
export const ADDRESS = "No. 220, Thimbirigasyaya Road, Colombo 05, Sri Lanka";

export const nav = [
  { href: "/", label: "Home" },
  { href: "/home-2", label: "Home 2" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/offerings", label: "Offerings" },
  { href: "/partners", label: "Partners" },
  { href: "/news", label: "News" },
] as const;

export const brands = [
  { name: "QNAP", logo: "/brands/brand-1.png" },
  { name: "Alcatel-Lucent", logo: "/brands/brand-2.png" },
  { name: "Sangfor", logo: "/brands/brand-4.png" },
  { name: "SADES", logo: "/brands/brand-5.png" },
  { name: "EnGenius", logo: "/brands/brand-6.png" },
  { name: "Horion", logo: "/brands/brand-7.png" },
  { name: "HP", logo: "/brands/brand-8.png" },
  { name: "Livolo", logo: "/brands/brand-9.png" },
  { name: "Yison", logo: "/brands/brand-10.png" },
  { name: "Vertiv", logo: "/brands/brand-11.png" },
  { name: "Ugreen", logo: "/brands/brand-12.png" },
  { name: "Uniview", logo: "/brands/brand-13.png" },
  { name: "PNY", logo: "/brands/brand-14.png" },
  { name: "Planet", logo: "/brands/brand-15.png" },
  { name: "Nexstgo", logo: "/brands/brand-16.png" },
  { name: "Samsung", logo: "/brands/brand-17.png" },
] as const;

export const metrics = [
  { label: "Channel reach", icon: "hub", value: 200, suffix: "+", detail: "Island-wide\npartners" },
  { label: "GLOBAL BRANDS", icon: "public", value: 50, suffix: "+", detail: "Globally recognized technology brands" },
  { label: "GEOGRAPHIC SCOPE", icon: "map", value: 9, suffix: " of 9", detail: "Provinces with partners and doorstep delivery" },
  { label: "INNOVATION FIRST", icon: "deployed_code", value: 1, suffix: "st", detail: "Customer experience center in Sri Lanka" },
];

export const portalSteps = [
  { title: "Stock checked", detail: "Live quantities by SKU and hub, before you quote." },
  { title: "Credit cleared", detail: "Your line and your terms, visible on the order." },
  { title: "Serial verified", detail: "Vendor serials validated so warranty starts clean." },
  { title: "Dispatched", detail: "Tracked from the Colombo hub to your province." },
];

export const faqs = [
  {
    q: "Do you sell to the public?",
    a: "No. VS One sells to registered partners: retailers, resellers, system integrators, sub-distributors and marketplaces. If you are a business, apply for a partner account and the desk will call you.",
  },
  {
    q: "How fast is delivery outside Colombo?",
    a: "24 to 48 hours to every province. Western-province partners can collect from the Colombo hub the same day stock is allocated.",
  },
  {
    q: "What happens when a unit is dead on arrival?",
    a: "Raise it in the portal against the serial. The Colombo convenience center handles DOA claims, repairs and RMA, and the replacement follows the same tracked route back to you.",
  },
  {
    q: "Is there a minimum order or a joining fee?",
    a: "No joining fee. Tier pricing starts from the first order, and volume moves you up the tiers over time.",
  },
  {
    q: "How do I get credit terms?",
    a: "Apply for a partner account, trade for a short period, then request a credit line in the portal. The desk reviews it and the line appears on your account.",
  },
  {
    q: "Can we test equipment before a bid?",
    a: "Yes. The Enterprise Experience Center in Colombo has live boards, conference audio and dense compute. Bring the bill of materials and the pre-sales team stages the closest configuration.",
  },
];

export const pillars = [
  {
    tag: "Catalog",
    icon: "inventory_2",
    title: "Many brands, one catalog",
    description:
      "Compute, networking, datacenter, rooms, mobile, software, and smart office. Partners buy across vendors from one bench instead of opening six accounts.",
    link: "Browse the catalog",
    href: "/products",
  },
  {
    tag: "Logistics",
    icon: "local_shipping",
    title: "Doorstep delivery, every province",
    description:
      "Orders leave the Colombo hub and reach partners in any corner of the island. The turnaround is 24 to 48 hours.",
    link: "View the dispatch hubs",
    href: "#island",
  },
  {
    tag: "Consulting",
    icon: "memory",
    title: "Engineers beside the bid",
    description:
      "Training, design advice, and technical support from certified engineers. The Experience Center stages the closest build before you quote.",
    link: "Talk to engineering",
    href: "/contact",
  },
  {
    tag: "Stores",
    icon: "storefront",
    title: "Online stores for partners",
    description:
      "VS One runs storefronts so a partner can take orders online without standing up a shop of their own.",
    link: "Talk to our team",
    href: "/contact",
  },
  {
    tag: "Warranty",
    icon: "support_agent",
    title: "Repair under a written SLA",
    description:
      "The Colombo convenience center handles warranty, dead-on-arrival claims, and returns against a service level agreed with the partner.",
    link: "Service center",
    href: "/services",
  },
  {
    tag: "Credit",
    icon: "account_balance",
    title: "Credit shaped to the account",
    description:
      "Payment schemes and credit lines set for the partner, reviewed by the desk, then shown on the portal.",
    link: "Ask about credit",
    href: "/contact",
  },
];

export type Offering = {
  slug: string;
  title: string;
  badge: string;
  badgeTone: "dark" | "crimson" | "muted";
  summary: string;
  meta: string;
  image: string;
  alt: string;
  extended?: boolean;
};

export const offerings: Offering[] = [
  {
    slug: "compute",
    title: "PC & Component",
    badge: "Compute",
    badgeTone: "dark",
    summary:
      "Notebooks, desktops, printers, monitors, IT accessories and workstations from the best brands",
    meta: "12 Subcategories",
    image: "/catalog/studio-compute.jpg",
    alt: "A silver business laptop with a blue screen on a white studio surface",
  },
  {
    slug: "network",
    title: "Network & Security",
    badge: "Security",
    badgeTone: "crimson",
    summary:
      "Switches, access points, routers, CCTV products and endpoint security products from the best brands.",
    meta: "18 Brands",
    image: "/catalog/studio-network.jpg",
    alt: "A white rackmount network switch with a row of blue port lights",
  },
  {
    slug: "datacenter",
    title: "Datacenter Systems",
    badge: "Infrastructure",
    badgeTone: "dark",
    summary:
      "Servers, storage, networking products, UPS systems, racks and enclosures.",
    meta: "Tier-1 Certified",
    image: "/catalog/studio-server.jpg",
    alt: "White rackmount servers with blue status lights in a datacenter",
  },
  {
    slug: "display",
    title: "Display & Audio",
    badge: "AV Systems",
    badgeTone: "muted",
    summary:
      "Smart boards, digital signage, indoor and outdoor displays and controllers, plus call center, conference and industrial audio systems.",
    meta: "Meeting rooms",
    image: "/catalog/studio-av.jpg",
    alt: "A white meeting room with a wall display and a conference speaker",
  },
  {
    slug: "mobile",
    title: "Mobile & accessories",
    badge: "Mobile",
    badgeTone: "dark",
    summary: "Mobile phones, personalized gadgets, and phone accessories from the global brands.",
    meta: "Handsets",
    image: "/catalog/studio-mobile.jpg",
    alt: "A silver phone with a blue screen beside white earbuds on a white studio surface",
  },
  {
    slug: "software",
    title: "Software & services",
    badge: "Software",
    badgeTone: "muted",
    summary: "Device management, managed printing, ERP, CRM, and design software.",
    meta: "Licenses",
    image: "/catalog/studio-software.jpg",
    alt: "A white desktop monitor with a blue screen and a keyboard on a white desk",
  },
  {
    slug: "automation",
    title: "Smart home & office",
    badge: "Smart",
    badgeTone: "crimson",
    summary: "Switches, controllers, sensors, gateways, and smart locks for connected homes and offices.",
    meta: "Connected",
    image: "/catalog/studio-smarthome.jpg",
    alt: "A white switch, a round sensor, and a silver smart lock on a white studio surface",
  },
];

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  summary: string;
  image: string;
  sku: string;
};

export const catalogFilters = [
  { slug: "compute", label: "Laptops & PCs" },
  { slug: "network", label: "Network & Security" },
  { slug: "datacenter", label: "Datacenter" },
  { slug: "display", label: "Display & Audio" },
  { slug: "mobile", label: "Mobile" },
  { slug: "software", label: "Software" },
  { slug: "automation", label: "Smart Office" },
] as const;

export const products: Product[] = [
  { id: "dell-latitude", name: "Latitude 5550", brand: "Dell", category: "compute", sku: "DLL-LAT-5550", image: "/catalog/laptop-1.jpg", summary: "14-inch business laptop for fleet refresh and field teams." },
  { id: "lenovo-thinkpad", name: "ThinkPad E16", brand: "Lenovo", category: "compute", sku: "LNV-TPE-16", image: "/catalog/laptop-2.jpg", summary: "16-inch commercial notebook with a full keyboard and spill-resistant deck." },
  { id: "hp-probook", name: "ProBook 450 G10", brand: "HP", category: "compute", sku: "HP-PB-450", image: "/catalog/laptop-3.jpg", summary: "15.6-inch corporate laptop for reseller and SME desk deployments." },
  { id: "asus-expertbook", name: "ExpertBook B1", brand: "ASUS", category: "compute", sku: "ASU-EXB-B1", image: "/catalog/laptop-4.jpg", summary: "Military-grade business laptop for branch offices and mobile staff." },
  { id: "lenovo-thinkbook", name: "ThinkBook 14", brand: "Lenovo", category: "compute", sku: "LNV-TB-14", image: "/catalog/laptop-5.jpg", summary: "Slim 14-inch notebook for everyday commercial procurement." },
  { id: "acer-travelmate", name: "TravelMate P2", brand: "Acer", category: "compute", sku: "ACR-TM-P2", image: "/catalog/laptop-6.jpg", summary: "Durable travel laptop for education and public-sector rollouts." },
  { id: "dell-precision", name: "Precision Workstation", brand: "Dell", category: "compute", sku: "DLL-PRC-TWR", image: "/catalog/monitor.jpg", summary: "ISV-certified tower for design and engineering desks." },
  { id: "lenovo-thinkvision", name: "ThinkVision Monitor", brand: "Lenovo", category: "display", sku: "LNV-TV-27", image: "/catalog/monitor.jpg", summary: "27-inch commercial display for trading floors and offices." },
  { id: "dell-poweredge", name: "PowerEdge Rack Server", brand: "Dell", category: "datacenter", sku: "DLL-PE-R650", image: "/catalog/server.jpg", summary: "2U rack server for virtualization and branch compute." },
  { id: "hpe-proliant", name: "ProLiant DL Server", brand: "HPE", category: "datacenter", sku: "HPE-PL-DL380", image: "/catalog/server.jpg", summary: "Density-optimized compute for private cloud racks." },
  { id: "hpe-msa", name: "MSA Storage Array", brand: "HPE", category: "datacenter", sku: "HPE-MSA-2060", image: "/catalog/server.jpg", summary: "Shared SAN storage for mixed virtual workloads." },
  { id: "lenovo-thinksystem", name: "ThinkSystem Server", brand: "Lenovo", category: "datacenter", sku: "LNV-TS-SR650", image: "/catalog/server.jpg", summary: "Rack server platform for general enterprise loads." },
  { id: "apc-smartups", name: "Smart-UPS", brand: "APC", category: "datacenter", sku: "APC-SU-3000", image: "/catalog/server.jpg", summary: "Line-interactive and online UPS for racks and closets." },
  { id: "apc-pdu", name: "Rack PDU", brand: "APC", category: "datacenter", sku: "APC-PDU-MT", image: "/catalog/server.jpg", summary: "Metered power distribution for dense cabinets." },
  { id: "cisco-catalyst", name: "Catalyst Layer-3 Switch", brand: "Cisco", category: "network", sku: "CSC-CAT-9300", image: "/catalog/network.jpg", summary: "Core and distribution switching with full Layer-3 routing." },
  { id: "cisco-meraki", name: "Meraki Security Appliance", brand: "Cisco", category: "network", sku: "CSC-MRK-MX", image: "/catalog/network.jpg", summary: "Cloud-managed UTM for multi-site retailers." },
  { id: "hpe-aruba-ap", name: "Aruba Access Point", brand: "HPE", category: "network", sku: "HPE-ARB-AP", image: "/catalog/network.jpg", summary: "Wi-Fi 6 campus access for offices and showrooms." },
  { id: "fortinet-fg", name: "FortiGate Firewall", brand: "Fortinet", category: "network", sku: "FTN-FG-100", image: "/catalog/network.jpg", summary: "Next-gen firewall for branch and datacenter edges." },
  { id: "fortinet-fap", name: "FortiAP Wireless", brand: "Fortinet", category: "network", sku: "FTN-FAP-431", image: "/catalog/network.jpg", summary: "Secure wireless tied to the Fortinet fabric." },
  { id: "cctv-nvr", name: "Intelligent CCTV NVR", brand: "VS One", category: "network", sku: "VSO-NVR-16", image: "/catalog/network.jpg", summary: "Surveillance recording for retail and campus sites." },
  { id: "smart-board", name: "Interactive Smart Board", brand: "VS One", category: "display", sku: "VSO-SB-86", image: "/catalog/board.jpg", summary: "Meeting-room display evaluated in the Experience Center." },
  { id: "conf-bar", name: "Conference Audio Bar", brand: "VS One", category: "display", sku: "VSO-CAB-01", image: "/catalog/board.jpg", summary: "All-in-one camera and speaker bar for hybrid rooms." },
  { id: "cisco-ip-phone", name: "IP Collaboration Endpoint", brand: "Cisco", category: "display", sku: "CSC-IP-8841", image: "/catalog/phone.jpg", summary: "Desk and room endpoints for enterprise voice." },
  { id: "headset", name: "Call Center Headset", brand: "VS One", category: "display", sku: "VSO-HS-CC", image: "/catalog/headset.jpg", summary: "Noise-managed headset for contact center desks." },
  { id: "erp-suite", name: "Enterprise ERP License", brand: "VS One", category: "software", sku: "VSO-ERP-LIC", image: "/catalog/monitor.jpg", summary: "Business suite allocated through the partner portal." },
  { id: "crm-suite", name: "CRM Platform", brand: "VS One", category: "software", sku: "VSO-CRM-LIC", image: "/catalog/monitor.jpg", summary: "Customer platform for corporate channel deals." },
  { id: "rugged-handset", name: "Rugged Business Handset", brand: "VS One", category: "mobile", sku: "VSO-PH-RGD", image: "/catalog/phone.jpg", summary: "Field device for logistics and retail operations." },
  { id: "office-sensor", name: "Workplace Occupancy Sensor", brand: "VS One", category: "automation", sku: "VSO-SNS-OC", image: "/catalog/board.jpg", summary: "Sensor for smart office automation projects." },
];

export const catalogBrands = [...new Set(products.map((item) => item.brand))];

export function categoryLabel(slug: string) {
  return catalogFilters.find((item) => item.slug === slug)?.label ?? slug;
}

export function getProduct(id: string) {
  return products.find((item) => item.id === id);
}

export function searchCatalog(query: string, category?: string, brand?: string) {
  const q = query.trim().toLowerCase();
  return products.filter((item) => {
    if (category && item.category !== category) return false;
    if (brand && item.brand !== brand) return false;
    if (!q) return true;
    return [item.name, item.brand, item.category, item.sku, item.summary].join(" ").toLowerCase().includes(q);
  });
}

export const provinces = [
  { code: "01", name: "Northern", count: "10+", side: "left" as const, x: 18, y: 15 },
  { code: "09", name: "North Central", count: "10+", side: "right" as const, x: 66, y: 23.7 },
  { code: "02", name: "North Western", count: "20+", side: "left" as const, x: 8.5, y: 44.6 },
  { code: "08", name: "Eastern", count: "10+", side: "right" as const, x: 86.8, y: 53.3 },
  { code: "03", name: "Western", count: "80+", side: "left" as const, x: 11.3, y: 62.1, hq: true },
  { code: "07", name: "Central", count: "20+", side: "right" as const, x: 96, y: 69.8 },
  { code: "05", name: "Sabaragamuwa", count: "15+", side: "left" as const, x: 18.5, y: 79.7 },
  { code: "06", name: "Uva", count: "10+", side: "right" as const, x: 83.7, y: 87.4 },
  { code: "04", name: "Southern", count: "20+", side: "left" as const, x: 23.5, y: 95.1 },
];

export const provinceBadges = [
  { name: "Western", count: "80+", accent: true },
  { name: "Central", count: "20+" },
  { name: "Southern", count: "20+" },
  { name: "North Western", count: "20+" },
  { name: "Sabaragamuwa", count: "15+" },
  { name: "Northern", count: "10+" },
  { name: "Eastern", count: "10+" },
  { name: "North Central", count: "10+" },
  { name: "Uva", count: "10+" },
];

export const hubs = [
  { city: "Colombo 05", role: "Headquarters & convenience center", detail: ADDRESS },
  { city: "Western hub", role: "Primary dispatch", detail: "80+ active partners, same-province staging." },
  { city: "Central & Southern", role: "Regional coverage", detail: "20+ partners each, 24 to 48 hour doorstep logistics." },
  { city: "North, East & Uva", role: "Island reach", detail: "Dedicated channel managers for remote provinces." },
];

export const offers = [
  { icon: "inventory_2", title: "Value-Added Distributor", summary: "We are the one-stop destination for our partners for all their ICT-related products and services requirements, from client compute to datacenter equipment and enterprise software." },
  { icon: "groups", title: "Partner Management", summary: "Recruitment, accreditation and specialization, business planning, business management, credit terms and logistics management, all handled for our partners." },
  { icon: "campaign", title: "Channel Support & Business Development", summary: "Pre-sales support, demo equipment, RFP response support, demand generation activities, events and PR." },
  { icon: "emoji_events", title: "Performance Evaluation & Rewards", summary: "Performance evaluations, incentives, promotions and attractive rebate schemes for our partners." },
  { icon: "build", title: "Repair & Warranty Management", summary: "We work closely with our partners to deliver Service Level Agreements for repairs and warranty management." },
  { icon: "account_balance", title: "Financial Services", summary: "Tailor-made financial schemes and credit terms for the convenience of our partners." },
];

export const channels = [
  { icon: "storefront", title: "Direct Retail Showrooms", summary: "We supply IT products and services to retail showrooms that bring our brands closer to individual customers." },
  { icon: "terminal", title: "IT Resellers", summary: "Full bills of materials for corporate and SME IT procurement, with tiered volume margins." },
  { icon: "device_hub", title: "System Integrators", summary: "Products and services for system integrators, with solutions customized to industry specifications." },
  { icon: "warehouse", title: "Sub Distributors", summary: "World-class products and services that help sub distributors strengthen their operations and serve their stakeholders." },
  { icon: "shopping_bag", title: "Large-Format Retailers", summary: "Effective, seamless distribution of our products and solutions to large-format retailers across the country." },
  { icon: "shopping_cart", title: "E-Commerce Marketplaces", summary: "Global brands and reliable solutions for e-commerce partners, supported by the online stores VS One operates." },
];

export const services = [
  { icon: "inventory_2", title: "Value-added distribution", summary: "One allocation desk for compute, networking, datacenter, and software across 50+ brands." },
  { icon: "memory", title: "Pre-sales architecture", summary: "Certified engineers and a live Experience Center for boards, rooms, and dense compute." },
  { icon: "local_shipping", title: "Nationwide logistics", summary: "Doorstep delivery to every province with a 24 to 48 hour partner SLA." },
  { icon: "support_agent", title: "Warranty, DOA & RMA", summary: "Colombo convenience center for repairs, dead-on-arrival claims, and partner returns." },
  { icon: "deployed_code", title: "ERP partner portal", summary: "Stock, credit, serial validation, and shipment tracking in one reseller login." },
  { icon: "monitoring", title: "Managed commercial terms", summary: "Credit lines, tier incentives, and account personnel matched to each channel model." },
];

export const teamImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA6fBjJEpVeou6DoY3NPvYZzESYkw81o4Pkasy3x8R5cJ4CypuTtBNj6OhbSJ0ULpF9bpvfuMT4_SK32dubOwfZtLbTvvOpwm_jMvfwZQBxjZvM-sWvBbueKUlWysBzzD5GfHjC8AHmfpYe0JP7TgxL8kDzXWb1MSKalvtRcJxonSFHjha7i8Gm_Qfo5fESBdRjdIlwF-Y3WJfip0uRqIv3sPxHYtW-2VvjK9p4AeR0ytekoOcHgBgaglYcajxe8AsY9A";

export const facilityImage =
  "https://lh3.googleusercontent.com/aida/AEtjO1WUFsgu0sEoHAPQo2z0KwqrXTHW4c2r5zbmOr3f3MmJSoQJJ-P6X6i0GmLtoPxvXFZoMGNPugoOwWgRPwWePAOSdR_rRFza6hWR19_E6vw5J7fcm_OF-Uv97n4rALu_VWfmEn3k4romfzZfg_nnOwuhN5Ql17LJ3wfV4nnidL2mP5j1dN24TpwmaDjpGUi4av8caEqu__4gYOKU3-0t1KdXLd88j_7g1JJm7_T-amMqORDet9SCw6gSCOA";

export const mapImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCkqQsChZ3JsH8gj2RWPKZAWOrDx6uvTjDjrR-WUOkqauEeb3FGThz4aMjYK2RBxcsw-vw1pLRAcAGN_7kv2F9Ms3PLdqQr76ODJjcZ2MFhs8VjYVAgF6fbAHWqmrFQj75QDm9K6rl1YF6Ztn8NyjdjErI-RvDGWyuXTFgszkb7x2BwkvAXZUlWlqD1MVASJ2rVvIc5OPwWJ4zAUb2WLJLk3ONaGrDp8yWHZ2-_-VcV1Ch7cqGktYjh1T3zdObZMPENLA";

export const teamRoles = [
  { icon: "verified", kicker: "Executive", title: "Executive Leadership", detail: "Decades of ICT vendor governance" },
  { icon: "memory", kicker: "Engineering", title: "Pre-Sales Architects", detail: "Certified L3 & cloud engineers" },
  { icon: "local_shipping", kicker: "Logistics", title: "Island-Wide Logistics Core", detail: "24 to 48 hour turnaround, every province" },
  { icon: "support_agent", kicker: "Support", title: "24/7 Enterprise SLAs", detail: "Immediate RMA & warranty response" },
];

export type Article = {
  slug: string;
  date: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "customer-convenience-service-center",
    date: "November 15, 2024",
    title: "Opening of Customer Convenience Service Center",
    summary:
      "VS One inaugurated an upgraded convenience center at our Colombo head office, enhancing turnaround times for device repairs, DOA claims, and partner RMA requests.",
    image: "/contact/1686.jpg",
    category: "Service center",
    body: [
      "VS One inaugurated an upgraded convenience center at the Colombo head office on Thimbirigasyaya Road. The floor is set up for device repairs, dead-on-arrival claims, and partner RMA intake in one visit.",
      "Authorized partners can book a drop-off against their portal account. Serial checks happen at the counter, and status returns through the same ERP record used for the original shipment.",
      "The center sits with headquarters dispatch so western-province partners can combine a collection and a return on the same run.",
    ],
  },
  {
    slug: "enterprise-experience-center",
    date: "October 20, 2024",
    title: "Inauguration of the Enterprise Experience Center",
    summary:
      "Partners and enterprise buyers can now evaluate live interactive digital smart boards, conference room acoustics, and high-density compute clusters in real time.",
    image: "/catalog/studio-av.jpg",
    category: "Experience floor",
    body: [
      "The Enterprise Experience Center gives partners and enterprise buyers a working room instead of a slide. Interactive boards, conference acoustics, and high-density compute are installed and powered.",
      "Pre-sales architects use the floor for RFP walkthroughs covering telecommunications, banking, and government bids. Integrators can compare displays, audio bars, and rack configurations before they commit stock.",
      "Visits are arranged through the Colombo office. Bring the bill of materials you are pricing and the team will stage the closest available configuration.",
    ],
  },
  {
    slug: "erp-partner-portal-2",
    date: "September 18, 2024",
    title: "ERP Partner Portal 2.0 Feature Release",
    summary:
      "New instant credit line requests, direct vendor serial number validations, and automated shipment tracking are now live for all registered resellers.",
    image: "/pillars/portal.jpg",
    category: "Partner portal",
    body: [
      "Portal 2.0 is live for registered resellers. Instant credit line requests, vendor serial validation, and automated shipment tracking sit beside the stock and warranty tools from the first release.",
      "A reseller can confirm a serial before a DOA is raised, then follow the replacement from the Colombo hub to the province without a separate status call.",
      "New partners receive portal credentials after their application is accepted. Existing accounts keep the same login.",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
