const $ = s => document.querySelector(s), view = $("#view");
const fmt = n => n == null ? "-" : Number(n).toLocaleString("en-IN", {maximumFractionDigits: 2});
const PAL = ["#a9b88a","#8fb3d1","#d9a5a5","#e58bb0","#b79ad0","#e8c39e","#9aa5d8","#7fcdd6","#c9c9c9","#d08c6c"];
let charts = [], tab = "Overview";

function card(title, inner, wide) { return `<div class="card${wide ? " wide" : ""}"><h2>${title}</h2>${inner}</div>`; }
function table(head, rows, hiCol) {
  const t = head.map((_, i) => rows.reduce((s, r) => s + (typeof r[i] === "number" ? r[i] : 0), 0));
  return `<div class="tw"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i === hiCol ? ' class="hi"' : ""}>${typeof c === "number" || c == null ? fmt(c) : c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function chart(id, type, labels, sets, opt = {}) {
  setTimeout(() => charts.push(new Chart($("#" + id), {type, data: {labels, datasets: sets}, options: Object.assign({responsive: true, plugins: {legend: {position: "bottom", labels: {boxWidth: 10}}}}, opt)})), 0);
  return `<canvas id="${id}"></canvas>`;
}
const bars = (l, v, lab = "Amount") => [{label: lab, data: v, backgroundColor: PAL}];
const R = () => $("#reg").value;
const mix = () => { const r = R(); return {y: r !== "Kompally", k: r !== "Yapral"}; };

const pages = {
 Overview() {
  const r = R(), m = mix(), names = r === "all" ? ["Overall", "Yapral", "Kompally"] : [r];
  const kp = names.map(n => `<b>${n}</b>` + D.kpi[n].map((v, i) => `<div class="k"><small>${["Mkt Exp. (Rs.)", "Cost / Site visit", "Cost / Booking", "Cost / Sft"][i]}</small><b>${v}</b></div>`).join("")).join("");
  const sets = []; if (m.y) sets.push({label: "Yapral", data: D.yap, backgroundColor: "#d8c9bb"}); if (m.k) sets.push({label: "Kompally", data: D.kom, backgroundColor: "#a2b0bd"});
  const ck = Object.keys(D.cat), ct = ck.map(k => D.cat[k].reduce((a, b, i) => a + (i === 0 && m.y || i === 1 && m.k ? b : 0), 0));
  const pk = Object.keys(D.proj).filter(k => r === "all" || D.region[k] === r);
  return `<div class="kpis">${kp}</div><div class="grid">`
   + card("Region-wise expenditure", chart("c1", "doughnut", ["Yapral", "Kompally"], [{data: [14070711, 17539471], backgroundColor: ["#d8c9bb", "#a2b0bd"]}]))
   + card("Category-wise expenditure", chart("c2", "doughnut", ck, [{data: ct, backgroundColor: PAL}]))
   + card("Monthly expenditure by region", chart("c3", "bar", D.months, sets, {scales: {x: {stacked: true}, y: {stacked: true}}}), true)
   + card("Project-wise expenditure", chart("c4", "bar", pk.map(k => D.pname[k]), bars(0, pk.map(k => D.proj[k])), {indexAxis: "y", plugins: {legend: {display: false}}}))
   + card("Cost per booking (Rs. lakh)", chart("c5", "line", D.months, Object.entries(D.cpb).filter(([k]) => r === "all" || k === r || k === "Overall").map(([k, v], i) => ({label: k, data: v, borderColor: PAL[i + 5], tension: .35}))))
   + card("Site visits, bookings & saleable area by category", table(["Category", "Site visits", "Bookings", "Saleable area"], D.visits), true)
   + card("Cost per site visit, booking & sft by project", table(["Project", "Per visit", "Per booking", "Per sft"], D.perProj.filter(p => r === "all" || D.region[Object.keys(D.pname).find(k => D.pname[k] === p[0])] === r)), true) + `</div>`;
 },
 Quarterly() {
  return `<div class="grid">`
   + card("Quarterly expenditure by project", chart("q1", "bar", D.qtr.map(r => r[0]), [{label: "Q1 (Apr-Jun)", data: D.qtr.map(r => r[1]), backgroundColor: "#8fb3d1"}, {label: "Q2 (Jul-Sep)", data: D.qtr.map(r => r[2]), backgroundColor: "#e8c39e"}]), true)
   + card("Project-wise expenditure per quarter", table(["Project", "Q1 2026", "Q2 2026", "Total"], D.qtr.map(r => [...r, r[1] + r[2]]), 3), true) + `</div>`;
 },
 Regional() {
  const rows = Object.entries(D.cat).map(([k, v]) => [k, v[0], v[1], v[0] + v[1]]);
  return `<div class="grid">` + card("Category by region", chart("r1", "bar", rows.map(r => r[0]), [{label: "Yapral", data: rows.map(r => r[1]), backgroundColor: "#d8c9bb"}, {label: "Kompally", data: rows.map(r => r[2]), backgroundColor: "#a2b0bd"}], {indexAxis: "y"}), true)
   + card("Ranking of category expenditure by region", table(["Category", "Yapral", "Kompally", "Grand total"], rows), true) + `</div>`;
 },
 Project() {
  const ks = Object.keys(D.proj);
  return `<div class="grid">` + card("Marketing expenditure share by project", chart("p1", "doughnut", ks.map(k => D.pname[k]), [{data: ks.map(k => Math.max(D.proj[k], 0)), backgroundColor: PAL}]))
   + card("Project totals", table(["Project", "Region", "Expenditure"], ks.map(k => [D.pname[k], D.region[k], D.proj[k]]), 2)) + `</div>`;
 },
 "Payment Date"() {
  const c = Object.entries(D.pay.cat);
  return `<div class="grid">` + card("Monthly expenditure by payment date", chart("d1", "bar", D.pay.months, bars(0, D.pay.v), {plugins: {legend: {display: false}}}), true)
   + card("By category", chart("d2", "doughnut", c.map(x => x[0]), [{data: c.map(x => x[1]), backgroundColor: PAL}]))
   + card("By region", chart("d3", "doughnut", Object.keys(D.pay.region), [{data: Object.values(D.pay.region), backgroundColor: ["#a2b0bd", "#d8c9bb"]}]))
   + card("Category totals (payment basis)", table(["Category", "Amount"], c, 1)) + `</div>`;
 },
 "Admin & Others"() {
  const o = D.other;
  return `<div class="kpis" style="grid-template-columns:repeat(4,1fr)">` + ["Administrative", "Manpower", "Security & Housekeeping", "Electricity"].map(k => `<div class="k"><small>${k}</small><b>${o[k] ? fmt(o[k]) : "No data"}</b></div>`).join("") + `</div><div class="grid">`
   + card("Security & housekeeping by location", chart("o1", "bar", Object.keys(o.sec), bars(0, Object.values(o.sec)), {indexAxis: "y", plugins: {legend: {display: false}}}))
   + card("Electricity by sales office", chart("o2", "bar", Object.keys(o.ele), bars(0, Object.values(o.ele)), {indexAxis: "y", plugins: {legend: {display: false}}})) + `</div>`;
 }
};

function draw() { charts.forEach(c => c.destroy()); charts = []; view.innerHTML = pages[tab](); [...$("#tabs").children].forEach(b => b.classList.toggle("on", b.textContent === tab)); }
function start() {
  $("#login").hidden = true; $("#app").hidden = false;
  $("#tabs").innerHTML = Object.keys(pages).map(t => `<button>${t}</button>`).join("");
  $("#tabs").onclick = e => { if (e.target.tagName === "BUTTON") { tab = e.target.textContent; draw(); } };
  $("#reg").onchange = draw; $("#out").onclick = Auth.logout; draw();
}
async function submit() {
  const b = $("#go"), box = $(".box"); b.classList.add("load"); $("#err").textContent = "";
  const [m] = await Promise.all([Auth.login($("#u").value, $("#p").value), new Promise(r => setTimeout(r, 500))]);
  b.classList.remove("load");
  if (m) { $("#err").textContent = m; box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake"); } else start();
}
$("#eye").onclick = () => { const p = $("#p"), s = p.type === "password"; p.type = s ? "text" : "password"; $("#eye").textContent = s ? "Hide" : "Show"; };
$("#go").onclick = submit; $("#p").onkeydown = e => e.key === "Enter" && submit();
if (Auth.ok()) start();
