/*
  EXPOSE – country data for the Countries map.

  HOW IT WORKS
  - EXPOSE_REGIMES: one entry per UN sanctions regime (case).
  - EXPOSE_COUNTRIES: one entry per country on the map, listing the regimes that apply to it.
    A country is red ("panel") if ANY of its regimes had a Panel of Experts, amber ("sanctions")
    if it only had regimes without a Panel, and grey if it is not listed (no UN sanctions).
  - "id" is the ISO 3166-1 numeric code as text. Kosovo has no code in the map file: use "x-Kosovo".
    "global-aq" is the Al-Qaida/ISIL regime, which is not tied to one country (it has no map shape).

  FIELDS OF A REGIME
  - panel: true / false      - status: "Ongoing" | "Terminated"
  - from, to: dates as text ("14 Oct 2006", "Present")
  - types: general sanction categories      - notes: extra remarks (optional)
  - episodes: [ [from, to], ... ] or null   - slug: page of the case on unsanctionsapp.com
  - db: id of the regime in data/cases.js (adds a link to the database)  (optional)
  - provisional: true shows a "check this" warning (remove it once you have verified the data)
  - outside: true = not covered by UN SanctionsApp (it starts in 1991)

  SOURCE: UN SanctionsApp, "Cases & episodes" (https://unsanctionsapp.com/cases).
  Entries marked provisional or outside were NOT taken from that site and must be verified
  against it or against the UN Security Council before publishing.
*/
window.EXPOSE_REGIMES = {

  /* ---------------------------- WITH PANEL OF EXPERTS ---------------------------- */
  angola: { name: "Angola", panel: true, status: "Terminated", from: "15 Sep 1993", to: "9 Dec 2002",
    types: ["Asset freeze", "Diplomatic", "Arms", "Commodity", "Transportation"],
    episodes: [["15 Sep 1993", "28 Aug 1997"], ["28 Aug 1997", "12 Jun 1998"], ["12 Jun 1998", "12 Jan 1999"], ["12 Jan 1999", "9 Dec 2002"]],
    slug: "angola" },

  aq: { name: "Al-Qaida / ISIL / Associates", panel: true, status: "Ongoing", from: "15 Oct 1999", to: "Present",
    types: ["Travel", "Asset freeze", "Diplomatic", "Arms", "Commodity", "Transportation"],
    notes: ["Includes the measures applied to the Taliban between 1999 and 2011, when both were in the same regime.", "Until January 2002 the measures were limited to areas of Afghanistan under Taliban control."],
    episodes: [["15 Oct 1999", "19 Dec 2000"], ["19 Dec 2000", "11 Sep 2001"], ["11 Sep 2001", "17 Jun 2011"], ["17 Jun 2011", "24 Sep 2014"], ["24 Sep 2014", "Present"]],
    slug: "al-qaida-isil-associates" },

  car: { name: "Central African Republic", panel: true, status: "Ongoing", from: "5 Dec 2013", to: "Present",
    types: ["Travel", "Asset freeze", "Arms"],
    episodes: [["5 Dec 2013", "30 Jul 2024"], ["30 Jul 2024", "Present"]],
    slug: "central-african-republic" },

  civ: { name: "Côte d'Ivoire", panel: true, status: "Terminated", from: "15 Nov 2004", to: "28 Apr 2016",
    types: ["Travel", "Asset freeze", "Arms", "Commodity"],
    episodes: [["15 Nov 2004", "15 Dec 2005"], ["15 Dec 2005", "20 Dec 2010"], ["20 Dec 2010", "28 Apr 2011"], ["28 Apr 2011", "28 Apr 2016"]],
    slug: "cote-d-ivoire" },

  dprk: { name: "DPRK (North Korea)", panel: true, status: "Ongoing", from: "14 Oct 2006", to: "Present",
    types: ["Travel", "Asset freeze", "Diplomatic", "Arms", "Proscribed activities", "Commodity", "Transportation", "Financial sector"],
    episodes: [["14 Oct 2006", "12 Jun 2009"], ["12 Jun 2009", "7 Mar 2013"], ["7 Mar 2013", "2 Mar 2016"], ["2 Mar 2016", "30 Nov 2016"], ["30 Nov 2016", "5 Aug 2017"], ["5 Aug 2017", "11 Sep 2017"], ["11 Sep 2017", "22 Dec 2017"], ["22 Dec 2017", "Present"]],
    slug: "democratic-people-s-republic-of-korea", db: "dprk" },

  drc: { name: "Democratic Republic of the Congo", panel: true, status: "Ongoing", from: "28 Jul 2003", to: "Present",
    types: ["Travel", "Asset freeze", "Arms"],
    notes: ["At first limited to North and South Kivu and Ituri; later extended to the whole country."],
    episodes: [["28 Jul 2003", "18 Apr 2005"], ["18 Apr 2005", "31 Mar 2008"], ["31 Mar 2008", "Present"]],
    slug: "democratic-republic-of-congo" },

  eritrea: { name: "Eritrea", panel: true, status: "Terminated", from: "23 Dec 2009", to: "14 Nov 2018",
    types: ["Travel", "Asset freeze", "Arms", "Financial sector"],
    episodes: [["23 Dec 2009", "5 Dec 2011"], ["5 Dec 2011", "14 Nov 2018"]],
    slug: "eritrea" },

  haiti2: { name: "Haiti II", panel: true, status: "Ongoing", from: "21 Oct 2022", to: "Present",
    types: ["Travel", "Asset freeze", "Arms"],
    episodes: [["21 Oct 2022", "2 Oct 2023"], ["2 Oct 2023", "18 Oct 2024"], ["18 Oct 2024", "Present"]],
    slug: "haiti-ii" },

  iran: { name: "Iran", panel: true, status: "Ongoing", from: "23 Dec 2006", to: "Present",
    types: ["Travel", "Asset freeze", "Arms", "Proscribed activities"],
    notes: ["Conditional bunkering ban during episodes 4 and 5."],
    episodes: [["23 Dec 2006", "24 Mar 2007"], ["24 Mar 2007", "3 Mar 2008"], ["3 Mar 2008", "9 Jun 2010"], ["9 Jun 2010", "24 Nov 2013"], ["24 Nov 2013", "16 Jan 2016"], ["16 Jan 2016", "18 Oct 2020"], ["18 Oct 2020", "18 Oct 2023"], ["18 Oct 2023", "27 Sep 2025"], ["27 Sep 2025", "Present"]],
    slug: "iran" },

  liberia: { name: "Liberia", panel: true, status: "Terminated", from: "19 Nov 1992", to: "25 May 2016",
    types: ["Travel", "Asset freeze", "Diplomatic", "Arms", "Commodity"],
    episodes: [["19 Nov 1992", "7 Mar 2001"], ["7 Mar 2001", "6 May 2003"], ["6 May 2003", "22 Dec 2003"], ["22 Dec 2003", "16 Jun 2006"], ["16 Jun 2006", "25 May 2016"]],
    slug: "liberia" },

  libya2: { name: "Libya II", panel: true, status: "Ongoing", from: "26 Feb 2011", to: "Present",
    types: ["Travel", "Asset freeze", "Arms", "Commodity", "Transportation", "Financial sector"],
    notes: ["Conditional aviation ban during episode 2."],
    episodes: [["26 Feb 2011", "17 Mar 2011"], ["17 Mar 2011", "16 Sep 2011"], ["16 Sep 2011", "19 Mar 2014"], ["19 Mar 2014", "9 Oct 2015"], ["9 Oct 2015", "Present"]],
    slug: "libya-ii", db: "libya" },

  mali: { name: "Mali", panel: true, status: "Terminated", from: "5 Sep 2017", to: "31 Aug 2023",
    types: ["Travel", "Asset freeze"],
    episodes: [["5 Sep 2017", "31 Aug 2023"]],
    slug: "mali" },

  sierra: { name: "Sierra Leone", panel: true, status: "Terminated", from: "8 Oct 1997", to: "29 Sep 2010",
    types: ["Travel", "Diplomatic", "Arms", "Commodity"],
    episodes: [["8 Oct 1997", "16 Mar 1998"], ["16 Mar 1998", "22 Oct 1999"], ["22 Oct 1999", "5 Jul 2000"], ["5 Jul 2000", "16 Jan 2002"], ["16 Jan 2002", "29 Sep 2010"]],
    slug: "sierra-leone" },

  somalia: { name: "Somalia / Al-Shabaab", panel: true, status: "Ongoing", from: "23 Jan 1992", to: "Present",
    types: ["Travel", "Asset freeze", "Arms", "Commodity"],
    notes: ["Secondary sanctions on Eritrea during episodes 3 and 4 (see the Eritrea regime)."],
    episodes: [["23 Jan 1992", "3 May 2002"], ["3 May 2002", "20 Nov 2008"], ["20 Nov 2008", "22 Feb 2012"], ["22 Feb 2012", "15 Nov 2019"], ["15 Nov 2019", "1 Dec 2023"], ["1 Dec 2023", "Present"]],
    slug: "somalia", db: "somalia" },

  ssudan: { name: "South Sudan", panel: true, status: "Ongoing", from: "3 Mar 2015", to: "Present",
    types: ["Travel", "Asset freeze", "Arms"],
    episodes: [["3 Mar 2015", "13 Jul 2018"], ["13 Jul 2018", "Present"]],
    slug: "south-sudan" },

  /* the next three are PROVISIONAL: the case pages could not be read, see "provisional" */
  sudan2: { name: "Sudan II", panel: true, status: "Ongoing", from: "30 Jul 2004", to: "Present",
    types: ["Travel", "Asset freeze", "Arms"], episodes: null,
    slug: "sudan-ii", provisional: true },

  taliban: { name: "Taliban", panel: true, status: "Ongoing", from: "Jun 2011", to: "Present",
    types: ["Travel", "Asset freeze", "Arms"], episodes: null,
    notes: ["Before June 2011 the Taliban were sanctioned inside the Al-Qaida regime (see Al-Qaida / ISIL / Associates)."],
    slug: "taliban", provisional: true },

  yemen: { name: "Yemen", panel: true, status: "Ongoing", from: "26 Feb 2014", to: "Present",
    types: ["Travel", "Asset freeze", "Arms"], episodes: null,
    slug: "yemen", db: "yemen", provisional: true },

  /* ------------------------- SANCTIONS WITHOUT PANEL OF EXPERTS ------------------------- */
  gbissau: { name: "Guinea-Bissau", panel: false, status: "Ongoing", from: "18 May 2012", to: "Present",
    types: ["Travel"],
    episodes: [["18 May 2012", "Present"]],
    slug: "guinea-bissau" },

  libya1: { name: "Libya I", panel: false, status: "Terminated", from: "31 Mar 1992", to: "12 Sep 2003",
    types: ["Asset freeze", "Diplomatic", "Arms", "Commodity", "Transportation"],
    episodes: [["31 Mar 1992", "11 Nov 1993"], ["11 Nov 1993", "5 Apr 1999"], ["5 Apr 1999", "12 Sep 2003"]],
    slug: "libya-i" },

  sudan1: { name: "Sudan I", panel: false, status: "Terminated", from: "1996", to: "2001",
    types: ["Diplomatic", "Transportation"], episodes: null,
    slug: "sudan-i", provisional: true },

  rhodesia: { name: "Southern Rhodesia", panel: false, status: "Terminated", from: "16 Dec 1966", to: "21 Dec 1979",
    types: ["Commodity", "Arms", "Comprehensive"],
    notes: ["Selective mandatory sanctions from December 1966 (Res. 232); comprehensive sanctions from May 1968 (Res. 253); lifted by Res. 460 (1979)."],
    episodes: null, outside: true },

  safrica: { name: "South Africa", panel: false, status: "Terminated", from: "4 Nov 1977", to: "25 May 1994",
    types: ["Arms"],
    notes: ["Mandatory arms embargo (Res. 418, 1977); lifted by Res. 919 (1994)."],
    episodes: null, outside: true },

  fry1: { name: "Former Yugoslavia I", panel: false, status: "Terminated", from: "15 Sep 1991", to: "1 Oct 1996",
    types: ["Arms", "Comprehensive"],
    notes: ["Comprehensive sanctions from May 1992 to October 1996."],
    episodes: [["25 Sep 1991", "30 May 1992"], ["30 May 1992", "1 Oct 1996"]],
    slug: "former-yugoslavia-i" },

  fry2: { name: "Former Yugoslavia II", panel: false, status: "Terminated", from: "31 Mar 1998", to: "10 Sep 2001",
    types: ["Arms"],
    episodes: [["31 Mar 1998", "10 Sep 2001"]],
    slug: "former-yugoslavia-ii" },

  haiti1: { name: "Haiti I", panel: false, status: "Terminated", from: "16 Jun 1993", to: "16 Oct 1994",
    types: ["Asset freeze", "Arms", "Commodity", "Comprehensive"],
    notes: ["Comprehensive sanctions from May to October 1994."],
    episodes: [["16 Jun 1993", "27 Aug 1993"], ["27 Aug 1993", "13 Oct 1993"], ["13 Oct 1993", "6 May 1994"], ["6 May 1994", "31 Jul 1994"], ["31 Jul 1994", "16 Oct 1994"]],
    slug: "haiti-i" },

  iraq: { name: "Iraq", panel: false, status: "Ongoing", from: "22 May 2003", to: "Present",
    types: ["Asset freeze", "Arms", "Proscribed activities", "Commodity"],
    notes: ["Before this regime, Iraq was under comprehensive sanctions (August 1990 to May 2003)."],
    episodes: [["22 May 2003", "8 Jun 2004"], ["8 Jun 2004", "Present"]],
    slug: "iraq" },

  rwanda: { name: "Rwanda", panel: false, status: "Terminated", from: "17 May 1994", to: "10 Jul 2008",
    types: ["Arms"],
    episodes: [["17 May 1994", "16 Aug 1995"], ["16 Aug 1995", "10 Jul 2008"]],
    slug: "rwanda" },

  lebanon: { name: "Lebanon", panel: false, status: "Ongoing", from: "31 Oct 2005", to: "Present",
    types: ["Travel", "Asset freeze"],
    episodes: [["31 Oct 2005", "Present"]],
    slug: "lebanon" },

  etheri: { name: "Ethiopia / Eritrea", panel: false, status: "Terminated", from: "17 May 2000", to: "16 May 2001",
    types: ["Arms"],
    episodes: [["17 May 2000", "16 May 2001"]],
    slug: "ethiopia-eritrea" }
};

window.EXPOSE_COUNTRIES = [
  /* ---- with at least one Panel of Experts regime ---- */
  { id: "140", name: "Central African Republic", regimes: ["car"] },
  { id: "887", name: "Yemen", regimes: ["yemen"] },
  { id: "434", name: "Libya", regimes: ["libya1", "libya2"] },
  { id: "408", name: "DPRK (North Korea)", regimes: ["dprk"] },
  { id: "180", name: "Democratic Republic of the Congo", regimes: ["drc"] },
  { id: "466", name: "Mali", regimes: ["mali"] },
  { id: "706", name: "Somalia", regimes: ["somalia"] },
  { id: "728", name: "South Sudan", regimes: ["ssudan"] },
  { id: "729", name: "Sudan", regimes: ["sudan1", "sudan2"] },
  { id: "024", name: "Angola", regimes: ["angola"] },
  { id: "694", name: "Sierra Leone", regimes: ["sierra"] },
  { id: "004", name: "Afghanistan", regimes: ["taliban"] },
  { id: "364", name: "Iran", regimes: ["iran"] },
  { id: "430", name: "Liberia", regimes: ["liberia"] },
  { id: "384", name: "Côte d'Ivoire", regimes: ["civ"] },
  { id: "332", name: "Haiti", regimes: ["haiti1", "haiti2"] },
  { id: "232", name: "Eritrea", regimes: ["etheri", "eritrea"] },
  { id: "global-aq", name: "Al-Qaida / ISIL / Associates", global: true, regimes: ["aq"],
    note: "This regime is not tied to one country, so it has no shape on the map." },

  /* ---- sanctions without Panel of Experts only ---- */
  { id: "624", name: "Guinea-Bissau", regimes: ["gbissau"] },
  { id: "716", name: "Zimbabwe", regimes: ["rhodesia"], note: "The sanctions applied to Southern Rhodesia, today's Zimbabwe." },
  { id: "710", name: "South Africa", regimes: ["safrica"] },
  { id: "368", name: "Iraq", regimes: ["iraq"] },
  { id: "646", name: "Rwanda", regimes: ["rwanda"] },
  { id: "422", name: "Lebanon", regimes: ["lebanon"] },
  { id: "231", name: "Ethiopia", regimes: ["etheri"] },

  /* ---- successor states of the former Yugoslavia (shown on the map as the countries they became) ---- */
  { id: "688", name: "Serbia", regimes: ["fry1", "fry2"], note: "Sanctions were imposed on the former Yugoslavia and its successors; the map shows them on the successor states." },
  { id: "499", name: "Montenegro", regimes: ["fry1", "fry2"], note: "Sanctions were imposed on the former Yugoslavia and its successors; the map shows them on the successor states." },
  { id: "x-Kosovo", name: "Kosovo", regimes: ["fry1", "fry2"], note: "Sanctions were imposed on the former Yugoslavia and its successors; the map shows them on the successor states." },
  { id: "070", name: "Bosnia and Herzegovina", regimes: ["fry1"], note: "Sanctions were imposed on the former Yugoslavia and its successors; the map shows them on the successor states." },
  { id: "191", name: "Croatia", regimes: ["fry1"], note: "Sanctions were imposed on the former Yugoslavia and its successors; the map shows them on the successor states." },
  { id: "807", name: "North Macedonia", regimes: ["fry1"], note: "Sanctions were imposed on the former Yugoslavia and its successors; the map shows them on the successor states." },
  { id: "705", name: "Slovenia", regimes: ["fry1"], note: "Sanctions were imposed on the former Yugoslavia and its successors; the map shows them on the successor states." }
];
