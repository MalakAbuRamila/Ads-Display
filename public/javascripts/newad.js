'use strict';
(function(){
    document.addEventListener('DOMContentLoaded', () =>{

        /**
         * this function handles the submitting of the form, it trims the inputs and displays an error message if the user
         * does not fill one of the mandatory fields then it submits the form
         * this function does not receive or return anything
         */
        function submitForm(){

            //trim the inputs
            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            const price = document.getElementById('price').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();

            const emptyError = document.getElementById('emptyError');

            //if the user does not fill one of the mandatory fields display an error message
            if (title === ''  || (price === '' || isNaN(price)) || email === '') {
                emptyError.innerHTML = 'Please fill out the mandatory fields';
                return;
            }
            else{
                emptyError.innerHTML = '';
                return;
            }

            //submit form
            document.getElementById('newAdForm').submit();
        }

        //event listener for the submit button
        document.getElementById('submitBtn').addEventListener('click', submitForm);

    });
})();