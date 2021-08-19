import React from 'react'
import { loadScript, moduleBaseURL, PDFViewerApplicationWarp } from './viewer'
import ImportScript from '../../../utility-functions/custom-hooks/import-script'





export default function PdfjsPreview({ url }) {

    // url = url || 'https://omrsheet.s3.ap-south-1.amazonaws.com/dev/lesson_plan_file/2021-22/Volume 1/Grade 3/English/CS_ Ch 1_Sequencing_Rev/Period-1/Student_Reading_Material/2021-03-23 07:43:40.672606_Grade 3_Vol 1_English_CS_Ch 1_Sequencing_Rev_Pd 14_Student Reading Material.pdf'
    url = url || 'https://d2r9gkgplfhsr2.cloudfront.net/dev/lesson_plan_file/2021-22/Volume 1/Grade 3/English/CS_ Ch 1_Sequencing_Rev/Period-1/Student_Reading_Material/2021-03-23 07:43:40.672606_Grade 3_Vol 1_English_CS_Ch 1_Sequencing_Rev_Pd 14_Student Reading Material.pdf'

    // url = url || 'https://pdfviewerk12.s3.ap-south-1.amazonaws.com/sample.pdf'

    // const [pdfjsLib, setPdfjsLib] = React.useState(null)
    // const [pdfjsViewer, setPdfjsViewer] = React.useState(null)

    // function fetchAndSetpdfjsLib() {
    //     const ispdfjsLibReadyProm = loadScript(`${moduleBaseURL}/pdf.js`, 'pdfjsLib')
    //     ispdfjsLibReadyProm.then((value) => {

    //         setPdfjsLib(value)
    //     })
    // }

    // function fetchAndSetpdfjsViewer() {
    //     const ispdfjsViewerReadyProm = loadScript(`${moduleBaseURL}/pdf_viewer.js`, 'pdfjsViewer')
    //     ispdfjsViewerReadyProm.then((value) => {
    //         setPdfjsViewer(value)
    //     })
    // }
    // if (pdfjsLib === null) {
    //     fetchAndSetpdfjsLib()
    // }
    // if (pdfjsViewer === null) {
    //     fetchAndSetpdfjsViewer()
    // }
    const [iscompMounted, setIscompMounted] = React.useState(null)
    const [ispdfjsLibReady, setpdfjsLibReady] = React.useState(null)
    const ispdfjsLibReadyProm = loadScript(`${moduleBaseURL}/pdf.js`)
    if (!ispdfjsLibReady) {
        ispdfjsLibReadyProm.then((res) => {
            setpdfjsLibReady(res)
        })
    }
    const [ispdfjsViewerReady, setispdfjsViewerReady] = React.useState(null)
    const ispdfjsViewerReadyProm = loadScript(`${moduleBaseURL}/pdf_viewer.js`)
    if (!ispdfjsViewerReady) {
        ispdfjsViewerReadyProm.then((res) => {
            setispdfjsViewerReady(res)
        })
    }
    const PdfViewerCSS = props => { return <ImportScript link resourceUrl={`${moduleBaseURL}/pdf_viewer.css`} /> }
    const ViewerCSS = props => { return <ImportScript link resourceUrl={`${moduleBaseURL}/viewer.css`} /> }

    const [PDFViewerApplication, setPDFViewerApplication] = React.useState(null)
    React.useEffect(() => { setIscompMounted(true) }, [])

    React.useEffect(() => {
        if (iscompMounted && ispdfjsLibReady && ispdfjsViewerReady) {
            const pdfViewerApplication = PDFViewerApplicationWarp()
            if (pdfViewerApplication && pdfViewerApplication.open) {
                pdfViewerApplication.initUI()
                setPDFViewerApplication(pdfViewerApplication)
            }
        }
    }, [iscompMounted, ispdfjsLibReady, ispdfjsViewerReady])
    // React.useEffect(() => {
    //     if (iscompMounted && pdfjsLib && pdfjsViewer) {
    //         const pdfViewerApplication = PDFViewerApplicationWarp(pdfjsLib, pdfjsViewer)
    //         if (pdfViewerApplication && pdfViewerApplication.open) {
    //             pdfViewerApplication.initUI()
    //             setPDFViewerApplication(pdfViewerApplication)
    //         }
    //     }
    // }, [iscompMounted, pdfjsLib, pdfjsViewer])
    React.useEffect(() => {
        if (PDFViewerApplication) {
            PDFViewerApplication.open({ url })
        }
    }, [PDFViewerApplication])
    return (
        <div>
            {/* <PdfViewerjs /> */}
            {/* <Pdfjs /> */}
            <ViewerCSS />
            <PdfViewerCSS />
            <header>
                <h1 id="title" />
            </header>

            <div id="viewerContainer">
                <div id="viewer" className="pdfViewer" />
            </div>

            <div id="loadingBar">
                <div className="progress" />
                <div className="glimmer" />
            </div>

            <div id="errorWrapper" hidden={true}>
                <div id="errorMessageLeft">
                    <span id="errorMessage" />

                    <button id="errorShowMore">
                        More Information
                    </button>
                    <button id="errorShowLess">
                        Less Information
                    </button>
                </div>
                <div id="errorMessageRight">
                    <button id="errorClose">
                        Close
                    </button>
                </div>
                <div className="clearBoth" />
                <textarea id="errorMoreInfo" hidden={true} readOnly="readonly" />
            </div>

            <footer>
                <button className="toolbarButton pageUp" title="Previous Page" id="previous"></button>
                <button className="toolbarButton pageDown" title="Next Page" id="next"></button>

                <input placeholder='Page - 1' type="number" id="pageNumber" className="toolbarField pageNumber" size="4" min="1" />

                <button className="toolbarButton zoomOut" title="Zoom Out" id="zoomOut"></button>
                <button className="toolbarButton zoomIn" title="Zoom In" id="zoomIn"></button>
            </footer>

        </div>
    )
}
