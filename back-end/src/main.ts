import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as session from 'express-session';
import * as FilesStore from 'session-file-store'
import * as cors from 'cors';

const FileStoreSession = FilesStore(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //enable WebSockets
  app.useWebSocketAdapter(new WsAdapter(app));

  //enable "cross origin resource sharing" - so that frontend can fetch data from the backend
  // setup session
  app.use(
    cors({
      origin: '*',  // Replace with the origin of your frontend application
      credentials: true,
    }),
    session({
      store: new FileStoreSession(),
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, //activate to onlz allow cookie send via https
        httpOnly: false, //activate to prevent readability with javascript
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1 Tag
        sameSite: 'lax'
      }
    })
  )
  await app.listen(3000);
}
bootstrap();
