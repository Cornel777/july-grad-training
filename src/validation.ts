window.onload = (e: Event) => {
  let header = document.getElementById("root");
  header.addEventListener("click", () => {
    header.innerText = "";
  });
};
