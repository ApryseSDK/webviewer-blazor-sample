// @link WebViewer: https://www.pdftron.com/api/web/WebViewer.html
// @link WebViewer.loadDocument: https://www.pdftron.com/api/web/WebViewer.html#loadDocument__anchor

WebViewer({
  path: '../../../lib',
  pdftronServer: 'https://demo.pdftron.com/',
  initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'
}, document.getElementById('viewer'))
  .then(function(instance) {
    document.getElementById('select').onchange = function(e) {
      instance.loadDocument(e.target.value);
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