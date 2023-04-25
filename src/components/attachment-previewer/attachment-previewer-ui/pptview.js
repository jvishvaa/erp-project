// import React, { useEffect, useRef } from 'react';
// import { useHistory } from 'react-router-dom';
// import WebViewer from '@pdftron/webviewer'
// import { Button } from 'antd';

// const PPTView = () => {
//   const history = useHistory();
//   const src = history?.location?.state?.src
//   console.log(src, 'src');
//   const viewer = useRef(null);

//   useEffect(() => {
//     WebViewer(
//       {
//         path: '/lib/public',
//         initialDoc: src,
//         disabledElements: [
//           'viewControlsButton',
//           'viewControlsOverlay',
//           'headerGroup',
//           "Download",
//           'ToolbarGroup',
//           "toolbarGroup-Annotate",
//           'toolbarGroup-Shapes', 'toolbarGroup-Insert', 'toolbarGroup-Measure',
//           'toolbarGroup-Edit', 'toolbarGroup-Forms', 'toolbarGroup-FillAndSign',
//           'menuButton', 'leftPanelButton', 'panToolButton', 'selectToolButton', 'toggleNotesButton'
//         ],
//         //   DisplayModes: 'Single',
//         //   disableVirtualDisplayMode: true,
//         isReadOnly: true,
//       },
//       viewer.current,
//     ).then((instance) => {
//       var Feature = instance.UI.Feature;
//       instance.UI.disableFeatures([Feature.Download]);
//       instance.UI.disableFeatures([Feature.Panel]);
//       instance.UI.disableElements(['ribbons']);
//       console.log(instance, 'ins');
//       const keyshot = instance.UI.hotkeys;
//       instance.UI.hotkeys.on(["UP"])
//       const LayoutMode = instance.UI.LayoutMode;
//       instance.UI.setLayoutMode([LayoutMode.FacingCoverContinuous]);
//       var FitMode = instance.UI.FitMode;
//       instance.UI.setFitMode([FitMode.FitWidth]);
//       const documentViewer = instance.Core.DocumentViewer
//       documentViewer.prototype.enableArrowKeyNavigation()
//       // console.log(instance.Core.DocumentViewer.getDocument() , 'log')

//       // you can now call WebViewer APIs here...
//     });
//   }, []);

//   const handleBack = () => {
//     history.goBack()
//   }

//   return (
//     <div className="MyComponent">
//       <div style={{ display: 'flex', justifyContent: 'flex-start' }} >
//         <Button onClick={handleBack}  >Back</Button>
//       </div>
//       <div >
//         <div className="webviewer" ref={viewer} style={{ height: "90vh" }}></div>
//       </div>
//     </div>
//   );
// };

// export default PPTView;