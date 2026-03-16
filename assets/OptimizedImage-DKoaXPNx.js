import{j as w}from"./index-Dy0PGL6L.js";import"./vendor-react-CUfvpDno.js";const n=({src:o,alt:i,className:s,sizes:r="(max-width: 768px) 100vw, 50vw",...m})=>{const p=o.includes("images.unsplash.com");let a;if(p){const t=o.split("?")[0];a=`
      ${t}?auto=format&fit=crop&q=60&w=400 400w,
      ${t}?auto=format&fit=crop&q=70&w=800 800w,
      ${t}?auto=format&fit=crop&q=80&w=1200 1200w,
      ${t}?auto=format&fit=crop&q=80&w=1600 1600w
    `}return w.jsx("img",{src:o,alt:i,className:s,loading:"lazy",srcSet:a,sizes:r,...m})};export{n as O};
