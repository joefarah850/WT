var messageDiv = document.getElementById('message');
var messageDiv1 = document.getElementById('message1');

function loginListener() {

    var loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var lEmailAddressInput = document.getElementById('l-emailAddress');
        var lPasswordInput = document.getElementById('l-password');
        var lFormData = {
            emailAddress: lEmailAddressInput.value,
            password: lPasswordInput.value
        };


        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.message === 0) {
                    messageDiv.textContent = 'Incorrect email or password!';
                    messageDiv.style.color = 'red';
                    lEmailAddressInput.value = "";
                    lPasswordInput.value = "";
                } else {
                    goToHomePage();
                }
                
            } else {
                messageDiv.textContent = 'Oops! An error occurred.';
            }
        };

        xhr.send(JSON.stringify(lFormData));
    });
}

function signupListener() {

    var signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var sPasswordInput = document.getElementById('s-password');
        var confirmPasswordInput = document.getElementById('confirmPassword');

        if (sPasswordInput.value !== confirmPasswordInput.value) {
            var passwordMismatchMessage = document.getElementById('passwordMismatch');
            passwordMismatchMessage.style.display = 'block';
            confirmPasswordInput.value = "";
            return; 
        }

        var firstNameInput = document.getElementById('firstName');
        var lastNameInput = document.getElementById('lastName');
        var sEmailAddressInput = document.getElementById('s-emailAddress');
        var sFormData = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            emailAddress: sEmailAddressInput.value,
            password: sPasswordInput.value,
            confirmPassword: confirmPasswordInput.value
        };

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/signup', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);

                if (response.message != 1) {
                    toggleForm('loginForm');
                    messageDiv.textContent = response.message;
                    messageDiv.style.color = 'black';
                }
                else {
                    messageDiv1.textContent = response.message;
                }
                setTimeout(function () {
                    messageDiv.style.display = 'none';
                }, 3000);

            } else {
                messageDiv.textContent = 'Oops! An error occurred.';
            }
        };

        xhr.send(JSON.stringify(sFormData));
    });
}


function goToHomePage() {
    var loadingOverlay = document.getElementById('loading-overlay');
    var form = document.querySelector('.form-container');

    loadingOverlay.style.display = 'block';
    form.style.opacity = '0.7'
    setTimeout(function () {
        window.location.href = '/index';
        loadingOverlay.style.display = 'none';
    }, 2000);
}


function toggleForm(formId) {
    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');

    if (formId == loginForm.id) {
        loginForm.classList.add("active");
        signupForm.classList.remove("active");
        signupForm.reset();
        loginListener();
    } else if (formId == signupForm.id) {
        loginForm.classList.remove("active");
        signupForm.classList.add("active");
        loginForm.reset();
        signupListener();
    }
}