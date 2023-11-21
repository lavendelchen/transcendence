export function authGuard(router: any) {
    fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/auth/isAuthenticated', {
        method: 'GET',
        credentials: 'include',
    })
	.then(response => response.json())
	.then(data => {
		if (data === false)
			router.push('/not-allowed')
	})
    .catch(error => console.error('Error:', error));
}