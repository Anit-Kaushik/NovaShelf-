import { useState ,  useEffect } from "react";
import { useParams } from "react-router-dom";//Used to read URL parameters
import Comments from "../pages/Comments";

import API from "../api/axios";

const PdfViewer = () => { //func component show pdf viewer and commentsUI

  const { pdfId } = useParams(); //Reads pdfId from URL 
  const [showComments, setShowComments] = useState(false);//state guide whether to show comments on right side or not(only pdf on full screen)
  //false->comments hidden at start , true ->comments shown
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  
 
  
  useEffect(() => {
  const fetchPdf = async () => {
    try {
      const res = await API.get(`/resources/${pdfId}`);
      // setPdfUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
      setPdfUrl(res.data.fileUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchPdf();
}, [pdfId]);

  return (
    <div style={{ height: "calc(100vh - 60px)", overflow: "hidden" }}> {/*A full screen container*/}

    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    height: "40px"
  }}
>
  <h3>Pdf Viewer</h3>
  <button onClick={() => setShowComments(!showComments)}>
    {showComments ? "Hide Comments" : "Show Comments"}
  </button>
  <button onClick={() => window.open(pdfUrl, "_blank")}>
  Fullscreen
</button>

  <button onClick={() => window.open(pdfUrl)}>
    Download
  </button>
</div>

      {/* MAIN AREA */}
       {/* PDF AREA */}

      {!showComments ? (
        <div style={{ height: "100%" }}>
         {loading ? (
  <p>Loading PDF...</p>
) : pdfUrl ? (
  
  <iframe
    src={pdfUrl}
    width="100%"
    height="100%"
    style={{ border: "none" }}
    title="PDF Viewer"
  />
  
) : (
  <p>Failed to load PDF</p>
)}
        </div>
      ) : (
        /* if comments ON */
        <div
          style={{
            display: "flex",
            height: "100%"
          }}
        >
          {/* LEFT = PDF */}
          <div style={{ flex: 2 }}>
           {loading ? (
  <p>Loading PDF...</p>
) : pdfUrl ? (
  
  <iframe
    src={pdfUrl}
    width="100%"
    height="100%"
    style={{ border: "none" }}
    title="PDF Viewer"
  />
 
) : (
  <p>Failed to load PDF</p>
)}
          </div>

          {/* RIGHT = comments */}
          <div
            style={{
               flex: 1,
    borderLeft: "1px solid #ddd",
    padding: "10px",
    overflowY: "auto",
    height: "100%"
            }}
          >
            <h3>Comments</h3>
            <Comments pdfId={pdfId} />
          </div>
        </div>
      )}

    </div>
  );
};

export default PdfViewer;