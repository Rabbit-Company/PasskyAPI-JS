export default class Validate{

	static username(username){
		if(typeof(username) == 'undefined' || username == null) return false;
		return /^[a-z0-9._]{6,30}$/i.test(username);
	}

	static password(password){
		if(typeof(password) == 'undefined' || password == null) return false;
		return password.length >= 8;
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
		return (website.length >= 2 && website.length <= 100);
	}

	static pUsername(username){
		if(typeof(username) == 'undefined' || username == null) return false;
		return username.length >= 2 && username.length <= 100;
	}

	static pPassword(password){
		if(typeof(password) == 'undefined' || password == null) return false;
		return password.length >= 2 && password.length <= 100;
	}

	static pMessage(message){
		if(typeof(message) == 'undefined' || message == null) return false;
		return message.length >= 0 && message.length <= 5000;
	}

	static positiveInteger(number){
		if(typeof(number) == 'undefined' || number == null) return false;
		return number >>> 0 === parseFloat(number);
	}

	static yubiKey(id){
		if(typeof(id) == 'undefined' || id == null) return false;
		return id.length == 44;
	}

	static license(license){
		if(typeof(license) == 'undefined' || license == null) return false;
		return license.length == 29;
	}

	static json(json){
		try{
			JSON.parse(json);
			return true;
		}catch{}
		return false;
	}
}