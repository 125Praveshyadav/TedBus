import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ImagePlus, MapPin, Tag, ArrowLeft, Loader2, Send } from "lucide-react";
import usePosts from "../../hooks/usePosts";
import { toast } from "react-toastify";

const CreatePost = () => {
  const navigate = useNavigate();
  const { createNewPost, loading } = usePosts();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    postType: "story",
    source: "",
    destination: "",
    tags: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Form input handle karna
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image selection handle karna
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    
    setImages([...images, ...files]);

    // Preview generate karna
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  // Selected image remove karna
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Title and content are required!");
      return;
    }

    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("content", formData.content);
    postData.append("postType", formData.postType);
    
    if (formData.source) postData.append("source", formData.source);
    if (formData.destination) postData.append("destination", formData.destination);
    if (formData.tags) postData.append("tags", formData.tags);

    // Images append karna
    images.forEach((img) => {
      postData.append("images", img);
    });

    const success = await createNewPost(postData);
    if (success) {
      navigate("/community"); // Post banne ke baad feed par bhej do
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <Link 
          to="/community" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Community
        </Link>

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
          <h1 className="text-3xl font-black text-slate-900 mb-8">Create a <span className="text-red-600">Post</span></h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Post Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. My amazing journey to Manali"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white transition-colors outline-none font-medium text-slate-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Post Type</label>
                <select
                  name="postType"
                  value={formData.postType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white transition-colors outline-none font-medium text-slate-800 cursor-pointer"
                >
                  <option value="story">Travel Story</option>
                  <option value="tip">Travel Tip</option>
                  <option value="photo">Photo Gallery</option>
                  <option value="discussion">Discussion</option>
                </select>
              </div>
            </div>

            {/* Route (Optional) */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin size={16} className="text-red-500" />
                Add Route (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="Source City (e.g. Delhi)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-red-500 outline-none text-sm font-medium"
                />
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Destination City (e.g. Jaipur)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-red-500 outline-none text-sm font-medium"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Your Story / Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                placeholder="Write your experience, tips, or ask a question..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white transition-colors outline-none font-medium text-slate-800 resize-none"
                required
              ></textarea>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Tag size={16} className="text-slate-400" />
                Tags (Comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. budget, night-travel, volvo"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white transition-colors outline-none font-medium text-slate-800"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <ImagePlus size={16} className="text-blue-500" />
                Add Photos (Max 5)
              </label>
              
              <div className="flex flex-wrap gap-4">
                {/* Previews */}
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                {/* Upload Button */}
                {images.length < 5 && (
                  <label className="w-24 h-24 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-red-500 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors">
                    <ImagePlus size={24} />
                    <span className="text-xs font-bold">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-2xl font-black shadow-[0px_8px_16px_rgba(220,38,38,0.3)] hover:bg-red-700 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default CreatePost;