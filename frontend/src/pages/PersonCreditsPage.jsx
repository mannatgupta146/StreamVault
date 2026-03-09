import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchPersonDetails, fetchPersonCredits } from "../utils/tmdb"
import Loader from "../components/Loader"
import MovieCard from "../components/MovieCard"

const PersonCreditsPage = () => {
  const { personId } = useParams()
  const [person, setPerson] = useState(null)
  const [credits, setCredits] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [personRes, creditsRes] = await Promise.all([
          fetchPersonDetails(personId),
          fetchPersonCredits(personId),
        ])
        setPerson(personRes.data)
        // Combine cast and crew, remove duplicates
        const allCredits = [
          ...(creditsRes.data.cast || []),
          ...(creditsRes.data.crew || []),
        ]
        const uniqueCredits = Array.from(
          new Map(allCredits.map((item) => [item.id, item])).values(),
        )
        setCredits(uniqueCredits)
      } catch (e) {
        setPerson(null)
        setCredits([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [personId])

  if (loading)
    return (
      <div className="page fade-in" style={{ paddingTop: 80 }}>
        <Loader count={8} />
      </div>
    )
  if (!person)
    return (
      <div className="page fade-in" style={{ paddingTop: 80, color: "#fff" }}>
        Person not found.
      </div>
    )

  return (
    <div
      className="page fade-in"
      style={{ paddingTop: 100, paddingLeft: "4rem", paddingRight: "4rem" }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 24,
          background: "none",
          color: "#fff",
          border: "1px solid #444",
          borderRadius: 6,
          padding: "6px 16px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
      <h1 style={{ marginBottom: 8 }}>{person.name}</h1>
      <div style={{ marginBottom: 24, color: "#aaa" }}>
        {person.known_for_department || "Actor"}
      </div>
      <h2 style={{ marginBottom: 16 }}>All Movies & TV Shows</h2>
      {credits.length === 0 ? (
        <div style={{ color: "#ccc" }}>No credits found.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 32,
          }}
        >
          {credits.map((item) => (
            <MovieCard key={item.id} movie={item} isLargeRow />
          ))}
        </div>
      )}
    </div>
  )
}

export default PersonCreditsPage
