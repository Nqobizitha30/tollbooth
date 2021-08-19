window.addEventListener("load", async function () {
	const data = await fetch("/tollbooth_current_admin");
	const currentAdmin = await data.json();

	if (!currentAdmin) document.location.pathname = "/admin";

	displayName(currentAdmin.boothName);
	displayHistory(currentAdmin.history);
});

const displayName = (name) =>
	(document.getElementById("booth-name").textContent = name);

const displayHistory = async (history) => {
	history.forEach((element, index) => {
		const row = document.createElement("tr");
		const countColumn = document.createElement("td");
		const nameColumn = document.createElement("td");
		const regColumn = document.createElement("td");
		const amountColumn = document.createElement("td");

		amountColumn.textContent = element.amount;
		countColumn.textContent = index + 1;
		nameColumn.textContent = element.user.name;
		regColumn.textContent = element.user.regNumber;

		row.appendChild(countColumn);
		row.appendChild(nameColumn);
		row.appendChild(regColumn);
		row.appendChild(amountColumn);

		document.querySelector("tbody").appendChild(row);
	});
};
