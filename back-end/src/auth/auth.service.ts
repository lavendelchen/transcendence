import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError, lastValueFrom } from 'rxjs'
// import * as jwt from 'jsonwebtoken'; // TODO: verify access token?!?

@Injectable()
export class AuthService {
	// protected api_access: Promise<any>;

	constructor(private readonly jwtService: JwtService, private readonly httpService: HttpService) {}

	async initAuth(){

		const url = 'https://api.intra.42.fr/oauth/authorize?';
		var params = new URLSearchParams();
		params.append('client_id', process.env.API_UID);
		params.append('redirect_uri', process.env.API_REDIRECT);
		params.append('response_type', 'code');
		return url + params;
	}
	async successAuth(code: string) {
		// Check if the code is undefined or empty
		if (!code) {
		  throw new ForbiddenException('Authorization failed: Missing code');
		}
	
		// Prepare the data for token exchange
		const tokenData = {
		  grant_type: 'authorization_code',
		  client_id: process.env.API_UID,
		  client_secret: process.env.API_SECRET,
		  code,
		  redirect_uri: process.env.API_REDIRECT,
		};
	
		try {
		  // Send a POST request to exchange the code for a token
		  const tokenResponse = await lastValueFrom(
			this.httpService.post('https://api.intra.42.fr/oauth/token', tokenData).pipe(
			  map((response) => response.data),
			  catchError(() => {
				throw new ForbiddenException('Authorization failed: Token exchange failed');
			  }),
			),
		  );
	
		  // Log the token information
		  console.log('Access token:', tokenResponse.access_token);
		  console.log('Token type:', tokenResponse.token_type);
		  console.log('Expires in:', tokenResponse.expires_in);
		  console.log('Refresh token:', tokenResponse.refresh_token);
		  console.log('Scope:', tokenResponse.scope);
		  console.log('Created at:', tokenResponse.created_at);
	
		  // Set the authorization header for subsequent requests
		  const headers = {
			Authorization: `Bearer ${tokenResponse.access_token}`,
		  };
	
		  // Send a GET request to fetch user data
		  const userResponse = await lastValueFrom(
			this.httpService.get('https://api.intra.42.fr/v2/me', { headers }).pipe(
			  map((response) => response.data),
			  catchError(() => {
				throw new ForbiddenException('Authorization failed: Failed to fetch user data');
			  }),
			),
		  );
	
		  // Log the keys and user data
		  console.log('Keys:', Object.keys(userResponse));
		  const userData = {
			email: userResponse.email,
			firstname: userResponse.first_name,
			lastname: userResponse.last_name,
			username: userResponse.login,
			image: userResponse.image.versions.medium,
		  };
		  console.log('USER DATA:', userData);
	
		  return userData.email;
		} catch (error) {
		  throw new ForbiddenException('Authorization failed: ' + error.message);
		}
	  }
	}