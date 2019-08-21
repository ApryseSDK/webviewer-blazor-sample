// @link WebViewer: https://www.pdftron.com/api/web/WebViewer.html
// @link WebViewer.loadDocument: https://www.pdftron.com/api/web/WebViewer.html#loadDocument__anchor

var viewerElement = document.getElementById('viewer');

WebViewer({
  path: '../../../lib',
  // in this example we are using 'all' to preload resources for office files
  // when working with only pdf, set to 'pdf' to avoid downloading unneeded resources
  preloadWorker: 'all',
}, viewerElement)
  .then(function(instance) {
    var preLoadFiles = [
      '../../../samples/files/demo.pdf',
      '../../../samples/full-apis/TestFiles/simple-excel_2007.xlsx',
      '../../../samples/full-apis/TestFiles/simple-word_2007.docx',
    ];

    var documentsDiv = document.getElementById('documents');

    preLoadFiles.forEach(function(file) {
      var div = document.createElement('div');
      div.innerHTML = file.split('/').slice(-1)[0];

      var button = document.createElement('button');
      button.innerHTML = 'Loading';

      var list = document.createElement('li');
      list.appendChild(div);
      list.appendChild(button);

      documentsDiv.appendChild(list);

      // using this instead of 'fetch' for IE11 support
      var xhr = new XMLHttpRequest();
      xhr.open('GET', file, true);
      xhr.responseType = 'blob';
      xhr.onload = function() {
        var doc = this.response;
        if (this.status === 200) {
          button.onclick = function() {
            viewerElement.style.visibility = 'visible';
            // file name is required for office files, 'loadDocument' will assume files are pdf if there isn't a filename
            instance.loadDocument(doc, { filename: file.split('/').slice(-1)[0] });
          };
          button.innerHTML = 'Open';
        }
      };
      xhr.send();
    });

    document.getElementById('toggle').addEventListener('click', function() {
      if (viewerElement.style.visibility === 'hidden') {
        viewerElement.style.visibility = 'visible';
      } else {
        viewerElement.style.visibility = 'hidden';
      }
    });
  });