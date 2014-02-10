(
    function(){
        var moduleName='serialCom';
        
        function getPorts(){
            chrome.serial.getDevices(gotPorts);
        };
        
        function gotPorts(ports){
            app.trigger('serial.ports',ports);
        };
        
        function connect(port){
            var baud=document.querySelector('[data-baud-rate]');
            if(baud)
                if(baud.value.trim()!='')
                    app.data.terminal.connection.options.bitrate=Number(baud.value.trim());
            
            chrome.serial.connect(
                port,
                app.data.terminal.connection.options,
                (
                    function(){
                        return function(connection){
                            connected(connection,port);
                        }
                    }
                )(port)
            );
        }
        
        function connected(connection,port){
            if(!connection){
                app.trigger('serial.connection.failed',port);
                return;   
            }
            
            app.trigger('serial.connection.success',port,connection);
        }
        
        function render(el){
            getPorts();
        }
        
        exports(moduleName,render);
        app.on("serial.get.ports",getPorts);
        app.on("serial.connect.to",connect);
    }
)();