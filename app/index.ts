import "./usersForm/usersForm";

fetch("./usersForm/usersForm.html")
  .then(res => res.text())
  .then(html => {
    const main = document.getElementById("main");
    if (main) {
      main.innerHTML = html;
    }
  });
