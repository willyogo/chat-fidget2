import{useRef as t,useState as e}from"react";const r=()=>{let r=t(),[n,c]=e();return{clients:t({}),setChainId:t=>{r.current=t,c(t)},chainId:r,chainIdState:n}};export{r as useSmartWalletChains};
