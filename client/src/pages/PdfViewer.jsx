import { useState ,  useEffect } from "react";
import { useParams } from "react-router-dom";
import Comments from "../pages/Comments";

import API from "../api/axios";

const PdfViewer = () => { 

  const { pdfId } = useParams();
  const [showComments, setShowComments] = useState(false);
  
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  
 
  
  useEffect(() => {
  const fetchPdf = async () => {
    try {
      const res = await API.get(`/resources/${pdfId}`);
    
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
  <div className="h-[calc(100vh-60px)] overflow-hidden bg-[#0F172A] text-white">

   
    <div className="flex justify-between items-center px-6 py-4 border-b border-[#1E293B] bg-[#111827]">

      <h3 className="text-2xl font-bold text-[#CCFBF1]">
        PDF Viewer
      </h3>

      <div className="flex gap-3">

        <button
          onClick={() => setShowComments(!showComments)}
          className="bg-[#0F766E] hover:bg-[#115E59] transition px-4 py-2 rounded-xl font-medium"
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>

        <button
          onClick={() => window.open(pdfUrl, "_blank")}
          className="bg-[#1E293B] hover:bg-[#334155] transition px-4 py-2 rounded-xl font-medium"
        >
          Fullscreen
        </button>

        <button
          onClick={() => window.open(pdfUrl)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] transition px-4 py-2 rounded-xl font-medium"
        >
          Download
        </button>

      </div>

    </div>

    {/* Main Area */}
    {!showComments ? (

      <div className="h-full bg-[#020617]">

        {loading ? (

          <div className="h-full flex items-center justify-center text-lg text-gray-300">
            Loading PDF...
          </div>

        ) : pdfUrl ? (

          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            className="border-none"
            title="PDF Viewer"
          />

        ) : (

          <div className="h-full flex items-center justify-center text-red-400 text-lg">
            Failed to load PDF
          </div>

        )}

      </div>

    ) : (

      <div className="flex h-full">

        {/* PDF Section */}
        <div className="flex-[2] bg-[#020617]">

          {loading ? (

            <div className="h-full flex items-center justify-center text-lg text-gray-300">
              Loading PDF...
            </div>

          ) : pdfUrl ? (

            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              className="border-none"
              title="PDF Viewer"
            />

          ) : (

            <div className="h-full flex items-center justify-center text-red-400 text-lg">
              Failed to load PDF
            </div>

          )}

        </div>

        {/* Comments Section */}
        <div className="flex-1 border-l border-[#1E293B] bg-[#111827] overflow-y-auto p-5">

          <h3 className="text-2xl font-bold text-[#CCFBF1] mb-5">
            Comments
          </h3>

          <Comments pdfId={pdfId} />

        </div>

      </div>

    )}

  </div>
);
};


export default PdfViewer;