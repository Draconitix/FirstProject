const urlBase = 'http://COP4331.xyz/API';
const extension = 'php';
// Update check 6/5
let userId = 0;
let firstName = "";
let lastName = "";
const contactsArray = [];

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	//document.getElementById("loginResult").innerHTML = "";

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
				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;
				userId = jsonObject.ID;
		
				if( userId < 1 )
				{

					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				localStorage.setItem('user-id', userId);
				localStorage.setItem('first-name', firstName);
				localStorage.setItem('last-name', lastName);
	
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
		FirstName: firstName,
		LastName: lastName,
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
				document.getElementById('registerResult').innerHTML = "This username is taken.";
				return;
			}
			if (xhr.status == 200)
			{
				document.getElementById('registerResult').innerHTML = "Success!";
				window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}


function getContacts(){
	let tmp = {
	UserID: localStorage.getItem("user-id"),
	Search: ""
	};

	let url = urlBase + '/Search.' + extension;
	const xhr = new XMLHttpRequest();
	xhr.open("Post", url);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.responseType = "json";

	return new Promise((resolve, reject) =>
	{
		xhr.onreadystatechange = () =>
		{
			if (xhr.readyState != 4)
			{
				return;
			}
			if (xhr.status == 200)
			{
				resolve(xhr.response.results);
			}
			else
			{
				reject(xhr.response);
			}
		}

		xhr.send(JSON.stringify(tmp));
	});
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	localStorage.clear();
	window.location.href = "index.html";
}

function addContact(){
	let tmp = {
		FirstName: document.getElementById("FirstName").value,
		LastName: document.getElementById("LastName").value,
		Phone: document.getElementById("Phone").value,
		Email: document.getElementById("Email").value,
		UserID: localStorage.getItem("user-id")
	};
	
	let url = urlBase + '/Add.' + extension;
	const xhr = new XMLHttpRequest();
	xhr.open("Post", url);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.responseType = "json";

	try
	{
		xhr.onreadystatechange = () =>
		{
			if (xhr.readyState != 4)
			{
				return;
			}
			if (xhr.status == 200)
			{
				alert("Added Contact.");
				location.reload();
			}
		}
		xhr.send(JSON.stringify(tmp));
	}
	catch(err)
	{
		document.getElementById("addStatusMessage").textContent = "err";
	}
}

function updateContact(){
	let tmp = {
		FirstName: document.getElementById("FirstName").value,
		LastName: document.getElementById("LastName").value,
		Phone: document.getElementById("Phone").value,
		Email: document.getElementById("Email").value,
		UserID: localStorage.getItem("user-id"),
		ID: document.getElementById("ID").value
	};
	
	let url = urlBase + '/Update.' + extension;
	const xhr = new XMLHttpRequest();
	xhr.open("Post", url);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.responseType = "json";

	try
	{
		xhr.onreadystatechange = () =>
		{
			if (xhr.readyState != 4)
			{
				return;
			}
			if (xhr.status == 200)
			{
				document.getElementById("addButton").style.visibility = true;
				document.getElementById("editButton").style.visibility = false;
				location.reload();
			}
		}
		xhr.send(JSON.stringify(tmp));
	}
	catch(err)
	{
		document.getElementById("addStatusMessage").textContent = "err";
	}
}

function findContact(array, firstname, lastname){
    let i = array.results.length;
    let j = 0;
    while( j < i){
        if(array.results[j].FirstName.localeCompare(firstName) == 0  && array.results[j].LastName.localeCompare(lastName) == 0){
            return array.results[j].ID;
        }
        j = j + 1;
    }
}

function editButtonClicked(array, firstname, lastname){
	let id = parseInt(findContact(array, firstname, lastname));
	document.getElementById("ID").value = array.results[id].ID;
	document.getElementById("FirstName").value = array.results[id].FirstName;
	document.getElementById("LastName").value = array.results[id].LastName;
	document.getElementById("Email").value = array.results[id].Email;
	document.getElementById("Phone").value = array.results[id].Phone;
	document.getElementById("addButton").style.visibility = false;
	document.getElementById("editButton").style.visibility = true;
}
