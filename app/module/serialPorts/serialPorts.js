(
    function(){
        var moduleName='serialPorts',
            portTemplate='<li path="${path}">${path}</li>',
            fetchPorts=false,
            openPort=false;
        
        function showPorts(ports){
            var n=ports.length;
            var list=document.getElementsByClassName('serialPorts-list')[0],
                portList='';
            document.querySelector('body').classList.remove('working');
            for(var i=0; i<n; i++){
                portList+=portTemplate.replace(/\$\{path\}/g,ports[i].path);
            }
            list.innerHTML=portList;
        };
        
        function connected(path,connection){
            connection.path=path;
            openPort=connection;
        }
        
        function render(el){
            fetchPorts=setInterval(
                function(){
                    app.trigger("serial.get.ports");
                },5000
            );
            el.addEventListener(
                "click",
                function(e){
                    if(openPort){
                        chrome.serial.disconnect(
                            openPort.connectionId,
                            (
                                function(path,oldPath){
                                    return function(disconnected){
                                        if(disconnected)
                                            app.trigger(
                                                'serial.output',
                                                'disconnected from '+oldPath,
                                                'notice'
                                            )
                                        app.trigger(
                                            'serial.connect.to',
                                            path
                                        );
                                    }
                                }
                            )(e.target.getAttribute("path"),openPort.path)
                        );
                        return;
                    }
                    
                    app.trigger(
                        'serial.connect.to',
                        e.target.getAttribute("path")
                    );
                }
            );
        }
        
        exports(moduleName,render);
        app.on("serial.ports",showPorts);
        app.on("serial.connection.success",connected);
    }
)();