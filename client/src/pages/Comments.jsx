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
    <div>
      <h2>Comments Section</h2>

      {/*///////////////////////////adding input box for new comments and add button////////////*/}

      <input //create text field for writing new comment
        type="text"
        placeholder="Write comment..."
        value={text}
        onChange={(e) => setText(e.target.value)} //as input field changed value in text state changes
      />

      <button onClick={handleAddComment} disabled={adding}>
            {adding ? "Adding..." : "Add Comment"}
      </button>

      {/*////////////////////////////////////////////////////////////////////////////////////////*/}

      {/*//////////////////////////////// conatianer for Showing  comments //////////////////////////2*/}
      <div style={{Height:"50vh"}}>
        {comments.map(
          (
            c, //loop through all comments. c=single comment obj
          ) => (
            <div
              key={c._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "8px",
              }}
            >
              {/*comment must have unique key so id from db is used as key*/}

              {/*///////////////show editing box or comment box ////////////////////////*/}
              {editingId === c._id ? ( //means if user click edit button
                <span>
                  
                  <strong>{c.userName}</strong>:
                  <input
                    value={editText} //input box for editing comment
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {    //on press enter save edited comment
                     if (e.key === "Enter") {
                        handleUpdate(c._id);
                        }
                    }}
                  />
                </span>
              ) : (
                <span>
                  <strong>{c.userName}</strong>
                  <small style={{ marginLeft: "8px", color: "gray" }}>
                   {formatTime(c.createdAt)}  {/*pass comment time in function and get stnadard formate of time and print it */}
                  </small>    {/*small tag is used for less imporant text then normal text */}
                  <br/>
                  <span>{c.text}</span>
                  {/*show c.text=>commment of that c object*/}
                </span>
              )}
              {/*/////////////////////editing box and comment box ends here/////////////////////////////////////////////////// */}

              {/*//////////////show save,edit button also show delete button for admin,user */}
             {(user?.role === "admin" || user?.id === c.user) && (
  <div style={{ display: "flex", gap: "8px" }}>

    {/* ✏️ EDIT ONLY FOR NORMAL USER (OWNER ONLY) */}
    {user?.role !== "admin" && user?.id === c.user && (
      editingId === c._id ? (
        <>
          <button
            onClick={() => handleUpdate(c._id)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => {
              setEditingId(null);
              setEditText("");
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setEditingId(c._id);
            setEditText(c.text);
          }}
        >
          Edit
        </button>
      )
    )}

    {/* 🗑️ DELETE FOR BOTH ADMIN + OWNER */}
    {(user?.role === "admin" || user?.id === c.user) && (
      <button
        onClick={() => handleDelete(c._id)}
        disabled={deletingId === c._id}
        style={{ color: "red" }}
      >
        {deletingId === c._id ? "Deleting..." : "Delete"}
      </button>
    )}

  </div>
)}

              {/*////////////////////save,edit,delete ends here ///////////////////////////////////////////////////// */}
            </div>
          ),
        )}
        <div ref={loaderRef}></div>
      </div>

      {/*////////////////////container showing comments ends here //////////////////////////////////////////////////// */}
      
      {/*////////////////////for prev and next page move//////////////////////////////////////////////////// */}
      

      {/*///////////////////////////prev,next ends here ///////////////////////////////////////////// */}

    </div>
  );
};

export default Comments;
