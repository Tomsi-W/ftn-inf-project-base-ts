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
const submitButton = usersForm.querySelector("button[type='submit']") as HTMLButtonElement;

let editingUserId: string | null = null;

// Űrlap megjelenítése új felhasználó hozzáadásához
showFormBtn.addEventListener("click", () => {
  usersForm.style.display = "block";
  showFormBtn.style.display = "none";
  submitButton.textContent = "Dodaj korisnika";
  editingUserId = null;
});

// Felhasználó hozzáadása vagy szerkesztése
usersForm.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const user: User = {
    id: editingUserId ?? crypto.randomUUID(),
    ime: imeInput.value.trim(),
    prezime: prezimeInput.value.trim(),
    email: emailInput.value.trim(),
    godina: parseInt(godinaInput.value.trim())
  };

  if (editingUserId) {
    updateUser(user);
  } else {
    addUser(user);
  }

  renderUsers();
  usersForm.reset();
  usersForm.style.display = "none";
  showFormBtn.style.display = "inline-block";
  submitButton.textContent = "Dodaj korisnika";
  editingUserId = null;
});

// Lista kirajzolása szerkesztés + törlés gombokkal
function renderUsers(): void {
  usersList.innerHTML = "";

  const users = getUsers();
  users.forEach(user => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${user.ime} ${user.prezime} (${user.email}) - ${user.godina}
      <button data-id="${user.id}" class="edit-btn">Izmeni</button>
      <button data-id="${user.id}" class="delete-btn">Obriši</button>
    `;
    usersList.appendChild(div);
  });

  const editButtons = usersList.querySelectorAll(".edit-btn");
  editButtons.forEach(button => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      const user = getUsers().find(u => u.id === id);
      if (user) {
        imeInput.value = user.ime;
        prezimeInput.value = user.prezime;
        emailInput.value = user.email;
        godinaInput.value = user.godina.toString();
        editingUserId = user.id;

        usersForm.style.display = "block";
        showFormBtn.style.display = "none";
        submitButton.textContent = "Sačuvaj izmene";
      }
    });
  });

  const deleteButtons = usersList.querySelectorAll(".delete-btn");
  deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      deleteUser(id);
      renderUsers(); // újrarenderelés törlés után
    });
  });
}

// Kezdeti lista betöltése
renderUsers();
