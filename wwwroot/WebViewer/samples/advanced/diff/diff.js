// @link WebViewer: https://www.pdftron.com/api/web/WebViewer.html
// @link WebViewer.loadDocument: https://www.pdftron.com/api/web/WebViewer.html#loadDocument__anchor

// @link DocumentViewer: https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html
// @link DocumentViewer.getViewportRegionRect: https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#getViewportRegionRect__anchor
// @link DocumentViewer.getCurrentPage: https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#getCurrentPage__anchor

// @link CoreControls: https://www.pdftron.com/api/web/CoreControls.html
// @link PartRetrievers: https://www.pdftron.com/api/web/PartRetrievers.html

// @link Document: https://www.pdftron.com/api/web/CoreControls.Document.html
// @link Document.loadAsync: https://www.pdftron.com/api/web/CoreControls.Document.html#loadAsync__anchor
// @link Document.cancelLoadCanvas: https://www.pdftron.com/api/web/CoreControls.Document.html#cancelLoadCanvas__anchor

CoreControls.setWorkerPath('../../../lib/core');

var workerTransportPromise;
var currentLoadCanvas;
var lastRenderRect;
var viewers = [];
var instances = {};
var viewerIds = [
  { panel: 'leftPanel' },
  { panel: 'middlePanel' },
  { panel: 'rightPanel' }
];

function update(panel, pageIndex) {
  var newDoc = instances[panel].newDoc;
  var documentContainer = instances[panel].documentContainer;
  var instance = instances[panel].instance;
  currentLoadCanvas = updatePage(newDoc, documentContainer, instance, pageIndex, currentLoadCanvas, lastRenderRect);
}

function updatePage(doc, documentContainer, instance, pageIndex, currentLoadCanvas, lastRenderRect) {
  var firstDocCanvas = documentContainer.querySelector('.canvas' + pageIndex);
  var firstDocCtx = firstDocCanvas.getContext('2d');
  var firstDocData = firstDocCtx.getImageData(0, 0, firstDocCanvas.width, firstDocCanvas.height).data;
  var isViewportRender = firstDocCanvas.style.left !== '';

  return doc.loadCanvasAsync({
    pageIndex: pageIndex,
    canvasNum: 1,
    pageRotation: instance.docViewer.getRotation(),
    getZoom: function() {
      return instance.docViewer.getZoom();
    },
    drawComplete: function(pageCanvas) {
      diffPixels(pageCanvas, firstDocCanvas, firstDocData);
    },
    renderRect: isViewportRender ? lastRenderRect : undefined
  });
}

function diffPixels(pageCanvas, firstDocCanvas, firstDocData) {
  pageCanvas.style.position = 'absolute';
  pageCanvas.style.zIndex = 25;
  pageCanvas.style.left = firstDocCanvas.style.left;
  pageCanvas.style.top = firstDocCanvas.style.top;
  pageCanvas.style.backgroundColor = '';

  pageCanvas.classList.add('canvasOverlay');
  firstDocCanvas.parentNode.appendChild(pageCanvas);

  var ctx = pageCanvas.getContext('2d');
  var secondDocImageData = ctx.getImageData(0, 0, pageCanvas.width, pageCanvas.height);
  var secondDocData = secondDocImageData.data;

  for (var i = 0; i < secondDocData.length; i += 4) {
    var coords = getCoords(i, pageCanvas.width);
    var index = getIndex(coords, firstDocCanvas.width);
    if (isPixelWhite(firstDocData, index) && isPixelWhite(secondDocData, index)) {
      // if pixel is white, make it transparent
      secondDocData[i + 3] = 0;
    } else if (isPixelDataEqual(firstDocData, secondDocData, index)) {
      // if pixel values are the same, make it grey
      secondDocData[i] = 169;
      secondDocData[i + 1] = 169;
      secondDocData[i + 2] = 169;
    } else {
      if (coords.y <= firstDocCanvas.height && coords.x <= firstDocCanvas.width) {
        if (isPixelWhite(firstDocData, index)) {
          // if the pixel is white in first document only, color it blue
          secondDocData[i] = 0;
          secondDocData[i + 1] = 0;
          secondDocData[i + 2] = 255;
        } else if (isPixelWhite(secondDocData, index)) {
          // if the pixel is white in second document only, color it red
          secondDocData[i] = 255;
          secondDocData[i + 1] = 0;
          secondDocData[i + 2] = 0;
        } else {
          // otherwise, color it magenta-ish based on color difference
          var colorDifference = Math.abs(secondDocData[i] - firstDocData[index]) +
            Math.abs(secondDocData[i + 1] - firstDocData[index + 1]) +
            Math.abs(secondDocData[i + 2] - firstDocData[index + 2]);

          var diffPercent = colorDifference / (255 * 3);
          var valChange = 127 * diffPercent;

          var magentaVal = 128 + valChange;

          secondDocData[i] = magentaVal;
          secondDocData[i + 1] = 128 - valChange;
          secondDocData[i + 2] = magentaVal;
        }
      }
    }
  }
  ctx.putImageData(secondDocImageData, 0, 0);
}

function isPixelWhite(data, index) {
  for (var i = 0; i < 3; i++) {
    if (data[index + i] !== 255) {
      return false;
    }
  }
  return true;
}

function isPixelDataEqual(data1, data2, index) {
  for (var i = 0; i < 4; i++) {
    if (data1[index + i] !== data2[index + i]) {
      return false;
    }
  }
  return true;
}

function getCoords(i, width) {
  var pixels = Math.floor(i / 4);
  return {
    x: pixels % width,
    y: Math.floor(pixels / width)
  };
}

function getIndex(coords, width) {
  return ((coords.y * width) + coords.x) * 4;
}

function openDoc(panel, firstPdf, secondPdf) {
  var instance = instances[panel].instance;
  instance.loadDocument(firstPdf);

  if (panel === 'middlePanel' && secondPdf) {
    loadDocument(panel, secondPdf);
  }
}

function loadDocument(panel, docLocation) {
  var CoreControls = instances[panel].instance.CoreControls;
  var newDoc = new CoreControls.Document('file.pdf', 'pdf');

  CoreControls.getDefaultBackendType()
    .then(function() {
      var options = {
        workerTransportPromise: getWorkerTransportPromise()
      };
      var partRetriever;
      if (docLocation instanceof File) {
        partRetriever = new CoreControls.PartRetrievers.LocalPdfPartRetriever(docLocation);
      } else {
        partRetriever = new CoreControls.PartRetrievers.ExternalPdfPartRetriever(docLocation);
      }

      newDoc.loadAsync(partRetriever, function() {}, options);
      instances[panel] = $.extend({}, instances[panel], { newDoc: newDoc });
    });
}

function initializeViewers(array, callback) {
  Promise.all(array.map(setupViewer)).then(function() {
    var instance = instances['middlePanel'].instance;

    // disable for middle panel
    instance.disableElements(['leftPanel', 'leftPanelButton', 'searchButton', 'searchPanel', 'searchOverlay']);

    instance.docViewer.on('pageComplete', function(e, completedPageIndex) {
      update('middlePanel', completedPageIndex);
    });

    instance.docViewer.on('beginRendering', function() {
      lastRenderRect = instance.docViewer.getViewportRegionRect(instance.docViewer.getCurrentPage() - 1);
      if (currentLoadCanvas) {
        var newDoc = instances['middlePanel'].newDoc;
        newDoc.cancelLoadCanvas(currentLoadCanvas);
      }
    });

    return callback(null, instances);
  });
}

var originalScroller = null;
var scrollTimeout;

function setupViewer(item) {
  return new Promise(function(resolve) {
    var viewerElement = document.getElementById(item.panel);

    WebViewer({
      path: '../../../lib',
      workerTransportPromise: getWorkerTransportPromise(),
      initialDoc: item.pdf || null,
      enableAnnotations: false
    }, viewerElement)
      .then(function(instance) {
        var docViewer = instance.docViewer;

        docViewer.on('documentLoaded', function() {
          if (!instances[item.panel].documentContainer) {
            var documentContainer = viewerElement.querySelector('iframe').contentDocument.querySelector('.DocumentContainer');
            instances[item.panel] = $.extend({}, instances[item.panel], {
              documentContainer: documentContainer
            });
            documentContainer.onscroll = function() {
              if (!originalScroller || originalScroller === documentContainer) {
                originalScroller = documentContainer;
                syncScrolls(documentContainer.scrollLeft, documentContainer.scrollTop);
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                  originalScroller = null;
                }, 50);
              }
            };
          }
        });

        docViewer.on('zoomUpdated', function(e, zoom) {
          syncZoom(zoom);
        });

        docViewer.on('rotationUpdated', function(e, rotation) {
          syncRotation(rotation);
        });

        viewers.push(item);

        instances[item.panel] = {
          instance: instance,
          viewerElement: viewerElement
        };

        resolve();
      });
  });
}

function getWorkerTransportPromise() {
  return workerTransportPromise || CoreControls.getDefaultBackendType().then(function(backendType) {
    workerTransportPromise = CoreControls.initPDFWorkerTransports(backendType, {});
    return workerTransportPromise;
  });
}

function syncScrolls(scrollLeft, scrollTop) {
  viewers.forEach(function(item) {
    var documentContainer = instances[item.panel].documentContainer;

    if (!documentContainer) {
      return;
    }

    if (documentContainer.scrollLeft !== scrollLeft) {
      documentContainer.scrollLeft = scrollLeft;
    }

    if (documentContainer.scrollTop !== scrollTop) {
      documentContainer.scrollTop = scrollTop;
    }
  });
}

function syncZoom(zoom) {
  viewers.forEach(function(item) {
    var instance = instances[item.panel].instance;

    if (instance.getZoomLevel() !== zoom) {
      instance.setZoomLevel(zoom);
    }
  });
}

function syncRotation(rotation) {
  viewers.forEach(function(item) {
    var instance = instances[item.panel].instance;

    if (instance.docViewer.getRotation() !== rotation) {
      instance.docViewer.setRotation(rotation);
    }
  });
}

initializeViewers(viewerIds, function() {
  openDoc('middlePanel', '../../../samples/files/test_doc_1.pdf', '../../../samples/files/test_doc_2.pdf');
  openDoc('leftPanel', '../../../samples/files/test_doc_1.pdf');
  openDoc('rightPanel', '../../../samples/files/test_doc_2.pdf');
});

document.getElementById('selectControl').onclick = function(e) {
  e.preventDefault();
  var select1 = document.getElementById('select1');
  var firstPdf = select1.options[select1.selectedIndex].value;
  var select2 = document.getElementById('select2');
  var secondPdf = select2.options[select2.selectedIndex].value;

  openDoc('middlePanel', firstPdf, secondPdf);
  openDoc('leftPanel', firstPdf);
  openDoc('rightPanel', secondPdf);
};

document.getElementById('url-form').onsubmit = function(e) {
  e.preventDefault();
  var firstPdf = document.getElementById('url').value;
  var secondPdf = document.getElementById('url2').value;

  openDoc('middlePanel', firstPdf, secondPdf);
  openDoc('leftPanel', firstPdf);
  openDoc('rightPanel', secondPdf);
};

document.getElementById('file-picker-form').onsubmit = function(e) {
  e.preventDefault();
  var firstPdf = document.forms['file-picker-form'][0].files[0];
  var secondPdf = document.forms['file-picker-form'][1].files[0];

  openDoc('middlePanel', firstPdf, secondPdf);
  openDoc('leftPanel', firstPdf);
  openDoc('rightPanel', secondPdf);
};