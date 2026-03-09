import React from "react"
import "./PersonCard.scss"

const PersonCard = ({ person, onClick }) => {
  if (!person) return null

  const imgBaseUrl = "https://image.tmdb.org/t/p/w500"
  const backupImg = "https://via.placeholder.com/500x750?text=No+Photo"

  const imageUrl =
    person && person.profile_path
      ? `${imgBaseUrl}${person.profile_path}`
      : backupImg

  return (
    <div
      className="person-card fade-in"
      onClick={() => onClick && onClick(person)}
    >
      <div className="image-container">
        <img
          src={imageUrl}
          alt={person.name}
          className="person-image"
          loading="lazy"
        />
      </div>
      <div className="person-info">
        <h3 className="person-name">{person.name}</h3>
        <p className="person-department">
          {person.known_for_department || "Actor"}
        </p>
        {person.known_for && person.known_for.length > 0 && (
          <div className="known-for">
            <span>Known for: </span>
            {person.known_for
              .slice(0, 2)
              .map((k) => k.title || k.name)
              .join(", ")}
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonCard
