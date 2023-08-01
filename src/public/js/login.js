const form = document.getElementById('loginForm')

form.addEventListener('submit', e => {
    e.preventDefault()

    const data = {
        email: form.email.value,
        password: form.password.value
    }
    fetch('api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(result => {
            console.log(result); // Check the result from the server
            if (result.status === 200) {
                console.log("Redirecting...");
                window.location.replace('/products');
            }
            if (result.status === 400) { alert('You are not registered.') }
        })
}
)
