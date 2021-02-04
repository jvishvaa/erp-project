import { iframeContents1 } from './iframe1'
import { iframeContents2 } from './iframe2'
/* global tinymce */
tinymce.PluginManager.add('dropdown', function (editor, url) {
  // Add a button that opens a window
  editor.ui.registry.addMenuButton('dropdown', {
    text: 'Select Keyboard',
    fetch: function (callback) {
      var items = [
        {
          type: 'menuitem',
          text: 'kannada',
          onAction: function () {
            editor.windowManager.open({
              title: 'ಕನ್ನಡ-ಕೀಬೋರ್ಡ್', // The dialog's title - displayed in the dialog header
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
                iframe: iframeContents1
              },
              onSubmit: function (api) {
                let iframe = document.querySelectorAll('[title=editor]')[0]
                let content = iframe.contentDocument || iframe.contentWindow.document
                let contentData = (content.getElementById('keyboard')).value
                editor.setContent(contentData)
                api.close()
              }
            })
          }

        },

        {
          type: 'menuitem',
          text: 'hindi',
          onAction: function () {
            editor.windowManager.open({
              title: ' हिन्दी कुंजीपटल (कीबोर्ड)', // The dialog's title - displayed in the dialog header
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
                iframe: iframeContents2
              },
              onSubmit: function (api) {
                let iframe = document.querySelectorAll('[title=editor]')[0]
                let content = iframe.contentDocument || iframe.contentWindow.document
                let contentData = (content.getElementById('keyboard')).value
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
