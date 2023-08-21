// src/forty-two-auth.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FortyTwoAuthService {
  private readonly UID = 'u-s4t2ud-60fcc437fbd9fd021efee77f37308ef82397a19276da6bdc9f39d658c9510343';
  private readonly SECRET = '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';
  private readonly API_BASE_URL = 'https://api.intra.42.fr';

  async getAccessToken(): Promise<string> {
    try {
      const response = await axios.post(
        `${this.API_BASE_URL}/oauth/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.UID,
          client_secret: this.SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      console.log('Access Token Response:', response.data); // Log the entire response
      return response.data.access_token;
    } catch (error) {
      throw new Error('Error getting access token: ' + error.message);
    }
  }  
}
