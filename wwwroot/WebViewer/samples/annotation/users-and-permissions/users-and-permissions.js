// @link WebViewer: https://www.pdftron.com/api/web/WebViewer.html
// @link WebViewer.setAnnotationUser: https://www.pdftron.com/api/web/WebViewer.html#setAnnotationUser__anchor
// @link WebViewer.setAdminUser: https://www.pdftron.com/api/web/WebViewer.html#setAdminUser__anchor
// @link WebViewer.openElement: https://www.pdftron.com/api/web/WebViewer.html#openElements__anchor
// @link WebViewer.setReadOnly: https://www.pdftron.com/api/web/WebViewer.html#setReadOnly__anchor
// @link WebViewer.setToolMode: https://www.pdftron.com/api/web/WebViewer.html#setToolMode__anchor

// @link AnnotationManager: https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html
// @link AnnotationManager.getAnnotationsList: https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#getAnnotationsList__anchor
// @link AnnotationManager.showAnnotations: https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#showAnnotations__anchor
// @link AnnotationManager.hideAnnotations: https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#hideAnnotations__anchor

WebViewer({
  path: '../../../lib',
  pdftronServer: 'https://demo.pdftron.com/', // comment this out to do client-side only
  initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'
}, document.getElementById('viewer'))
  .then(function(instance) {
    instance.setAnnotationUser('Justin');
    instance.setAdminUser(true);
    instance.openElement('notesPanel');

    document.getElementById('justin').onchange = function() {
      instance.setAnnotationUser('Justin');
      instance.setAdminUser(true);
      instance.setReadOnly(false);
      instance.setToolMode('AnnotationEdit');
    };

    document.getElementById('sally').onchange = function() {
      instance.setAnnotationUser('Sally');
      instance.setAdminUser(false);
      instance.setReadOnly(false);
      instance.setToolMode('AnnotationEdit');
    };

    document.getElementById('brian').onchange = function() {
      instance.setAnnotationUser('Brian');
      instance.setAdminUser(false);
      instance.setReadOnly(true);
      instance.setToolMode('AnnotationEdit');
    };

    document.getElementById('display').onchange = function(e) {
      var currentUser = instance.getAnnotationUser();
      var allAnnotations = instance.annotManager.getAnnotationsList().filter(function(annot) {
        return annot.Listable
      });

      if (e.target.checked) {
        instance.annotManager.showAnnotations(allAnnotations);
      } else {
        var annotationsToHide = allAnnotations.filter(function(annot) {
          return annot.Author !== currentUser
        });
        instance.annotManager.hideAnnotations(annotationsToHide);
      }
    };
  });