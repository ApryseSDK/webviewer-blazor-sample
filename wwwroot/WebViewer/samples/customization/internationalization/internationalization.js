// @link WebViewer: https://www.pdftron.com/api/web/WebViewer.html
// @link WebViewer.setLanguage: https://www.pdftron.com/api/web/WebViewer.html#setLanguage__anchor

WebViewer({
  path: '../../../lib',
  pdftronServer: 'https://demo.pdftron.com/', // comment this out to do client-side only
  initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'
}, document.getElementById('viewer'))
  .then(function(instance) {
    document.getElementById('form').onchange = function(e) {
      // Set language
      instance.setLanguage(e.target.id);
    };
  });