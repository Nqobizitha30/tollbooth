window.addEventListener("load", async function () {
  const data = await fetch("/tollbooth_current_user");
  const currentUser = await data.json();
  console.log(currentUser);
});
