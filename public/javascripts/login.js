'use strict';
(function (){
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');

        //event listener for the submit button
        loginForm.addEventListener('submit', () =>{

            //trim  the username before submitting
            usernameInput.value = usernameInput.value.trim();
        });
    });
})();