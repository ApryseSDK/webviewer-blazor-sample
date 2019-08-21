// @link WebViewer: https://www.pdftron.com/api/web/WebViewer.html
// @link WebViewer.openElement: https://www.pdftron.com/api/web/WebViewer.html#openElements__anchor
// @link WebViewer.closeElement: https://www.pdftron.com/api/web/WebViewer.html#closeElements__anchor

// @link DocumentViewer: https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html
// @link DocumentViewer.refreshAll: https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#refreshAll__anchor
// @link DocumentViewer.updateView: https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#updateView__anchor

// @link Document: https://www.pdftron.com/api/web/CoreControls.Document.html
// @link Document.getLayersArray: https://www.pdftron.com/api/web/CoreControls.Document.html#getLayersArray__anchor
// @link Document.setLayersArray: https://www.pdftron.com/api/web/CoreControls.Document.html#setLayersArray__anchor

WebViewer({
  path: '../../../lib',
  initialDoc: '../../../samples/files/construction-drawing-final.pdf',
}, document.getElementById('viewer'))
  .then(function(instance) {
    var docViewer = instance.docViewer;
    var layersElement = document.getElementById('layers');

    docViewer.on('documentLoaded', function() {
      var doc = docViewer.getDocument();

      // Get PDF layers array
      doc.getLayersArray().then(function(layers) {
        layers.forEach(function(layer, index) {
          var input = document.createElement('input');
          input.id = layer.name;
          input.type = 'checkbox';
          input.checked = layer.visible;
          input.onchange = function(e) {
            instance.openElement('loadingModal');
            // Show/hide a layer
            layers[index].visible = e.target.checked;
            doc.setLayersArray(layers);
            // Redraw the canvas
            docViewer.refreshAll();
            docViewer.updateView();
          };

          var label = document.createElement('label');
          label.htmlFor = layer.name;
          label.innerHTML = layer.name;

          var lineBreak = document.createElement('br');

          layersElement.appendChild(input);
          layersElement.appendChild(label);
          layersElement.appendChild(lineBreak);
        });
      });
    });

    docViewer.on('pageComplete', function() {
      instance.closeElement('loadingModal');
    });
  });