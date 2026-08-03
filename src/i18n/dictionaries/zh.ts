import type { Dictionary } from "./en";

/* 简体中文 (Simplified Chinese).
 *
 * Note for the build: Inter carries no CJK glyphs, so these strings fall back to the
 * reader's system font. globals.css adds a CJK stack after Inter so the fallback is a
 * deliberate choice rather than whatever the browser picks first. */
const zh: Dictionary = {
  nav: {
    about: "关于我们",
    services: "我们的服务",
    contact: "联系我们",
    cta: "与我们联系",
    menu: "菜单",
    close: "关闭菜单",
    selectLanguage: "选择语言",
    home: "Nomad Investments Limited — 首页",
  },

  services: {
    lines: {
      business: "企业咨询与投资者关系",
      ict: "信息通信技术咨询、人工智能与网络安全",
      engineering: "工程与基础设施",
      agriculture: "农业服务与咨询",
      energy: "石油、天然气与绿色能源",
    },
    heroTitle: "我们的服务",
    heroBody:
      "Nomad Investments Limited 在真正推动经济发展的各个领域提供一流服务——从企业战略与安全系统，到支撑这一切的建筑、农田与能源基础设施。一家公司，一套标准，把工作真正做完。",
    heroCta: "了解我们的业务",
    problemLabel: "问题所在",
    problemBody:
      "多数公司把服务卖给您，却把执行交给一个您从未见过的人。在东非，正是这道落差——承诺的内容与真正到场的人之间的落差——让项目在无声中失败。",
    hintLabel: "一项业务，多个专业",
    hintBody: "向下滚动，逐一了解。",
    sector: "领域",
    expertiseLabel: "我们的专长",
    expertiseTitle: "机构为什么把工作交给我们。",
    expertise: {
      guidance: {
        title: "专业指导",
        body: "我们承接的每个专业领域都有资深人员，因此您得到的建议，来自亲手做过这些工作的人。",
      },
      delivery: {
        title: "可靠交付",
        body: "我们承诺可靠的服务交付。我们给出的日期，是已经倒推排期之后的日期。",
      },
      standard: {
        title: "诚信、品质、创新",
        body: "这是我们为人所知的标准，靠持续改进来维持，而不是宣布一次就搁置。",
      },
      workforce: {
        title: "经验丰富的团队",
        body: "在建筑、农业与供应领域跻身乌干达前列——这份底子体现在工地上，而不只是纸面上。",
      },
    },
    listTitle: "完整业务领域",
    ctaTitle: "告诉我们需要交付什么。",
    ctaBody: "把需求和所属专业发给我们，我们会从坎帕拉回复您。",
  },

  contact: {
    label: "联系我们",
    title: "让我们开始工作。",
    body: "告诉我们您需要交付什么，以及属于哪个专业领域。我们会从坎帕拉回复您。",
    briefLabel: "项目需求",
    briefTitle: "告诉我们需要交付什么。",
    fields: {
      name: "姓名",
      namePlaceholder: "您的姓名",
      organisation: "机构",
      organisationPlaceholder: "公司或政府部门",
      email: "电子邮箱",
      emailPlaceholder: "you@organisation.com",
      discipline: "专业领域",
      brief: "需求说明",
      briefPlaceholder: "需要交付什么？期限是什么时候？",
    },
    submit: "发送咨询",
    sending: "发送中…",
    received: "已收到",
    receivedNote: "已收到——我们会从坎帕拉回复您",
    thanksLabel: "已收到",
    thanksTitle: "感谢您——我们已收到您的需求。",
    thanksBody: "我们会尽快回复。如有紧急情况，请致电",
    thanksOr: "或通过 WhatsApp 联系我们。",
    sendAnother: "再发送一条",
    errorGeneric: "暂时无法发送，请稍后再试。",
    errorOffline: "网络未连接。请检查网络后重试。",
  },

  footer: {
    office: "办公地址",
    telephone: "电话",
    whatsapp: "WhatsApp",
    email: "电子邮箱",
    tagline: "战略 · 组织 · 全球化",
    blurb: "一家东非企业，在十一个专业领域以同一套标准把工作做完。",
    rights: "© 2026 Nomad Investments Limited",
  },

  disciplines: {
    businessConsulting: "企业咨询",
    investorRelations: "投资者关系",
    ictConsultancy: "信息通信技术咨询",
    cybersecurity: "网络安全",
    transport: "运输服务",
    clearing: "清关与货运代理",
    financial: "金融解决方案",
    construction: "建筑与工程",
    medical: "医疗物资与健康信息化",
    oilGas: "石油与天然气咨询",
    environment: "环境与绿色能源",
  },

  home: {
    heroWords: ["战略。", "组织。", "全球化。"],
    whoHeading: "我们是一家致力于把工作做完的乌干达企业。",
    who: {
      founded: {
        kicker: "成立于 2016 年",
        title: "一流的咨询公司",
        body: "Nomad Investments Limited 因把业务做成而创立。我们制定战略、组织执行、走向全球——创造商业机会的协同与合作，是我们价值观的核心。",
      },
      guidance: {
        kicker: "专业指导",
        title: "专业团队，随时开工",
        body: "资深专业人员随时为客户提供可靠服务。一支经验丰富的队伍，加上在每个业务领域持续改进的投入。",
      },
      delivery: {
        kicker: "可靠交付",
        title: "我们会把它做完",
        body: "我们承诺可靠的服务交付，您可以放心，我们会把它做完——地址：Plot 13, Mukwano Courts, Buganda Road, Kampala。",
      },
    },
    scroll: {
      business: {
        title: "企业咨询\n与投资者关系",
        body: "我们的企业咨询部门提供量身定制、以结果为导向的方案，帮助机构释放全部潜力。",
      },
      ict: {
        title: "信息通信技术咨询、人工智能\n与网络安全",
        body: "根据您的业务需求量身打造的一流信息通信技术咨询与网络安全服务——从 IT 战略、系统集成，到渗透测试与事件响应。",
      },
      engineering: {
        title: "工程\n与基础设施",
        body: "我们对品质、创新与可持续性的坚持，确保在建筑与基础设施交付中满足客户的特定需求。",
      },
      agriculture: {
        title: "农业服务\n与咨询",
        body: "凭借专家团队，我们提供全面的农业服务与咨询——通过创新方案改善农业基础设施与产出。",
      },
      energy: {
        title: "石油、天然气\n与绿色能源",
        body: "凭借深厚经验，我们帮助客户应对石油与天然气行业的复杂性，同时提供环境评估与绿色能源咨询。",
      },
    },
    showcase: {
      agriculture: {
        title: "农业",
        body: "我们通过创新基础设施与专业咨询提升农业产出与可持续性——为这个领域提供成长所需的工具与知识。",
      },
      environment: {
        title: "环境与绿色能源",
        body: "环境影响评估、可持续发展咨询、废弃物管理与生态修复——在修复受损生态的同时降低环境足迹。",
      },
      business: {
        title: "企业解决方案",
        body: "量身定制、以结果为导向的咨询，帮助机构释放全部潜力——把意图转化为已交付成果的战略、组织与合作。",
      },
    },
    whyLabel: "为什么选择我们",
    whyHeading: "对卓越的坚持，体现在我们交付的每一个项目中。",
    stats: {
      lines: { unit: "个领域", label: "同一套运营标准下的服务专业领域" },
      years: { unit: "年", label: "自 2016 年起在坎帕拉运营" },
      standard: { unit: "套标准", label: "每个行业都采用同样的交付准则" },
    },
    points: {
      integrity: {
        title: "诚信",
        body: "诚信、品质与创新的核心价值观，驱动着我们的运营与决策。",
      },
      workforce: {
        title: "专业团队",
        body: "一支经验丰富、技术过硬的队伍，加上对持续改进的投入。",
      },
      done: {
        title: "把事做成",
        body: "我们制定战略、组织执行、走向全球——把意图转化为交付的协同与合作。",
      },
    },
  },

  about: {
    label: "关于 Nomad Investments",
    title: "一家致力于把工作做完的乌干达企业。",
    lead: "成立于 2016 年，从坎帕拉起步，我们在十一个专业领域以同一套交付标准开展工作——战略、组织、全球化。",
    points: {
      built: {
        title: "为把工作做完而生",
        body: "Nomad Investments Limited 成立于 2016 年，是一家东非企业——一家致力于把工作做完的乌干达公司。不是远远旁观的控股公司，而是亲自承担交付的执行者。",
      },
      brief: {
        title: "客户的目标就是任务书",
        body: "我们把客户的需求与目标放在首位，量身制定投资策略以匹配其具体目标。每一次合作都始于客户真正想达成的事，而不是我们更想卖出的服务。",
      },
      reach: {
        title: "触角不止于单一市场",
        body: "我们在多个地区设有业务，具备在全球范围内发现并分析投资机会的条件。坎帕拉是我们的起点，而不是我们业务的边界。",
      },
      growth: {
        title: "经得起时间的增长",
        body: "我们创造长期价值，风险是主动管理的，而不是事后才发现的。可持续增长在这里是一项交付标准，而不是宣传册上的一行字——正是它让客户能够规划到本季度之后。",
      },
    },
    missionLabel: "使命",
    missionBody: "我们把客户的需求与目标放在首位，量身制定投资策略以匹配其具体目标。",
    visionLabel: "愿景",
    visionBody: "成为东非企业首先想到的交付伙伴——在我们经营的每个行业中，都能被托付那些必须做好的工作。",
    whyTitle: "机构为什么选择我们",
    reasons: {
      reach: {
        title: "全球视野",
        body: "我们在多个地区设有业务，具备在全球范围内发现并分析投资机会的条件。",
      },
      expertise: {
        title: "专业能力",
        body: "金融专家对多个行业与资产类别有深入的了解与洞察。",
      },
      client: {
        title: "以客户为中心",
        body: "量身定制的方式，围绕眼前这家机构的具体目标来搭建。",
      },
      growth: {
        title: "可持续增长",
        body: "创造长期价值，并在交付的每个阶段贯彻风险管理。",
      },
    },
    disciplinesTitle: "十一个专业领域，一套标准",
    ctaTitle: "告诉我们需要交付什么。",
  },

  contactPage: {
    label: "联系我们",
    title: "让我们开始工作。",
    body: "告诉我们您需要交付什么，以及属于哪个专业领域。我们会从坎帕拉回复您。",
  },

  languages: {
    en: "英语",
    fr: "法语",
    es: "西班牙语",
    nl: "荷兰语",
    zh: "中文",
    sw: "斯瓦希里语",
    ar: "阿拉伯语",
  },
};

export default zh;
