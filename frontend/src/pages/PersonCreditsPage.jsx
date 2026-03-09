import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPersonDetails, fetchPersonCredits } from "../utils/tmdb";
import Loader from "../components/Loader";
import MovieCard from "../components/MovieCard";
import "./PersonCreditsPage.scss"; // Create this file

const PersonCreditsPage = () => {
  const [showFullBio, setShowFullBio] = useState(false);
  const { personId } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [personRes, creditsRes] = await Promise.all([
          fetchPersonDetails(personId),
          fetchPersonCredits(personId),
        ]);
        setPerson(personRes.data);
        const allCredits = [...(creditsRes.data.cast || []), ...(creditsRes.data.crew || [])];
        const uniqueCredits = Array.from(new Map(allCredits.map((item) => [item.id, item])).values());
        setCredits(uniqueCredits);
      } catch (e) {
        setPerson(null);
        setCredits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [personId]);

  if (loading) return <div className="page-loader"><Loader count={8} /></div>;
  if (!person) return <div className="error-msg">Person not found.</div>;

  const profileUrl = person.profile_path ? `https://image.tmdb.org/t/p/h632${person.profile_path}` : null;

  return (
    <div className="person-credits-page fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <span className="arrow">←</span> Back
      </button>

      <div className="person-hero">
        <div className="profile-image-container">
          {profileUrl ? (
            <img src={profileUrl} alt={person.name} className="profile-img" />
          ) : (
            <div className="profile-placeholder" />
          )}
        </div>

        <div className="person-details">
          <span className="badge">{person.known_for_department || "Talent"}</span>
          <h1 className="person-name">{person.name}</h1>
          
          {person.birthday && (
            <p className="person-meta">
              <strong>Born:</strong> {new Date(person.birthday).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              {person.place_of_birth && <span className="birth-place"> • {person.place_of_birth}</span>}
            </p>
          )}

          {person.biography && (() => {
            const isMob = window.innerWidth <= 768;
            const LIMIT = 250;
            const isLong = person.biography.length > LIMIT;
            const bioText = isMob && isLong && !showFullBio
              ? person.biography.trim().slice(0, LIMIT) + "..."
              : person.biography.trim();
            return (
              <div className="bio-container">
                <p className="bio-text">{bioText}</p>
                {isMob && isLong && (
                  <button className="bio-toggle" onClick={() => setShowFullBio(!showFullBio)}>
                    {showFullBio ? "Read Less ↑" : "Read Full Bio ↓"}
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      <div className="credits-section">
        <h2 className="section-title">Filmography</h2>
        <div className="credits-grid">
          {credits.map((item) => (
            <MovieCard key={item.id} movie={item} isLargeRow />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonCreditsPage;