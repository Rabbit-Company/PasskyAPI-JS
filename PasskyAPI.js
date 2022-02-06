(function(){

	class Validate{

		static username(username){
			if(typeof(username) == 'undefined' || username == null) return false;
			return /^[a-z0-9.]{6,30}$/i.test(username);
		}

		static password(password){
			if(typeof(password) == 'undefined' || password == null) return false;
			return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&,_\(\)\=\-\.])[A-Za-z\d@$!%*#?&,_\(\)\=\-\.]{8,255}$/i.test(password);
		}

		static url(url){
			if(typeof(url) == 'undefined' || url == null) return false;
			return !(/\s/.test(url));
		}

		static email(email){
			if(typeof(email) == 'undefined' || email == null) return false;
			return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i.test(email);
		}

		static otp(otp){
			if(typeof(otp) == 'undefined' || otp == null) return false;
			return (otp.length == 0 || otp.length == 6 || otp.length == 44);
		}

		static token(token){
			if(typeof(token) == 'undefined' || token == null) return false;
			return /^[a-z0-9]{64}$/i.test(token);
		}

		static pWebsite(website){
			if(typeof(website) == 'undefined' || website == null) return false;
			return (website.length >= 5 && website.length <= 255) && !website.includes(" ");
		}

		static pUsername(username){
			if(typeof(username) == 'undefined' || username == null) return false;
			return username.length >= 3 && username.length <= 255;
		}

		static pPassword(password){
			if(typeof(password) == 'undefined' || password == null) return false;
			return password.length >= 5 && password.length <= 255;
		}

		static positiveInteger(number){
			if(typeof(number) == 'undefined' || number == null) return false;
			return number >>> 0 === parseFloat(number);
		}

		static yubiKey(id){
			if(typeof(id) == 'undefined' || id == null) return false;
			return id.length == 44;
		}

		static jsonPasswords(passwords){
			if(typeof(passwords) == 'undefined' || passwords == null) return false;
			for(let i = 0; i < Object.keys(passwords).length; i++){
				if(!this.pWebsite(passwords[i].website)) return false;
				if(!this.pUsername(passwords[i].username)) return false;
				if(!this.pPassword(passwords[i].password)) return false;
			}
			return true;
		}
	}

	class Passky{

		static getInfo(server){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);

				fetch(server + "?action=getInfo").then((result) => {
					if (result.status != 200) reject(505);
						return result.text();
					}).then((response) => {
						try{
							resolve(JSON.parse(response));
						}catch(error){
							reject(505);
						}
					}).catch(() => {
						reject(505);
					});
			});
		}

		static createAccount(server, username, password, email){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.email(email)) reject(2);
				if(!Validate.username(username)) reject(3);
				if(!Validate.password(password)) reject(4);

				password = sha512(password + username + "passky2020");

				let data = new FormData();
				data.append("email", email);
		
				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + password));

				fetch(server + "?action=createAccount", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						resolve(JSON.parse(response));
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}

		static getToken(server, username, password, otp = "", encrypted = true){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.username(username)) reject(2);
				if(!Validate.password(password)) reject(3);
				if(!Validate.otp(otp)) reject(4);

				let data = new FormData();
				data.append("otp", otp);
		
				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + sha512(password + username + "passky2020")));
		
				fetch(server + "?action=getToken", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						let data = JSON.parse(response);
						if(!encrypted && data.passwords != null){
							for(let i = 0; i < data.passwords.length; i++){
								data.passwords[i].password = CryptoJS.AES.decrypt(data.passwords[i].password, password).toString(CryptoJS.enc.Utf8);
								if(data.passwords[i].message != null && typeof(data.passwords[i].message) != 'undefined') data.passwords[i].message = CryptoJS.AES.decrypt(data.passwords[i].message, password).toString(CryptoJS.enc.Utf8);
							}
						}
						resolve(data);
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}

		static getPasswords(server, username, token, password = "", encrypted = true){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.username(username)) reject(2);
				if(!Validate.token(token)) reject(3);
				if(!encrypted && !Validate.password(password)) reject(4);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				fetch(server + "?action=getPasswords", {
					method: "POST",
					headers: headers
				}).then((result) => {
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						let data = JSON.parse(response);
						if(!encrypted && data.passwords != null){
							for(let i = 0; i < data.passwords.length; i++){
								data.passwords[i].password = CryptoJS.AES.decrypt(data.passwords[i].password, password).toString(CryptoJS.enc.Utf8);
								if(data.passwords[i].message != null && typeof(data.passwords[i].message) != 'undefined') data.passwords[i].message = CryptoJS.AES.decrypt(data.passwords[i].message, password).toString(CryptoJS.enc.Utf8);
							}
						}
						resolve(data);
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}

		static savePassword(server, username, token, password, [pWebsite, pUsername, pPassword, pMessage]){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.username(username)) reject(2);
				if(!Validate.token(token)) reject(3);
				if(!Validate.password(password)) reject(4);
	
				if(!Validate.pWebsite(pWebsite)) reject(5);
				if(!Validate.pUsername(pUsername)) reject(6);
				if(!Validate.pPassword(pPassword)) reject(7);
					
				if(pMessage == null || typeof(pMessage) == 'undefined' || pMessage.length == 0) pMessage = "";
	
				pPassword = CryptoJS.AES.encrypt(pPassword, password).toString();
				pMessage = CryptoJS.AES.encrypt(pMessage, password).toString();
	
				if(pMessage.length > 10000) reject(8);
	
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
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						resolve(JSON.parse(response));
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}
	
		static editPassword(server, username, token, password, passwordID, [pWebsite, pUsername, pPassword, pMessage]){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.username(username)) reject(2);
				if(!Validate.token(token)) reject(3);
				if(!Validate.password(password)) reject(4);
				if(!Validate.positiveInteger(passwordID)) reject(5);
				if(!Validate.pWebsite(pWebsite)) reject(6);
				if(!Validate.pUsername(pUsername)) reject(7);
				if(!Validate.pPassword(pPassword)) reject(8);
	
				if(pMessage == null || typeof(pMessage) == 'undefined' || pMessage.length == 0) pMessage = "";
	
				pPassword = CryptoJS.AES.encrypt(pPassword, password).toString();
				pMessage = CryptoJS.AES.encrypt(pMessage, password).toString();
	
				if(pMessage.length > 10000) reject(9);
	
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
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						resolve(JSON.parse(response));
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}
	
		static deletePassword(server, username, token, passwordID){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.username(username)) reject(2);
				if(!Validate.token(token)) reject(3);
				if(!Validate.positiveInteger(passwordID)) reject(4);
	
				let data = new FormData();
				data.append("password_id", passwordID);
	
				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));
	
				fetch(server + "?action=deletePassword", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						resolve(JSON.parse(response));
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}
	
		static deleteAccount(server, username, token){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.username(username)) reject(2);
				if(!Validate.token(token)) reject(3);
	
				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));
	
				fetch(server + "?action=deleteAccount", {
					method: "POST",
					headers: headers
				}).then((result) => {
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						resolve(JSON.parse(response));
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}
	
		static enable2FA(server, username, token){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.username(username)) reject(2);
				if(!Validate.token(token)) reject(3);
	
				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));
	
				fetch(server + "?action=enable2fa", {
					method: "POST",
					headers: headers
				}).then((result) => {
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						resolve(JSON.parse(response));
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}
	
		static disable2FA(server, username, token){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.username(username)) reject(2);
				if(!Validate.token(token)) reject(3);
	
				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));
	
				fetch(server + "?action=disable2fa", {
					method: "POST",
					headers: headers
				}).then((result) => {
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						resolve(JSON.parse(response));
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}
	
		static addYubiKey(server, username, token, id){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.username(username)) reject(2);
				if(!Validate.token(token)) reject(3);
				if(!Validate.yubiKey(id)) reject(4);
	
				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));
	
				let data = new FormData();
				data.append("id", id);
	
				fetch(server + "?action=addYubiKey", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						resolve(JSON.parse(response));
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}
	
		static removeYubiKey(server, username, token, id){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.username(username)) reject(2);
				if(!Validate.token(token)) reject(3);
				if(!Validate.yubiKey(id)) reject(4);
	
				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));
	
				let data = new FormData();
				data.append("id", id);
	
				fetch(server + "?action=removeYubiKey", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						resolve(JSON.parse(response));
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}
	
		static forgotUsername(server, email){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.email(email)) reject(2);
	
				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));
	
				let data = new FormData();
				data.append("email", email);
	
				fetch(server + "?action=forgotUsername", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						resolve(JSON.parse(response));
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}
	
		static importPasswords(server, username, token, password, passwords){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) reject(1);
				if(!Validate.username(username)) reject(2);
				if(!Validate.token(token)) reject(3);
				if(!Validate.password(password)) reject(4);
				if(!Validate.jsonPasswords(passwords)) reject(5);
	
				for(let i = 0; i < Object.keys(passwords).length; i++){
					if(passwords[i].message == null || typeof(passwords[i].message) == 'undefined' || passwords[i].message.length == 0) passwords[i].message = "";
					passwords[i].password = CryptoJS.AES.encrypt(passwords[i].password, password).toString();
					passwords[i].message = CryptoJS.AES.encrypt(passwords[i].message, password).toString();
	
					if(passwords[i].message.length > 10000) reject(6);
				}
	
				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));
				headers.append('Content-Type', 'application/json');
	
				let data = JSON.stringify(passwords);
	
				fetch(server + "?action=importPasswords", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200) reject(505);
					return result.text();
				}).then((response) => {
					try{
						resolve(JSON.parse(response));
					}catch(error){
						reject(505);
					}
				}).catch(() => {
					reject(505);
				});
			});
		}
	}

	window.Passky = Passky;
})();