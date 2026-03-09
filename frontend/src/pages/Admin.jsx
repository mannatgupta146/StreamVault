import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import AdminLogin from "./AdminLogin"
import {
  getMovies,
  createMovie,
  deleteMovie,
  updateMovie,
} from "../features/movies/movieSlice"
import { getUsers, deleteUser, banUser } from "../features/admin/adminSlice"
import "./Admin.scss"

const Admin = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    poster_path: "",
    backdrop_path: "",
    category: "Movies",
    tmdb_id: "",
    release_date: "",
    trailer_url: "",
    genre: "",
  })

  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  const {
    title,
    description,
    poster_path,
    backdrop_path,
    category,
    tmdb_id,
    release_date,
    trailer_url,
    genre,
  } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { movies, isLoading } = useSelector((state) => state.movies)
  const { users, isLoading: usersLoading } = useSelector((state) => state.admin)

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(getMovies())
      dispatch(getUsers())
    }
  }, [user, dispatch])

  if (!user || user.role !== "admin") {
    return <AdminLogin />
  }

  if (user.role !== "admin") {
    return null
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (editMode) {
      dispatch(updateMovie({ id: editId, ...formData }))
      setEditMode(false)
      setEditId(null)
    } else {
      dispatch(createMovie(formData))
    }

    setFormData({
      title: "",
      description: "",
      poster_path: "",
      backdrop_path: "",
      category: "Movies",
      tmdb_id: "",
      release_date: "",
      trailer_url: "",
      genre: "",
    })
  }

  const handleEditClick = (movie) => {
    setEditMode(true)
    setEditId(movie._id)
    setFormData({
      title: movie.title || "",
      description: movie.description || "",
      poster_path: movie.poster_path || "",
      backdrop_path: movie.backdrop_path || "",
      category: movie.category || "Movies",
      tmdb_id: movie.tmdb_id || "",
      release_date: movie.release_date || "",
      trailer_url: movie.trailer_url || "",
      genre: movie.genre || "",
    })
  }

  const cancelEdit = () => {
    setEditMode(false)
    setEditId(null)
    setFormData({
      title: "",
      description: "",
      poster_path: "",
      backdrop_path: "",
      category: "Movies",
      tmdb_id: "",
      release_date: "",
      trailer_url: "",
      genre: "",
    })
  }

  if (isLoading || usersLoading) {
    return (
      <div className="page fade-in">
        <h1>Loading Admin Panel...</h1>
      </div>
    )
  }

  return (
    <div className="page admin-page fade-in">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage movies and moderate platform users.</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card add-movie-form">
          <h2>{editMode ? "Edit Movie" : "Add New Movie"}</h2>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                placeholder="Movie Title"
                required
              />
            </div>
            <div className="form-group dual">
              <input
                type="text"
                name="tmdb_id"
                value={tmdb_id}
                onChange={onChange}
                placeholder="TMDB ID"
              />
              <input
                type="text"
                name="release_date"
                value={release_date}
                onChange={onChange}
                placeholder="Release Year"
              />
            </div>
            <div className="form-group dual">
              <input
                type="text"
                name="genre"
                value={genre}
                onChange={onChange}
                placeholder="Genre"
              />
              <select name="category" value={category} onChange={onChange}>
                <option value="Trending">Trending</option>
                <option value="Popular">Popular</option>
                <option value="Movies">Movies</option>
                <option value="TV Shows">TV Shows</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="text"
                name="poster_path"
                value={poster_path}
                onChange={onChange}
                placeholder="Poster Image URL"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="backdrop_path"
                value={backdrop_path}
                onChange={onChange}
                placeholder="Backdrop Image URL"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="trailer_url"
                value={trailer_url}
                onChange={onChange}
                placeholder="YouTube Trailer URL/Key"
              />
            </div>
            <div className="form-group">
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Description"
                required
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-submit" type="submit">
                {editMode ? "Update Movie" : "Add Movie"}
              </button>
              {editMode && (
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-card movie-list">
          <h2>Movie Database ({movies?.length || 0})</h2>
          {movies && movies.length > 0 ? (
            <ul className="admin-items">
              {movies.map((movie) => (
                <li key={movie._id} className="admin-item">
                  <div className="item-info">
                    <strong>{movie.title}</strong>
                    <span>{movie.category}</span>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClick(movie)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => dispatch(deleteMovie(movie._id))}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No movies in the database.</p>
          )}
        </div>

        <div className="admin-card user-list" style={{ gridColumn: "1 / -1" }}>
          <h2>User Moderation ({users?.length || 0})</h2>
          {users && users.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className={u.banned ? "banned-row" : ""}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      {u.banned ? (
                        <span className="status-banned">Banned</span>
                      ) : (
                        <span className="status-active">Active</span>
                      )}
                    </td>
                    <td className="table-actions">
                      {u.role !== "admin" && (
                        <>
                          <button
                            className={`btn-ban ${u.banned ? "unban" : ""}`}
                            onClick={() =>
                              dispatch(
                                banUser({ id: u._id, banned: !u.banned }),
                              )
                            }
                          >
                            {u.banned ? "Unban" : "Ban"}
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => dispatch(deleteUser(u._id))}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
