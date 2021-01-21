import React from 'react'
import ReactDOMServer from 'react-dom/server'

function htmlForPdf (content) {
  return (
    <React.Fragment>
      {/* <head>
        <title>{content.title}</title>
        <link rel='stylesheet' type='text/css' href='./pdfGenerator.module.css' />
      </head> */}
      <body className='pdf_body'>
        <header>
          {content.header}
        </header>
        <hr />
        <section className='pdf_content_block'>
          {content.component}
        </section>
        <hr />
        <footer className='pdf_footer'>
          {content.footer}
        </footer>
        {content.isCancelled ? (
          <div className='pdf_watermark'>
           CANCELLED
          </div>
        ) : null}
      </body>
    </React.Fragment>
  )
}

/*
 @Params = {component, header, footer, title} => requiredHtmlContent
 Description = Provide All the Parameters in an Object while calling function
*/
function generatePdf (requiredHtmlContent) {
  const pdfContent = ReactDOMServer.renderToStaticMarkup(htmlForPdf(requiredHtmlContent))
  var frame1 = document.createElement('iframe')
  frame1.name = 'frame1'
  frame1.style.position = 'absolute'
  frame1.style.top = '-1000000px'
  document.body.appendChild(frame1)
  var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument
  frameDoc.document.open()
  frameDoc.document.write(`<html><head><title>${requiredHtmlContent.title}</title>`)
  frameDoc.document.write(`<style>
  .pdf_footer {
    font-size: 9px;
    text-align: center;
  }
  
  .pdf_watermark {
    opacity: 0.5;
    color: rgb(196, 46, 46);
    position: absolute;
    top: 400px;
    left: 0;
    font-size: 140px; 
    transform: rotate(-45deg);
    z-index: 9999;
  }
  
  @page {
    size: A4;
    margin: 11mm 17mm 17mm 17mm;
  }
  
  @media print {
    .pdf_footer {
      position: fixed;
      bottom: 0;
    }
  
    .pdf_content_block, p{
      page-break-inside: avoid;
    }
  
    .pdf_body {
      width: 210mm;
      height: 350mm;
    }
  
  }
  </style>`)
  frameDoc.document.write('</head><body>')
  frameDoc.document.write(pdfContent)
  frameDoc.document.write('</body></html>')
  frameDoc.document.close()
  setTimeout(function () {
    window.frames['frame1'].focus()
    window.frames['frame1'].print()
    document.body.removeChild(frame1)
  }, 500)
  return false
}

export default generatePdf
