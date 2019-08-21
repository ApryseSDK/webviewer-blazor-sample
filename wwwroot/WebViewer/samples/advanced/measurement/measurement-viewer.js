    
// @link WebViewer: https://www.pdftron.com/api/web/WebViewer.html
// @link WebViewer.setHeaderItems: https://www.pdftron.com/api/web/WebViewer.html#setHeaderItems__anchor
// @link WebViewer.openElements: https://www.pdftron.com/api/web/WebViewer.html#openElements__anchor
// @link WebViewer.loadDocument: https://www.pdftron.com/api/web/WebViewer.html#loadDocument__anchor

// @link Header: https://www.pdftron.com/api/web/WebViewer.Header.html

WebViewer({
  path: '../../../lib',
  initialDoc: '../../../samples/files/demo.pdf',
  enableMeasurement: true
}, document.getElementById('viewer'))
  .then(function(instance) {
    instance.setHeaderItems(function(header) {
      header.delete('textToolGroupButton');
      header.delete('freeHandToolGroupButton');
      header.delete('shapeToolGroupButton');
      header.delete('signatureToolButton');
      header.delete('freeTextToolButton');
      header.delete('stickyToolButton');
      header.delete('miscToolGroupButton');
    });
    instance.openElements(['notesPanel']);
  
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
