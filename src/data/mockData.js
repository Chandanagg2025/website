// Comprehensive mock data for SHREE PRATHAM across all 5 verticals

export const initialGiftProducts = [
  {
    id: 'gift-1',
    name: 'Executive Gold Crest Gift Set',
    category: 'Corporate',
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    description: 'Bespoke corporate gifting box featuring 24K gold foil pen, premium leatherette notebook, customized metallic keychain & insulated cardholder.',
    isCustomizable: true,
    inStock: true,
    tags: ['Best Seller', 'Corporate'],
    personalizationOptions: ['Name Engraving', 'Company Logo Stamping', 'Custom Message Card']
  },
  {
    id: 'gift-2',
    name: 'Royal Heritage Wedding Sweet Box',
    category: 'Wedding',
    price: 2450,
    originalPrice: 3200,
    rating: 5.0,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
    description: 'Handcrafted velvet keepsake hamper filled with organic dry fruits, saffron-infused treats, scented brass diya, and gold-foil congratulations card.',
    isCustomizable: true,
    inStock: true,
    tags: ['Luxury', 'Wedding'],
    personalizationOptions: ['Bride & Groom Names', 'Wax Seal Stamping', 'Custom Date Ribbon']
  },
  {
    id: 'gift-3',
    name: 'Celebration Confetti Birthday Hamper',
    category: 'Birthday',
    price: 1299,
    originalPrice: 1699,
    rating: 4.8,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=800&auto=format&fit=crop',
    description: 'Vibrant celebratory box packed with artisanal chocolates, customized thermal tumbler, personalized birthday plaque, and party sparklers.',
    isCustomizable: true,
    inStock: true,
    tags: ['Trending', 'Birthday'],
    personalizationOptions: ['Recipient Name', 'Age Number Badge', 'Photo Greeting Card']
  },
  {
    id: 'gift-4',
    name: 'Divya Festive Brass Pooja Collection',
    category: 'Festive',
    price: 1999,
    originalPrice: 2799,
    rating: 4.9,
    reviews: 310,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=800&auto=format&fit=crop',
    description: 'Pure bell-metal brass Aarti Thali set with engraved lotus motifs, natural dhoop cones, silver coin and festive velvet pouch.',
    isCustomizable: true,
    inStock: true,
    tags: ['Festive Special', 'Handmade'],
    personalizationOptions: ['Family Name Engraving', 'Festive Blessing Message']
  },
  {
    id: 'gift-5',
    name: 'Artisan Gourmet Chocolate Chest',
    category: 'Birthday',
    price: 1150,
    originalPrice: 1450,
    rating: 4.7,
    reviews: 82,
    image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?q=80&w=800&auto=format&fit=crop',
    description: 'Assorted Belgian dark, hazelnut praline, and berry infused artisanal chocolates in a reusable mahogany-finished wooden case.',
    isCustomizable: true,
    inStock: true,
    tags: ['Gourmet', 'Birthday'],
    personalizationOptions: ['Wooden Lid Engraving', 'Satin Ribbon Color']
  },
  {
    id: 'gift-6',
    name: 'Eco-Elite Sustainable Corporate Kit',
    category: 'Corporate',
    price: 999,
    originalPrice: 1350,
    rating: 4.8,
    reviews: 140,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop',
    description: 'Plantable seed pen, bamboo flask with digital temperature gauge, cork notebook, and unbleached cotton tote bag.',
    isCustomizable: true,
    inStock: true,
    tags: ['Eco-Friendly', 'Corporate'],
    personalizationOptions: ['Corporate Logo Laser Print', 'Employee Name']
  }
];

export const initialWaterProducts = [
  {
    id: 'water-1',
    name: '20L Alkaline Mineral Bubble Jar',
    type: 'Jar',
    price: 90,
    deposit: 150,
    rating: 4.9,
    reviews: 820,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=800&auto=format&fit=crop',
    description: '10-stage purified 20 Litre water jar with added copper, magnesium, and essential alkaline minerals. 100% BPA-free food-grade container.',
    purity: 'TDS 90-120 PPM • pH 8.2 Alkaline',
    inStock: true,
    subscriptionEligible: true
  },
  {
    id: 'water-2',
    name: 'Smart Bottom-Loading Hot & Cold Dispenser',
    type: 'Jar',
    price: 5499,
    originalPrice: 6999,
    rating: 4.8,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop',
    description: 'Ergonomic stainless steel bottom-loading dispenser. Three water temperatures (Chill, Room, Instant Boiling 90°C) with child safety lock.',
    purity: 'Energy Star Rated • Stainless Steel Reservoir',
    inStock: true,
    subscriptionEligible: false
  },
  {
    id: 'water-3',
    name: 'Premium 500ml Bottled Water Case (24 Bottles)',
    type: 'Bottled',
    price: 360,
    originalPrice: 480,
    rating: 4.9,
    reviews: 430,
    image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?q=80&w=800&auto=format&fit=crop',
    description: 'Box of 24 shatterproof 500ml bottles, UV sterilized and ozonized for conferences, weddings, executive travel, and daily hydration.',
    purity: 'UV Sterilized • Micro-Filtered • Pack of 24',
    inStock: true,
    subscriptionEligible: true
  },
  {
    id: 'water-4',
    name: 'Executive 1 Litre Mineral Bottles Case (12 Bottles)',
    type: 'Bottled',
    price: 240,
    originalPrice: 300,
    rating: 4.7,
    reviews: 260,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=800&auto=format&fit=crop',
    description: 'Box of 12 ergonomic 1-Litre bottles. Ideal for home, gym, long-distance road trips, and meeting rooms.',
    purity: 'Reverse Osmosis • Ozonized • Pack of 12',
    inStock: true,
    subscriptionEligible: true
  },
  {
    id: 'water-5',
    name: 'Commercial 50 LPH Industrial RO Purifier',
    type: 'RO Purified',
    price: 18500,
    originalPrice: 22000,
    rating: 5.0,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1584771145729-0bd9fda6529b?q=80&w=800&auto=format&fit=crop',
    description: 'Heavy duty 50 Litres Per Hour RO plant with dual Dow Filmtec membranes, antiscalant dosing, and 50L SS storage vessel for offices, cafeterias and clinics.',
    purity: 'Multi-Stage Commercial RO + UV + TDS Controller',
    inStock: true,
    subscriptionEligible: false
  }
];

export const initialAppliances = [
  {
    id: 'app-1',
    name: 'Titan Frost 550L Double Door Deep Freezer',
    category: 'Refrigeration',
    price: 42500,
    rating: 4.9,
    reviews: 73,
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800&auto=format&fit=crop',
    description: 'Commercial high-capacity horizontal chest freezer designed for cloud kitchens, restaurants, dairy outlets, and frozen supermarkets.',
    specs: {
      capacity: '550 Litres',
      tempRange: '-18°C to -26°C (Sub-Zero Rapid Freeze)',
      power: '280 Watts • 230V / 50Hz Single Phase',
      material: 'Food Grade SS 304 Inner Liner • Powder Coated Steel',
      dimensions: '1650 x 740 x 850 mm',
      warranty: '3 Years Comprehensive + 5 Years on Emerson Compressor',
      energyRating: '5 Star Commercial Inverter'
    },
    inStock: true
  },
  {
    id: 'app-2',
    name: 'CoolBreeze 4-Door Glass Upright Display Chiller',
    category: 'Refrigeration',
    price: 68000,
    rating: 4.8,
    reviews: 41,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=800&auto=format&fit=crop',
    description: 'Full-height ventilated upright chiller with heated anti-fog double glazed glass doors and brilliant LED canopy illumination.',
    specs: {
      capacity: '880 Litres',
      tempRange: '+1°C to +8°C Uniform Air Flow',
      power: '450 Watts • R290 Eco Refrigerant',
      material: 'Pre-painted Galvanized Sheet + Anodized Aluminum',
      dimensions: '1200 x 710 x 2000 mm',
      warranty: '2 Years Comprehensive',
      energyRating: '4 Star Commercial'
    },
    inStock: true
  },
  {
    id: 'app-3',
    name: 'Vulcan Pro Heavy-Duty 4-Burner Range with Oven',
    category: 'Cooking',
    price: 54900,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
    description: 'Heavy duty commercial LPG/PNG range equipped with cast iron pan supports, pilot burners, flame failure safety, and spacious base roasting oven.',
    specs: {
      capacity: '4 High-Output Burners (32,000 BTU each) + 80L Oven',
      tempRange: 'Oven: 50°C to 300°C Thermostatic Control',
      power: 'Gas Operated with Auto Spark Ignition',
      material: 'Heavy Gauge Non-Magnetic SS 304 1.5mm',
      dimensions: '900 x 900 x 850 mm',
      warranty: '2 Years On-Site Commercial Warranty',
      energyRating: 'High Efficiency Thermal Design'
    },
    inStock: true
  },
  {
    id: 'app-4',
    name: 'MaxiInduct 5000W Commercial Induction Wok Range',
    category: 'Cooking',
    price: 34000,
    rating: 4.7,
    reviews: 55,
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800&auto=format&fit=crop',
    description: 'Instant-response concave induction wok station for high-flame Asian and Continental stir fry. Delivers 93% thermal efficiency with zero kitchen heat.',
    specs: {
      capacity: 'Single Concave Wok (Up to 40cm Wok)',
      tempRange: '60°C to 280°C (10 Power Presets)',
      power: '5000W (5KW) • 3-Phase 415V Industrial',
      material: 'German Schott Ceran Glass + SS 304 Body',
      dimensions: '500 x 600 x 400 mm',
      warranty: '2 Years Motor & IGBT Warranty',
      energyRating: '93% Efficiency Certification'
    },
    inStock: true
  },
  {
    id: 'app-5',
    name: 'Apex Spiral Dough Kneader 30KG',
    category: 'Processing',
    price: 49500,
    rating: 5.0,
    reviews: 38,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    description: 'Two-speed automatic spiral mixer for bakeries, pizzerias and central kitchens. Mixes stiff doughs gently without heating.',
    specs: {
      capacity: '30 KG Flour / 48 KG Finished Dough',
      tempRange: 'Ambient (Friction minimal design)',
      power: '2.2 KW Dual Speed Motor',
      material: 'Electropolished SS 304 Bowl & Spiral Arm',
      dimensions: '880 x 530 x 920 mm',
      warranty: '2 Years Gearbox & Motor',
      energyRating: 'Industrial Duty Heavy Cycle'
    },
    inStock: true
  },
  {
    id: 'app-6',
    name: 'OmniCut Commercial Vegetable Prep Processor',
    category: 'Processing',
    price: 29800,
    rating: 4.8,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?q=80&w=800&auto=format&fit=crop',
    description: 'Continuous feed multi-disc vegetable cutter with 6 interchangeable cutting discs for slicing, dicing, julienne, grating and shredding.',
    specs: {
      capacity: '300 KG / Hour Output',
      tempRange: 'Continuous Duty Air-Cooled',
      power: '750 Watts Induction Motor • 230V',
      material: 'Cast Aluminum Alloy + Tempered Stainless Steel Blades',
      dimensions: '510 x 280 x 500 mm',
      warranty: '1 Year Full Replacement Guarantee',
      energyRating: 'Continuous Commercial Duty'
    },
    inStock: true
  }
];

export const marketingPackages = [
  {
    id: 'mkt-seo',
    name: 'SEO Domination & Organic Pipeline',
    category: 'SEO',
    tagline: 'Claim #1 Rankings on Google & Attract High-Intent Buyers 24/7',
    price: 18500,
    period: 'per month',
    popular: true,
    features: [
      'Comprehensive 150-Point Technical SEO & Core Web Vitals Audit',
      'High-Intent Commercial Keyword Architecture (50 Keywords)',
      'On-Page Optimization & Semantic Schema Markup',
      '8 High-DA Authority Backlinks & Digital PR placements/mo',
      'Monthly In-depth Competitor Gap Analysis & Rank Tracking',
      'Dedicated Google Analytics 4 & Search Console Dashboard'
    ],
    timeline: '3-6 Months typical ROI inflection point',
    idealFor: 'E-commerce, D2C brands, manufacturing & local businesses'
  },
  {
    id: 'mkt-social',
    name: 'Social Media Mastery & Virality',
    category: 'Social',
    tagline: 'Turn Passive Followers Into Vocal Brand Advocates & Buyers',
    price: 22000,
    period: 'per month',
    popular: false,
    features: [
      '16 Bespoke High-Converting Short-Form Reels & Carousels',
      'End-to-End Scripting, Professional Video Editing & Hook Crafting',
      'Instagram, LinkedIn, Facebook & YouTube Shorts Cross-Posting',
      'Daily Community Management & Comment Response Protocol',
      'Monthly Micro-Influencer Outreach & Collaboration Management',
      'Brand Identity Aesthetics, Fonts & Tone Guidelines'
    ],
    timeline: 'Immediate engagement boost within 14 days',
    idealFor: 'Lifestyle brands, restaurants, startups & creators'
  },
  {
    id: 'mkt-ppc',
    name: 'High-ROAS Paid Performance Ads',
    category: 'PPC',
    tagline: 'Laser-Targeted Google & Meta Campaigns Engineered for Max Profit',
    price: 26000,
    period: 'per month',
    popular: true,
    features: [
      'Google Search, Shopping & Performance Max Campaigns',
      'Meta (Instagram/Facebook) Retargeting & Lookalike Funnels',
      'High-Converting Ad Creatives & Copywriting (A/B Tested)',
      'Custom Landing Page Conversion Rate Optimization (CRO)',
      'Conversion API (CAPI) & Server-Side Pixel Tracking Setup',
      'Live Bi-Weekly ROAS Reporting & Budget Scaling Protocol'
    ],
    timeline: 'Leads & sales starting within 48-72 hours of launch',
    idealFor: 'B2B companies, clinics, real estate & scaling retail'
  },
  {
    id: 'mkt-360',
    name: '360° Omnichannel Growth Engine',
    category: 'Full-Funnel',
    tagline: 'Complete CMO-Level Marketing Department at a Fraction of the Cost',
    price: 55000,
    period: 'per month',
    popular: false,
    features: [
      'Everything in SEO, Social Media & Paid Performance Tiers',
      'Automated Email & WhatsApp Marketing Drip Campaigns (Klaviyo/Interakt)',
      'Dedicated Fractional CMO & Weekly Strategy Calls',
      'Custom Video Shoots & Studio Photography Coordination',
      'Omnichannel Brand PR & Press Release Distribution',
      'Guaranteed Minimum Lead/Revenue KPIs in SLA'
    ],
    timeline: 'Sustained hyper-growth with aggressive compounding',
    idealFor: 'Mid-market enterprises and established industry leaders'
  }
];

export const marketingCaseStudies = [
  {
    id: 'cs-1',
    client: 'Velocita Luxury Furnishings',
    industry: 'Premium D2C Furniture',
    metrics: [
      { label: 'Revenue Growth', value: '+340%' },
      { label: 'Blended ROAS', value: '4.8x' },
      { label: 'Organic Keyword #1s', value: '42' }
    ],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
    challenge: 'High cost per acquisition and heavy reliance on generic marketplace discounts.',
    solution: 'Engineered high-intent Google Search campaigns paired with luxury-focused video ads and organic SEO for targeted long-tail keywords.',
    testimonial: '"Shree Pratham transformed our digital funnel. Our ROAS spiked from 1.6x to 4.8x within 90 days."'
  },
  {
    id: 'cs-2',
    client: 'Apex Health Diagnostics',
    industry: 'Healthcare & Diagnostics',
    metrics: [
      { label: 'Monthly Leads', value: '1,850+' },
      { label: 'Cost Per Lead', value: '-62%' },
      { label: 'Local Pack Rank', value: '#1 in 8 Zones' }
    ],
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop',
    challenge: 'Fragmented local presence and excessive ad spend on non-converting display ads.',
    solution: 'Deployed hyper-localized Google Local Services Ads, automated WhatsApp appointment bookings, and Google Maps optimization.',
    testimonial: '"Our lab booking calendar is filled weeks in advance now. Unmatched expertise."'
  },
  {
    id: 'cs-3',
    client: 'Aura Industrial Valves',
    industry: 'B2B Heavy Engineering',
    metrics: [
      { label: 'Export RFQs', value: '+210%' },
      { label: 'Global Pipeline', value: '₹4.2 Cr' },
      { label: 'International Traffic', value: '+450%' }
    ],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    challenge: 'Outdated legacy website with zero international organic discovery.',
    solution: 'Built an optimized international technical website architecture, target country SEO, and targeted LinkedIn executive outreach.',
    testimonial: '"Secured three major European industrial distributor contracts within six months."'
  }
];

export const itServicesCatalog = [
  {
    id: 'it-web',
    title: 'Custom Web & Mobile Application Development',
    category: 'Development',
    description: 'Bespoke web apps, high-throughput e-commerce engines, and cross-platform iOS & Android mobile applications built on cutting-edge stacks.',
    technologies: ['React 19', 'Next.js', 'Node.js', 'React Native', 'PostgreSQL', 'Tailwind'],
    deliverables: ['Custom UI/UX Prototypes', 'Scalable Microservices API', 'CI/CD Automated Deployment', '100% Code Ownership & IP'],
    startingPrice: '₹35,000'
  },
  {
    id: 'it-cloud',
    title: 'Cloud Infrastructure & DevOps Automation',
    category: 'Cloud',
    description: 'Modernize your workload with enterprise-grade AWS, Microsoft Azure, and GCP architectures with containerization and zero-downtime deployments.',
    technologies: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Azure DevOps', 'Cloudflare'],
    deliverables: ['Cloud Migration Roadmap', 'Cost Optimization (Save 30-45%)', 'Auto-scaling & High Availability', 'Disaster Recovery Setup'],
    startingPrice: '₹25,000'
  },
  {
    id: 'it-support',
    title: '24/7 Managed IT Helpdesk & Infrastructure Support',
    category: 'Support',
    description: 'Round-the-clock remote and on-site IT operations, network monitoring, workstation maintenance, email management, and 15-minute SLA response.',
    technologies: ['Windows Server', 'Cisco / Fortinet Firewalls', 'Google Workspace', 'Microsoft 365', 'Zabbix'],
    deliverables: ['Dedicated NOC Engineers', '15-Minute Guaranteed SLA', 'Monthly Patching & Preventive Audits', 'Asset Inventory Tracking'],
    startingPrice: '₹15,000/mo'
  },
  {
    id: 'it-sec',
    title: 'Cybersecurity Auditing & Penetration Testing',
    category: 'Security',
    description: 'Protect company data, customer payment records, and proprietary algorithms against ransomware, data breaches, and zero-day vulnerabilities.',
    technologies: ['OWASP Top 10', 'Burp Suite Pro', 'Nessus', 'ISO 27001 Checklist', 'SOC 2 Ready'],
    deliverables: ['Black-Box / White-Box Pentest', 'Comprehensive Executive Risk Report', 'Remediation Verification', 'Security Compliance Certificate'],
    startingPrice: '₹30,000'
  }
];

export const itPricingTiers = [
  {
    id: 'tier-starter',
    name: 'Starter Business IT',
    badge: 'Essential',
    price: 14999,
    period: 'per month',
    description: 'Perfect for small teams and growing retail/offices needing robust IT security, emails, and daily support.',
    features: [
      'Up to 15 Workstations & Mobile Devices Supported',
      'Microsoft 365 / Google Workspace Administration',
      'Business Hours Helpdesk Support (9 AM - 7 PM)',
      'Automated Daily Cloud Backups (Up to 500GB)',
      'Managed Antivirus & Anti-Ransomware Endpoint Protection',
      'Basic Network & WiFi Router Monitoring'
    ],
    sla: '4-Hour Response Time',
    actionText: 'Choose Starter'
  },
  {
    id: 'tier-growth',
    name: 'Growth Enterprise IT',
    badge: 'Most Popular',
    popular: true,
    price: 29999,
    period: 'per month',
    description: 'Engineered for scaling organizations with multi-branch networks, critical databases, and cloud systems.',
    features: [
      'Up to 50 Workstations + 3 Cloud Servers Supported',
      '24/7 Priority Emergency Helpdesk & NOC Monitoring',
      'AWS / Azure Cloud Infrastructure Maintenance',
      'Automated Disaster Recovery & Real-Time Replication',
      'Firewall, VPN & Remote Secure Worker Setup',
      'Monthly Vulnerability Scanning & OS Patching',
      'Quarterly IT Strategy & Hardware Refresh Advisory'
    ],
    sla: '1-Hour Priority Response',
    actionText: 'Choose Growth'
  },
  {
    id: 'tier-enterprise',
    name: 'Dedicated Tech Partner',
    badge: 'Full Outsourcing',
    price: 59999,
    period: 'per month',
    description: 'Full-scale outsourced CTO and IT engineering department for organizations demanding 99.99% uptime.',
    features: [
      'Unlimited Workstations, Hybrid Cloud & Branch Networks',
      '24/7/365 Dedicated Senior Systems Engineer Assigned',
      'Full DevSecOps Pipeline & Continuous Integration Support',
      'Quarterly External Penetration Testing & Compliance Reports',
      'Hardware Procurement at Corporate Direct Wholesale Rates',
      'Custom API Integrations & ERP/CRM Data Pipelines',
      '15-Minute Critical Severity 1 SLA Guarantee'
    ],
    sla: '15-Minute Guaranteed SLA',
    actionText: 'Contact Enterprise'
  }
];

export const serviceAreaList = [
  { pincode: '400001', area: 'Fort / South Mumbai', status: 'Available', deliveryTime: 'Same Day (Within 3 Hours)' },
  { pincode: '400050', area: 'Bandra West, Mumbai', status: 'Available', deliveryTime: 'Same Day (Within 2 Hours)' },
  { pincode: '400069', area: 'Andheri East (MIDC/SEEPZ)', status: 'Available', deliveryTime: 'Daily Morning & Evening Slots' },
  { pincode: '400705', area: 'Vashi, Navi Mumbai', status: 'Available', deliveryTime: 'Daily Morning Slot' },
  { pincode: '411001', area: 'Shivajinagar, Pune', status: 'Available', deliveryTime: 'Same Day Delivery' },
  { pincode: '110001', area: 'Connaught Place, New Delhi', status: 'Available', deliveryTime: 'Express 4-Hour Delivery' },
  { pincode: '560001', area: 'MG Road, Bangalore', status: 'Available', deliveryTime: 'Same Day Delivery' },
  { pincode: '500081', area: 'Hitech City, Hyderabad', status: 'Available', deliveryTime: 'Express 3-Hour Delivery' }
];

export const testimonials = [
  {
    id: 't-1',
    name: 'Vikramaditya Singhania',
    role: 'Managing Director, Apex Hospitality Group',
    content: 'Shree Pratham has been our single most dependable partner for 3 years. They supply our banquet drinking water, customized VIP wedding gift hampers, and fully outfitted our industrial kitchen with deep freezers and ranges. Exceptional reliability!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    vertical: 'Appliances & Water'
  },
  {
    id: 't-2',
    name: 'Ananya Deshmukh',
    role: 'Head of People & Culture, FinTech Global',
    content: 'We ordered 450 customized Diwali & onboarding hampers from their Gift Gallery. Every single box had immaculate laser-engraved names and high-grade unboxing presentation. Their delivery was 100% on schedule!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    vertical: 'Gift Gallery'
  },
  {
    id: 't-3',
    name: 'Rohan Mehta',
    role: 'Co-Founder, QuickCart Logistics',
    content: 'Their IT Services team migrated our monolith infrastructure to an auto-scaling AWS Kubernetes cluster without a single second of user disruption. Their 24/7 support response time has saved us countless hours.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    vertical: 'IT Services'
  }
];

export const seedOrders = [
  {
    id: 'SP-ORD-89421',
    date: '2026-09-18',
    customer: {
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@example.com',
      phone: '+91 98201 23456',
      address: 'Flat 402, Sea Green Heights, Bandra West, Mumbai 400050'
    },
    items: [
      {
        id: 'gift-1',
        name: 'Executive Gold Crest Gift Set',
        price: 1899,
        quantity: 2,
        customization: { recipientName: 'Rajesh Sharma & Associates', note: 'Best wishes for FY 2026-27' }
      },
      {
        id: 'water-3',
        name: 'Premium 500ml Bottled Water Case (24 Bottles)',
        price: 360,
        quantity: 1
      }
    ],
    totalAmount: 4158,
    paymentMethod: 'UPI (Google Pay)',
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    shiprocketAwb: 'SR298104819IN',
    shiprocketCourier: 'Blue Dart Air Express (Shiprocket)',
    shiprocketStatus: 'Out for Delivery',
    shiprocketTrackingUrl: 'https://shiprocket.co/tracking/SR298104819IN',
    trackingSteps: [
      { title: 'Order Placed', time: '18 Sep, 10:30 AM', completed: true },
      { title: 'Processed & Customized', time: '19 Sep, 02:15 PM', completed: true },
      { title: 'Dispatched via Blue Dart (Shiprocket AWB: SR298104819IN)', time: '21 Sep, 09:00 AM', completed: true },
      { title: 'Out for Delivery', time: 'Today, 08:30 AM', completed: true },
      { title: 'Delivered', time: 'Estimated by 2:00 PM', completed: false }
    ]
  },
  {
    id: 'SP-ORD-87102',
    date: '2026-09-02',
    customer: {
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@example.com',
      phone: '+91 98201 23456',
      address: 'Flat 402, Sea Green Heights, Bandra West, Mumbai 400050'
    },
    items: [
      {
        id: 'water-1',
        name: '20L Alkaline Mineral Bubble Jar',
        price: 90,
        quantity: 4
      }
    ],
    totalAmount: 360,
    paymentMethod: 'Pay on Delivery',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    shiprocketAwb: 'SR192837461IN',
    shiprocketCourier: 'Delhivery Surface (Shiprocket)',
    shiprocketStatus: 'Delivered',
    shiprocketTrackingUrl: 'https://shiprocket.co/tracking/SR192837461IN',
    trackingSteps: [
      { title: 'Order Placed', time: '02 Sep, 08:15 AM', completed: true },
      { title: 'Packed', time: '02 Sep, 09:00 AM', completed: true },
      { title: 'Dispatched via Delhivery (Shiprocket)', time: '02 Sep, 10:30 AM', completed: true },
      { title: 'Delivered', time: '02 Sep, 12:45 PM', completed: true }
    ]
  }
];

export const seedSubscriptions = [
  {
    id: 'SP-SUB-104',
    planName: '20L Alkaline Jars - Corporate Office Routine',
    frequency: 'Alternate Days (Mon, Wed, Fri)',
    jarCount: 3,
    ratePerJar: 85,
    monthlyTotal: 1020,
    nextDeliveryDate: 'Tomorrow, 07:00 AM - 09:00 AM',
    status: 'Active',
    address: 'Suite 601, Nesco IT Park, Goregaon East, Mumbai 400063',
    startedOn: '2026-08-01'
  }
];

export const seedQuotes = [
  {
    id: 'SP-QUO-5021',
    date: '2026-09-20',
    applianceName: 'Titan Frost 550L Double Door Deep Freezer',
    quantity: 4,
    company: 'Blue Lagoon Seafood Restro',
    contactPerson: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98201 23456',
    gstin: '27AABCS1429B1Z8',
    installationRequired: true,
    estimatedTotal: '₹1,53,000 (Bulk Tier Discount Applied: 10%)',
    status: 'Quote Sent',
    adminNotes: 'Special commercial discount approved for 4 units. Free delivery and on-site testing included.'
  }
];

export const seedTickets = [
  {
    id: 'SP-TCK-771',
    date: '2026-09-21',
    subject: 'SSL Certificate Expiry & Cloudflare DNS Configuration',
    category: 'Cloud & Web',
    priority: 'High',
    status: 'In Progress',
    description: 'We require SSL wildcard renewal for our subdomains and need help pointing Cloudflare edge rules to the new origin server.',
    replies: [
      {
        sender: 'Rajesh Sharma (Customer)',
        time: '21 Sep, 11:30 AM',
        text: 'Submitted ticket regarding SSL renewal and DNS propagation.'
      },
      {
        sender: 'Amit Verma (Shree Pratham IT Lead)',
        time: '21 Sep, 12:15 PM',
        text: 'Hello Rajesh, our DevOps engineer has updated the Let\'s Encrypt auto-renewal hook and tested DNS propagation. Please verify your staging subdomain now.'
      }
    ]
  }
];
