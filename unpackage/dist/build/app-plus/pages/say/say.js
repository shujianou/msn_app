
      !(function(){
        var uniAppViewReadyCallback = function(){
          setCssToHead(["body { background: #ccc; }\n.",[1],"place { margin-top: var(--status-bar-height); height: ",[0,100],"; }\n.",[1],"uni-textarea{ padding: 0 2.5vw 2.5vw 2.5vw; margin: 0 2.5 2.5vw 2.5vw; width: 95%; background-color: #fff; }\n.",[1],"loginbtn .",[1],"_button { margin-top: ",[0,20],"; height: ",[0,88],"; width: 100%; line-height: ",[0,88],"; color: white; font-size: ",[0,32],"; border-radius: ",[0,44],"; outline: 0; display: block; margin: 0; font-family: inherit; background: #FFBD27; opacity: 0.8; }\n",],undefined,{path:"./pages/say/say.wxss"})();
document.dispatchEvent(new CustomEvent("generateFuncReady", { detail: { generateFunc: $gwx('./pages/say/say.wxml') } }));
        }
        if(window.__uniAppViewReady__){
          uniAppViewReadyCallback()
        }else{
          document.addEventListener('uniAppViewReady',uniAppViewReadyCallback)
        }
      })();
      