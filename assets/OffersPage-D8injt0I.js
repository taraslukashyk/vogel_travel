import{c as re,a as I,r as l,j as e,f as ne,S as oe,d as ie,u as H,L as le}from"./index-b2F1vLos.js";import{u as ce}from"./offers-CxKJR_gL.js";import{S as de}from"./SEOHead-ayVSPX0g.js";import{a as me}from"./about-bg-D6nnTOjp.js";import{O as W}from"./OptimizedImage-DwKuQReu.js";import{u as xe}from"./useLanguageContent-B1AY-nho.js";import{C as B,a as pe,f as A}from"./dateUtils-CP1bB7Qc.js";import{C as z,f as k,p as _,u as Y,e as G,D as ue}from"./DayPicker-CJO6bkNT.js";import{s as he}from"./notifications-BNAv5xTH.js";import{e as M}from"./html-Co27hwkg.js";import{S as be}from"./sparkles-CxL9_UkA.js";import{G as ge}from"./globe-CfIcbGL2.js";import{C as Q}from"./chevron-right-CKdD8fRg.js";import{M as q}from"./map-pin-Bxf3UVha.js";import{M as R,C as fe}from"./minus-Bp1b2lj9.js";import{P as O}from"./plus-CvU1of96.js";import{U as we}from"./users-CR8HdFQt.js";import{C as ve}from"./circle-check-DPsMAByB.js";import{L as ye}from"./loader-circle-Qmw_-ZKu.js";import"./useQuery-Brdpymup.js";const je=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],Ne=re("moon",je),V=()=>({mode:"search",departureCity:"",country:"",city:"",dateFrom:"",dateTo:"",nights:"",adults:2,children:0,childAges:[]}),T=({label:t,icon:o,value:d,placeholder:a,onClick:i,active:n,subValue:c,canSearch:x,searchValue:m,onSearchChange:u})=>e.jsxs("button",{onClick:h=>{h.stopPropagation(),i()},className:`relative flex flex-col items-start px-6 py-5 rounded-xl transition-all duration-300 group min-h-[80px] w-full ${n?"bg-white/15 ring-1 ring-white/30 shadow-[0_0_30px_rgba(255,255,255,0.08)]":"bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10"}`,children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 pointer-events-none",children:[e.jsx(o,{size:14,className:`${n?"text-[#5cc8bd]":"text-white/80 group-hover:text-white"} transition-colors`}),e.jsx("span",{className:"text-[10px] uppercase font-montserrat font-black tracking-[0.2em] text-white/70 group-hover:text-white/90",children:t})]}),e.jsxs("div",{className:"flex flex-col items-start overflow-hidden w-full text-left",children:[n&&x?e.jsx("input",{autoFocus:!0,className:"w-full bg-transparent text-sm font-montserrat font-bold text-white border-none outline-none p-0 placeholder:text-white/40 animate-in fade-in duration-300",value:m,onChange:h=>u?.(h.target.value),onClick:h=>h.stopPropagation(),placeholder:d||a}):e.jsx("span",{className:`text-sm font-montserrat font-bold truncate w-full ${d?"text-white":"text-white/40"}`,children:d||a}),c&&!n&&e.jsx("span",{className:"text-[10px] text-[#5cc8bd] font-semibold mt-0.5 truncate w-full",children:c})]}),n&&e.jsx("div",{className:"absolute bottom-0 left-6 right-6 h-0.5 bg-[#5cc8bd] rounded-full shadow-[0_0_12px_rgba(92,200,189,0.8)]"})]}),ke=({filter:t,onChange:o})=>{const{currentLang:d}=I(),a=d==="ua",[i,n]=l.useState(null),[c,x]=l.useState(""),[m,u]=l.useState(""),[h,v]=l.useState(!1),[C,N]=l.useState(!1),[p,y]=l.useState({name:"",phone:"",email:""}),[j,S]=l.useState(new Date),[$,Z]=l.useState(new Date().getFullYear()),E=l.useRef(null),J=l.useMemo(()=>{const s=new Date().getFullYear();return[s,s+1,s+2]},[]),ee=l.useMemo(()=>{const s=[];for(let r=0;r<12;r++)s.push(new Date($,r,1));return s},[$]);l.useEffect(()=>{const s=r=>{E.current&&!E.current.contains(r.target)&&(n(null),x(""),u(""))};return document.addEventListener("mousedown",s),()=>document.removeEventListener("mousedown",s)},[]);const F=l.useCallback(s=>{o({...t,...s})},[t,o]),b=l.useCallback((s,r)=>{F({[s]:r})},[F]),te=l.useMemo(()=>{const s=t.adults===1?a?"1 дорослий":"1 adult":`${t.adults} ${a?"дорослих":"adults"}`,r=t.children>0?` + ${t.children} ${a?t.children===1?"дит.":"дітей":"children"}`:"";return s+r},[t.adults,t.children,a]),ae=async s=>{if(s.preventDefault(),!p.phone&&!p.email||h)return;v(!0);const r=z.find(X=>X.name===t.country||X.name_en===t.country),f=r?r.flag:"",g=t.mode==="search"?a?"🔍 Пошук акцій":"🔍 Deals Search":a?"✨ Індивідуальний підбір":"✨ Individual Quote",w=t.children>0?` (вік: ${t.childAges.slice(0,t.children).join(", ")})`:"",se=["<b>🔍 Запит на підбір туру</b>",`<b>Режим:</b> ${g}`,t.country?`<b>Країна:</b> ${f} ${M(t.country)}`:null,t.city?`<b>Місто:</b> ${M(t.city)}`:null,t.nights?`<b>Ночей:</b> ${t.nights}`:null,`<b>Гості:</b> Дорослі: ${t.adults} | Діти: ${t.children}${w}`,"","<b>👤 Клієнт:</b>",`Ім'я: ${M(p.name||"Anonymous")}`,p.phone?`Телефон: ${M(p.phone)}`:null,p.email?`Email: ${M(p.email)}`:null].filter(Boolean).join(`
`);(await he(se)).success&&(N(!0),y({name:"",phone:"",email:""}),setTimeout(()=>N(!1),5e3)),v(!1)},D=l.useMemo(()=>{const s=[];return z.forEach(r=>{(a?r.cities:r.cities_en).forEach(g=>{s.push({name:g,countryName:a?r.name:r.name_en,flag:r.flag})})}),s},[a]),P=l.useMemo(()=>{if(!c)return z;const s=c.toLowerCase();return z.filter(r=>(a?r.name:r.name_en).toLowerCase().includes(s))},[c,a]),U=l.useMemo(()=>{if(t.country){const r=z.find(w=>(a?w.name:w.name_en)===t.country),f=a?r?.cities||[]:r?.cities_en||[];if(!m)return f.map(w=>({name:w,countryName:t.country,flag:r?.flag||""}));const g=m.toLowerCase();return f.filter(w=>w.toLowerCase().includes(g)).map(w=>({name:w,countryName:t.country,flag:r?.flag||""}))}if(!m)return D;const s=m.toLowerCase();return D.filter(r=>r.name.toLowerCase().includes(s))},[t.country,m,D,a]);return e.jsxs("section",{className:"relative z-30 max-w-[1440px] mx-auto px-4 md:px-12 pointer-events-none",children:[e.jsxs("div",{ref:E,className:"bg-zinc-950/60 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_48px_140px_-20px_rgba(0,0,0,0.9)] p-4 md:p-6 overflow-visible pointer-events-auto",children:[e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center gap-3 mb-6",children:[e.jsx("div",{className:"text-[9px] uppercase font-montserrat font-black tracking-[0.3em] text-white/20 pl-1",children:a?"РЕЖИМ ФІЛЬТРУ":"FILTER MODE"}),e.jsx("div",{className:"flex bg-white/10 p-1.5 rounded-2xl w-fit shadow-lg border border-white/5",children:[{id:"search",label:a?"Пошук акцій":"Deals Search",icon:ne},{id:"custom",label:a?"Індивідуальний підбір":"Full Custom",icon:be}].map(s=>e.jsxs("button",{onClick:()=>{b("mode",s.id),n(null)},className:`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[11px] font-montserrat font-black uppercase tracking-widest transition-all duration-500 relative ${t.mode===s.id?"text-white":"text-white/40 hover:text-white/70"}`,children:[t.mode===s.id&&e.jsx("div",{className:"absolute inset-0 bg-[#5cc8bd] rounded-xl shadow-[0_0_24px_rgba(92,200,189,0.4)] animate-in fade-in zoom-in duration-500"}),e.jsx(s.icon,{size:13,className:"relative z-10"}),e.jsx("span",{className:"relative z-10",children:s.label})]},s.id))})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5",children:[e.jsxs("div",{className:"relative",children:[e.jsx(T,{label:a?"КРАЇНА":"COUNTRY",icon:ge,value:t.country,placeholder:a?"Куди прямуємо?":"Destination?",onClick:()=>n(i==="country"?null:"country"),active:i==="country",canSearch:!0,searchValue:c,onSearchChange:x}),i==="country"&&e.jsx("div",{className:"absolute top-full right-0 z-[100] mt-2 w-[280px] sm:w-[320px] origin-top animate-in fade-in slide-in-from-top-4 duration-300",children:e.jsxs("div",{className:"bg-[#0b1a15] border border-[#5cc8bd]/20 rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] overflow-hidden",children:[e.jsx("div",{className:"p-2 border-b border-[#5cc8bd]/10 bg-[#081210]",children:e.jsx("button",{onClick:()=>{b("country",""),b("city",""),n(null),x("")},className:"w-full text-left px-4 py-2 text-[10px] text-[#5cc8bd] font-black uppercase tracking-widest hover:bg-white/5 rounded-lg transition-colors",children:a?"Всі країни":"All countries"})}),e.jsx("div",{className:"max-h-[300px] overflow-y-auto custom-scrollbar p-2",children:P.length===0?e.jsx("div",{className:"px-6 py-8 text-center text-xs text-white/20 italic",children:a?"Нічого не знайдено":"Nothing found"}):P.map(s=>e.jsxs("button",{onClick:()=>{F({country:a?s.name:s.name_en,city:""}),n("city"),x("")},className:"w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-[#5cc8bd]/10 hover:text-[#5cc8bd] transition-all group text-left",children:[e.jsx("span",{className:"text-xl group-hover:scale-125 transition-transform duration-300",children:s.flag}),e.jsx("span",{className:"flex-1",children:a?s.name:s.name_en}),e.jsx(Q,{size:14,className:"opacity-20 group-hover:opacity-100 transition-opacity"})]},s.code))})]})})]}),e.jsxs("div",{className:"relative",children:[e.jsx(T,{label:a?"МІСТО / РЕГІОН":"CITY / REGION",icon:q,value:t.city,placeholder:a?"Всі регіони":"All regions",onClick:()=>n(i==="city"?null:"city"),active:i==="city",canSearch:!0,searchValue:m,onSearchChange:u}),i==="city"&&e.jsx("div",{className:"absolute top-full lg:left-0 right-0 lg:right-auto z-[100] mt-2 w-[280px] sm:w-[320px] origin-top animate-in fade-in slide-in-from-top-4 duration-300",children:e.jsxs("div",{className:"bg-[#0b1a15] border border-[#5cc8bd]/20 rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] overflow-hidden",children:[e.jsx("div",{className:"p-2 border-b border-[#5cc8bd]/10 bg-[#081210]",children:e.jsx("button",{onClick:()=>{b("city",""),n(null),u("")},className:"w-full text-left px-4 py-2 text-[10px] text-[#5cc8bd] font-black uppercase tracking-widest hover:bg-white/5 rounded-lg transition-colors",children:a?"Всі регіони":"All regions"})}),e.jsx("div",{className:"max-h-[300px] overflow-y-auto custom-scrollbar p-2",children:U.length===0?e.jsx("div",{className:"px-6 py-8 text-center text-xs text-white/20 italic",children:a?"Нічого не знайдено":"Nothing found"}):U.map((s,r)=>e.jsxs("button",{onClick:()=>{b("country",s.countryName),b("city",s.name),n(null),u("")},className:"w-full flex flex-col items-start px-4 py-3 rounded-xl hover:bg-[#5cc8bd]/10 transition-all group text-left",children:[e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("span",{className:"text-sm font-medium text-white/70 group-hover:text-[#5cc8bd]",children:s.name}),e.jsx("span",{className:"text-lg opacity-40 group-hover:opacity-100 transition-all",children:s.flag})]}),e.jsx("span",{className:"text-[10px] text-white/20 uppercase font-bold tracking-widest",children:s.countryName})]},r))})]})})]}),e.jsxs("div",{className:"relative",children:[e.jsx(T,{label:a?"ВІДПРАВЛЕННЯ":"DEPARTURE",icon:B,value:t.dateFrom?`${k(_(t.dateFrom),"dd.MM")} — ${t.dateTo?k(_(t.dateTo),"dd.MM"):"..."}`:"",placeholder:a?"Дати":"Dates",onClick:()=>n(i==="dates"?null:"dates"),active:i==="dates"}),i==="dates"&&e.jsx("div",{className:"absolute top-full right-0 z-[100] mt-2 w-[320px] sm:w-[600px] origin-top animate-in fade-in slide-in-from-top-4 duration-500",children:e.jsxs("div",{className:"bg-[#0b1a15] border border-[#5cc8bd]/20 rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col sm:flex-row min-h-[460px]",children:[e.jsxs("div",{className:"w-full sm:w-44 bg-[#081210] border-b sm:border-b-0 sm:border-r border-[#5cc8bd]/10 flex flex-col",children:[e.jsx("div",{className:"flex border-b border-[#5cc8bd]/10 px-2 py-2 gap-1",children:J.map(s=>e.jsx("button",{onClick:()=>{Z(s),S(new Date(s,j.getMonth(),1))},className:`flex-1 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all ${$===s?"bg-[#5cc8bd] text-black":"text-white/40 hover:text-white hover:bg-white/5"}`,children:s},s))}),e.jsx("div",{className:"flex-1 overflow-y-auto custom-scrollbar py-1",children:ee.map((s,r)=>{const f=s.getMonth()===j.getMonth()&&s.getFullYear()===j.getFullYear();return e.jsxs("button",{onClick:()=>S(s),className:`w-full text-left px-5 py-2.5 transition-all flex items-center justify-between ${f?"bg-[#5cc8bd] text-black font-black":"text-white/50 hover:text-white hover:bg-white/5"}`,children:[e.jsx("span",{className:"text-[11px] uppercase font-bold tracking-wider",children:k(s,"LLLL",{locale:a?Y:G})}),f&&e.jsx("div",{className:"w-1.5 h-1.5 bg-black rounded-full"})]},r)})})]}),e.jsxs("div",{className:"flex-1 p-5 flex flex-col justify-between",children:[e.jsx("div",{children:e.jsx(ue,{mode:"range",month:j,onMonthChange:S,selected:{from:t.dateFrom?_(t.dateFrom):void 0,to:t.dateTo?_(t.dateTo):void 0},onSelect:s=>{o({...t,dateFrom:s?.from?k(s.from,"yyyy-MM-dd"):"",dateTo:s?.to?k(s.to,"yyyy-MM-dd"):""})},locale:a?Y:G,className:"calendar-premium-v2",showOutsideDays:!1})}),e.jsxs("div",{className:"mt-4 pt-4 border-t border-[#5cc8bd]/10 flex items-center justify-between gap-4",children:[e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-[8px] font-black text-white/30 uppercase tracking-widest",children:a?"ВИЛІТ":"DEPARTURE"}),e.jsx("span",{className:"text-sm font-bold text-[#5cc8bd]",children:t.dateFrom?k(_(t.dateFrom),"dd MMM"):"—"})]}),e.jsx("div",{className:"text-white/20 flex items-center",children:"→"}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-[8px] font-black text-white/30 uppercase tracking-widest",children:a?"ПОВЕРНЕННЯ":"RETURN"}),e.jsx("span",{className:"text-sm font-bold text-[#5cc8bd]",children:t.dateTo?k(_(t.dateTo),"dd MMM"):"—"})]})]}),e.jsx("button",{onClick:()=>n(null),className:"bg-[#5cc8bd] hover:bg-[#4eb1a6] text-black font-black text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 rounded-xl shadow-lg shadow-[#5cc8bd]/20 transition-all active:scale-95",children:a?"Застосувати":"Apply"})]})]})]})})]}),e.jsxs("div",{className:"relative",children:[e.jsx(T,{label:a?"НОЧЕЙ":"NIGHTS",icon:Ne,value:t.nights?`${t.nights}`:"",placeholder:"7 - 14",onClick:()=>n(i==="nights"?null:"nights"),active:i==="nights"}),i==="nights"&&e.jsx("div",{className:"absolute top-full left-0 z-[100] mt-2 w-[280px] sm:w-[340px] origin-top animate-in fade-in slide-in-from-top-4 duration-300",children:e.jsxs("div",{className:"bg-[#0b1a15] border border-[#5cc8bd]/20 rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] p-8 flex flex-col items-center gap-10",children:[e.jsxs("div",{className:"flex items-center gap-10",children:[e.jsx("button",{onClick:s=>{s.stopPropagation(),b("nights",Math.max(1,Number(t.nights||7)-1))},className:"w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-all group scale-100 active:scale-90",children:e.jsx(R,{size:20})}),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx("span",{className:"text-5xl font-montserrat font-black text-white leading-none",children:t.nights||7}),e.jsx("span",{className:"text-[10px] font-bold text-white/20 uppercase tracking-widest",children:a?"ночей":"nights"})]}),e.jsx("button",{onClick:s=>{s.stopPropagation(),b("nights",Math.min(30,Number(t.nights||7)+1))},className:"w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-all group scale-100 active:scale-90",children:e.jsx(O,{size:20})})]}),e.jsx("button",{onClick:()=>n(null),className:"w-full py-4 bg-[#5cc8bd] text-black rounded-xl text-xs font-black uppercase tracking-[0.3em] shadow-lg shadow-[#5cc8bd]/20 hover:bg-[#4eb1a6] transition-all active:scale-95",children:a?"Застосувати":"Apply"})]})})]}),e.jsxs("div",{className:"relative",children:[e.jsx(T,{label:a?"ГОСТІ":"GUESTS",icon:we,value:te,placeholder:a?"Склад родини":"Family",onClick:()=>n(i==="guests"?null:"guests"),active:i==="guests"}),i==="guests"&&e.jsx("div",{className:"absolute top-full right-0 z-[100] mt-2 w-[340px] sm:w-[420px] origin-top animate-in fade-in slide-in-from-top-4 duration-300",children:e.jsxs("div",{className:"bg-[#0b1a15] border border-[#5cc8bd]/20 rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] p-6 space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-[11px] font-black text-white uppercase tracking-wider",children:a?"ДОРОСЛІ":"ADULTS"}),e.jsx("p",{className:"text-[10px] text-white/30 italic",children:"16+ years"})]}),e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("button",{onClick:()=>b("adults",Math.max(1,t.adults-1)),className:"w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors",children:e.jsx(R,{size:14})}),e.jsx("span",{className:"w-6 text-center text-sm font-black text-white",children:t.adults}),e.jsx("button",{onClick:()=>b("adults",Math.min(9,t.adults+1)),className:"w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors",children:e.jsx(O,{size:14})})]})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-[11px] font-black text-white uppercase tracking-wider",children:a?"ДІТИ":"CHILDREN"}),e.jsx("p",{className:"text-[10px] text-white/30 italic",children:"0 - 15 years"})]}),e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("button",{onClick:()=>b("children",Math.max(0,t.children-1)),className:"w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors",children:e.jsx(R,{size:14})}),e.jsx("span",{className:"w-6 text-center text-sm font-bold text-white",children:t.children}),e.jsx("button",{onClick:()=>b("children",Math.min(6,t.children+1)),className:"w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors",children:e.jsx(O,{size:14})})]})]}),t.children>0&&e.jsxs("div",{className:"pt-4 border-t border-white/5 space-y-3",children:[e.jsx("p",{className:"text-[9px] text-white/40 uppercase font-black text-center tracking-widest",children:a?"Вкажіть вік кожної дитини":"Specify each child age"}),e.jsx("div",{className:"grid grid-cols-3 gap-2",children:Array.from({length:t.children}).map((s,r)=>e.jsxs("div",{className:"bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 hover:border-[#5cc8bd]/30 group transition-all relative",children:[e.jsx("label",{className:"text-[8px] text-white/30 uppercase font-bold block mb-1",children:a?`Дитина ${r+1}`:`Kid ${r+1}`}),e.jsxs("div",{className:"relative",children:[e.jsx("select",{value:t.childAges[r]||0,onChange:f=>{const g=[...t.childAges];g[r]=parseInt(f.target.value),b("childAges",g)},className:"w-full bg-transparent text-white text-xs font-bold outline-none cursor-pointer appearance-none relative z-10 pr-5",children:[...Array(16)].map((f,g)=>e.jsxs("option",{value:g,className:"bg-zinc-900 text-white",children:[g," ",a?"р.":"y."]},g))}),e.jsx(fe,{size:11,className:"absolute right-0 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-[#5cc8bd] pointer-events-none transition-colors"})]})]},r))})]}),e.jsx("button",{onClick:()=>n(null),className:"w-full py-4 bg-[#5cc8bd] text-black rounded-xl text-xs font-black uppercase tracking-[0.3em] shadow-lg shadow-[#5cc8bd]/10 hover:bg-[#4eb1a6] transition-all active:scale-95",children:a?"Застосувати":"Apply"})]})})]})]}),e.jsx("div",{className:"pt-6 border-t border-white/10 relative overflow-hidden",children:C?e.jsxs("div",{className:"flex flex-col items-center justify-center py-6 animate-in fade-in slide-in-from-bottom duration-1000",children:[e.jsx("div",{className:"w-16 h-16 rounded-3xl bg-[#5cc8bd]/10 flex items-center justify-center text-[#5cc8bd] shadow-[0_0_50px_rgba(92,200,189,0.2)] mb-4",children:e.jsx(ve,{size:40,className:"animate-in zoom-in spin-in-12 duration-1000"})}),e.jsxs("div",{className:"text-center",children:[e.jsx("h3",{className:"text-white font-montserrat font-black uppercase tracking-[0.3em] text-xl mb-2",children:a?"ВАШ ЗАПИТ ПРИЙНЯТИЙ":"REQUEST ACCEPTED"}),e.jsx("p",{className:"text-white/40 text-sm font-medium",children:a?"Персональний менеджер звʼяжеться з вами найближчим часом":"A personal manager will contact you shortly"})]})]}):e.jsx("div",{className:"flex flex-col items-center",children:e.jsxs("form",{onSubmit:ae,className:"w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch",children:[e.jsx("input",{type:"text",name:"name",autoComplete:"name",placeholder:a?"ВАШЕ ІМ'Я":"YOUR NAME",value:p.name,onChange:s=>y({...p,name:s.target.value}),className:"bg-white/[0.03] border border-white/10 rounded-xl px-6 py-5 text-sm text-white focus:bg-white/[0.08] focus:border-[#5cc8bd] outline-none transition-all placeholder:text-white/40 font-bold tracking-wide"}),e.jsx("input",{type:"tel",name:"tel",autoComplete:"tel",placeholder:"+380 XX XXX XX XX",value:p.phone,onChange:s=>y({...p,phone:s.target.value}),className:"bg-white/[0.03] border border-white/10 rounded-xl px-6 py-5 text-sm text-white focus:bg-white/[0.08] focus:border-[#5cc8bd] outline-none transition-all placeholder:text-white/40 font-bold tracking-wide"}),e.jsx("input",{type:"email",name:"email",autoComplete:"email",placeholder:"EMAIL",value:p.email,onChange:s=>y({...p,email:s.target.value}),className:"bg-white/[0.03] border border-white/10 rounded-xl px-6 py-5 text-sm text-white focus:bg-white/[0.08] focus:border-[#5cc8bd] outline-none transition-all placeholder:text-white/40 font-bold tracking-wide"}),e.jsxs("button",{type:"submit",disabled:h||!p.phone&&!p.email,className:"group bg-white hover:bg-[#5cc8bd] text-black px-8 py-5 rounded-xl transition-all duration-700 flex items-center justify-center gap-4 relative overflow-hidden active:scale-95 disabled:opacity-30 disabled:pointer-events-none",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer"}),e.jsx("span",{className:"text-[13px] font-montserrat font-black uppercase tracking-[0.3em] relative z-10",children:h?"...":a?"ОТРИМАТИ ПРОПОЗИЦІЮ":"GET PROPOSAL"}),h?e.jsx(ye,{size:18,className:"animate-spin relative z-10"}):e.jsx("div",{className:"relative w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500",children:e.jsx(oe,{size:18,className:"absolute inset-0"})})]})]})})})]}),e.jsx("style",{children:`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          transition: background 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5cc8bd;
        }
        
        /* Premium Calendar Styles */
        .calendar-premium {
          --rdp-accent-color: #5cc8bd;
          --rdp-accent-color-dark: #4eb1a6;
          --rdp-background-color: transparent;
          --rdp-outline: 2px solid var(--rdp-accent-color);
          --rdp-outline-selected: 2px solid var(--rdp-accent-color);
          --rdp-selected-color: #000;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          margin: 0;
        }
        .calendar-premium .rdp-day {
          border-radius: 8px;
          transition: all 0.2s;
          font-size: 13px;
          font-weight: 500;
        }
        .calendar-premium .rdp-day:hover:not(.rdp-day_selected) {
          background: rgba(92, 200, 189, 0.1) !important;
          color: #5cc8bd;
        }
        .calendar-premium .rdp-day_selected {
          background: #5cc8bd !important;
          color: #000 !important;
          font-weight: 800;
        }
        .calendar-premium .rdp-day_range_middle {
          background: rgba(92, 200, 189, 0.15) !important;
          color: #fff !important;
          border-radius: 0;
        }
        .calendar-premium .rdp-month_caption {
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 11px;
          color: #5cc8bd;
          margin-bottom: 1rem;
        }
        .calendar-premium .rdp-weekday {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.05em;
        }
        .calendar-premium .rdp-nav_button {
          color: rgba(255, 255, 255, 0.4);
        }
        .calendar-premium .rdp-nav_button:hover {
          color: #5cc8bd;
          background: rgba(255, 255, 255, 0.05);
        }

        /* V2 Split Calendar — Deep Forest Green */
        .calendar-premium-v2 {
          --rdp-accent-color: #5cc8bd;
          --rdp-selected-color: #000;
          color: #e0f7f5;
          font-family: 'Montserrat', sans-serif;
          width: 100%;
        }
        .calendar-premium-v2 table {
          width: 100%;
          border-collapse: collapse;
        }
        .calendar-premium-v2 .rdp-day {
          height: 40px;
          width: 40px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          transition: all 0.15s;
          border-radius: 6px;
          padding: 0;
          text-align: center;
          vertical-align: middle;
        }
        .calendar-premium-v2 .rdp-day_button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          cursor: pointer;
          border-radius: 6px;
          background: none;
          border: none;
          color: inherit;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 0;
          transition: all 0.15s;
        }
        .calendar-premium-v2 .rdp-day_button:hover {
          background-color: rgba(92, 200, 189, 0.2);
          color: #5cc8bd;
        }
        .calendar-premium-v2 .rdp-day_today .rdp-day_button {
          color: #5cc8bd;
          font-weight: 800;
        }
        .calendar-premium-v2 .rdp-month_caption {
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #5cc8bd;
          padding: 6px 0 12px;
          text-align: center;
          font-size: 13px;
        }

        /* Essential v9 Range Styling */
        .calendar-premium-v2 .rdp-selected {
          background: none !important;
        }

        .calendar-premium-v2 .rdp-range_start .rdp-day_button {
          background-color: #5cc8bd !important;
          color: #000 !important;
          font-weight: 900 !important;
          border-radius: 8px 0 0 8px !important;
          width: 100% !important;
        }

        .calendar-premium-v2 .rdp-range_end .rdp-day_button {
          background-color: #5cc8bd !important;
          color: #000 !important;
          font-weight: 900 !important;
          border-radius: 0 8px 8px 0 !important;
          width: 100% !important;
        }

        .calendar-premium-v2 .rdp-range_middle {
          background-color: rgba(92, 200, 189, 0.15) !important;
        }

        .calendar-premium-v2 .rdp-range_middle .rdp-day_button {
          color: #c8f0ec !important;
          width: 100% !important;
          border-radius: 0 !important;
        }

        .calendar-premium-v2 .rdp-range_start.rdp-range_end .rdp-day_button {
          border-radius: 8px !important;
        }

        /* Outside days hidden */
        .calendar-premium-v2 .rdp-day_outside {
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .calendar-premium-v2 .rdp-nav { display: none; }
        .calendar-premium-v2 .rdp-weekday {
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          color: rgba(92, 200, 189, 0.45);
          padding-bottom: 8px;
          letter-spacing: 0.08em;
          text-align: center;
        }
        .calendar-premium-v2 th,
        .calendar-premium-v2 td {
          text-align: center;
          padding: 2px;
        }
      `})]})};function K(){const t=l.useRef(null);return l.useEffect(()=>{const o=t.current;if(!o)return;const d=new IntersectionObserver(([a])=>{a.isIntersecting&&(o.classList.add("opacity-100","translate-y-0"),o.classList.remove("opacity-0","translate-y-10"),d.disconnect())},{threshold:.12});return d.observe(o),()=>d.disconnect()},[]),t}function L(t){if(!t)return null;const o=/^\d{4}-\d{2}-\d{2}$/.test(t)?t:null;return o?new Date(o):null}function _e(t){const o=new Date(t.stayFrom||t.stay_from||""),d=new Date(t.stayTo||t.stay_to||"");return isNaN(o.getTime())||isNaN(d.getTime())?0:Math.round((d.getTime()-o.getTime())/864e5)}function Ce(t,o,d){return o.mode==="custom"?t:t.filter(a=>{const i=d?a.country||"":a.country_en||a.country||"",n=d?a.city||"":a.city_en||a.city||"";if(o.country&&!i.toLowerCase().includes(o.country.toLowerCase())||o.city&&!n.toLowerCase().includes(o.city.toLowerCase()))return!1;if(o.dateFrom){const c=L(a.stayFrom||a.stay_from||""),x=L(a.stayTo||a.stay_to||""),m=L(o.dateFrom),u=o.dateTo?L(o.dateTo):m;if(c&&x&&m&&u&&(x<m||c>u))return!1}if(o.nights!==""){const c=_e(a);if(c>0&&Math.abs(c-Number(o.nights))>2)return!1}return!0})}const Se=({offer:t,idx:o})=>{const d=K(),{l:a,currentLang:i}=I(),{t:n}=xe(),{t:c}=H(),x=i==="ua",m=n(t,"hotel"),u=n(t,"location"),h=n(t,"book_by"),v=n(t,"stay_from"),C=n(t,"stay_to"),N=n(t,"discount"),p=n(t,"slug"),y=x?t.country:t.country_en||t.country,j=x?t.city:t.city_en||t.city,S=y&&j?`${y}, ${j}`:y||j||u;return e.jsx("div",{ref:d,id:`offer-${p}`,className:"opacity-0 translate-y-10 transition-all duration-700 ease-out scroll-mt-32 h-full",style:{transitionDelay:`${o*100}ms`},children:e.jsx(le,{to:a(`/offers/${p}`),className:"block h-full group",children:e.jsxs("article",{className:"bg-[#0b1a15]/40 backdrop-blur-md border border-[#5cc8bd]/10 rounded-none overflow-hidden hover:bg-[#0b1a15]/60 md:hover:-translate-y-2 transition-all duration-700 flex flex-col h-full group/card shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]",children:[e.jsxs("div",{className:"relative h-60 overflow-hidden",children:[e.jsx(W,{src:t.image,alt:n(t,"image_alt")||m,className:"w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-all duration-1000 group-hover/card:scale-110",sizes:"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-[#0b1a15] via-[#0b1a15]/20 to-transparent"}),N&&e.jsx("div",{className:"absolute top-5 right-5 bg-[#5cc8bd] text-black font-montserrat font-black text-[13px] px-5 py-2 rounded-none shadow-[0_10px_20px_rgba(92,200,189,0.3)] tracking-wider",children:N}),e.jsxs("div",{className:"absolute bottom-5 left-5 flex items-center gap-2 text-[#5cc8bd] text-[10px] font-montserrat font-black uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md px-4 py-2 rounded-none border border-white/5",children:[e.jsx(q,{className:"w-3.5 h-3.5",strokeWidth:2.5}),S]})]}),e.jsxs("div",{className:"flex-1 p-8 flex flex-col gap-6",children:[e.jsx("h2",{className:"font-montserrat font-black text-xl text-white leading-tight group-hover/card:text-[#5cc8bd] transition-colors duration-500 tracking-tight",children:m}),e.jsxs("div",{className:"space-y-0 mt-auto border-t border-[#5cc8bd]/10 pt-6 divide-y divide-[#5cc8bd]/5",children:[e.jsxs("div",{className:"flex items-center gap-4 text-white/60 py-4 group/item",children:[e.jsx("div",{className:"w-10 h-10 rounded-none bg-[#5cc8bd]/5 flex items-center justify-center text-[#5cc8bd] group-hover/item:bg-[#5cc8bd] group-hover/item:text-black transition-all duration-300",children:e.jsx(pe,{className:"w-5 h-5",strokeWidth:1.5})}),e.jsxs("div",{className:"flex flex-col gap-0.5 leading-tight",children:[e.jsx("span",{className:"font-inter text-[10px] font-black uppercase tracking-[0.1em] text-white/30",children:c("offers.book_by")}),e.jsx("strong",{className:"text-white/90 font-bold text-[15px] font-montserrat",children:A(h)})]})]}),e.jsxs("div",{className:"flex items-center gap-4 text-white/60 py-4 group/item",children:[e.jsx("div",{className:"w-10 h-10 rounded-none bg-[#5cc8bd]/5 flex items-center justify-center text-[#5cc8bd] group-hover/item:bg-[#5cc8bd] group-hover/item:text-black transition-all duration-300",children:e.jsx(B,{className:"w-5 h-5",strokeWidth:1.5})}),e.jsxs("div",{className:"flex flex-col gap-0.5 leading-tight",children:[e.jsx("span",{className:"font-inter text-[10px] font-black uppercase tracking-[0.1em] text-white/30",children:c("offers.stay_period")}),e.jsxs("strong",{className:"text-white/90 font-bold text-[15px] font-montserrat tracking-tight",children:[A(v)," — ",A(C)]})]})]}),N&&e.jsxs("div",{className:"flex items-center justify-between py-4",children:[e.jsx("span",{className:"font-inter text-[14px] text-white/30 font-bold uppercase tracking-widest",children:c("common.discount")}),e.jsx("span",{className:"font-montserrat font-black text-[#5cc8bd] text-2xl tracking-tight",children:N})]})]}),e.jsxs("div",{className:"mt-2 w-full bg-[#5cc8bd] text-black font-montserrat uppercase tracking-[0.2em] text-[11px] font-black py-4 hover:bg-white transition-all duration-500 rounded-none text-center flex items-center justify-center gap-3 group/btn",children:[e.jsx("span",{children:c("common.details")}),e.jsx(Q,{size:14,className:"group-hover/btn:translate-x-1 transition-transform"})]})]})]})})})},Qe=()=>{const{data:t=[]}=ce(),[o,d]=l.useState(!0),[a,i]=l.useState(V()),n=ie(),{currentLang:c}=I(),{t:x}=H(),m=c==="ua",u=Ce(t,a,m);l.useEffect(()=>{window.scrollTo(0,0)},[n]),l.useEffect(()=>{const v=setTimeout(()=>d(!1),2e3);return()=>clearTimeout(v)},[]);const h=K();return e.jsxs("main",{className:"w-full bg-zinc-950/95 text-white selection:bg-[#5cc8bd]/30 min-h-screen overflow-hidden relative",children:[e.jsx(de,{pagePath:`/${c}/offers`,fallbackTitle:x("nav.offers")+" — Vogel Family Travel",fallbackDescription:x("offers.subtitle")}),e.jsxs("div",{className:"fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0",children:[e.jsx("video",{className:"w-full h-full object-cover opacity-20",poster:me,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,preload:"metadata",children:e.jsx("source",{src:"/about-video.mp4",type:"video/mp4"})}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10"})]}),e.jsxs("section",{className:"relative w-full min-h-[640px] md:h-[85vh] overflow-hidden flex flex-col-reverse md:flex-col justify-start md:justify-between pt-24 md:pt-0",children:[e.jsx(W,{src:"https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1920",alt:"Offers hero",className:"absolute inset-0 w-full h-full object-cover opacity-100",sizes:"100vw"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"}),e.jsx("div",{className:"relative z-20 pt-2 md:pt-32 pb-8",children:e.jsx(ke,{filter:a,onChange:i})}),e.jsxs("div",{className:"relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-8 md:pb-20 w-full",children:[e.jsxs("h1",{className:"font-montserrat font-extrabold uppercase tracking-tight leading-none",children:[e.jsx("span",{className:"block text-white/30 text-xl md:text-2xl lg:text-3xl mb-1 md:mb-2",children:"Vogel Family Travel"}),e.jsx("span",{className:"block text-4xl md:text-7xl lg:text-[88px] text-white",children:x("nav.offers")})]}),e.jsxs("div",{className:`absolute bottom-6 md:bottom-10 right-10 flex flex-col items-center gap-2 transition-opacity duration-[2000ms] ease-in-out ${o?"opacity-100 animate-pulse":"opacity-0 pointer-events-none"}`,children:[e.jsx("span",{className:"text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase",children:c==="ua"?"Гортай":"Scroll"}),e.jsx("div",{className:"scroll-indicator"})]})]})]}),e.jsx("section",{className:"relative z-10 bg-zinc-950 border-y border-white/5 py-14",children:e.jsxs("div",{ref:h,className:"opacity-0 translate-y-10 transition-all duration-700 ease-out max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center",children:[e.jsxs("div",{children:[e.jsxs("h2",{className:"font-montserrat font-bold text-3xl md:text-4xl text-white flex items-center gap-4 mb-6",children:[e.jsx("span",{className:"w-8 h-px bg-white/30"}),x("offers.title")]}),e.jsx("p",{className:"font-inter text-white/70 text-lg leading-relaxed",children:x("offers.subtitle")})]}),e.jsx("div",{children:e.jsx("p",{className:"font-inter text-white/50 text-base leading-relaxed border-l border-white/10 pl-8",children:c==="ua"?"Кожна пропозиція перевірена нашими менеджерами особисто. Ми гарантуємо відповідність заявленого рівня сервісу та захист інтересів клієнта на кожному етапі бронювання.":"Each offer is personally verified by our managers. We guarantee compliance with the stated level of service and protection of client interests at every stage of booking."})})]})}),e.jsx("section",{className:"relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-24",children:u.length===0&&a.mode==="search"?e.jsxs("div",{className:"text-center py-20",children:[e.jsx("p",{className:"font-montserrat font-bold text-white/40 text-xl uppercase tracking-widest",children:m?"Не знайдено пропозицій за заданими критеріями":"No offers match your criteria"}),e.jsx("button",{onClick:()=>i(V()),className:"mt-6 text-[#5cc8bd] text-sm font-inter underline hover:no-underline",children:m?"Скинути фільтр":"Reset filter"})]}):e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7",children:u.map((v,C)=>e.jsx(Se,{offer:v,idx:C},v.id))})})]})};export{Qe as default};
