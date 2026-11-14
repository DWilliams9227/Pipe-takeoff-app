"use strict";
const $=id=>document.getElementById(id);
const KEY="pipe-takeoff-data-v02";
const defaultData=()=>({fittings:[],projects:[],spacingRules:[]});
let data;
try {data=JSON.parse(localStorage.getItem(KEY))||defaultData();if(!Array.isArray(data.fittings)||!Array.isArray(data.projects))throw Error("Invalid data");}catch{data=defaultData()}
if(!Array.isArray(data.spacingRules))data.spacingRules=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{alert("Unable to save. Check available browser storage.")}}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}
function number(id){const v=parseFloat($(id).value);return Number.isFinite(v)?v:null}
function fmt(v,unit){if(!Number.isFinite(v))return "—";return `${Number(v.toFixed(3))} ${unit}`}
function parseMeasure(s){s=String(s).trim().replace(/\s+/g," ");if(/^\d+(?:\.\d+)?$/.test(s))return Number(s);let m=s.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/);if(!m||Number(m[3])===0)return null;return Number(m[1]||0)+Number(m[2])/Number(m[3])}
function switchPage(page){document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.page===page));["library","calculators","saved","manage","spacing"].forEach(p=>$(p+"Page").classList.toggle("hidden",p!==page));if(page==="saved")renderProjects();if(page==="library")renderFittings();if(page==="spacing")renderSpacing()}
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>switchPage(t.dataset.page)));
const filters=["globalSearch","materialFilter","connectionFilter","brandFilter","styleFilter","sizeFilter","typeFilter"];
filters.forEach(id=>$(id).addEventListener("input",renderFittings));
function catalogCards(){
 const v=id=>$(id).value.trim().toLowerCase(),q=v("globalSearch");
 const rows=MANUFACTURER_CATALOG.filter(f=>[f.manufacturer,f.style,f.material,f.connection,f.size,f.type,f.model,f.partNumber,f.description].join(" ").toLowerCase().includes(q)&&(!v("materialFilter")||f.material.toLowerCase()===v("materialFilter"))&&(!v("connectionFilter")||f.connection.toLowerCase()===v("connectionFilter"))&&(!v("brandFilter")||f.manufacturer.toLowerCase()===v("brandFilter"))&&(!v("styleFilter")||f.style.toLowerCase()===v("styleFilter"))&&f.size.toLowerCase().includes(v("sizeFilter"))&&(!v("typeFilter")||f.type.toLowerCase()===v("typeFilter")));
 return {count:rows.length,html:rows.map(f=>`<article class="fitting-card"><span class="pill">CATALOG-CONFIRMED • DIMENSIONS NOT LOADED</span><h3>${esc(f.manufacturer)} ${esc(f.model)} — ${esc(f.size)}&quot;</h3><div class="detail">${esc(f.description)} • Part ${esc(f.partNumber)}</div><div class="detail">Center-to-end: NOT VERIFIED • Insertion depth: NOT VERIFIED</div><div class="detail"><a href="${esc(f.source)}" target="_blank" rel="noopener noreferrer">Manufacturer catalog source</a></div></article>`).join("")};
}
function renderFittings(){const v=id=>$(id).value.trim().toLowerCase();const q=v("globalSearch");const rows=data.fittings.filter(f=>[f.manufacturer,f.style,f.material,f.connection,f.size,f.type,f.dimensionName,f.source].join(" ").toLowerCase().includes(q)&&(!v("materialFilter")||f.material.toLowerCase()===v("materialFilter"))&&(!v("connectionFilter")||f.connection.toLowerCase()===v("connectionFilter"))&&(!v("brandFilter")||f.manufacturer.toLowerCase()===v("brandFilter"))&&(!v("styleFilter")||f.style.toLowerCase()===v("styleFilter"))&&f.size.toLowerCase().includes(v("sizeFilter"))&&(!v("typeFilter")||f.type.toLowerCase()===v("typeFilter")));
const catalog=catalogCards();$("resultCount").textContent=`${catalog.count} catalog items • ${rows.length} saved measurements`;
$("fittingResults").innerHTML=catalog.html+(rows.length?rows.map(f=>`<article class="fitting-card"><span class="pill">USER-ENTERED • NOT VERIFIED</span><h3>${esc(f.manufacturer)} — ${esc(f.style)}</h3><div class="detail">${esc(f.size)} • ${esc(f.material)} • ${esc(f.connection)} • ${esc(f.type)}</div><div class="detail">${esc(f.dimensionName)}</div><div class="dimension">${esc(f.dimension)} ${esc(f.unit)}</div><div class="detail">Source: ${esc(f.source||"Not supplied")} ${f.revision?"• "+esc(f.revision):""}</div>${f.notes?`<div class="detail">Notes: ${esc(f.notes)}</div>`:""}<div class="row-actions"><button class="primary danger" data-delete-fitting="${esc(f.id)}">Delete</button></div></article>`).join(""):catalog.count?"":`<div class="empty-state"><div class="empty-icon">⌕</div><h3>No fitting takeoff measurements loaded</h3><p>Spacing requirements are available separately. Add your fitting dimensions under <strong>My fittings</strong>. Manufacturer-verified dimensions will be added as the drawings are checked.</p><button class="primary" id="goAdd">Add a fitting</button></div>`);
$("goAdd")?.addEventListener("click",()=>switchPage("manage"));
document.querySelectorAll("[data-delete-fitting]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Delete this measurement?")){data.fittings=data.fittings.filter(f=>f.id!==b.dataset.deleteFitting);save();renderFittings()}}))}
$("fittingForm").addEventListener("submit",e=>{e.preventDefault();const obj=Object.fromEntries(new FormData(e.currentTarget));const n=parseMeasure(obj.dimension);if(n===null||n<0){alert("Enter a positive measurement, such as 2.5 or 2 1/2.");return}obj.id=uid();obj.status="user-entered";data.fittings.push(obj);save();e.currentTarget.reset();switchPage("library")});
function calcTravel(){const r=number("run"),h=number("rise");if(r===null||h===null||r<0||h<0){$("travelResult").textContent="—";return}const mm=Math.hypot(r*($("runUnit").value==="mm"?1:25.4),h*($("riseUnit").value==="mm"?1:25.4));$("travelResult").textContent=$("runUnit").value==="mm"&&$("riseUnit").value==="mm"?fmt(mm,"mm"):fmt(mm/25.4,"in")}
["run","rise","runUnit","riseUnit"].forEach(id=>$(id).addEventListener("input",calcTravel));
function calcCut(){const face=number("face"),left=number("leftAllowance"),right=number("rightAllowance");if([face,left,right].some(n=>n===null||n<0)){$("cutResult").textContent="—";return}const result=face-left-right;$("cutResult").textContent=result<0?"Invalid: allowances exceed length":fmt(result,$("faceUnit").value)}
["face","leftAllowance","rightAllowance","faceUnit"].forEach(id=>$(id).addEventListener("input",calcCut));
$("addProject").addEventListener("click",()=>{const name=$("projectName").value.trim();if(!name){alert("Enter a project name.");return}data.projects.push({id:uid(),name,items:[]});$("projectName").value="";save();renderProjects()});
function renderProjects(){$("projectList").innerHTML=data.projects.length?data.projects.map(p=>`<article class="project-card"><h3>${esc(p.name)}</h3><div class="detail">${p.items.length} line item(s)</div><div class="project-line"><label>Item description<input placeholder="2 in 90° elbow" data-desc="${esc(p.id)}"></label><label>Qty<input type="number" min="1" step="1" value="1" data-qty="${esc(p.id)}"></label><label>Notes<input placeholder="Area / system" data-note="${esc(p.id)}"></label><button class="primary" data-add="${esc(p.id)}">Add item</button></div>${p.items.length?`<table style="width:100%;font-size:13px"><thead><tr><th align="left">Item</th><th>Qty</th><th align="left">Notes</th><th></th></tr></thead><tbody>${p.items.map(i=>`<tr><td>${esc(i.desc)}</td><td align="center">${i.qty}</td><td>${esc(i.note)}</td><td><button data-remove="${esc(p.id)}" data-item="${esc(i.id)}" aria-label="Remove line item">✕</button></td></tr>`).join("")}</tbody></table>`:""}<div class="row-actions"><button class="primary secondary" data-csv="${esc(p.id)}">Export CSV</button><button class="primary danger" data-delete-project="${esc(p.id)}">Delete project</button></div></article>`).join(""):`<div class="empty-state"><h3>No projects yet</h3><p>Create a project to start tracking fitting quantities.</p></div>`;
document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{const id=b.dataset.add,p=data.projects.find(x=>x.id===id),desc=document.querySelector(`[data-desc="${id}"]`).value.trim(),qty=Number(document.querySelector(`[data-qty="${id}"]`).value),note=document.querySelector(`[data-note="${id}"]`).value.trim();if(!desc||!Number.isSafeInteger(qty)||qty<1){alert("Enter a description and a whole-number quantity greater than zero.");return}p.items.push({id:uid(),desc,qty,note});save();renderProjects()});
document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{const p=data.projects.find(x=>x.id===b.dataset.remove);p.items=p.items.filter(x=>x.id!==b.dataset.item);save();renderProjects()});
document.querySelectorAll("[data-delete-project]").forEach(b=>b.onclick=()=>{if(confirm("Delete this project and its takeoff items?")){data.projects=data.projects.filter(x=>x.id!==b.dataset.deleteProject);save();renderProjects()}});
document.querySelectorAll("[data-csv]").forEach(b=>b.onclick=()=>{const p=data.projects.find(x=>x.id===b.dataset.csv);const csv=s=>`"${String(s).replace(/"/g,'""')}"`;const content=[["Description","Quantity","Notes"],...p.items.map(i=>[i.desc,i.qty,i.note])].map(row=>row.map(csv).join(",")).join("\r\n");download(p.name.replace(/[^a-z0-9_-]/gi,"_")+"_takeoff.csv",content,"text/csv;charset=utf-8")})}
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
$("exportData").onclick=()=>download("pipe-takeoff-backup.json",JSON.stringify({version:3,...data},null,2),"application/json");
$("restoreData").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const imported=JSON.parse(await f.text());if(!Array.isArray(imported.fittings)||!Array.isArray(imported.projects)||imported.fittings.length>10000||imported.projects.length>10000||imported.fittings.some(x=>!x.id||!x.manufacturer||!x.style||!x.dimension)||imported.projects.some(x=>!x.id||!x.name||!Array.isArray(x.items)))throw Error("Unsupported backup");if(confirm("Replace all current fitting measurements and projects with this backup?")){data={fittings:imported.fittings,projects:imported.projects,spacingRules:Array.isArray(imported.spacingRules)?imported.spacingRules:[]};save();renderProjects();renderFittings()}}catch(err){alert("Unable to restore: "+err.message)}e.target.value=""});

// Press spacing rules are explicitly user-entered, never claimed to be manufacturer-verified.
// Manufacturer-documented minimum spacing between copper press joints, NOT cut length or tool clearance.
// NIBCO Press System Installation Instructions revised 4/4/2024, chart 1.
const NIBCO_GAPS_IN={"1/2":0,"3/4":0,"1":0,"1 1/4":0,"1 1/2":0,"2":0,"2 1/2":0.375,"3":0.375,"4":0.375};
const NIBCO_SOURCE="NIBCO Press System Installation Instructions, revised 4/4/2024, Chart 1";
const NIBCO_URL="https://www.macombgroup.com/ASSETS/DOCUMENTS/ITEMS/EN/NIBCOPRESSTEECXC3X12_Broc.pdf";
const spacingKey=()=>{const [manufacturer,style]=$("spacingSystem").value.split("|");return {manufacturer,style,size:$("spacingSize").value}}
function renderSpacing(){
 const key=spacingKey();const userRule=data.spacingRules.find(r=>r.manufacturer===key.manufacturer&&r.style===key.style&&r.size===key.size);
 const builtin=key.manufacturer==="NIBCO"&&key.style==="Press System"&&Object.prototype.hasOwnProperty.call(NIBCO_GAPS_IN,key.size)?{mm:NIBCO_GAPS_IN[key.size]*25.4,source:NIBCO_SOURCE,revision:"4/4/2024"}:null;
 const rule=builtin||userRule;
 $("requiredGap").textContent=rule?fmt(rule.mm/25.4,"in")+" / "+fmt(rule.mm,"mm"):"Not loaded";
 $("spacingSource").textContent=rule?(builtin?"MANUFACTURER-DOCUMENTED • ":"USER-ENTERED, NOT VERIFIED • ")+"Source: "+rule.source+(rule.revision?" • "+rule.revision:"")+(builtin?" • "+NIBCO_URL:"")+(rule.toolNote?" • Tool note: "+rule.toolNote:""):"NOT LOADED for this brand and size.";
 const raw=$("actualGap").value.trim(),actual=parseMeasure(raw),unit=$("spacingUnit").value;
 let msg="Enter an actual exposed pipe gap to check.";
 if(!rule)msg="NOT LOADED for this exact brand, series and size. Cannot determine compliance.";
 else if(!raw)msg="Enter an actual exposed pipe gap to check.";
 else if(actual===null||actual<0)msg="Enter a valid nonnegative measurement (for example 3/4).";
 else {const mm=actual*(unit==="in"?25.4:1);msg=mm+1e-7>=rule.mm?(builtin?"Meets NIBCO published joint spacing. Check press-tool clearance separately.":"Meets your saved rule only. Verify manufacturer instructions and tool clearance."):(builtin?"BELOW NIBCO published minimum joint spacing.":"BELOW your saved minimum. Check manufacturer instructions.")}
 $("spacingVerdict").textContent=msg;
 $("spacingRulesList").innerHTML=data.spacingRules.length?data.spacingRules.map(r=>`<div class="spacing-row"><strong>${esc(r.manufacturer)} — ${esc(r.style)} • ${esc(r.size)}&quot;</strong><span>${esc(fmt(r.mm/25.4,"in"))} minimum • User-entered</span><button class="primary danger" data-remove-spacing="${esc(r.id)}">Delete</button></div>`).join(""):"<p class='muted'>No saved spacing rules yet.</p>";
 document.querySelectorAll("[data-remove-spacing]").forEach(b=>b.onclick=()=>{if(confirm("Delete this spacing rule?")){data.spacingRules=data.spacingRules.filter(r=>r.id!==b.dataset.removeSpacing);save();renderSpacing()}});
}
["spacingSystem","spacingSize","actualGap","spacingUnit"].forEach(id=>$(id).addEventListener("input",renderSpacing));
$("spacingRuleForm").addEventListener("submit",e=>{
 e.preventDefault();const fields=Object.fromEntries(new FormData(e.currentTarget));const gap=parseMeasure(fields.gap);
 if(gap===null||gap<0){alert("Enter a valid nonnegative minimum gap.");return}
 if(!fields.source.trim()){alert("Provide the source document.");return}
 const key=spacingKey();const mm=gap*(fields.unit==="in"?25.4:1);
 data.spacingRules=data.spacingRules.filter(r=>!(r.manufacturer===key.manufacturer&&r.style===key.style&&r.size===key.size));
 data.spacingRules.push({...key,mm,source:fields.source.trim(),revision:fields.revision.trim(),toolNote:fields.toolNote.trim(),id:uid(),status:"user-entered"});save();e.currentTarget.reset();renderSpacing();
});

if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
function status(){$("offlineStatus").textContent=navigator.onLine?"● Offline ready":"● Offline mode"}
window.addEventListener("online",status);window.addEventListener("offline",status);status();renderFittings();
