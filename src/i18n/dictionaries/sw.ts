import type { Dictionary } from "./en";

/* Kiswahili. Reviewed for sense rather than translated word for word — the long
   marketing sentences are rephrased where a literal rendering would read stiffly. */
const sw: Dictionary = {
  nav: {
    about: "Kutuhusu",
    services: "Huduma Zetu",
    contact: "Wasiliana Nasi",
    cta: "Wasiliana nasi",
    menu: "Menyu",
    close: "Funga menyu",
    selectLanguage: "Chagua lugha",
    home: "Nomad Investments Limited — mwanzo",
  },

  services: {
    lines: {
      business: "Ushauri wa Biashara na Uhusiano wa Wawekezaji",
      ict: "Ushauri wa TEHAMA, AI na Usalama Mtandaoni",
      engineering: "Uhandisi na Miundombinu",
      agriculture: "Huduma na Ushauri wa Kilimo",
      energy: "Mafuta, Gesi na Nishati Safi",
    },
    heroTitle: "Huduma Zetu",
    heroBody:
      "Nomad Investments Limited hutoa huduma za kiwango cha juu katika sekta zinazoendesha uchumi kwa kweli — kutoka mikakati ya kampuni na mifumo salama hadi majengo, mashamba na miundombinu ya nishati inayoyategemeza. Kampuni moja, kiwango kimoja cha utendaji, kazi inayokamilika.",
    heroCta: "Tazama shughuli zetu",
    problemLabel: "Tatizo",
    problemBody:
      "Kampuni nyingi hukuuzia huduma kisha hukabidhi utekelezaji kwa mtu ambaye hujawahi kukutana naye. Afrika Mashariki, pengo hilo — kati ya kilichoahidiwa na anayefika kazini — ndipo miradi hushindwa kimya kimya.",
    hintLabel: "Shughuli moja, taaluma nyingi",
    hintBody: "Sogeza chini kuipitia.",
    sector: "Sekta",
    expertiseLabel: "Utaalamu wetu",
    expertiseTitle: "Kwa nini mashirika hutukabidhi kazi.",
    expertise: {
      guidance: {
        title: "Mwongozo wa kitaalamu",
        body: "Wataalamu wenye ujuzi katika kila taaluma tunayoichukua, ili ushauri unaoupata utoke kwa watu waliokwisha fanya kazi hiyo wenyewe.",
      },
      delivery: {
        title: "Utekelezaji wa kuaminika",
        body: "Tunajitolea kutoa huduma za kuaminika. Tarehe tunayoitoa ni tarehe ambayo tayari tumeipanga kwa makini.",
      },
      standard: {
        title: "Uadilifu, ubora, ubunifu",
        body: "Kiwango tunachojulikana kwacho, kinachodumishwa kwa maboresho endelevu badala ya kutangazwa mara moja kisha kusahaulika.",
      },
      workforce: {
        title: "Wafanyakazi wenye uzoefu",
        body: "Miongoni mwa bora zaidi Uganda katika ujenzi, kilimo na usambazaji — uzoefu unaoonekana kazini, si kwenye karatasi tu.",
      },
    },
    listTitle: "Taaluma zetu kwa ukamilifu",
    ctaTitle: "Tuambie kinachohitajika kutekelezwa.",
    ctaBody:
      "Tutumie maelezo ya mradi na taaluma inayohusika. Tutakujibu kutoka Kampala.",
  },

  contact: {
    label: "Wasiliana nasi",
    title: "Tuanze kazi.",
    body: "Tuambie unachohitaji kutekelezwa na taaluma inayohusika. Tutakujibu kutoka Kampala.",
    briefLabel: "Maelezo ya mradi",
    briefTitle: "Tuambie kinachohitajika kutekelezwa.",
    fields: {
      name: "Jina",
      namePlaceholder: "Jina lako",
      organisation: "Shirika",
      organisationPlaceholder: "Kampuni au wizara",
      email: "Barua pepe",
      emailPlaceholder: "wewe@shirika.com",
      discipline: "Taaluma",
      brief: "Maelezo",
      briefPlaceholder: "Nini kinahitajika kutekelezwa, na lini?",
    },
    submit: "Tuma ombi",
    sending: "Inatuma…",
    received: "Imepokelewa",
    receivedNote: "Imepokelewa — tutakujibu kutoka Kampala",
    thanksLabel: "Imepokelewa",
    thanksTitle: "Asante — tumepokea maelezo yako.",
    thanksBody: "Tutakujibu hivi karibuni. Ikiwa ni dharura, piga simu",
    thanksOr: "au tutafute kwa WhatsApp.",
    sendAnother: "Tuma ombi lingine",
    errorGeneric: "Hatukuweza kutuma ujumbe wako sasa. Tafadhali jaribu tena.",
    errorOffline: "Hakuna muunganisho. Angalia mtandao wako kisha ujaribu tena.",
  },

  footer: {
    office: "Ofisi",
    telephone: "Simu",
    whatsapp: "WhatsApp",
    email: "Barua pepe",
    tagline: "Panga · Ratibu · Fikia Dunia",
    blurb:
      "Kampuni ya Afrika Mashariki inayokamilisha kazi katika taaluma kumi na moja, chini ya kiwango kimoja cha utendaji.",
    rights: "© 2026 Nomad Investments Limited",
  },

  disciplines: {
    businessConsulting: "Ushauri wa biashara",
    investorRelations: "Uhusiano wa wawekezaji",
    ictConsultancy: "Ushauri wa TEHAMA",
    cybersecurity: "Usalama mtandaoni",
    transport: "Huduma za usafirishaji",
    clearing: "Uondoshaji na usafirishaji mizigo",
    financial: "Suluhisho za kifedha",
    construction: "Ujenzi na uhandisi",
    medical: "Vifaa vya afya na taarifa za afya",
    oilGas: "Ushauri wa mafuta na gesi",
    environment: "Mazingira na nishati safi",
  },

  home: {
    heroWords: ["Panga.", "Ratibu.", "Fikia Dunia."],
    whoHeading: "Sisi ni kampuni ya Uganda iliyojitoa kukamilisha kazi.",
    who: {
      founded: {
        kicker: "Ilianzishwa 2016",
        title: "Kampuni Bora ya Ushauri",
        body: "Nomad Investments Limited ilianzishwa ili kukamilisha kazi za biashara. Tunapanga, tunaratibu na tunafikia dunia — ushirikiano na ubia unaozalisha fursa za biashara ndio msingi wa maadili yetu.",
      },
      guidance: {
        kicker: "Mwongozo wa Kitaalamu",
        title: "Watu Wenye Ujuzi, Tayari Kufanya Kazi",
        body: "Wataalamu wenye ujuzi wapo tayari kutoa huduma za kuaminika kwa wateja wetu. Wafanyakazi wenye uzoefu, pamoja na kujitolea kwa maboresho endelevu katika kila taaluma tunayoifanyia kazi.",
      },
      delivery: {
        kicker: "Utekelezaji wa Kuaminika",
        title: "Tutaikamilisha",
        body: "Tumejitolea kutoa huduma za kuaminika, na uwe na uhakika tutaikamilisha — kutoka Plot 13, Mukwano Courts, Buganda Road, Kampala.",
      },
    },
    scroll: {
      business: {
        title: "Ushauri wa Biashara\nna Uhusiano wa Wawekezaji",
        body: "Kitengo chetu cha ushauri wa biashara hutoa suluhisho maalum, zinazolenga matokeo, kusaidia mashirika kufikia uwezo wao kamili.",
      },
      ict: {
        title: "Ushauri wa TEHAMA, AI\nna Usalama Mtandaoni",
        body: "Huduma bora za ushauri wa TEHAMA na usalama mtandaoni, zilizoandaliwa kulingana na mahitaji ya biashara yako — kuanzia mikakati ya TEHAMA na uunganishaji wa mifumo hadi upimaji wa usalama na kukabiliana na matukio.",
      },
      engineering: {
        title: "Uhandisi\nna Miundombinu",
        body: "Kujitolea kwetu kwa ubora, ubunifu na uendelevu kunahakikisha tunakidhi mahitaji ya kipekee ya wateja wetu katika ujenzi na utekelezaji wa miundombinu.",
      },
      agriculture: {
        title: "Huduma za Kilimo\nna Ushauri",
        body: "Kwa timu yetu ya wataalamu tunatoa huduma na ushauri kamili wa kilimo — kuboresha miundombinu na uzalishaji wa kilimo kupitia suluhisho bunifu.",
      },
      energy: {
        title: "Mafuta, Gesi\nna Nishati Safi",
        body: "Kwa utaalamu mpana tunawasaidia wateja kupitia ugumu wa sekta ya mafuta na gesi, pamoja na tathmini ya mazingira na ushauri wa nishati safi.",
      },
    },
    showcase: {
      agriculture: {
        title: "Kilimo",
        body: "Tunaboresha uzalishaji na uendelevu wa kilimo kupitia miundombinu bunifu na ushauri wa kitaalamu — tukiipa sekta zana na maarifa ya kustawi.",
      },
      environment: {
        title: "Mazingira na Nishati Safi",
        body: "Tathmini za athari za mazingira, ushauri wa uendelevu, usimamizi wa taka na urejeshaji wa mifumo ikolojia — kupunguza athari kwa mazingira huku tukirejesha mifumo iliyoharibika.",
      },
      business: {
        title: "Suluhisho za Biashara",
        body: "Ushauri maalum unaolenga matokeo, unaosaidia mashirika kufikia uwezo wao kamili — mikakati, mpangilio na ubia unaogeuza nia kuwa kazi iliyokamilika.",
      },
    },
    whyLabel: "Kwa nini utuchague",
    whyHeading: "Kujitolea kwa ubora, katika kila mradi tunaotekeleza.",
    stats: {
      lines: { unit: "taaluma", label: "Taaluma za huduma chini ya kiwango kimoja" },
      years: { unit: "miaka", label: "Tukifanya kazi kutoka Kampala tangu 2016" },
      standard: { unit: "kiwango", label: "Nidhamu ile ile ya utekelezaji katika kila sekta" },
    },
    points: {
      integrity: {
        title: "Uadilifu",
        body: "Maadili ya uadilifu, ubora na ubunifu yanaongoza shughuli na maamuzi yetu.",
      },
      workforce: {
        title: "Wafanyakazi wenye ujuzi",
        body: "Wafanyakazi wenye uzoefu na ujuzi, pamoja na kujitolea kwa maboresho endelevu.",
      },
      done: {
        title: "Kuikamilisha kazi",
        body: "Tunapanga, tunaratibu na tunafikia dunia — ushirikiano na ubia unaogeuza nia kuwa utekelezaji.",
      },
    },
  },

  about: {
    label: "Kuhusu Nomad Investments",
    title: "Kampuni ya Uganda iliyojitoa kukamilisha kazi.",
    lead: "Ilianzishwa mwaka 2016 na inafanya kazi kutoka Kampala, tunahudumu katika taaluma kumi na moja chini ya kiwango kimoja cha utekelezaji — panga, ratibu, fikia dunia.",
    points: {
      built: {
        title: "Iliundwa ili kukamilisha kazi",
        body: "Ilianzishwa mwaka 2016, Nomad Investments Limited ni kampuni ya Afrika Mashariki — kampuni ya Uganda iliyojitoa kukamilisha kazi. Si kampuni inayoangalia kwa mbali, bali mtendaji anayechukua utekelezaji mwenyewe.",
      },
      brief: {
        title: "Lengo la mteja ndilo maelekezo",
        body: "Tunapa kipaumbele mahitaji na malengo ya wateja wetu, tukiandaa mikakati ya uwekezaji kulingana na malengo yao mahususi. Kila kazi huanza na kile mteja anachotaka kufikia kwa kweli, si huduma tungependa kuuza.",
      },
      reach: {
        title: "Kufika zaidi ya soko moja",
        body: "Kwa uwepo katika maeneo mbalimbali, tuko katika nafasi nzuri ya kufikia na kuchambua fursa za uwekezaji duniani kote. Kampala ndipo tunapofanyia kazi; si mpaka wa mahali tunapofanya kazi.",
      },
      growth: {
        title: "Ukuaji unaodumu",
        body: "Tunazalisha thamani ya muda mrefu huku hatari ikisimamiwa kwa makusudi badala ya kugunduliwa kuchelewa. Ukuaji endelevu hapa ni kiwango cha utekelezaji, si mstari kwenye kijitabu — ndicho kinachomwezesha mteja kupanga zaidi ya robo ya sasa.",
      },
    },
    missionLabel: "Dhamira",
    missionBody: "Tunapa kipaumbele mahitaji na malengo ya wateja wetu, tukiandaa mikakati ya uwekezaji kulingana na malengo yao mahususi.",
    visionLabel: "Maono",
    visionBody: "Kuwa mshirika wa utekelezaji ambaye biashara za Afrika Mashariki humgeukia kwanza — kampuni inayoaminiwa kwa kazi inayopaswa kufanywa vizuri, katika kila sekta tunayofanyia kazi.",
    whyTitle: "Kwa nini mashirika hutuchagua",
    reasons: {
      reach: {
        title: "Ufikiaji wa kimataifa",
        body: "Kwa uwepo katika maeneo mbalimbali, tuko katika nafasi nzuri ya kufikia na kuchambua fursa za uwekezaji duniani kote.",
      },
      expertise: {
        title: "Utaalamu",
        body: "Wataalamu wa fedha wenye maarifa na uelewa wa kina katika sekta na aina mbalimbali za mali.",
      },
      client: {
        title: "Tunaanza na mteja",
        body: "Mbinu maalum, iliyojengwa kulingana na malengo mahususi ya shirika lililo mbele yetu.",
      },
      growth: {
        title: "Ukuaji endelevu",
        body: "Uzalishaji wa thamani ya muda mrefu, pamoja na usimamizi wa hatari katika kila hatua ya utekelezaji.",
      },
    },
    disciplinesTitle: "Taaluma kumi na moja, kiwango kimoja",
    ctaTitle: "Tuambie kinachohitajika kutekelezwa.",
  },

  contactPage: {
    label: "Wasiliana",
    title: "Tuanze kazi.",
    body: "Tuambie unachohitaji kutekelezwa na taaluma inayohusika. Tutakujibu kutoka Kampala.",
  },

  languages: {
    en: "Kiingereza",
    fr: "Kifaransa",
    es: "Kihispania",
    nl: "Kiholanzi",
    zh: "Kichina",
    sw: "Kiswahili",
  },
};

export default sw;
