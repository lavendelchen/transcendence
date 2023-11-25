export type User = {
	id: number;
	fortytwo_id: number;
	pseudo: string;
	email: string;
	avatar: string;
	is2FActive: boolean;
	is2FAuthenticated: boolean;
};

export function whoIam(): Promise<User | null> {
	return fetch('http://' + import.meta.env.VITE_CURRENT_HOST + ':3000/auth/whoIam', {
        method: 'GET',
        credentials: 'include',
    })
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json() as Promise<User>
	})
	.catch(error => { 
		console.error(error.message)
		return null
	}) as Promise<User | null>
}