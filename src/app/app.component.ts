import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ChatSession } from 'src/entities/chat-session';
import { User } from 'src/entities/user';
import { MOCK_USERS } from 'src/mock-user';
import { OrmService } from './orm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private ormService: OrmService) {
    platform.ready().then(async () => {
      console.log('Platform is ready!');
      await this.ormService.ready();
      const allUsers = await User.find();
      if (allUsers.length === 0) {
        // load dummy users
        for (let index = 0; index < 10; index++) {
          const user = MOCK_USERS[index];
          console.log(`Creating user ${user.firstName} ${user.lastName}`);
          const newUser = new User();
          newUser.firstName = user.firstName;
          newUser.lastName = user.lastName;
          await newUser.save();
        }
      }
      console.log('All users:', JSON.stringify((await User.find()), null, 2));
      console.log('All chat sessions:', JSON.stringify((await ChatSession.find()), null, 2));
    });
  }
}
