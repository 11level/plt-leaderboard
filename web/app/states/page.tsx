import { AlertCircle, CloudOff, FileQuestion, FolderOpen, LoaderCircle, RefreshCw } from "lucide-react";
const states=[
  [LoaderCircle,"Initial synchronization","Scanning debate files","143 of 218 documents processed"],
  [RefreshCw,"Incremental synchronization","Checking recent Drive changes","Partial leaderboard results remain available"],
  [AlertCircle,"Parsing failure","One document could not be processed","The previous successful version remains active"],
  [CloudOff,"Authorization expired","Google Drive needs to be reconnected","No source data has been deleted"],
  [FolderOpen,"No documents found","The selected folder does not contain Google Docs","Choose another folder or add preparation files"],
  [FileQuestion,"No cutter tags found","Documents were scanned successfully","Confirm the // [username] format in Settings"],
];
export default function StatesPage(){return <main className="shell"><section className="page-head"><div><h1>System states</h1><p>Reusable connection, synchronization, and empty-state treatments</p></div></section><div className="state-grid">{states.map(([Icon,title,message,detail])=>{const StateIcon=Icon as typeof LoaderCircle;return <section className="panel state-card" key={title as string}><span className="empty-icon"><StateIcon/></span><div><small>{title as string}</small><h2>{message as string}</h2><p>{detail as string}</p>{title==="Initial synchronization"&&<div className="progress"><i/></div>}</div><button className="button">{title==="Authorization expired"?"Reconnect Drive":"View details"}</button></section>})}</div></main>}
