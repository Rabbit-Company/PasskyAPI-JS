import { PasskyAPI, type Password, type PasswordData, type StandardResponse } from "./passky-api";

const server = document.getElementById("server") as HTMLInputElement;
const username = document.getElementById("username") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const responses = document.getElementById("responses");

const loginPage = document.getElementById("login-page");
const loggedInPage = document.getElementById("loggedin-page");

const passwordsTable = document.getElementById("table-passwords") as HTMLTableElement;

const passwordsID = document.getElementById("input-passwords-id") as HTMLInputElement;
const passwordsWebsite = document.getElementById("input-passwords-website") as HTMLInputElement;
const passwordsUsername = document.getElementById("input-passwords-username") as HTMLInputElement;
const passwordsPassword = document.getElementById("input-passwords-password") as HTMLInputElement;
const passwordsMessage = document.getElementById("input-passwords-message") as HTMLTextAreaElement;

let account: PasskyAPI;
let counter = 1;
let latency = Date.now();

document.getElementById("btn-create-account")?.addEventListener("click", async () => {
	if (!server || !username || !email || !password) return;

	latency = Date.now();

	let account = new PasskyAPI(server.value, username.value, password.value);
	await account.generateAuthenticationHash();
	const res = await account.createAccount(email.value);
	printResponse(res);
});

document.getElementById("btn-get-token")?.addEventListener("click", async () => {
	if (!server || !username || !password) return;

	latency = Date.now();
	account = new PasskyAPI(server.value, username.value, password.value);
	await account.generateAuthenticationHash();
	await account.generateEncryptionHash();
	const res = await account.getToken();
	printResponse(res);

	if (res.error === 0 || res.error === 8) {
		if (loginPage) loginPage.style.display = "none";
		if (loggedInPage) loggedInPage.style.display = "block";

		if (Array.isArray(res.passwords)) {
			populatePasswordsTable(account.decryptPasswords(res.passwords) || []);
		}
	}
});

document.getElementById("btn-delete-account")?.addEventListener("click", async () => {
	latency = Date.now();
	const res = await account.deleteAccount();
	printResponse(res);

	if (res.error === 0) {
		if (loginPage) loginPage.style.display = "block";
		if (loggedInPage) loggedInPage.style.display = "none";
	}
});

document.getElementById("btn-delete-passwords")?.addEventListener("click", async () => {
	latency = Date.now();
	const res = await account.deletePasswords();
	printResponse(res);

	if (res.error === 0) populatePasswordsTable([]);
});

document.getElementById("btn-save-password")?.addEventListener("click", async () => {
	latency = Date.now();

	const passwordData: PasswordData = {
		website: passwordsWebsite.value,
		username: passwordsUsername.value,
		password: passwordsPassword.value,
		message: passwordsMessage.value,
	};

	const res = await account.savePassword(passwordData);
	printResponse(res);

	if (res.error === 0) await refreshPasswordTable();
});

document.getElementById("btn-edit-password")?.addEventListener("click", async () => {
	latency = Date.now();

	const passwordData: Password = {
		id: Number(passwordsID.value),
		website: passwordsWebsite.value,
		username: passwordsUsername.value,
		password: passwordsPassword.value,
		message: passwordsMessage.value,
	};

	const res = await account.editPassword(passwordData);
	printResponse(res);

	if (res.error === 0) await refreshPasswordTable();
});

document.addEventListener("click", async (event) => {
	if (!event.target) return;

	const target = event.target as HTMLElement;

	if (target.classList.contains("btn-password-delete")) {
		const passwordID = target.getAttribute("data-password-id");
		if (passwordID) {
			const res = await account.deletePassword(passwordID);
			if (res.error === 0) await refreshPasswordTable();
		}
	}
});

function populatePasswordsTable(passwords: Password[]) {
	passwordsTable.innerHTML = `
		<tr>
			<th>ID</th>
			<th>Website</th>
			<th>Username</th>
			<th>Password</th>
			<th>Message</th>
			<th>Action</th>
		</tr>
	`;

	passwords.forEach((passwordData) => {
		passwordsTable.innerHTML += `
			<tr>
				<td>${passwordData.id}</td>
				<td>${passwordData.website}</td>
				<td>${passwordData.username}</td>
				<td>${passwordData.password}</td>
				<td>${passwordData.message}</td>
				<td><button class="btn-password-delete" data-password-id="${passwordData.id}">Delete</button></td>
			</tr>
		`;
	});
}

async function refreshPasswordTable() {
	const res = await account.getPasswords();
	if (res.error === 0 || res.error === 8) populatePasswordsTable(account.decryptPasswords(res.passwords || []) || []);
}

function printResponse(response: StandardResponse) {
	if (!responses) return;

	const date = new Date().toISOString().split("T")[0];
	const time = new Date().toISOString().split("T")[1].split(".")[0];

	responses.innerHTML += `<p class="response ${Number(response.error) === 0 || Number(response.error) === 8 ? "green" : "red"}">${counter}. ${date} ${time} - ${
		Date.now() - latency
	}ms<br /><br />${JSON.stringify(response, null, 4)}</p>`;
	counter++;
	responses.scrollTop = responses.scrollHeight;
}
