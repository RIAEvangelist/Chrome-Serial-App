var app={};

var screenWidth = screen.availWidth,
    screenHeight = screen.availHeight,
    width=screenWidth/2,
    height=screenHeight/1.5,
    minWidth=800,
    minHeight=600;

chrome.runtime.requestUpdateCheck(updateCheck);

function updateCheck(status){
    if(status=="no_update")
        return;
    chrome.runtime.reload();
}

chrome.app.runtime.onLaunched.addListener(
    function() {
        chrome.app.window.create(
            'index.html', 
            {
                bounds: {
                    width   : Math.round(width),
                    height  : Math.round(height),
                    left    : Math.round((screenWidth-width)/2),
                    top     : Math.round((screenHeight-height)/2)
                },
                frame       : 'none',
            },
            app.opened
        );
    }
);
    
app.opened=function(e){
    e.contentWindow.onload=app.onload;
}

app.onload=function(e){
    
}