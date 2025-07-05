import { User } from "../models/user.model";
import { addUser, getUsers } from "./users.service";
import "./usersForm.scss";


const usersForm = document.getElementById("users-form") as HTMLFormElement;
const imeInput = document.getElementById("ime") as HTMLInputElement;
const prezimeInput = document.getElementById("prezime") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const godinaInput = document.getElementById("godina") as HTMLInputElement;
const usersList = document.getElementById("users-list") as HTMLDivElement;

usersForm.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const noviUser: User = {
    id: crypto.randomUUID(),
    ime: imeInput.value.trim(),
    prezime: prezimeInput.value.trim(),
    email: emailInput.value.trim(),
    godina: parseInt(godinaInput.value.trim())
  };

  addUser(noviUser);
  renderUsers();
  usersForm.reset();
});

function renderUsers(): void {
  usersList.innerHTML = "";

  const users = getUsers();
  users.forEach(user => {
    const div = document.createElement("div");
    div.textContent = `${user.ime} ${user.prezime} (${user.email}) - ${user.godina}`;
    usersList.appendChild(div);
  });
}
