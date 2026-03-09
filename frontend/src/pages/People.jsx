import React, { useState, useEffect } from "react"
import PersonCard from "../components/PersonCard"
import Loader from "../components/Loader"
import { fetchPopularPeople } from "../utils/tmdb"
import { useInfiniteScroll } from "../hooks/useInfiniteScroll"
import { useNavigate } from "react-router-dom"

const People = () => {
  const [people, setPeople] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const navigate = useNavigate()
  const handlePersonClick = (person) => {
    navigate(`/person/${person.id}/credits`)
  }

  const [lastElementRef] = useInfiniteScroll(() => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1)
    }
  })

  useEffect(() => {
    const loadPeople = async () => {
      try {
        if (page === 1) setLoading(true)
        const res = await fetchPopularPeople(page)
        setPeople((prev) =>
          page === 1 ? res.data.results : [...prev, ...res.data.results],
        )
        setHasMore(res.data.page < res.data.total_pages)
      } catch (error) {
        console.error("Error fetching people from TMDB", error)
      }
    }
    loadPeople()
  }, [page])

  return (
    <div>
      <div
        className="page people-page fade-in"
        style={{
          paddingTop: "100px",
          paddingLeft: "4rem",
          paddingRight: "4rem",
        }}
      >
        <h1 style={{ marginBottom: "2rem" }}>Popular People</h1>
        <div
          className="people-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {people.map((person, index) => {
            const isLast = people.length === index + 1
            return (
              <div ref={isLast ? lastElementRef : null} key={person.id}>
                <PersonCard person={person} onClick={handlePersonClick} />
              </div>
            )
          })}
        </div>
      </div>
      {loading && page > 1 && (
        <div style={{ margin: "2rem 0" }}>
          <Loader count={4} />
        </div>
      )}
    </div>
  )
}

export default People
