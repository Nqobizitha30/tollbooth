window.addEventListener("load", async function () {
	const data = await fetch("/tollbooth_current_user");
	const currentUser = await data.json();

	if (!currentUser) window.location.pathname = "/";

	display(currentUser);
});

function display(currentUser) {
	//display currentUser name
	const nameContainer = document.querySelector("#name span");
	nameContainer.textContent = currentUser.name;
	document.title = `${currentUser.name} Tollbooth Management System`;
	//display currentUser reg number
	const regContainer = document.querySelector("#reg span");
	regContainer.textContent = currentUser.regNumber;
	//display currentUser balance
	const balanceContainer = document.querySelector("#balance span");
	balanceContainer.textContent = currentUser.balance;
	//display user activity
	displayActivity(currentUser.activity);
}

function displayActivity(activities) {
	//make table row
	for (let activity of activities) {
		const tableRow = document.createElement("tr");
		const boothColumn = document.createElement("td");
		const amaountColumn = document.createElement("td");

		//input data
		boothColumn.textContent = activity.boothName;
		amaountColumn.textContent = activity.amount;
		//linking td-tr
		tableRow.appendChild(boothColumn);
		tableRow.appendChild(amaountColumn);
		//linking table row to html table
		const table = document.querySelector(".activity table");
		table.appendChild(tableRow);
	}
}
