import { kannadaiframeContent } from './iframe'
import { hindiiframeContent } from './hindiiframe'
/* global tinymce */

tinymce.PluginManager.add('ಕನ್ನಡ', function (editor, url) {
  // Add a button that opens a window
  editor.ui.registry.addMenuButton('editor_drop_down', {
    text: 'Select editor',

    fetch: function (callback) {
      var items = [
        {
          type: 'menuitem',
          text: 'kannada',
          onAction: function () {
            editor.windowManager.open({
              title: 'ಕನ್ನಡ', // The dialog's title - displayed in the dialog header
              size: 'large',
              body: {
                type: 'panel', // The root body type - a Panel or TabPanel
                items: [ {
                  type: 'iframe', // component type
                  name: 'iframe', // identifier
                  label: 'editor', // text for the iframe's title attribute
                  sandboxed: false,
                  width: '500px',
                  height: '99px'
                }// A list of panel components
                ]
              },
              buttons: [ // A list of footer buttons
                {
                  type: 'submit',
                  text: 'OK'
                }
              ],
              initialData: {
                iframe: kannadaiframeContent
              },
              onSubmit: function (api) {
                let iframe = document.querySelectorAll('[title=editor]')[0]
                let content = iframe.contentDocument || iframe.contentWindow.document
                let contentData = (content.getElementById('language')).value
                editor.setContent(contentData)
                api.close()
              }
            })
          }
        },
        { type: 'menuitem',
          text: 'hindi',
          onAction: function () {
            editor.windowManager.open({
              title: 'हिन्दी', // The dialog's title - displayed in the dialog header
              size: 'large',
              body: {
                type: 'panel', // The root body type - a Panel or TabPanel
                items: [ {
                  type: 'iframe', // component type
                  name: 'iframe', // identifier
                  label: 'editor', // text for the iframe's title attribute
                  sandboxed: false,
                  width: '500px',
                  height: '99px'
                }// A list of panel components
                ]
              },
              buttons: [ // A list of footer buttons
                {
                  type: 'submit',
                  text: 'OK'
                }
              ],
              initialData: {
                iframe: hindiiframeContent
              },
              onSubmit: function (api) {
                let iframe = document.querySelectorAll('[title=editor]')[0]
                let content = iframe.contentDocument || iframe.contentWindow.document
                let contentData = (content.getElementById('language')).value
                editor.setContent(contentData)
                api.close()
              }
            })
          }
        }
      ]
      callback(items)
    }
  })
})
