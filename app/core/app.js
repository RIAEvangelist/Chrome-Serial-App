var app=(
    function(){

/************\
    Scope
\************/
        var config={
            modulesPath : 'app/module/'
        }
        
        var modules,
            constructors={},
            moduleQueue = {},
            events=[],
            dataStore={
                hasWebkitSpeech:(document.createElement("input").hasOwnProperty('webkitSpeech')),
                hasSpeech:(document.createElement("input").hasOwnProperty('speech')),
                HTML:{}
            }
        
        function setConfig(userConfig){
            for(var property in userConfig){
                if(!userConfig.hasOwnProperty('property'))
                    return;
                
                config[property] = userConfig[property];
            }
        }

/************\
    Modules
\************/
        function getModules(){
            modules=document.getElementsByClassName('appModule');
        }
        
        function buildModules(elements){
            if(!elements){
                elements=modules;
                if(!elements)
                    elements=[];
            }
            
            if( !elements[0])
                elements=[elements];
            
            if( !elements[0].getAttribute)
                return;
            
            var moduleCount=elements.length;
            
            for(var i=0; i<moduleCount; i++){
                var el=elements[i];
                var moduleType=el.getAttribute('data-moduletype');
                
                if(!constructors[moduleType]){
                    (
                        function(config,moduleType,moduleQueue,el){
                            setTimeout(
                                function(){
                                    if(moduleQueue[moduleType])
                                        return;
                                    
                                    var module=config.modulesPath+moduleType+'/'+moduleType;
                                    moduleQueue[moduleType]=true;
                                    
                                    var js = document.createElement('script');
                                    js.setAttribute('async', true);
                                    js.setAttribute('src', module+'.js');
                                    document.head.appendChild(js);
                                    
                                    if(el.getAttribute('data-css')!='true')
                                        return;
                                    
                                    var css = document.createElement('link');
                                    css.rel='stylesheet'; 
                                    css.type='text/css'; 
                                    css.setAttribute('href', module+'.css');
                                    document.head.appendChild(css);
                                }
                                ,0
                            );
                        }
                    )(config,moduleType,moduleQueue,el);
                    
                    if(el.getAttribute('data-html')=='true')
                        fetchModuleHTML(moduleType);
                    
                    continue;
                }
                
                if(app.data.HTML[moduleType])
                    HTMLLoaded(el,moduleType);
                
                if(
                    (el.innerHTML!='' && el.getAttribute('data-html')=='true') ||
                    el.getAttribute('data-html')!='true')
                {
                    constructors[moduleType](el);
                    continue;
                }else{
                    (
                        function(){
                            setTimeout(
                                function(){
                                    console.log(el);
                                    buildModules(el);
                                },
                                50
                            )
                        }
                    )(el)
                }
            }
        }
        
        function fetchModuleHTML(moduleType){
            var xmlhttp;
                xmlhttp=new XMLHttpRequest();
            
            (
                function(){
                    xmlhttp.onreadystatechange=function(){
                        if (xmlhttp.readyState==4 && xmlhttp.status==200){
                            dataStore.HTML[moduleType]=xmlhttp.responseText;
                            HTMLLoaded(
                                document.querySelectorAll('[data-moduletype="'+moduleType+'"]'),
                                moduleType
                            );
                        }
                    }
                }
            )(moduleType);
            
            xmlhttp.open('GET',config.modulesPath+moduleType+'/'+moduleType+'.html',true);
            xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
            xmlhttp.send();
        }
        
        function HTMLLoaded(modules,moduleType){
            if(!modules.length)
                modules=[modules];
            var totalModules=modules.length;
            for(var i=0; i<totalModules; i++){
                var module=modules[i];
                module.innerHTML=dataStore.HTML[moduleType];
                findAndInitDynamicModules(module);
            }
        }
        
        function deferredLoad(type){
            buildModules(document.querySelectorAll('[data-moduletype="'+type+'"]'));
        }
        
        function appendDOMNode(el){
            (
                function(){
                    setTimeout(
                        function(){
                            document.querySelector(
                                el.getAttribute('data-dompath')
                            ).appendChild(el);
                        }
                        ,0
                    );
                }
            )(el);
        }
        
        function checkModuleExists(moduleType){
            return !!!constructors[moduleType];
        }
        
        function findAndInitDynamicModules(parent){
            buildModules(parent.querySelectorAll('[data-moduletype]'));
        }
        
        function addConstructor(type, moduleInit){
            if(constructors[type])
                return;
            constructors[type] = moduleInit;
            if(document.readyState == 'complete')
                deferredLoad(type);
        }
        
        function initModules(){
            switch(document.readyState){ 
                case 'interactive' :
                    //dom not yet ready
                    break;
                case 'complete' :
                    getModules();
                    buildModules();
                    break;
            }
        }

/************\
    Events
\************/
        function registerEvent(eventName,handler){
            if(!events[eventName])
                events[eventName]=[];
				
            events[eventName].push(handler);
        }
		
        function removeEvent(eventName){
            delete events[eventName]
        }
		
        function triggerEvent(eventName){
            if(!events[eventName])
                return;
            
            var totalEvents=events[eventName].length,
                args=Array.prototype.slice.call(arguments,1);
            
            for(var i=0; i<totalEvents; i++){
                (
                    function(event){
                        setTimeout(
                            function(){
                                event.apply(null,args);
                            }
                            ,0
                        );
                    }
                )(events[eventName][i],args);
            }
        }
        
        window.exports=addConstructor;
        document.onreadystatechange=initModules;
        
        return {
            register        : addConstructor,
            build           : buildModules,
            inject          : appendDOMNode,
            config          : setConfig,
            on              : registerEvent,
            off             : removeEvent,
            trigger         : triggerEvent,
            exists          : checkModuleExists,
            data            : dataStore
        }

    }
)();