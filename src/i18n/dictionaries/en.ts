/**
 * English is the source dictionary — every other locale is typed against its shape,
 * so a missing or misspelled key is a build error rather than a blank on the page.
 */
const en = {
  nav: {
    about: "About Us",
    services: "Our Services",
    contact: "Contact Us",
    cta: "Get in touch",
    menu: "Menu",
    close: "Close menu",
    selectLanguage: "Select language",
    home: "Nomad Investments Limited — home",
  },

  services: {
    lines: {
      business: "Business Consulting & Investor Relations",
      ict: "ICT Consultancy, AI & Cybersecurity",
      engineering: "Engineering & Infrastructure",
      agriculture: "Agricultural Services & Consultancy",
      energy: "Oil, Gas & Green Energy",
    },
    heroTitle: "Our Services",
    heroBody:
      "Nomad Investments Limited delivers top-notch services across the sectors that actually move an economy — from boardroom strategy and secure systems to the structures, fields and energy infrastructure behind them. One firm, one operating standard, work that gets done.",
    heroCta: "See the operation",
    problemLabel: "The problem",
    problemBody:
      "Most firms sell you a service and hand the delivery to someone you never met. Across East Africa that gap — between what was promised and who actually turns up — is where projects quietly fail.",
    hintLabel: "One operation, many disciplines",
    hintBody: "Scroll to move across it.",
    sector: "Sector",
    expertiseLabel: "Our expertise",
    expertiseTitle: "Why organisations hand us the work.",
    expertise: {
      guidance: {
        title: "Professional guidance",
        body: "Skilled professionals across every discipline we take on, so the advice you get is from people who have carried the work themselves.",
      },
      delivery: {
        title: "Dependable delivery",
        body: "We commit to dependable service delivery. A date we give is a date we have already worked backwards from.",
      },
      standard: {
        title: "Integrity, quality, innovation",
        body: "The standard we are known for, held through continuous improvement rather than announced once and left alone.",
      },
      workforce: {
        title: "An experienced workforce",
        body: "Positioned among Uganda's best in construction, agriculture and supply — depth that shows up on site, not just on paper.",
      },
    },
    listTitle: "The lines in full",
    ctaTitle: "Tell us what needs delivering.",
    ctaBody:
      "Send the brief and the discipline it sits in. We will come back to you from Kampala.",
  },

  contact: {
    label: "Get in touch",
    title: "Let's get the work done.",
    body: "Tell us what you need delivered and which discipline it sits in. We will come back to you from Kampala.",
    briefLabel: "Project brief",
    briefTitle: "Tell us what needs delivering.",
    fields: {
      name: "Name",
      namePlaceholder: "Your name",
      organisation: "Organisation",
      organisationPlaceholder: "Company or ministry",
      email: "Email",
      emailPlaceholder: "you@organisation.com",
      discipline: "Discipline",
      brief: "Brief",
      briefPlaceholder: "What needs delivering, and by when?",
    },
    submit: "Send enquiry",
    sending: "Sending…",
    received: "Received",
    receivedNote: "Received — we will come back to you from Kampala",
    thanksLabel: "Received",
    thanksTitle: "Thank you — we have your brief.",
    thanksBody: "We will get back to you soon. If it is urgent, call",
    thanksOr: "or reach us on WhatsApp.",
    sendAnother: "Send another",
    errorGeneric: "We could not send that just now. Please try again.",
    errorOffline: "No connection. Check your network and try again.",
  },

  footer: {
    office: "Office",
    telephone: "Telephone",
    whatsapp: "WhatsApp",
    email: "Email",
    tagline: "Strategize · Organize · Globalize",
    blurb:
      "An East African firm getting business done across eleven disciplines, under one operating standard.",
    rights: "© 2026 Nomad Investments Limited",
  },

  /** The 11 disciplines, shared by the about page list and the contact form select. */
  disciplines: {
    businessConsulting: "Business Consulting",
    investorRelations: "Investor Relations",
    ictConsultancy: "ICT Consultancy",
    cybersecurity: "Cybersecurity",
    transport: "Transport Services",
    clearing: "Clearing & Forwarding",
    financial: "Financial Solutions",
    construction: "Construction & Engineering",
    medical: "Medical Supplies & Health Informatics",
    oilGas: "Oil & Gas Consultancy",
    environment: "Environment & Green Energy",
  },

  home: {
    heroWords: ["Strategize.", "Organize.", "Globalize."],
    whoHeading: "We are a Ugandan firm dedicated to getting work done.",
    who: {
      founded: {
        kicker: "Founded 2016",
        title: "A Premier Consulting Company",
        body: "Nomad Investments Limited was founded to get business done. We strategize, organize and globalize — synergies and partnerships to create business opportunities sit at the core of our values.",
      },
      guidance: {
        kicker: "Professional Guidance",
        title: "Skilled People, Ready to Work",
        body: "Skilled professionals are always ready to provide reliable services to our clients. An experienced workforce, combined with a dedication to continuous improvement across every discipline we operate in.",
      },
      delivery: {
        kicker: "Dependable Delivery",
        title: "We Will Get It Done",
        body: "We are committed to dependable service delivery, and you can rest assured we will get it done — from Plot 13, Mukwano Courts, Buganda Road, Kampala.",
      },
    },
    scroll: {
      business: {
        title: "Business Consulting\n& Investor Relations",
        body: "Our business consulting division provides tailored, results-driven solutions to help organizations unlock their full potential.",
      },
      ict: {
        title: "ICT Consultancy, AI\n& Cybersecurity",
        body: "Exceptional ICT consultancy and cybersecurity services tailored to the unique needs of your business — from IT strategy and system integration to penetration testing and incident response.",
      },
      engineering: {
        title: "Engineering\n& Infrastructure",
        body: "Our commitment to quality, innovation and sustainability ensures that we meet the unique needs of our clients across construction and infrastructure delivery.",
      },
      agriculture: {
        title: "Agricultural Services\n& Consultancy",
        body: "With our team of experts we provide comprehensive agricultural services and consulting — improving agricultural infrastructure and productivity through innovative solutions.",
      },
      energy: {
        title: "Oil, Gas\n& Green Energy",
        body: "With extensive expertise we help clients navigate the complexities of the oil and gas sector, alongside environmental assessment and green energy advisory.",
      },
    },
    showcase: {
      agriculture: {
        title: "Agriculture",
        body: "We enhance agricultural productivity and sustainability through innovative infrastructure and expert consultancy — supporting the sector with the tools and knowledge to thrive.",
      },
      environment: {
        title: "Environment & Green Energy",
        body: "Environmental impact assessments, sustainability consulting, waste management and ecological restoration — reducing environmental footprint while restoring degraded ecosystems.",
      },
      business: {
        title: "Business Solutions",
        body: "Tailored, results-driven consulting that helps organizations unlock their full potential — strategy, organisation and partnerships that turn intent into delivered work.",
      },
    },
    whyLabel: "Why choose us",
    whyHeading: "Commitment to excellence, in every project we deliver.",
    stats: {
      lines: { unit: "lines", label: "Service disciplines under one operating standard" },
      years: { unit: "yrs", label: "Operating from Kampala since 2016" },
      standard: { unit: "standard", label: "Same delivery discipline across every sector" },
    },
    points: {
      integrity: {
        title: "Integrity",
        body: "Core values of integrity, quality and innovation drive our operations and decision-making.",
      },
      workforce: {
        title: "Skilled workforce",
        body: "An experienced and skilled workforce, combined with dedication to continuous improvement.",
      },
      done: {
        title: "Getting it done",
        body: "We strategize, organize and globalize — synergies and partnerships that turn intent into delivery.",
      },
    },
  },

  about: {
    label: "About Nomad Investments",
    title: "A Ugandan firm dedicated to getting work done.",
    lead: "Founded in 2016 and operating from Kampala, we work across eleven disciplines under a single delivery standard — strategize, organize, globalize.",
    points: {
      built: {
        title: "Built to get work done",
        body: "Founded in 2016, Nomad Investments Limited is an East African based company — a Ugandan firm dedicated to getting work done. Not a holding company that watches from a distance, but an operator that takes on the delivery itself.",
      },
      brief: {
        title: "The client's objective is the brief",
        body: "We prioritize the needs and goals of our clients, tailoring investment strategies to meet their specific objectives. Every engagement starts from what the client is actually trying to achieve, not from a service we would prefer to sell.",
      },
      reach: {
        title: "Reach beyond a single market",
        body: "With a presence in multiple regions, we are well-positioned to access and analyze investment opportunities across the globe. Kampala is where we operate from; it is not the limit of where we work.",
      },
      growth: {
        title: "Growth that holds up",
        body: "We generate long-term value with risk managed deliberately rather than discovered late. Sustainable growth is a delivery standard here, not a line in a brochure — it is what lets a client plan past the current quarter.",
      },
    },
    missionLabel: "Mission",
    missionBody: "We prioritize the needs and goals of our clients, tailoring investment strategies to meet their specific objectives.",
    visionLabel: "Vision",
    visionBody: "To be the delivery partner East African business turns to first — the firm trusted with the work that has to be done properly, in every sector we operate in.",
    whyTitle: "Why organisations choose us",
    reasons: {
      reach: {
        title: "Global reach",
        body: "With a presence in multiple regions, we are well-positioned to access and analyze investment opportunities across the globe.",
      },
      expertise: {
        title: "Expertise",
        body: "Financial specialists with deep knowledge and insights across various industries and asset classes.",
      },
      client: {
        title: "Client-centric",
        body: "A customized approach, built around the specific objectives of the organisation in front of us.",
      },
      growth: {
        title: "Sustainable growth",
        body: "Long-term value generation, with risk management carried through every stage of delivery.",
      },
    },
    disciplinesTitle: "Eleven disciplines, one standard",
    ctaTitle: "Tell us what needs delivering.",
  },

  contactPage: {
    label: "Contact",
    title: "Let's get the work done.",
    body: "Tell us what you need delivered and which discipline it sits in. We will come back to you from Kampala.",
  },

  /** Language names for the hover hint on the switcher, in this locale's own
   *  words — so an English reader hovering FR sees "French", not "Français". */
  languages: {
    en: "English",
    fr: "French",
    es: "Spanish",
    nl: "Dutch",
    zh: "Chinese",
    sw: "Swahili",
    ar: "Arabic",
  },
};

export default en;

/**
 * Shape every other locale must satisfy.
 *
 * Deliberately no `as const` on the object above: it would freeze each English string
 * into its own literal type, and every translation would then fail to assign because
 * "À propos" is not the type `"About Us"`.
 */
export type Dictionary = typeof en;
