// @link WebViewer: https://www.pdftron.com/api/web/WebViewer.html
// @link WebViewer.registerTool: https://www.pdftron.com/api/web/WebViewer.html#registerTool__anchor
// @link WebViewer.unregisterTool: https://www.pdftron.com/api/web/WebViewer.html#unregisterTool__anchor
// @link WebViewer.setHeaderItems: https://www.pdftron.com/api/web/WebViewer.html#setHeaderItems__anchor
// @link WebViewer.setToolMode: https://www.pdftron.com/api/web/WebViewer.html#setToolMode__anchor

// @link Header: https://www.pdftron.com/api/web/WebViewer.Header.html
// @link Header.get: https://www.pdftron.com/api/web/WebViewer.Header.html#get__anchor
// @link Header.getHeader: https://www.pdftron.com/api/web/WebViewer.Header.html#getHeader__anchor
// @link Header.insertBefore: https://www.pdftron.com/api/web/WebViewer.Header.html#insertBefore__anchor

WebViewer({
  path: '../../../lib',
  pdftronServer: 'https://demo.pdftron.com/', // comment this out to do client-side only
  initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'
}, document.getElementById('viewer'))
  .then(function(instance) {
    // ruler.js
    var rulerTool = window.createRulerTool(instance);
    // stamp.js
    var customStampTool = window.createStampTool(instance);

    var addRulerTool = function() {
      // Register tool
      instance.registerTool({
        toolName: 'RulerTool',
        toolObject: rulerTool,
        buttonImage: '../../../samples/annotation/custom-annotations/ruler.svg',
        buttonName: 'rulerToolButton',
        tooltip: 'Ruler Tool'
      });

      // Add tool button in header
      instance.setHeaderItems(function(header) {
        header.get('freeHandToolGroupButton').insertBefore({
          type: 'toolButton',
          toolName: 'RulerTool',
          hidden: ['tablet', 'mobile']
        });
        header.getHeader('tools').get('freeHandToolGroupButton').insertBefore({
          type: 'toolButton',
          toolName: 'RulerTool',
          hidden: ['desktop']
        });
      });
      instance.setToolMode('RulerTool');
    };

    function removeRulerTool() {
      // Unregister tool
      instance.unregisterTool('RulerTool');
      instance.setToolMode('AnnotationEdit');
    }

    function addCustomStampTool() {
      // Register tool
      instance.registerTool({
        toolName: 'CustomStampTool',
        toolObject: customStampTool,
        buttonImage: '../../../samples/annotation/custom-annotations/stamp.png',
        buttonName: 'customStampToolButton',
        tooltip: 'Approved Stamp Tool'
      });

      // Add tool button in header
      instance.setHeaderItems(function(header) {
        header.get('freeHandToolGroupButton').insertBefore({
          type: 'toolButton',
          toolName: 'CustomStampTool',
          hidden: ['tablet', 'mobile']
        });
        header.getHeader('tools').get('freeHandToolGroupButton').insertBefore({
          type: 'toolButton',
          toolName: 'CustomStampTool',
          hidden: ['desktop']
        });
      });

      instance.setToolMode('CustomStampTool');
    }

    function removeCustomStampTool() {
      instance.unregisterTool('CustomStampTool');
      instance.setToolMode('AnnotationEdit');
    }

    document.getElementById('ruler').onchange = function(e) {
      if (e.target.checked) {
        addRulerTool();
      } else {
        removeRulerTool();
      }
    };

    document.getElementById('custom-stamp').onchange = function(e) {
      if (e.target.checked) {
        addCustomStampTool();
      } else {
        removeCustomStampTool();
      }
    };
  });