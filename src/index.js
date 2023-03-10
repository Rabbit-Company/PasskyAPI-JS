import Passky from "./passky";

let options = ['server', 'username', 'token', 'masterPassword', 'email', 'otp', 'passwordID', 'passwords', 'encrypted'];

document.getElementById('endpoints').addEventListener('change', () => {
	let endpoint = document.getElementById('endpoints').value;
	document.getElementById('output').innerText = "";

	hideAllOptions();

	if(endpoint === 'getInfo') showOptions(['server']);
	if(endpoint === 'getStats') showOptions(['server']);
	if(endpoint === 'getReport') showOptions(['server']);
	if(endpoint === 'createAccount') showOptions(['server', 'username', 'masterPassword', 'email']);
	if(endpoint === 'getToken') showOptions(['server', 'username', 'masterPassword', 'otp', 'encrypted']);
	if(endpoint === 'getPasswords') showOptions(['server', 'username', 'token', 'masterPassword', 'encrypted']);
	if(endpoint === 'savePassword') showOptions(['server', 'username', 'token', 'masterPassword', 'passwords']);
	if(endpoint === 'editPassword') showOptions(['server', 'username', 'token', 'masterPassword', 'passwordID', 'passwords']);
	if(endpoint === 'deletePassword') showOptions(['server', 'username', 'token', 'passwordID']);
});

document.getElementById('btn-submit').addEventListener('click', () => {
	let endpoint = document.getElementById('endpoints').value;
	document.getElementById('output').innerText = "";

	if(endpoint === 'getInfo') getInfo();
	if(endpoint === 'getStats') getStats();
	if(endpoint === 'getReport') getReport();
	if(endpoint === 'createAccount') createAccount();
	if(endpoint === 'getToken') getToken();
	if(endpoint === 'getPasswords') getPasswords();
	if(endpoint === 'savePassword') savePassword();
	if(endpoint === 'editPassword') editPassword();
	if(endpoint === 'deletePassword') deletePassword();
});

async function getInfo(){
	let server = document.getElementById('server').value;
	Passky.getInfo(server).then(response => {
		document.getElementById('output').innerText = JSON.stringify(response, null, 2);
	}).catch(err => {
		document.getElementById('output').innerText = "Error code: " + err;
	});
}

async function getStats(){
	let server = document.getElementById('server').value;
	Passky.getStats(server).then(response => {
		document.getElementById('output').innerText = JSON.stringify(response, null, 2);
	}).catch(err => {
		document.getElementById('output').innerText = "Error code: " + err;
	});
}

async function getReport(){
	let server = document.getElementById('server').value;
	Passky.getReport(server).then(response => {
		document.getElementById('output').innerText = JSON.stringify(response, null, 2);
	}).catch(err => {
		document.getElementById('output').innerText = "Error code: " + err;
	});
}

async function createAccount(){
	let server = document.getElementById('server').value;
	let username = document.getElementById('username').value;
	let masterPassword = document.getElementById('masterPassword').value;
	let email = document.getElementById('email').value;

	Passky.createAccount(server, username, masterPassword, email).then(response => {
		document.getElementById('output').innerText = JSON.stringify(response, null, 2);
	}).catch(err => {
		document.getElementById('output').innerText = "Error code: " + err;
	});
}

async function getToken(){
	let server = document.getElementById('server').value;
	let username = document.getElementById('username').value;
	let masterPassword = document.getElementById('masterPassword').value;
	let otp = document.getElementById('otp').value;
	let encrypted = document.getElementById('encrypted').checked;

	Passky.getToken(server, username, masterPassword, otp, encrypted).then(response => {
		document.getElementById('output').innerText = JSON.stringify(response, null, 2);
	}).catch(err => {
		document.getElementById('output').innerText = "Error code: " + err;
	});
}

async function getPasswords(){
	let server = document.getElementById('server').value;
	let username = document.getElementById('username').value;
	let token = document.getElementById('token').value;
	let masterPassword = document.getElementById('masterPassword').value;
	let encrypted = document.getElementById('encrypted').checked;

	Passky.getPasswords(server, username, token, masterPassword, encrypted).then(response => {
		document.getElementById('output').innerText = JSON.stringify(response, null, 2);
	}).catch(err => {
		document.getElementById('output').innerText = "Error code: " + err;
	});
}

async function savePassword(){
	let server = document.getElementById('server').value;
	let username = document.getElementById('username').value;
	let token = document.getElementById('token').value;
	let masterPassword = document.getElementById('masterPassword').value;

	let pWebsite = document.getElementById('pWebsite').value;
	let pUsername = document.getElementById('pUsername').value;
	let pPassword = document.getElementById('pPassword').value;
	let pMessage = document.getElementById('pMessage').value;

	Passky.savePassword(server, username, token, masterPassword, [pWebsite, pUsername, pPassword, pMessage]).then(response => {
		document.getElementById('output').innerText = JSON.stringify(response, null, 2);
	}).catch(err => {
		document.getElementById('output').innerText = "Error code: " + err;
	});
}

async function editPassword(){
	let server = document.getElementById('server').value;
	let username = document.getElementById('username').value;
	let token = document.getElementById('token').value;
	let masterPassword = document.getElementById('masterPassword').value;
	let passwordID = document.getElementById('passwordID').value;

	let pWebsite = document.getElementById('pWebsite').value;
	let pUsername = document.getElementById('pUsername').value;
	let pPassword = document.getElementById('pPassword').value;
	let pMessage = document.getElementById('pMessage').value;

	Passky.editPassword(server, username, token, masterPassword, passwordID, [pWebsite, pUsername, pPassword, pMessage]).then(response => {
		document.getElementById('output').innerText = JSON.stringify(response, null, 2);
	}).catch(err => {
		document.getElementById('output').innerText = "Error code: " + err;
	});
}

async function deletePassword(){
	let server = document.getElementById('server').value;
	let username = document.getElementById('username').value;
	let token = document.getElementById('token').value;
	let passwordID = document.getElementById('passwordID').value;

	Passky.deletePassword(server, username, token, passwordID).then(response => {
		document.getElementById('output').innerText = JSON.stringify(response, null, 2);
	}).catch(err => {
		document.getElementById('output').innerText = "Error code: " + err;
	});
}

function showOptions(options){
	options.forEach(option => {
		document.getElementById('l-' + option).style = "display: block";
	});
}

function hideAllOptions(){
	options.forEach(option => {
		document.getElementById('l-' + option).style = "display: none;";
	});
}