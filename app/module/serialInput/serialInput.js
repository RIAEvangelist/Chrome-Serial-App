(
    function(){
        var moduleName='serialInput';
        var module={};
        
        function connected(path,connection){
            module.container.classList.remove('disabled');
            module.input.disabled=false;
            module.send.disabled=false;
            module.clear.disabled=false;
            module.connection=connection;
        }
        
        function send(data,callback){
            if(!module.connection)
                app.trigger(
                    'serial.output',
                    'Not connected to any serial port',
                    'warn'
                )
                
            chrome.serial.send(
                module.connection.connectionId,
                str2serial(data+'\r\n'),
                function(){
                    
                }
            );
        }
        
        function keyup(e){
            if(e.keyCode==13)
                sendInputData();
        }
        
        function sendInputData(e){
            if(!e)
                e={
                    target:{}
                }
            if(e.target.disabled)
                return;
            
            send(module.input.value);
            module.input.value='';
        }
        
        function render(el){
            module.container=el;
            module.input=el.querySelector('input');
            module.send=el.querySelector('#serial-send');
            module.clear=el.querySelector('#serial-clear');
            module.send.addEventListener(
                'click',
                sendInputData
            );
            module.clear.addEventListener(
                'click',
                function(e){
                    if(e.target.disabled)
                        return;
                    app.trigger('serial.output.clear');
                }
            );
            module.input.addEventListener(
                'keyup',
                keyup
            )
        }
        
        exports(moduleName,render);
        app.on("serial.connection.success",connected);
    }
)();