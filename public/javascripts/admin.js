'use strict';
(function (){

    const loading = document.getElementById('loading');

    /**
     * this function fetches all the ads and displays them on the admin page.
     * it's an async function.
     */
    document.addEventListener('DOMContentLoaded', async () => {
        try {

            //display the loading gif
            loadingGif(true);

            //fetch all the ads
            const response = await fetch('/find-ads'); // Fetch all ads for the admin page
            if (!response.ok) {
                throw new Error('Failed to fetch ads');
            }

            const ads = await response.json();

            //hide the loading gif
            loadingGif(false);

            //call for the render function that renders the ads on the admin page
            renderAds(ads);

        } catch (error) {
            console.log('Error');
        }
    });

    /**
     * this function renders all the ads on the admin page with an approve and delete buttons
     * that allow the admin to approve or delete ads
     * it receives the ads(the ad's data) as a parameter
     * it's a void function, it does not return anything
     * @param ads
     */
    function renderAds(ads) {

        const adminContainer = document.getElementById('admin-container');
        adminContainer.innerHTML = ''; // clear previous content

        ads.forEach(ad => {

            //define for all the ads a card
            const adCard = document.createElement('div');
            adCard.classList.add('card', 'mb-4');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            //creating elements to store the ads information

            //create element h5 to display the title
            const title = document.createElement('h5');
            title.classList.add('card-title');
            title.textContent = ad.title;

            //create element p to display the description
            const description = document.createElement('p');
            description.classList.add('card-text');
            description.textContent = `Description: ${ad.description}`;

            //create element p to display the price
            const price = document.createElement('p');
            price.classList.add('card-text');
            price.textContent = `Price: ${ad.price}`;

            //create element p to display the phone
            const phone = document.createElement('p');
            phone.classList.add('card-text');
            phone.textContent = `Phone: ${ad.phone}`;

            //create element p to display the email
            const email = document.createElement('p');
            email.classList.add('card-text');
            email.textContent = `Email: ${ad.email}`;

            //create the approve button
            const approveBtn = document.createElement('button');
            approveBtn.textContent = 'Approve';
            approveBtn.dataset.id = ad.id;
            approveBtn.classList.add('btn', 'btn-success','me-2');
            //event listener for the approve button
            approveBtn.addEventListener('click', () => approveAd(ad.id, ad.approved));

            //create the delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('btn', 'btn-danger');
            deleteBtn.dataset.id = ad.id;
            //event listener for the delete button
            deleteBtn.addEventListener('click', () => deleteAd(ad.id));

            //append all the information to the card body
            cardBody.appendChild(title);
            cardBody.appendChild(description);
            cardBody.appendChild(price);
            cardBody.appendChild(phone);
            cardBody.appendChild(email);
            //append approve button
            cardBody.appendChild(approveBtn);

            //append delete button
            cardBody.appendChild(deleteBtn);

            //append card body
            adCard.appendChild(cardBody);
            //append ad container
            adminContainer.appendChild(adCard);
        });
    }

    /**
     * this function handles the deletion of ads. It's an async function.
     * it receives the adId(string) as a parameter (in order to delete ads based on their id)
     * it returns a promise
     * @param adId
     * @returns {Promise<void>}
     */
    async function deleteAd(adId) {
        try {
            //display the loading gif
           loadingGif(true);

           //delete method for the deleted ads
            const response = await fetch(`/ads/${adId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            //throw error if something went wrong
            if (!response.ok) {
                throw new Error('Failed to delete ad');
            }

            //hide the loading gif
            loadingGif(false);

            //refresh the admin page after deletion
            location.reload();

        } catch (error) {
            console.error(error);

        }
    }


    /**
     * this function handles the approval of ads. It's an async function.
     * it receives the adId(string) as a parameter (in order to update the list of ads based on their id)
     * and it receives approved(boolean) as a parameter, to check if the admin already approved an ad or not
     * it returns a promise
     * @param adId
     * @param approved
     * @returns {Promise<void>}
     */
    async function approveAd(adId, approved) {
        try {

            //if the ad is already approved alert the admin
            if(approved){
                alert('You already approved this ad');
                return;
            }

           // display the gif when the admin approves an add
            loadingGif(true);

            //fetch the approved ads (update the list of ads)
            const response = await fetch(`/approved/${adId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({approved: true})
            });

            //throw error if something went wrong
            if (!response.ok) {
                throw new Error('Failed to approve ad');
            }

            //hide the loading gif
            loadingGif(false);

            //refresh the admin page after approve
            location.reload();

        }
        catch (error){
            console.error(error);
        }
    }

    /**
     * this function handles the displaying and hiding of the loading Gif.
     * this function receives a boolean parameter display, if display was true the loading gif will be displayed
     * otherwise the loading gif will not be displayed
     * it's a void function
     * this function does not return anything
     * @param display
     */
    function loadingGif(display){

        if(display){
            //display the loading Gif
            loading.classList.remove('d-none');
        }
        else{
            //hide the loading Gif
            loading.classList.add('d-none');
        }

    }

})();