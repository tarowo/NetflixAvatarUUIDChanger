// ==UserScript==
// @name         Netflix Avatar UUID Changer
// @namespace    https://www.netflix.com/
// @version      1.0
// @description  Allow avatar UUID updating to allow you to get any Netflix avatar
// @author       tarowo
// @match        https://www.netflix.com/settings/profile/edit/*
// @grant        none
// ==/UserScript==

(function() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    container.style.color = 'white';
    container.style.padding = '10px';
    container.style.zIndex = '9999';
    container.style.borderRadius = '8px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Enter Avatar Key';
    inputField.style.marginBottom = '10px';
    inputField.style.padding = '5px';
    inputField.style.borderRadius = '4px';
    inputField.style.border = '1px solid #ccc';
    inputField.style.backgroundColor = 'white';
    inputField.style.color = 'black';
    inputField.style.fontSize = '14px';
    inputField.style.width = '250px';
    inputField.style.outline = 'none';
    inputField.style.transition = 'border-color 0.3s ease';

    inputField.addEventListener('focus', function() {
        inputField.style.borderColor = '#007bff';
    });

    inputField.addEventListener('blur', function() {
        inputField.style.borderColor = '#ccc';
    });

    const executeButton = document.createElement('button');
    executeButton.innerHTML = 'Update Profile';
    executeButton.style.padding = '10px';
    executeButton.style.border = 'none';
    executeButton.style.backgroundColor = '#007bff';
    executeButton.style.color = 'white';
    executeButton.style.cursor = 'pointer';
    executeButton.style.borderRadius = '4px';

    const openRedditButton = document.createElement('button');
    openRedditButton.innerHTML = 'Open Avatar Keys';
    openRedditButton.style.padding = '10px';
    openRedditButton.style.border = 'none';
    openRedditButton.style.backgroundColor = '#ff0000';
    openRedditButton.style.color = 'white';
    openRedditButton.style.cursor = 'pointer';
    openRedditButton.style.borderRadius = '4px';
    openRedditButton.style.marginTop = '10px';

    const copyrightText = document.createElement('p');
    copyrightText.innerHTML = 'Made by tarowo &copy; 2025. All rights reserved.';
    copyrightText.style.fontSize = '12px';
    copyrightText.style.color = '#bbb';
    copyrightText.style.marginTop = '10px';

    container.appendChild(inputField);
    container.appendChild(executeButton);
    container.appendChild(openRedditButton);
    container.appendChild(copyrightText);

    document.body.appendChild(container);

    async function makeOptionsRequest() {
        const response = await fetch("https://web.prod.cloud.netflix.com/graphql", {
            method: "OPTIONS",
            headers: {
                "accept": "*/*",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            credentials: "include",
        });
        return response;
    }

    async function updateProfileInfo(profileId, name, gender, avatarKey) {
        const queryBody = JSON.stringify({
            operationName: "updateProfileInfo",
            variables: {
                id: profileId,
                name: name,
                gender: gender,
                avatarKey: avatarKey
            },
            extensions: {
                persistedQuery: {
                    id: "b5e136b3-ff3d-4952-ac70-0f11acc5ac8f",
                    version: 102
                }
            }
        });

        const response = await fetch("https://web.prod.cloud.netflix.com/graphql", {
            method: "POST",
            headers: {
                "accept": "*/*",
                "content-type": "application/json",
                "x-netflix.context.app-version": "v614875f3",
                "x-netflix.context.is-inapp-browser": "false",
                "x-netflix.context.locales": "en-gb",
                "x-netflix.context.operation-name": "updateProfileInfo",
                "x-netflix.context.ui-flavor": "akira",
                "x-netflix.request.attempt": "1",
                "x-netflix.request.client.context": "{\"appstate\":\"foreground\"}",
                "x-netflix.request.id": "515f60a060934ea5a457ac300e10b71f",
                "x-netflix.request.originating.url": window.location.href,
                "x-netflix.request.toplevel.uuid": "907f9ccf-74df-47f2-b539-9fa1e173852c"
            },
            body: queryBody,
            credentials: "include",
        });

        const result = await response.json();
        return result;
    }

    executeButton.addEventListener('click', async () => {
        const avatarKey = inputField.value.trim();

        if (!avatarKey) {
            alert("Please enter a valid Avatar Key.");
            return;
        }

        const profileId = window.location.pathname.split('/')[4];
        const name = document.querySelector('input[name="profile-name"]').value;
        const gender = "UNSPECIFIED";

        const optionsResponse = await makeOptionsRequest();

        if (optionsResponse.ok) {
            await updateProfileInfo(profileId, name, gender, avatarKey);
            alert("Profile updated successfully!");
            window.location.reload();
        } else {
            alert("Failed to authenticate. Please make sure you're logged in.");
        }
    });

    openRedditButton.addEventListener('click', () => {
        window.open('https://www.reddit.com/r/netflix/comments/13h9uhr/netflix_profile_icons_compilation_project/', '_blank');
    });
})();
