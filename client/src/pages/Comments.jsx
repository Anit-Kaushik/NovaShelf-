import { useState, useEffect, useContext , useRef} from "react"; //useState->store data that can change (comment,inputfield)
//useEffect->run when component loads/updates(usually for fetching comments)
import API from "../api/axios"; //used to call backend api shortly
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";//this lib. show small popup notification in react app

const Comments = ({ pdfId }) => {
  //create funcitonal component
  const loaderRef = useRef(null);
  
  const { user } = useContext(AuthContext); //get user state from global state
  
  const [comments, setComments] = useState([]); //comments store list(array) of comments
  const [text, setText] = useState(""); //text → stores input box value (new comment)
  const [totalPages, setTotalPages] = useState(1); //total pages from comments pagination process
  const [currentPage, setCurrentPage] = useState(1); //current page which we want to see
  const [limit] = useState(10); //for changing limit(no. of comments per pg) of comments
  const [adding, setAdding] = useState(false);//add comment request running
  const [saving, setSaving] = useState(false);//edit save request running
  const [deletingId, setDeletingId] = useState(null);//which comment is deleting now 
  
  const [loadingMore, setLoadingMore] = useState(false);//it is a flag that tells “Is an API request currently running?”

  useEffect(() => {
    //run code after component render
    if(pdfId){
    fetchComments(1);//load 1st pg only once when page load(pg appear on first time on screen)
    } 
  }, [pdfId]); //this effect run only once

  useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    const target = entries[0];

    if (target.isIntersecting && currentPage < totalPages && !loadingMore) {
      fetchComments(currentPage + 1);
    }
  });

  if (loaderRef.current) {
    observer.observe(loaderRef.current);
  }

  return () => {
    if (loaderRef.current) {
      observer.unobserve(loaderRef.current);
    }
  };
}, [currentPage, totalPages, loadingMore]);

  


  

  const fetchComments = async (page = 1) => { //This function fetches comments from the server page by page.”
    
    if(!pdfId) return;

    try {
     
      setLoadingMore(true);//“I am now fetching comments, block new requests of fetching comments”
      const res = await API.get(
        `/comments/${pdfId}?page=${page}&limit=${limit}`,
      );
      
      // if first page → replace comments
    // if next pages → append comments
    setComments((prev) => //his updates the comments in React state.
      page === 1    //if pg is 1st then replace Comments state data with res.data.comments or comments of 1st pg
        ? res.data.comments
        : [...prev, ...res.data.comments]  //if pg is not 1st then keep prev. pages comment in Comment state and add new page comments also
    );
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }finally {
    setLoadingMore(false);//“Request finished, now allow new scroll loads”
    
  }
  };

  const handleAddComment = async () => {

    const cleanText = text.trim();//remove starting and ending space from text enter by user
    if (!cleanText) { //if cleanText is empty then
    alert("Comment cannot be empty");
    return;
  }

    try {
       setAdding(true);//show adding... in button since here backend start
      await API.post(`/comments/${pdfId}`, {
        //send post request to backend with pdfid as param

        text: cleanText, //this Sends typed comment text
      });

       toast.success("Comment added");

      setText(""); //Clears input box after comment is added successfully.

      fetchComments(currentPage); //call function to load comments again using current page
    } catch (error) {
       toast.error(error.response?.data?.message || "Something went wrong");
    }
     finally { 
       setAdding(false);//means when request of adding comment successful or fail then button again show "add comment"
    }
  };

  const handleDelete = async (commentId) => {
    //get comment id from comment state on which we click

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(commentId);
      await API.delete(`/comments/${commentId}`); //call comment delete api with comment id
       
      toast.success("Comment deleted");

      const newPage = //if pg has only one comment then after deletion pg go to previous pg and show that pg comments
        comments.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;

      fetchComments(currentPage); //get comments after successfull deletion
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    finally{
      setDeletingId(null);
    }
  };

  const [editingId, setEditingId] = useState(null); //editingId = which comment is being edited , id of comment
  const [editText, setEditText] = useState(""); //text inside edit input

  const handleUpdate = async (commentId) => {

     const cleanText = editText.trim();//remove starting and ending space from edited text 
     if (!cleanText) {
    alert("Comment cannot be empty");
    return;
    }

    //handle update in comment
    try {
      setSaving(true);
      await API.put(`/comments/${commentId}`, {
        text: cleanText,
      }); //when user click save  then req go to backend
      
      toast.success("Comment updated");

      setEditingId(null); //setting state to null as now no editing comment is working
      setEditText(""); //set this state also empty (make ready for new comment edition)

      fetchComments(currentPage); //fetch comments after updation
     } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
    }
    finally {
     setSaving(false);
    }
  };


  const formatTime = (time) => { //Create a function named formatTime.It accepts one input called time
  
  const now = new Date();//Get current date and current time right now
  const past = new Date(time);//Take comment created time.Convert it into JavaScript Date object.give actual time when comment created

  const diffMs = now - past;//subract old time from present time(time diff. inn milliseconds)
  const diffMin = Math.floor(diffMs / 60000); //converts ms into minutes
  const diffHour = Math.floor(diffMin / 60);//converts min into hours 
  const diffDay = Math.floor(diffHour / 24);//into days

  if (diffMin < 1) return "Just now";  //if diff in minutes is less than one minute
  if (diffMin < 60) return `${diffMin} min ago`;//if diff is less then 1 hour but greater than 1 minute
  if (diffHour < 24) return `${diffHour} hour ago`;//if diff is less than 24 hours but more than 1 hour
  if (diffDay === 1) return "Yesterday";//if diff day is 1 
  if (diffDay < 7) return `${diffDay} days ago`;//diff is less than one week 
  return past.toLocaleString();//if old than one week show date and time when created
};

return (
  <div className="min-h-screen bg-white p-6">

    {/* Heading */}
    <div className="mb-8">

      <h1
        className="text-4xl font-black text-[#0F766E]"
        style={{ fontFamily: "'Ibarra Real Nova', serif" }}
      >
        NovaShelf
      </h1>

      <h2 className="text-2xl font-bold text-gray-800 mt-2">
        Comments
      </h2>

    </div>

    {/* Add Comment */}
    <div className="flex gap-3 mb-8">

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#0F766E] flex items-center justify-center text-white font-bold">
        {user?.name?.charAt(0)}
      </div>

      <div className="flex-1">

        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border-b border-gray-300 pb-2 outline-none focus:border-[#0F766E] bg-transparent text-black"
        />

        <div className="flex justify-end mt-3">

          <button
            onClick={handleAddComment}
            disabled={adding}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white px-5 py-2 rounded-full font-medium"
          >
            {adding ? "Adding..." : "Comment"}
          </button>

        </div>

      </div>

    </div>

    {/* Comments List */}
    <div className="space-y-6">

      {comments.map((c) => (

        <div
          key={c._id}
          className="flex gap-3"
        >

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#0F766E] flex items-center justify-center text-white font-bold flex-shrink-0">
            {c.userName?.charAt(0)}
          </div>

          {/* Content */}
          <div className="flex-1">

            <div className="flex items-center gap-2">

              <h3 className="font-semibold text-gray-800">
                {c.userName}
              </h3>

              <small className="text-gray-500">
                {formatTime(c.createdAt)}
              </small>

            </div>

            {/* Edit Input */}
            {editingId === c._id ? (

              <div className="mt-2">

                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdate(c._id);
                    }
                  }}
                  className="w-full border-b border-gray-300 pb-2 outline-none focus:border-[#0F766E] text-black"
                />

                <div className="flex gap-2 mt-3">

                  <button
                    onClick={() => handleUpdate(c._id)}
                    disabled={saving}
                    className="bg-[#0F766E] text-white px-4 py-1 rounded-full text-sm"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                    className="bg-gray-200 px-4 py-1 rounded-full text-sm"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            ) : (

              <p className="text-gray-800 mt-1 break-words">
                {c.text}
              </p>

            )}

            {/* Buttons */}
            {(user?.role === "admin" || user?.id === c.user) && (

              <div className="flex gap-4 mt-3 text-sm">

                {user?.role !== "admin" && user?.id === c.user && editingId !== c._id && (

                  <button
                    onClick={() => {
                      setEditingId(c._id);
                      setEditText(c.text);
                    }}
                    className="text-[#0F766E] font-medium hover:underline"
                  >
                    Edit
                  </button>

                )}

                <button
                  onClick={() => handleDelete(c._id)}
                  disabled={deletingId === c._id}
                  className="text-red-500 font-medium hover:underline"
                >
                  {deletingId === c._id ? "Deleting..." : "Delete"}
                </button>

              </div>

            )}

          </div>

        </div>

      ))}

      <div ref={loaderRef}></div>

    </div>

  </div>
);
};

export default Comments;
