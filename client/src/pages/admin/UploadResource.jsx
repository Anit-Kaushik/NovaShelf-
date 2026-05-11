import { useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";

const UploadResource = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !category || !type || !file) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();//formdata->Used when sending:files , pdf, images

      formData.append("title", title);
      formData.append("category", category);
      formData.append("file", file);
      formData.append("type", type);

      await API.post("/resources/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",//multipart/form-data->means browser send input field and files together
        },
      });

      toast.success("Resource uploaded");

      setTitle("");
      setCategory("");
      setFile(null);

    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Resource</h2>

      <form onSubmit={handleUpload}>

        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

       <div>
  <select
    value={type}
    onChange={(e) => setType(e.target.value)}
  >
    <option value="">Select Type</option>

    <option value="pdf">PDF</option>

    <option value="notes">Notes</option>

    <option value="ebook">E-Book</option>

    <option value="question-paper">Question Paper</option>

    <option value="assignment">Assignment</option>
  </select>
</div>

        <div>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>

      </form>
    </div>
  );
};

export default UploadResource;