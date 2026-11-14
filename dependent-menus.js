"use strict";
// Contextual menu options are UI suggestions, not a certification of material compatibility.
const MATERIAL_CONNECTIONS = {
  "Copper":["Press","Solder","Brazed","Threaded","Flanged","DWV"],
  "Carbon steel":["Butt-weld","Socket-weld","Threaded","Grooved","Flanged","Press"],
  "Stainless steel":["Butt-weld","Socket-weld","Press","Grooved","Threaded","Flanged"],
  "PVC":["Solvent-weld","Threaded","Flanged","DWV","Grooved"],
  "CPVC":["Solvent-weld","Threaded","Flanged","Grooved"],
  "Cast iron":["No-hub","Hub-and-spigot","DWV","Flanged","Grooved"],
  "Ductile iron":["Mechanical joint","Push-on","Grooved","Flanged","Restrained joint"],
  "HDPE":["Butt fusion","Electrofusion","Mechanical","Flanged"],
  "Other":["Press","Solder","Brazed","Butt-weld","Socket-weld","Threaded","Grooved","Flanged","Solvent-weld","DWV","Mechanical joint","Other"]
};
const COMMON_TYPES=["90° elbow","45° elbow","22.5° elbow","Tee","Reducer","Coupling","Union","Cap","Cross","Flange","Valve","Adapter","Other"];
const CONNECTION_TYPES={
  "Press":["90° elbow","45° elbow","Tee","Reducer","Coupling","Cap","Adapter","Union","Valve","Flange"],
  "Solder":["90° elbow","45° elbow","Tee","Reducer","Coupling","Cap","Adapter","Union"],
  "Brazed":["90° elbow","45° elbow","Tee","Reducer","Coupling","Cap","Adapter"],
  "Butt-weld":["90° elbow","45° elbow","22.5° elbow","Tee","Reducer","Cap","Cross"],
  "Socket-weld":["90° elbow","45° elbow","Tee","Coupling","Union","Cap","Cross"],
  "Grooved":["90° elbow","45° elbow","22.5° elbow","Tee","Reducer","Coupling","Cap","Cross","Adapter","Flange","Valve"],
  "Flanged":["90° elbow","Tee","Reducer","Flange","Valve","Adapter"],
  "Solvent-weld":["90° elbow","45° elbow","22.5° elbow","Tee","Reducer","Coupling","Union","Cap","Adapter"],
  "DWV":["90° elbow","45° elbow","22.5° elbow","Tee","Reducer","Coupling","Cap","Adapter","Other"],
  "No-hub":["90° elbow","45° elbow","Tee","Reducer","Coupling","Cap","Cross"],
  "Hub-and-spigot":["90° elbow","45° elbow","Tee","Reducer","Coupling","Cap"],
  "Mechanical joint":["90° elbow","45° elbow","22.5° elbow","Tee","Reducer","Coupling","Cap","Flange"],
  "Push-on":["90° elbow","45° elbow","Tee","Reducer","Coupling","Cap"],
  "Restrained joint":["90° elbow","45° elbow","Tee","Reducer","Coupling","Cap"],
  "Butt fusion":["90° elbow","45° elbow","Tee","Reducer","Coupling","Cap","Adapter"],
  "Electrofusion":["90° elbow","45° elbow","Tee","Reducer","Coupling","Cap","Adapter"],
  "Mechanical":["90° elbow","45° elbow","Tee","Reducer","Coupling","Adapter"],
  "Threaded":["90° elbow","45° elbow","Tee","Reducer","Coupling","Union","Cap","Cross","Adapter","Valve"]
};
const SUGGESTED_BRANDS={
  "Copper|Press":["Viega","NIBCO","Apollo","Mueller"],
  "Stainless steel|Press":["Viega","NIBCO","Victaulic"],
  "Carbon steel|Grooved":["Victaulic","Shurjoint","Gruvlok"],
  "Stainless steel|Grooved":["Victaulic","Shurjoint"],
  "Carbon steel|Press":["Viega","Victaulic"],
  "Ductile iron|Grooved":["Victaulic","Shurjoint"]
};
const SUGGESTED_STYLES={
  "Viega|Press":["ProPress","MegaPress","ProPress Stainless"],
  "NIBCO|Press":["Press System"],
  "Victaulic|Grooved":["Style 07","Style 77","Style 741","Other style"]
};
function populate(select,items,allLabel,retain){
  const prev=retain?select.value:"";
  select.replaceChildren();
  if(allLabel){const opt=new Option(allLabel,"");select.add(opt)}
  [...new Set(items)].forEach(x=>select.add(new Option(x,x)));
  if(prev && !items.includes(prev))select.add(new Option(prev+" (existing/custom)",prev));
  if(prev && [...select.options].some(o=>o.value===prev))select.value=prev;
}
const BRAND_OPTIONS={"Copper|Press":["Viega","NIBCO","Apollo","Mueller","Other / custom"],"Stainless steel|Press":["Viega","NIBCO","Victaulic","Other / custom"],"Carbon steel|Grooved":["Victaulic","Shurjoint","Gruvlok","Other / custom"],"Carbon steel|Press":["Viega","Victaulic","Other / custom"]};
const SERIES_OPTIONS={"Copper|Press|Viega":["ProPress"],"Copper|Press|NIBCO":["Press System"],"Stainless steel|Press|Viega":["ProPress Stainless"],"Carbon steel|Press|Viega":["MegaPress"],"Carbon steel|Grooved|Victaulic":["Style 07","Style 77","Style 741","Other / custom"]};
function setupDependentMenus(material,connection,type,brand,style,all){
 const refresh=(level)=>{
 const mat=material.value, connections=mat?(MATERIAL_CONNECTIONS[mat]||MATERIAL_CONNECTIONS.Other):[...new Set(Object.values(MATERIAL_CONNECTIONS).flat())];
 if(level<=1)populate(connection,[...connections,"Other"],all?"All connection types":null,level!==0);
 const conn=connection.value;
 if(level<=2)populate(type,conn?(CONNECTION_TYPES[conn]||COMMON_TYPES):COMMON_TYPES,all?"All fitting types":null,level>1);
 const brands=BRAND_OPTIONS[mat+"|"+conn]||SUGGESTED_BRANDS[mat+"|"+conn]||["Other / custom"];
 if(level<=3)populate(brand,brands,all?"All manufacturers":null,level>2);
 const styles=SERIES_OPTIONS[[mat,conn,brand.value].join("|")]||SUGGESTED_STYLES[brand.value+"|"+conn]||["Other / custom"];
 if(level<=4)populate(style,styles,all?"All styles":null,level>3);
 };
 material.addEventListener("change",()=>{refresh(0);connection.dispatchEvent(new Event("input",{bubbles:true}))});
 connection.addEventListener("change",()=>{refresh(2);connection.dispatchEvent(new Event("input",{bubbles:true}))});
 brand.addEventListener("change",()=>{refresh(4);brand.dispatchEvent(new Event("input",{bubbles:true}))});
 refresh(0);
}
document.addEventListener("DOMContentLoaded",()=>{
 const byId=id=>document.getElementById(id);
 setupDependentMenus(byId("materialFilter"),byId("connectionFilter"),byId("typeFilter"),byId("brandFilter"),byId("styleFilter"),true);
 const form=byId("fittingForm");setupDependentMenus(form.elements.material,form.elements.connection,form.elements.type,form.elements.manufacturer,form.elements.style,false);
 form.addEventListener("reset",()=>setTimeout(()=>form.elements.material.dispatchEvent(new Event("change")),0));
});
