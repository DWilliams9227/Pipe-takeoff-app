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
function setupDependentMenus(material,connection,type,brand,style,all){
  const change=()=>{
    const mat=material.value;
    const connections=mat?(MATERIAL_CONNECTIONS[mat]||MATERIAL_CONNECTIONS.Other):[...new Set(Object.values(MATERIAL_CONNECTIONS).flat())];
    populate(connection,[...connections,"Other"],all?"All connection types":null,true);
    const types=connection.value?(CONNECTION_TYPES[connection.value]||COMMON_TYPES):COMMON_TYPES;
    populate(type,[...types,"Other"],all?"All fitting types":null,true);
    if(brand){const names=SUGGESTED_BRANDS[mat+"|"+connection.value]||[];brand.placeholder=names.length?"e.g. "+names.join(", "):"Manufacturer (optional search)";}
    if(style){const key=(brand?.value||"").trim()+"|"+connection.value;const styles=SUGGESTED_STYLES[key]||[];style.placeholder=styles.length?"e.g. "+styles.join(", "):"Series / style (as labeled by manufacturer)";}
  };
  material.addEventListener("change",()=>{
    // Material changes clear dependent selections rather than carrying an irrelevant option.
    connection.value="";change();connection.dispatchEvent(new Event("input",{bubbles:true}));
  });
  connection.addEventListener("change",()=>{type.value="";change();connection.dispatchEvent(new Event("input",{bubbles:true}))});
  brand?.addEventListener("input",change);
  change();
}
document.addEventListener("DOMContentLoaded",()=>{
  const byId=id=>document.getElementById(id);
  setupDependentMenus(byId("materialFilter"),byId("connectionFilter"),byId("typeFilter"),byId("brandFilter"),byId("styleFilter"),true);
  const form=byId("fittingForm");
  setupDependentMenus(form.elements.material,form.elements.connection,form.elements.type,form.elements.manufacturer,form.elements.style,false);
  // Restore valid first options after form reset.
  form.addEventListener("reset",()=>setTimeout(()=>form.elements.material.dispatchEvent(new Event("change")),0));
});
