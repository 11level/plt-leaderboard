export const cards = [
  {id:"C-2481",title:"Federal transmission planning reduces regional capacity shortfalls",cutter:"Pingkang Qian",tag:"pingkang",citation:"Jenkins 2026",document:"Energy Aff — Grid Modernization",date:"Jul 30, 2026",similarity:"Unique",status:"Verified"},
  {id:"C-2479",title:"AI-enabled targeting compresses military decision timelines",cutter:"Tony Dong",tag:"tony",citation:"Horowitz 2025",document:"AI DA — Escalation Impacts",date:"Jul 30, 2026",similarity:"Unique",status:"Verified"},
  {id:"C-2472",title:"Industrial policy strengthens critical mineral supply resilience",cutter:"Maya Lin",tag:"maya",citation:"Farrell 2025",document:"Trade Neg — Supply Chains",date:"Jul 29, 2026",similarity:"86% match",status:"Near duplicate"},
  {id:"C-2468",title:"Permitting delays constrain interregional grid expansion",cutter:"Alex Rivera",tag:"alex",citation:"DOE 2026",document:"Energy Aff — Grid Modernization",date:"Jul 29, 2026",similarity:"100% match",status:"Exact duplicate"},
  {id:"C-2457",title:"Public health cooperation rebuilds institutional trust",cutter:"Pingkang Qian",tag:"pingkang",citation:"Gostin 2025",document:"Health Coop — Soft Power",date:"Jul 28, 2026",similarity:"Unique",status:"Verified"},
];

export const documents = [
  {name:"Energy Aff — Grid Modernization",type:"Google Doc",cards:84,verified:71,duplicates:13,modified:"12 min ago",scanned:"2 min ago",status:"Synced"},
  {name:"AI DA — Escalation Impacts",type:"Google Doc",cards:63,verified:58,duplicates:5,modified:"1 hr ago",scanned:"46 min ago",status:"Synced"},
  {name:"Trade Neg — Supply Chains",type:"Google Doc",cards:49,verified:41,duplicates:8,modified:"3 hrs ago",scanned:"3 hrs ago",status:"Processing"},
  {name:"Health Coop — Soft Power",type:"Google Doc",cards:37,verified:35,duplicates:2,modified:"Yesterday",scanned:"Yesterday",status:"Synced"},
  {name:"Old Backfiles — 2025",type:"Google Doc",cards:112,verified:89,duplicates:23,modified:"Jul 22",scanned:"Jul 24",status:"Stale"},
];

export const activity = [
  {date:"Today",items:[
    ["cards","Pingkang Qian added 3 verified cards","Energy Aff — Grid Modernization","12 minutes ago"],
    ["scan","Google Drive scan completed","18 documents processed · 14 new cards","24 minutes ago"],
    ["duplicate","Near-duplicate evidence detected","Trade Neg — Supply Chains · 86% similarity","1 hour ago"],
    ["cards","Tony Dong added 5 verified cards","AI DA — Escalation Impacts","2 hours ago"],
  ]},
  {date:"Yesterday",items:[
    ["approve","Coach Quinn approved 4 cards","Historical import review","Yesterday at 4:18 PM"],
    ["document","Document rescanned after revision","Health Coop — Soft Power","Yesterday at 2:06 PM"],
  ]},
];
