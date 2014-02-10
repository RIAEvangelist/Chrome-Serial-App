(
    function(){
        var moduleName  = 'serialOutput',
            terminal    = false,
            module      = false;
            
        
        function failedConnection(port){
            output(
                'Error connecting to serial port : '+port,
                'warn'
            );
            output(
                'Are you sure that your cable is securely attached at both ends and plugged into '+port+'?',
                'notice'
            );
        }
        
        function connected(port,data){
            output(
                'Connected to serial port : '+port,
                'success'
            );
        }
        
        function connecting(port){
            output(
                'Connecting to serial port : '+port,
                'notice'
            );
        }
        
        function error(data){
            output(
                'Serial port '+data.connectionId+' error : '+data.error,
                'warn'
            );
        }
        
        function outputData(data){
            output(
                serial2str(data.data)
            );
        }
        
        function output(data,type){
            if(!data)
                return;
            var rowtype='li';
            if(!type)
                type='data';
            if(type=='data'){
                rowtype='span';
                data=data.replace('\n','</br>').replace(/\s/g,'&nbsp;');
            }
            var line=document.createElement(rowtype);
                line.classList.add(type);
                line.innerHTML=data;
            
            terminal.appendChild(line);
            
            module.scrollTop=module.scrollHeight;
        }
        
        function clear(){
            terminal.innerHTML='';
        }
        
        function render(el){
            chrome.serial.onReceive.addListener(
                outputData 
            );
            
            chrome.serial.onReceiveError.addListener(
                error
            );
            
            module=el;
            terminal=document.getElementById('serialOutput-list');
        }
        
        exports(moduleName,render);
        app.on('serial.connection.failed',failedConnection);
        app.on('serial.connection.success',connected);
        app.on('serial.connect.to',connecting);
        app.on('serial.output',output);
        app.on('serial.output.clear',clear);
    }
)();