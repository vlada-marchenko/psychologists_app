// import { db } from "../../firebase/firebase"
// import { collection, getDocs } from "firebase/firestore"
import {
  fetchPsychologists,
  type Psychologist,
} from "../../services/psychologistsService";
import { useEffect, useState, useMemo } from "react";
import css from "./Psychologists.module.css";
import Icon from "../../components/Icon/Icon";

type FilterOption =
  | "a-z"
  | "z-a"
  | "lt-10"
  | "gt-10"
  | "popular"
  | "not-popular"
  | "all";

const FilterLabels: Record<FilterOption, string> = {
  "a-z": "A to Z",
  "z-a": "Z to A",
  "lt-10": "Less than 10$",
  "gt-10": "More than 10$",
  popular: "Popular",
  "not-popular": "Not Popular",
  all: "Show all",
};

export default function Psychologists() {
  const [items, setItems] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterOption>("a-z");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPsychologists();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredItems = useMemo(() => {
    let arr = [...items];

    if (filter === "a-z") {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filter === "z-a") {
      arr.sort((a, b) => b.name.localeCompare(a.name));
    } else if (filter === "lt-10") {
      arr = arr.filter((p) => p.price_per_hour < 10);
    } else if (filter === "gt-10") {
      arr = arr.filter((p) => p.price_per_hour >= 10);
    } else if (filter === "popular") {
      arr = arr.filter((p) => p.rating >= 4.7);
    } else if (filter === "not-popular") {
      arr = arr.filter((p) => p.rating < 4.7);
    }
    return arr;
  }, [items, filter]);

  if (loading) return <p className={css.loader}>Loading....</p>;
  if (!filteredItems.length)
    return <p className={css.loader}>No psychologists found</p>;

  const visibleItems = filteredItems.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  const handleSelectFilter = (value: FilterOption) => {
    setFilter(value);
    setFilterOpen(false);
    setVisibleCount(3);
  };

  return (
    <div className={css.psychologists}>
      <div className={css.filters}>
        <span className={css.filters_label}>Filters</span>
        <div className={css.dropdown}>
          <button
            className={css.btn_dropdown}
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
          >
            <span className={css.dropdown_span}>{FilterLabels[filter]}</span>
            <Icon
              className={css.dropdown_icon}
              name={filterOpen ? "arrow-up" : "arrow-down"}
              width={10}
              height={5}
            />
          </button>
          {filterOpen && (
            <ul className={css.dropdown_list}>
              {(
                [
                  "a-z",
                  "z-a",
                  "lt-10",
                  "gt-10",
                  "popular",
                  "not-popular",
                  "all",
                ] as FilterOption[]
              ).map((option) => (
                <li key={option}>
                  <button
                    className={`${css.dropdown_item} ${
                      filter === option ? css.dropdown_itemActive : ""
                    }`}
                    type="button"
                    onClick={() => handleSelectFilter(option)}
                  >
                    {FilterLabels[option]}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <ul className={css.list}>
        {visibleItems.map((p, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <li key={index} className={css.item}>
              <div className={css.avatar}>
                <img
                  className={css.img}
                  src={p.avatar_url}
                  alt={p.name}
                  width={216}
                  height={216}
                />
              </div>
              <div className={css.info}>
                <div className={css.item_header}>
                  <div className={css.name_cont}>
                    <h3 className={css.title}>Psychologist</h3>
                    <h2 className={css.name}>{p.name}</h2>
                  </div>
                  <div className={css.right_side}>
                    <div className={css.rating}>
                      <Icon name="star" width={16} height={16} />
                      <span className={css.rating_text}>
                        Rating: {p.rating}
                      </span>
                    </div>
                    <span className={css.span}>|</span>
                    <div className={css.price_like}>
                      <span className={css.price}>
                        Price / 1 hour: <span>{p.price_per_hour}$</span>
                      </span>
                      <Icon
                        className={css.like}
                        name="like"
                        width={26}
                        height={26}
                      />
                    </div>
                  </div>
                </div>
                <div className={css.tag_row}>
                  <div className={css.tag}>
                    <span className={css.tag_label}>Experience:</span>
                    <span className={css.tag_value}>{p.experience}</span>
                  </div>

                  <div className={css.tag}>
                    <span className={css.tag_label}>License:</span>
                    <span className={css.tag_value}>{p.license}</span>
                  </div>

                  <div className={css.tag}>
                    <span className={css.tag_label}>Specialization:</span>
                    <span className={css.tag_value}>{p.specialization}</span>
                  </div>

                  <div className={css.tag}>
                    <span className={css.tag_label}>Initial consultation:</span>
                    <span className={css.tag_value}>
                      {p.initial_consultation}
                    </span>
                  </div>
                </div>
                <p className={css.about}>{p.about} </p>

                {isExpanded && (
                  <div className={css.extra}>
                    <ul className={css.reviews}>
                      {p.reviews.map((review) => (
                        <li className={css.review}>
                          <div className={css.name_container}>
                            <div className={css.person_avatar}>
                              {review.reviewer.slice(0, 1)}
                            </div>
                            <div className={css.name_rating}>
                              <span className={css.name_reviewer}>
                                {review.reviewer}
                              </span>
                              <div className={css.rating_review}>
                                <Icon name="star" width={16} height={16} />
                                <span className={css.rating_count}>
                                  {review.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className={css.comment}>{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                    <button type="button" className={css.btn_appointment}>
                      Make an appointment
                    </button>
                  </div>
                )}

                {!isExpanded && (
                  <button
                    type="button"
                    className={css.btn_readmore}
                    onClick={() => setExpandedIndex(index)}
                  >
                    Read more
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className={css.btn_loadmore}
        onClick={() => handleLoadMore()}
      >
        Load more
      </button>
    </div>
  );
}
