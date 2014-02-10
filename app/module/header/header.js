(
    function(){
        var moduleName='header';
        
        function controlEvent(e){
            switch(e.target.id){
                case 'close':
                    chrome.app.window.current().close();
                    break;
                case 'min':
                    chrome.app.window.current().minimize();
                    break;
                case 'max':
                    if(chrome.app.window.current().isFullscreen()){
                        chrome.app.window.current().restore();
                        break;
                    }
                    chrome.app.window.current().fullscreen();
                    break;
            }
        }
        
        function render(el){
            el.addEventListener(
                'click',
                controlEvent
            );
            
            el.querySelector('#version').innerText='v'+chrome.runtime.getManifest().version;
        }
        
        exports(moduleName,render);    
    }
)();