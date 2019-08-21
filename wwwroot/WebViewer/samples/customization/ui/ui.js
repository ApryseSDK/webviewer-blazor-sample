// @link WebViewer: https://www.pdftron.com/api/web/WebViewer.html
// @link WebViewer.setHeaderItems: https://www.pdftron.com/api/web/WebViewer.html#setHeaderItems__anchor
// @link WebViewer.enableElement: https://www.pdftron.com/api/web/WebViewer.html#enableElements__anchor
// @link WebViewer.disableElement: https://www.pdftron.com/api/web/WebViewer.html#disableElements__anchor

// @link Header: https://www.pdftron.com/api/web/WebViewer.Header.html
// @link Header.getItems: https://www.pdftron.com/api/web/WebViewer.Header.html#getItems__anchor
// @link Header.update: https://www.pdftron.com/api/web/WebViewer.Header.html#update__anchor

WebViewer({
  path: '../../../lib',
  pdftronServer: 'https://demo.pdftron.com/', // comment this out to do client-side only
  initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'
}, document.getElementById('viewer'))
  .then(function(instance) {
    function reverseHeaderItems() {
    // Change header items
      instance.setHeaderItems(function(header) {
        var items = header.getItems();
        var copiedItems = items.splice(2, 18);
        copiedItems.reverse();
        header.update([].concat(items.slice(0, 2), copiedItems, items.slice(2)));
      });
    };

    function toggleElement(e, dataElement) {
    // Enable/disable individual element
      if (e.target.checked) {
        instance.enableElement(dataElement);
      } else {
        instance.disableElement(dataElement);
      }
    };

    [].forEach.call(document.getElementsByName('header'), function(radioInput) {
      radioInput.onchange = function() {
        reverseHeaderItems();
      };
    });

    document.getElementById('text-selection').onchange = function(e) {
    // Enable/disable text selection
      if (e.target.checked) {
        instance.enableTextSelection();
      } else {
        instance.disableTextSelection();
      }
    };

    document.getElementById('annotations').onchange = function(e) {
    // Enable/disable annotations
      if (e.target.checked) {
        instance.enableAnnotations();
      } else {
        instance.disableAnnotations();
      }
    };

    document.getElementById('notes-panel').onchange = function(e) {
    // Enable/disable notes panel
      if (e.target.checked) {
        instance.enableNotesPanel();
      } else {
        instance.disableNotesPanel();
      }
    };

    document.getElementById('file-picker').onchange = function(e) {
    // Enable/disable file picker
      if (e.target.checked) {
        instance.enableFilePicker();
      } else {
        instance.disableFilePicker();
      }
    };

    document.getElementById('print').onchange = function(e) {
    // Enable/disable print
      if (e.target.checked) {
        instance.enablePrint();
      } else {
        instance.disablePrint();
      }
    };

    document.getElementById('download').onchange = function(e) {
    // Enable/disable download
      if (e.target.checked) {
        instance.enableDownload();
      } else {
        instance.disableDownload();
      }
    };

    document.getElementById('view-controls').onchange = function(e) {
      toggleElement(e, 'viewControlsButton');
    };

    document.getElementById('search').onchange = function(e) {
      toggleElement(e, 'searchButton');
    };

    document.getElementById('pan-tool').onchange = function(e) {
      toggleElement(e, 'panToolButton');
    };

    document.getElementById('page-nav').onchange = function(e) {
      toggleElement(e, 'pageNavOverlay');
    };

    document.getElementById('default').onchange = function(e) {
      if (e.target.checked) {
        reverseHeaderItems();
      }
    };

    document.getElementById('reverse').onchange = function(e) {
      if (e.target.checked) {
        reverseHeaderItems();
      }
    };

    [].forEach.call(document.getElementsByName('theme'), function(radioInput) {
      radioInput.onchange = function(e) {
        if (e.target.id === 'light' && e.target.checked) {
          instance.setTheme('default');
        } else {
          instance.setTheme('dark');
        }
      };
    });
  });