# Psychologists App

This is a learning project — a small web application for browsing psychologists and booking a consultation.  
A user can see a list of psychologists, filter them by different criteria, add some to favourites, and send a request for an appointment.

---

## What this project is about

The idea is simple:

- show a catalogue of psychologists with key information (experience, specialization, license, price, rating, reviews);
- allow the user to:
  - browse the list and open more details;
  - add psychologists to a **Favourites** list using a heart button;
  - fill in a form to request an appointment via a modal window.

Favourites are tied to the currently logged-in user and are stored so they don’t disappear after a page refresh.

---

## Tech stack

The project uses:

- **React + TypeScript** – main UI and logic.
- **React Router** – navigation between pages (psychologists, favourites, login/register).
- **Authentication** (via `AuthContext`, e.g. Firebase Auth) – handling logged-in users.
- **localStorage** – storing each user’s list of favourite psychologists  
  (key format: `favorites_<userId>`).
- **react-hook-form** + **yup** – forms and validation (appointment form).
- **react-hot-toast** – toast notifications (success messages, “only for authorized users”, etc.).
- **react-spinners** – loading spinner while fetching data.
- **CSS Modules** – component-scoped styles.
- Custom **Icon** component – SVG icons (including `like` and `like-on` for the heart button).

---

## UI & layout

The interface is designed as a modern specialists catalogue:

### Psychologists page

Each psychologist card includes:

- avatar;
- name and title;
- experience, specialization, license;
- price per hour and rating;
- short “about” text;
- reviews (shown when the card is expanded).

Main interactions:

- **Filters**: sort and filter psychologists by name, price and popularity.
- **Read more** button: expands the card and shows reviews and the appointment button.
- **Heart button**:
  - outlined heart (`like`) – psychologist is **not** in favourites;
  - filled heart (`like-on`) – psychologist **is** in favourites.
- **Make an appointment** button: opens a modal with a request form.

### Favourites page

- Shows only those psychologists that the user has added to favourites.
- Uses the same card layout, design and filters as the main page.
- The heart icon is in the active (filled) state, and clicking it again removes the psychologist from favourites.

If you have a design in Figma or a PDF, you can add the link here, for example:

> Design (mockup): `[link to design](https://...)`

---

## Requirements / Technical specification

### 1. Psychologists list page

- Fetch the list of psychologists from the API using `fetchPsychologists`.
- For each psychologist display:
  - avatar (`avatar_url`);
  - name;
  - experience;
  - license;
  - specialization;
  - initial consultation info;
  - rating;
  - price per hour;
  - reviews (inside the expanded section).

- Implement filters:
  - **A to Z / Z to A** – sorting by name;
  - **Less than 10$ / More than 10$** – filtering by price;
  - **Popular / Not popular** – filtering by rating;
  - **Show all** – show the full list.

### 2. Heart button & favourites logic

- For a **non-authorized user**:
  - when clicking the heart, show a modal or toast notification that this feature is only available for authorized users.

- For an **authorized user**:
  - on the first click:
    - add the psychologist to the favourites list for that user  
      (stored in `localStorage` under `favorites_<userId>`);
    - change icon from `like` (outline) to `like-on` (filled).
  - on repeated click:
    - remove the psychologist from the favourites list;
    - switch the icon back to the outlined state.

- Favourites state:
  - read from `localStorage` when the page loads;
  - stored per user with key `favorites_${user.uid}`;
  - persists after page refresh.

### 3. Favourites page

- Access:
  - only available for logged-in users;
  - if the user is not logged in, show a message like  
    _“Please log in to see your favourite psychologists.”_

- Logic:
  - fetch all psychologists from the API;
  - filter only those whose `name` (or `id`, depending on implementation) is in `favoriteIds` from `localStorage`;
  - apply the same filters (A–Z, price, popular, show all).

- UI:
  - reuse the same card layout as on the main psychologists page;
  - heart icon is shown as active (`like-on`);
  - clicking the heart removes the psychologist from favourites and from the list.

### 4. Appointment modal

- Opens when the user clicks `Make an appointment`.
- Form fields:
  - **Name**
  - **Phone number** (with prefix +380)
  - **Meeting time** (selected from a dropdown based on `timeOptions`)
  - **Email**
  - **Comment**

- Validation (with `yup` + `react-hook-form`):
  - all fields are required;
  - email must be valid.

- On successful submit:
  - show a success toast (`toast.success`);
  - clear the form;
  - close the modal.

---

## Example project structure

```text
src/
  components/
    Icon/
      Icon.tsx
  context/
    AuthContext.tsx
  pages/
    Psychologists/
      Psychologists.tsx
      Psychologists.module.css
    Favorites/
      Favorites.tsx
      Favorites.module.css
  services/
    psychologistsService.ts
