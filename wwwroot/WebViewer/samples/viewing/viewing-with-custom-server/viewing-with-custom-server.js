// @link WebViewer: https://www.pdftron.com/api/web/WebViewer.html
// @link WebViewer.loadDocument: https://www.pdftron.com/api/web/WebViewer.html#loadDocument__anchor

WebViewer({
  path: '../../../lib',
  initialDoc: '../../../samples/files/demo-annotated.xod',
}, document.getElementById('viewer'))
  .then(function(instance) {
    document.getElementById('select').onchange = function(e) {
      if (e.target.value === 'https://pdftron.s3.amazonaws.com/downloads/pl/encrypted-foobar12.xod') {
        instance.loadDocument(e.target.value, {
          decrypt: document.querySelector('iframe').contentWindow.CoreControls.Encryption.decrypt,
          decryptOptions: {
            p: 'foobar12',
            type: 'aes',
            error: function(msg) {
              alert(msg);
            }
          }
        });
      } else {
        instance.loadDocument(e.target.value);
      }
    };
  
    document.getElementById('file-picker').onchange = function(e) {
      var file = e.target.files[0];
      if (file) {
        instance.loadDocument(file);
      }
    };
  
    document.getElementById('url-form').onsubmit = function(e) {
      e.preventDefault();
      instance.loadDocument(document.getElementById('url').value);
    };
  });