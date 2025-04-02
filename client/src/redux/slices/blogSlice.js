import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create Blog
export const createBlog = createAsyncThunk(
  "blog/create",
  async ({ title, textBody, topic, image }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://blog-applicattionserver.vercel.app/api/blog/createBlog",
        { title, textBody, topic, image },
        {
          headers: { "x-auth-token": token },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get All Blogs
export const getAllBlogs = createAsyncThunk(
  "blog/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://blog-applicattionserver.vercel.app/api/blog/readAllBlogs"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get Single Blog
export const getBlogById = createAsyncThunk(
  "blog/getById",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://blog-applicattionserver.vercel.app/api/blog/readBlog/${blogId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update Blog
export const updateBlog = createAsyncThunk(
  "blog/update",
  async ({ blogId, title, textBody, topic, image }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.patch(
        `https://blog-applicattionserver.vercel.app/api/blog/editBlog/${blogId}`,
        { title, textBody, topic, image },
        {
          headers: { "x-auth-token": token },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete Blog
export const deleteBlog = createAsyncThunk(
  "blog/delete",
  async (blogId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `https://blog-applicattionserver.vercel.app/api/blog/deleteBlog/${blogId}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      return blogId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add Comment
export const addComment = createAsyncThunk(
  "blog/addComment",
  async ({ blogId, text }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `https://blog-applicattionserver.vercel.app/api/blog/comment/${blogId}`,
        { text },
        {
          headers: { "x-auth-token": token },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  success: false,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload);
        state.success = true;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create blog";
      })

      // Get All Blogs
      .addCase(getAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch blogs";
      })

      // Get Single Blog
      .addCase(getBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch blog";
      })

      // Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
        state.blogs = state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
        state.success = true;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update blog";
      })

      // Delete Blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete blog";
      })

      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentBlog) {
          state.currentBlog.comments = [
            ...state.currentBlog.comments,
            action.payload,
          ];
        }
        state.success = true;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add comment";
      });
  },
});

export const { clearError, clearSuccess, clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;
