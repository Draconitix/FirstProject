const urlBase = 'http://COP4331.xyz/API';
const extension = 'php';
// Update check 6/5
let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				console.log(firstName);
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				localStorage.setItem('user-id', userId);
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}
function doRegister()
{
	let firstName = document.getElementById('firstName').value;
	let lastName = document.getElementById('lastName').value;
	let userName = document.getElementById('userName').value;
	let password = document.getElementById('password').value;

	let temp =
	{
		firstName: firstName,
		lastName: lastName,
		Username: userName,
		Password: password
	};

	let jsonPayload = JSON.stringify(temp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

	try
	{
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState != 4)
			{
				return;
			}
			if (xhr.status == 409)
			{
				document.getElementById('registrationMessage').innerHTML = "This username is taken.";
				return;
			}
			if (xhr.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				userId = jsonObject.id;
				localStorage.setItem('user-id', userId);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	localStorage.clear();
	window.location.href = "index.html";
}
