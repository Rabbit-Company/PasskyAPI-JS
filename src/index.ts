import { PasskyAPI, type StandardResponse } from "./passky-api";

const server = document.getElementById("server") as HTMLInputElement;
const username = document.getElementById("username") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const responses = document.getElementById("responses");

const loginPage = document.getElementById("login-page");
const loggedInPage = document.getElementById("loggedin-page");

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
	const res = await account.getToken();
	printResponse(res);

	if (res.error === 0 || res.error === 8) {
		await account.generateEncryptionHash();
		if (loginPage) loginPage.style.display = "none";
		if (loggedInPage) loggedInPage.style.display = "block";
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
});

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
