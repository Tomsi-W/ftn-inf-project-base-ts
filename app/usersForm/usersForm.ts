import { User } from "../models/user.model";
import { addUser, getUsers, updateUser, deleteUser } from "../services/users.service";
import "./usersForm.scss";

// HTML elemek
const usersForm = document.getElementById("users-form") as HTMLFormElement;
const showFormBtn = document.getElementById("show-form-btn") as HTMLButtonElement;
const imeInput = document.getElementById("ime") as HTMLInputElement;
const prezimeInput = document.getElementById("prezime") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const godinaInput = document.getElementById("godina") as HTMLInputElement;
const usersList = document.getElementById("users-list") as HTMLDivElement;

const saveBtn = document.getElementById("saveBtn") as HTMLButtonElement;         // új: mentés gomb ID-vel
const tooltip = document.getElementById("saveTooltip") as HTMLElement;          // új: tooltip elem
const formError = document.getElementById("formError") as HTMLElement;          // új: hibaüzenet hely
const spinnerOverlay = document.getElementById("globalSpinner") as HTMLElement; // új: globális spinner

let editingUserId: string | null = null;
let tooltipTimer: number | null = null;

// ---------------------------
// Razmatranje (Megfontolás)
// - hover/focus után 1–2 mp múlva tooltip
// ---------------------------
function showTooltipDelayed(): void {
  if (tooltipTimer) {
    clearTimeout(tooltipTimer);
    tooltipTimer = null;
  }
  tooltipTimer = window.setTimeout(() => {
    tooltip.setAttribute("data-visible", "true");
    tooltip.setAttribute("aria-hidden", "false");
  }, 1200); // 1,2 mp késleltetés
}
function hideTooltip(): void {
  if (tooltipTimer) {
    clearTimeout(tooltipTimer);
    tooltipTimer = null;
  }
  tooltip.removeAttribute("data-visible");
  tooltip.setAttribute("aria-hidden", "true");
}
saveBtn.addEventListener("mouseenter", showTooltipDelayed);
saveBtn.addEventListener("mouseleave", hideTooltip);
saveBtn.addEventListener("focus", showTooltipDelayed);
saveBtn.addEventListener("blur", hideTooltip);

// ---------------------------
// Form megnyitása új felhasználóhoz
// ---------------------------
showFormBtn.addEventListener("click", () => {
  usersForm.style.display = "block";
  showFormBtn.style.display = "none";
  saveBtn.textContent = "Dodaj korisnika";
  editingUserId = null;
  formError.textContent = "";
});

// ---------------------------
// Mentés (Iniciranje, Izvršavanje, Prikaz rezultata)
// ---------------------------
usersForm.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();

  const user: User = {
    id: editingUserId ?? crypto.randomUUID(),
    ime: imeInput.value.trim(),
    prezime: prezimeInput.value.trim(),
    email: emailInput.value.trim(),
    godina: parseInt(godinaInput.value.trim(), 10)
  };

  // Iniciranje: gomb letiltása, szürkítés (CSS :disabled), hiba törlése
  saveBtn.disabled = true;
  saveBtn.setAttribute("aria-busy", "true");
  formError.textContent = "";

  // Izvršavanje: spinner megjelenítése
  spinnerOverlay.removeAttribute("hidden");

  try {
    // Itt most lokális „szolgáltatás” hívás van (sync),
    // de a szerkezet kész egy valódi HTTP kéréshez is.
    if (editingUserId) {
      updateUser(user);
    } else {
      addUser(user);
    }

    // Sikeres eredmény: lista frissítése, form elrejtése
    renderUsers();
    usersForm.reset();
    usersForm.style.display = "none";
    showFormBtn.style.display = "inline-block";
    saveBtn.textContent = "Dodaj korisnika";
    editingUserId = null;
  } catch {
    // Prikaz rezultata (hiba): üzenet + gomb újra engedélyezése
    formError.textContent = "Greška pri čuvanju korisnika.";
  } finally {
    // Izvršavanje vége: spinner elrejtése és gomb felszabadítása
    spinnerOverlay.setAttribute("hidden", "");
    saveBtn.disabled = false;
    saveBtn.removeAttribute("aria-busy");
  }
});

// ---------------------------
// Lista kirajzolása szerkesztés + törlés gombokkal
// ---------------------------
function renderUsers(): void {
  usersList.innerHTML = "";

  const arr = getUsers();
  arr.forEach((user) => {
    const container = document.createElement("div");
    container.innerHTML = `
      ${user.ime} ${user.prezime} (${user.email}) - ${user.godina}
      <button data-id="${user.id}" class="edit-btn">Izmeni</button>
      <button data-id="${user.id}" class="delete-btn">Obriši</button>
    `;
    usersList.appendChild(container);
  });

  const editButtons = usersList.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      const found = getUsers().find((u) => u.id === id);
      if (!found) {
        return;
      }
      imeInput.value = found.ime;
      prezimeInput.value = found.prezime;
      emailInput.value = found.email;
      godinaInput.value = String(found.godina);
      editingUserId = found.id;

      usersForm.style.display = "block";
      showFormBtn.style.display = "none";
      saveBtn.textContent = "Sačuvaj izmene";
      formError.textContent = "";
    });
  });

  const deleteButtons = usersList.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      deleteUser(id);
      renderUsers(); // újrarenderelés törlés után
    });
  });
}

// Kezdeti lista betöltése
renderUsers();
