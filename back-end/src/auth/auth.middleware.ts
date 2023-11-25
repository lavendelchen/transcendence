import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(
		private userService: UserService,
	) { }
	async checkAuthentication(req: Request) {
		const isAuth = (await this.userService.findOne(req.session.userID)).isAuthenticated;
		console.log("isAuth middleware: " + isAuth)
		if (req.session && isAuth) {
			// Fetch user details from the database
			const userId = req.session.userID;
			const user = await this.userService.findOne(userId);

			if (!user) {
			  console.log('User not found');
			  return false;
			}
			if (user.is2FActive) {
			  // Check if TFA is authenticated
			  if (user.is2FAuthenticated) {
				  console.log('User is TFA authenticated.');
				  return true;
				} else {
				  console.log('User is not TFA authenticated.');
				  return false;
			  }
			} else {
				return true;
			}
		  } else {
			// If user is not authenticated, return false
			console.log('User is not authenticated.');
			return false;
		  }
	}

	async use(req: Request, res: Response, next: NextFunction) {
		console.log('MIDDLEWARE!')
		const isAuthenticated = await this.checkAuthentication(req)
    	if (isAuthenticated) {
    	  // User is authenticated, proceed to the next middleware or route handler
    	  next();
    	} else {
    	  // User is not authenticated, return an unauthorized response
    	  res.status(401).json({ message: 'Unauthorized: Need to be logged in' });
    	}
	}
}

@Injectable()
export class CheckUserOwnershipMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Check User Ownership MIDDLEWARE!')

    const	requester = req.session.userID
	console.log("Requester: " + requester)

	/* useing regex to extract number and get requested user id */
	const r = new RegExp("\\d+")
	const	path = (req as any)._parsedOriginalUrl.path as string
	const	requestedUserArray = path.match(r)
	console.log(requestedUserArray)
	if (requestedUserArray == null) {
		next()
		return
	}
	const requestedUser = requestedUserArray[0]
	console.log("requested user: " + requestedUser)

    if (requester == requestedUser) {
      next()
    } else {
      res.status(403).json({ message: 'Forbidden: need to be the user who\'s data you requested' })
    }
  }
}
