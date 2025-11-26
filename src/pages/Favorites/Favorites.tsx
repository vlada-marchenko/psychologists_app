import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";


export default function Favorites() {
    // in Favorites page
const { user } = useAuth();
const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

useEffect(() => {
  if (!user) return;
  const raw = localStorage.getItem(`favorites_${user.uid}`);
  if (!raw) return;
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) setFavoriteIds(parsed);
}, [user]);

const favoritePsychologists = items.filter((p) => favoriteIds.includes(p.id));

}