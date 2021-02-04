/* global tinymce */
// eslint-disable-next-line
import { kn_ascii2unicode } from './converter'

tinymce.PluginManager.add('ascii2unicode', function (editor, url) {
  editor.ui.registry.addButton('ascii2unicode', {
    text: 'ascii2unicode',
    onAction: () => {
      editor.selection.setContent(kn_ascii2unicode(editor.selection.getSelectedBlocks()[0].innerText))
    }
  })
})
