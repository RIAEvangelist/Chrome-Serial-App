app.data.terminal={
    connection:{
        options:{
            bitrate     : 9600,
            persistent  : true
        }
    }
}

function serial2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2serial(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}