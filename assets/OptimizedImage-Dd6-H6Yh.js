import{j as r}from"./vendor-query-B7XoaiUt.js";const c=({src:o,alt:e,className:s,sizes:m="(max-width: 768px) 100vw, 50vw",priority:i=!1,...f})=>{const p=o.includes("images.unsplash.com");let a;if(p){const t=o.split("?")[0];a=`
      ${t}?auto=format&fm=webp&fit=crop&q=60&w=400 400w,
      ${t}?auto=format&fm=webp&fit=crop&q=70&w=800 800w,
      ${t}?auto=format&fm=webp&fit=crop&q=80&w=1200 1200w,
      ${t}?auto=format&fm=webp&fit=crop&q=80&w=1600 1600w
    `}return r.jsx("img",{src:o,alt:e,className:s,loading:i?"eager":"lazy",decoding:"async",fetchPriority:i?"high":"auto",srcSet:a,sizes:a?m:void 0,...f})};export{c as O};
