"use client";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
const steps=[
 ["Create your team","Set the workspace that will own documents, members, and scoring.",["Create PLT Debate","Join an existing team"]],
 ["Connect Google Drive","Authorize read-only access with your team administrator account.",["Connect qianpingkang@gmail.com","Use a different Google account"]],
 ["Choose your source","Select the root preparation folder. All nested folders are included.",["PLT Nationals 2026","Choose another folder"]],
 ["Supported files","Choose which Drive documents the scanner should process.",["Google Docs only","Google Docs and uploaded Word files"]],
 ["Cutter-tag format","Define the exact marker that attributes each card.",["// [username]","Use a custom format"]],
 ["Team members","Confirm members and aliases before scanning.",["Use existing member mapping","Import a CSV"]],
 ["Duplicate credit","How should duplicate cards be credited?",["Send duplicates for administrator review","Credit the first observed cutter","Credit every cutter individually"]],
 ["Historical imports","Choose how existing cards should appear in activity reports.",["Count in all-time rankings only","Count as current activity","Require review"]],
 ["Review setup","Everything is ready for the initial synchronization.",["Start initial sync","Save and return later"]],
];
export default function OnboardingPage(){
 const [step,setStep]=useState(0); const current=steps[step];
 return <main className="onboarding"><section className="setup-panel"><div className="setup-progress" aria-label={`Step ${step+1} of ${steps.length}`}>{steps.map((_,i)=><i className={i<=step?"done":""} key={i}/>)}</div><p className="eyebrow">STEP {step+1} OF {steps.length}</p><h1>{current[0]}</h1><p>{current[1]}</p><div className="choice-grid">{(current[2] as string[]).map((choice,i)=><button className={`choice ${i===0?"selected":""}`} key={choice}><strong>{choice}</strong><span>{i===0?"Recommended for the confirmed PLT configuration.":"You can change this later in Settings."}</span>{i===0&&<CheckCircle2/>}</button>)}</div><div className="setup-actions"><button className="button" disabled={step===0} onClick={()=>setStep(value=>Math.max(0,value-1))}><ArrowLeft/> Back</button><button className="button primary" onClick={()=>setStep(value=>Math.min(steps.length-1,value+1))}>{step===steps.length-1?"Start sync":"Continue"} <ArrowRight/></button></div></section></main>
}
