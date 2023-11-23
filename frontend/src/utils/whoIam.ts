export function whoIam(): any {
	fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/auth/whoIam', {
        method: 'GET',
        credentials: 'include',
    })
	.then(response => response.json())
	.then(data => {
		console.log(data)
		return data
	})
	.catch(error => { 
		console.log(error.message)
		return null
	})
}