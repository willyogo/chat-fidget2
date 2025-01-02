import{useState as t,useEffect as r}from"react";const e=e=>{let[c,o]=t();return r((()=>{e().then((t=>{o(t)})).catch((()=>{}))}),[]),c};export{e as useAsyncValue};
