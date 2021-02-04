
/* global tinymce */
tinymce.PluginManager.add('math', function (editor, url) {
  // Add a button that opens a window
  editor.ui.registry.addButton('math', {
    text: '¾',
    onAction: function () {
      var mathJaxFrame = document.createElement('iframe')
      mathJaxFrame.style.width = '640px'
      mathJaxFrame.style.height = '480px'
      document.body.appendChild(mathJaxFrame)
      let doc = mathJaxFrame.contentWindow.document
      doc.open()
      doc.write(`
        <script>
          window.MathJax = {
            jax: ["input/TeX","input/MathML","input/AsciiMath", "output/SVG"],
            tex2jax: {
              inlineMath: [ ['$','$'], ["\\(","\\)"] ],
              displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
              processEscapes: true
            },
            extensions: ["tex2jax.js", "MathMenu.js", "MathZoom.js"],
            showMathMenu: false,
            showProcessingMessages: false,
            messageStyle: "none",
            SVG: { useGlobalCache: false },
            TeX: {
              extensions: ["AMSmath.js", "AMSsymbols.js", "autoload-all.js"]
            },
            AuthorInit: function() {
              MathJax.Hub.Register.StartupHook("End", function() {
                var mj2img = function(texstring, callback) {
                  var input = texstring;
                  var wrapper = document.createElement("div");
                  wrapper.innerHTML = input;
                  var output = { svg: "", img: ""};
                  MathJax.Hub.Queue(["Typeset", MathJax.Hub, wrapper]);
                  MathJax.Hub.Queue(function() {
                    var mjOut = wrapper.getElementsByTagName("svg")[0];
                    mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    // thanks, https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
                    output.svg = mjOut.outerHTML;
                    var image = new Image();
                    image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(output.svg)));
                    image.onload = function() {
                      var canvas = document.createElement('canvas');
                      canvas.width = image.width;
                      canvas.height = image.height;
                      var context = canvas.getContext('2d');
                      context.drawImage(image, 0, 0);
                      output.img = canvas.toDataURL('image/png');
                      callback(output);
                    };
                  });
                }
                mj2img("${editor.selection.getContent({ format: 'text' })}", function(output){
                  document.getElementById("target").innerHTML = "<img src='" + output.img + "'/>"
                });
              });
            }
          };
          
          (function(d, script) {
            script = d.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function() {
              // remote script has loaded
            };
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js';
            d.getElementsByTagName('head')[0].appendChild(script);
          }(document));
        </script>
        <div id="target"></div>   
     `)
      doc.close()
      setTimeout(() => {
        let data = doc.getElementById('target')
        editor.focus()
        if (data && data.childNodes && data.childNodes[0]) {
          editor.selection.setContent(data.childNodes[0].outerHTML)
        }
      }, 1000)
    }
  })
  editor.ui.registry.addButton('mathhelp', {
    text: '¾ help',
    onAction: () => {
      console.log('Button Clicked')
      window.open(`${window.location.origin}/MathsDoc/MathsDocumentation`)
    }
  })

  return {
    getMetadata: function () {
      return {
        name: 'Example plugin',
        url: 'http://exampleplugindocsurl.com'
      }
    }
  }
})
