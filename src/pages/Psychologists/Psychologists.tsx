import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  fetchPsychologists,
  type Psychologist,
} from "../../services/psychologistsService";
import { useEffect, useState, useMemo } from "react";
import css from "./Psychologists.module.css";
import Icon from "../../components/Icon/Icon";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/AuthContext";

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

type AppointmentValues = {
  name: string;
  number: string;
  time: string;
  email: string;
  comment: string;
};

const appointmentSchema = yup
  .object({
    name: yup.string().required("Name is required"),
    number: yup.string().required("Phone number is required"),
    time: yup.string().required("Meeting time is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    comment: yup.string().required("Comment is required"),
  })
  .required();

const timeOptions: string[] = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

export default function Psychologists() {
  const [items, setItems] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [, setPhone] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterOption>("a-z");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] =
    useState<Psychologist | null>(null);

  const [meetingTimeOpen, setMeetingTimeOpen] = useState(false);
  const [meetingTime, setMeetingTime] = useState<string>("");

  const { user, isLoggedIn } = useAuth()
  const [favoritesId, setFavoritesId] = useState<string[]>([])

  const {
    register,
    handleSubmit: formHandleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AppointmentValues>({
    resolver: yupResolver(appointmentSchema),
    mode: "onSubmit",
  });

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

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if(!user) {
      setFavoritesId([])
      return
    }

    const key = `favorites_${user.uid}`
    const raw = localStorage.getItem(key)
    if(!raw) return

    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setFavoritesId(parsed)
      }
    } catch (e) {
      console.error(e)
    }
  }, [user])

  const saveFavorites = (ids: string[]) => {
    if(!user) return 
    localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(ids))
  }

  const handleToggleFavorite = (id: string) => {
    if(!isLoggedIn || !user) {
      toast('This fucntion is available only for authorized users')
      return
    }

    setFavoritesId((prev) => {
      const isFav = prev.includes(id)
      const next = isFav ? prev.filter((fav) => fav !== id) : [...prev, id]

      saveFavorites(next)
      return next
    })

  }

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

  if (loading)
    return (
      <div className={css.loader}>
        <ClipLoader size={32} />
      </div>
    );
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

  const handleOpenModal = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPsychologist(null);
    setPhone("");
    setMeetingTime("");
  };

  const onSubmit = (data: AppointmentValues) => {
    if (!selectedPsychologist) return;

    const payload = {
      psychologistName: selectedPsychologist.name,
      ...data,
    };

    console.log(payload);

    toast.success("Your appointment request has been sent successfully");

    reset();
    setMeetingTime("");
    handleCloseModal();
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
          const isFav = favoritesId.includes(p.name)

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
                      <button type="button" className={css.like_btn} onClick={() => handleToggleFavorite(p.name)}>
                      <Icon
                        className={css.like}
                        name={isFav ? 'like-on' : 'like'}
                        width={26}
                        height={26}
                      />
                      </button>
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
                      {p.reviews.map((review, index) => (
                        <li
                          key={`${review.reviewer}-${index}`}
                          className={css.review}
                        >
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
                    <button
                      type="button"
                      className={css.btn_appointment}
                      onClick={() => handleOpenModal(p)}
                    >
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

      {isModalOpen && selectedPsychologist && (
        <div className={css.modal_backdrop} onClick={handleCloseModal}>
          <div className={css.modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={css.modal_close}
              onClick={handleCloseModal}
            >
              <Icon name="close" width={20} height={20} />
            </button>
            <h2 className={css.modal_title}>
              Make an appointment with a psychologists
            </h2>
            <p className={css.modal_text}>
              You are on the verge of changing your life for the better. Fill
              out the short form below to book your personal appointment with a
              professional psychologist. We guarantee confidentiality and
              respect for your privacy.
            </p>
            <div className={css.psychologist_modal}>
              <div className={css.modal_avatar}>
                <img
                  src={selectedPsychologist.avatar_url}
                  alt={selectedPsychologist.name}
                  width={44}
                  height={44}
                  className={css.modal_img}
                />
              </div>
              <div className={css.psychologist_info}>
                <span className={css.modal_psychologist}>
                  Your psychologists
                </span>
                <span className={css.modal_name}>
                  {selectedPsychologist.name}
                </span>
              </div>
            </div>

            <form
              onSubmit={formHandleSubmit(onSubmit)}
              className={css.modal_form}
            >
              <div className={css.field}>
                <input
                  className={css.modal_input}
                  type="text"
                  placeholder="Name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className={css.error}>{errors.name.message}</p>
                )}
              </div>
              <div className={css.row}>
                <div className={css.field}>
                  <div className={css.phone}>
                    <span className={css.phone_prefix}>+380</span>
                    <input
                      className={css.phone_input}
                      type="tel"
                      {...register("number")}
                    />
                  </div>
                  {errors.number && (
                    <p className={css.error}>{errors.number.message}</p>
                  )}
                </div>
                <div className={css.field}>
                  <div className={css.time_wrapper}>
                    <div className={css.time_wrap}>
                    <input
                      className={css.time_input}
                      type="text"
                      readOnly
                      value={meetingTime}
                      {...register("time")}
                      onClick={() => setMeetingTimeOpen((o) => !o)}
                      placeholder="00:00"
                    />
                    <button
                      type="button"
                      value={meetingTime}
                      className={css.time_btn}
                      onClick={() => setMeetingTimeOpen((o) => !o)}
                    >
                      <Icon
                        className={css.clock}
                        name="clock"
                        width={20}
                        height={20}
                      />
                    </button>
                    </div>
                    {meetingTimeOpen && (
                      <div className={css.time_dropdown}>
                        <span className={css.dropdown_text}>Meeting time</span>
                        <ul className={css.time_list}>
                          {timeOptions.map((t) => (
                            <li key={t}>
                              <button
                                type="button"
                                className={`${css.time_item} ${
                                  meetingTime === t ? css.time_item_active : ""
                                }`}
                                onClick={() => {
                                  setMeetingTime(t);
                                  setValue("time", t, { shouldValidate: true });
                                  setMeetingTimeOpen(false);
                                }}
                              >
                                {t}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {errors.time && (
                    <p className={css.error}>{errors.time.message}</p>
                  )}
                </div>
              </div>
              <div className={css.field}>
                <input
                  className={css.modal_input}
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className={css.error}>{errors.email.message}</p>
                )}
              </div>
              <div className={css.field}>
                <textarea
                  className={css.comment_input}
                  placeholder="Comment"
                  {...register("comment")}
                />
                {errors.comment && (
                  <p className={css.error}>{errors.comment.message}</p>
                )}
              </div>
              <button className={css.btn_submit}>Send</button>
            </form>
          </div>
        </div>
      )}

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
