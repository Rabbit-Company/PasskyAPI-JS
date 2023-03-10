import Validate from './validate';
import XChaCha20 from '@rabbit-company/xchacha20';

export default class Passky{

	static getInfo(server){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);

			fetch(server + "?action=getInfo").then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
		});
	}

	static getStats(server){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);

			fetch(server + "?action=getStats").then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
		});
	}

	static getReport(server){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);

			fetch(server + "?action=getReport").then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
		});
	}

	static createAccount(server, username, password, email){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.email(email)) return reject(1007);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.password(password)) return reject(1006);

			let data = new FormData();
			data.append("email", email);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + password));

			fetch(server + "?action=createAccount", {
				method: "POST",
				headers: headers,
				body: data
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					console.log(error);
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static getToken(server, username, password, otp = "", encrypted = true){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.password(password)) return reject(1006);
			if(!Validate.otp(otp)) return reject(1002);

			let data = new FormData();
			data.append("otp", otp);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + password));

			fetch(server + "?action=getToken", {
				method: "POST",
				headers: headers,
				body: data
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					let data = JSON.parse(response);
					if(!encrypted && data.passwords != null){
						for(let i = 0; i < data.passwords.length; i++){
							data.passwords[i].website = XChaCha20.decrypt(data.passwords[i].website, password);
							data.passwords[i].username = XChaCha20.decrypt(data.passwords[i].username, password);
							data.passwords[i].password = XChaCha20.decrypt(data.passwords[i].password, password);
							data.passwords[i].message = XChaCha20.decrypt(data.passwords[i].message, password);
						}
					}
					return resolve(data);
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static getPasswords(server, username, token, password = "", encrypted = true){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);
			if(!encrypted && !Validate.password(password)) return reject(1006);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

			fetch(server + "?action=getPasswords", {
				method: "POST",
				headers: headers
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					let data = JSON.parse(response);
					if(!encrypted && data.passwords != null){
						for(let i = 0; i < data.passwords.length; i++){
							data.passwords[i].website = XChaCha20.decrypt(data.passwords[i].website, password);
							data.passwords[i].username = XChaCha20.decrypt(data.passwords[i].username, password);
							data.passwords[i].password = XChaCha20.decrypt(data.passwords[i].password, password);
							data.passwords[i].message = XChaCha20.decrypt(data.passwords[i].message, password);
						}
					}
					return resolve(data);
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static savePassword(server, username, token, password, [pWebsite, pUsername, pPassword, pMessage]){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);
			if(!Validate.password(password)) return reject(1006);

			if(!Validate.pWebsite(pWebsite)) return reject(1008);
			if(!Validate.pUsername(pUsername)) return reject(1009);
			if(!Validate.pPassword(pPassword)) return reject(1010);
			if(!Validate.pMessage(pMessage)) return reject(1011);

			pWebsite = XChaCha20.encrypt(pWebsite, password);
			pUsername = XChaCha20.encrypt(pUsername, password);
			pPassword = XChaCha20.encrypt(pPassword, password);
			pMessage = XChaCha20.encrypt(pMessage, password);

			if(pWebsite.length > 255) return reject(1008);
			if(pUsername.length > 255) return reject(1009);
			if(pPassword.length > 255) return reject(1010);
			if(pMessage.length > 10000) return reject(1011);

			let data = new FormData();
			data.append("website", pWebsite);
			data.append("username", pUsername);
			data.append("password", pPassword);
			data.append("message", pMessage);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

			fetch(server + "?action=savePassword", {
				method: "POST",
				headers: headers,
				body: data
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static editPassword(server, username, token, password, passwordID, [pWebsite, pUsername, pPassword, pMessage]){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);
			if(!Validate.password(password)) return reject(1006);
			if(!Validate.positiveInteger(passwordID)) return reject(1012);
			if(!Validate.pWebsite(pWebsite)) return reject(1008);
			if(!Validate.pUsername(pUsername)) return reject(1009);
			if(!Validate.pPassword(pPassword)) return reject(1010);
			if(!Validate.pMessage(pMessage)) return reject(1011);

			pWebsite = XChaCha20.encrypt(pWebsite, password);
			pUsername = XChaCha20.encrypt(pUsername, password);
			pPassword = XChaCha20.encrypt(pPassword, password);
			pMessage = XChaCha20.encrypt(pMessage, password);

			if(pWebsite.length > 255) return reject(1008);
			if(pUsername.length > 255) return reject(1009);
			if(pPassword.length > 255) return reject(1010);
			if(pMessage.length > 10000) return reject(1011);

			let data = new FormData();
			data.append("password_id", passwordID);
			data.append("website", pWebsite);
			data.append("username", pUsername);
			data.append("password", pPassword);
			data.append("message", pMessage);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

			fetch(server + "?action=editPassword", {
				method: "POST",
				headers: headers,
				body: data
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static deletePassword(server, username, token, passwordID){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);
			if(!Validate.positiveInteger(passwordID)) return reject(1012);

			let data = new FormData();
			data.append("password_id", passwordID);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

			fetch(server + "?action=deletePassword", {
				method: "POST",
				headers: headers,
				body: data
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static deletePasswords(server, username, token){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

			fetch(server + "?action=deletePasswords", {
				method: "POST",
				headers: headers
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static deleteAccount(server, username, token){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

			fetch(server + "?action=deleteAccount", {
				method: "POST",
				headers: headers
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static enable2FA(server, username, token){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

			fetch(server + "?action=enable2fa", {
				method: "POST",
				headers: headers
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static disable2FA(server, username, token){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

			fetch(server + "?action=disable2fa", {
				method: "POST",
				headers: headers
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static addYubiKey(server, username, token, id){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);
			if(!Validate.yubiKey(id)) return reject(1004);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

			let data = new FormData();
			data.append("id", id);

			fetch(server + "?action=addYubiKey", {
				method: "POST",
				headers: headers,
				body: data
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static removeYubiKey(server, username, token, id){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);
			if(!Validate.yubiKey(id)) return reject(1004);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

			let data = new FormData();
			data.append("id", id);

			fetch(server + "?action=removeYubiKey", {
				method: "POST",
				headers: headers,
				body: data
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static forgotUsername(server, email){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.email(email)) return reject(1007);

			let data = new FormData();
			data.append("email", email);

			fetch(server + "?action=forgotUsername", {
				method: "POST",
				body: data
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static upgradeAccount(server, username, token, license){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);
			if(!Validate.license(license)) return reject(1014);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

			let data = new FormData();
			data.append("license", license);

			fetch(server + "?action=upgradeAccount", {
				method: "POST",
				headers: headers,
				body: data
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}

	static importPasswords(server, username, token, passwords, encrypted = false, password = ""){
		return new Promise((resolve, reject) => {
			if(!Validate.url(server)) return reject(1001);
			if(!Validate.username(username)) return reject(1005);
			if(!Validate.token(token)) return reject(1003);

			if(!encrypted){
				if(!Validate.password(password)) return reject(1006);

				for(let i = 0; i < Object.keys(passwords).length; i++){
					passwords[i].website = XChaCha20.encrypt(passwords[i].website, password);
					passwords[i].username = XChaCha20.encrypt(passwords[i].username, password);
					passwords[i].password = XChaCha20.encrypt(passwords[i].password, password);
					if(!Validate.pMessage(passwords[i].message)) passwords[i].message = "";
					passwords[i].message = XChaCha20.encrypt(passwords[i].message, password);
				}
			}

			let importPasswords = [];

			for(let i = 0, j = 0; i < Object.keys(passwords).length; i++){
				if(!(passwords[i].website.length >= 35 && passwords[i].website.length <= 255) || passwords[i].website.indexOf(' ') !== -1) continue;
				if(!(passwords[i].username.length >= 35 && passwords[i].username.length <= 255) || passwords[i].username.indexOf(' ') !== -1) continue;
				if(!(passwords[i].password.length >= 35 && passwords[i].password.length <= 255) || passwords[i].password.indexOf(' ') !== -1) continue;
				if(!(passwords[i].message.length >= 35 && passwords[i].message.length <= 10000) || passwords[i].password.indexOf(' ') !== -1) continue;

				importPasswords[j] = {};
				importPasswords[j]["website"] = passwords[i].website;
				importPasswords[j]["username"] = passwords[i].username;
				importPasswords[j]["password"] = passwords[i].password;
				importPasswords[j]["message"] = passwords[i].message;
				j++;
			}

			if(importPasswords.length == 0) return reject(1013);

			let headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));
			headers.append('Content-Type', 'application/json');

			let data = JSON.stringify(importPasswords);

			fetch(server + "?action=importPasswords", {
				method: "POST",
				headers: headers,
				body: data
			}).then((result) => {
				if (result.status != 200 && result.status != 429) return reject(1000);
				return result.text();
			}).then((response) => {
				try{
					return resolve(JSON.parse(response));
				}catch(error){
					return reject(1000);
				}
			}).catch(() => {
				return reject(1000);
			});
		});
	}
}