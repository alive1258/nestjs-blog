// import {
//   ConflictException,
//   Injectable,
//   RequestTimeoutException,
// } from '@nestjs/common';
// import { User } from '../user.entity';

// import { DataSource } from 'typeorm';
// import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

// @Injectable()
// export class UsersCreateManyProvider {
//   constructor(
//     // inject datasource
//     private readonly dataSource: DataSource,
//   ) {}
//   public async createMany(createManyUsersDto: CreateManyUsersDto) {
//     let newUsers: User[] = [];

//     // Create Query Runner Instance
//     const queryRunner = this.dataSource.createQueryRunner();
//     try {
//       //connect Query Runner to datasource
//       await queryRunner.connect();

//       //start Transaction
//       await queryRunner.startTransaction();
//     } catch (error) {
//       throw new RequestTimeoutException('Could not connect to the database');
//     }

//     try {
//       for (let user of createManyUsersDto.users) {
//         let newUser = queryRunner.manager.create(User, user);
//         let result = await queryRunner.manager.save(newUser);
//         newUsers.push(result);
//       }

//       //if success commit transaction
//       await queryRunner.commitTransaction();
//       return newUsers;
//     } catch (error) {
//       //if unsuccessful rollback transaction
//       await queryRunner.rollbackTransaction();

//       throw new ConflictException('could not commit transaction', {
//         description: String(error),
//       });
//     } finally {
//       try {
//         //release collection Query Runner
//         await queryRunner.release();
//       } catch (error) {
//         throw new RequestTimeoutException(
//           'Could not release the connection to the database',
//           {
//             description: String(error),
//           },
//         );
//       }
//     }
//     return newUsers;
//   }
// }

import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Connect Query Runner to the data source and start transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Loop through each user and save
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      // Commit transaction if successful
      await queryRunner.commitTransaction();
      return newUsers;
    } catch (error) {
      // Rollback transaction if any error occurs
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not commit transaction', {
        description: String(error),
      });
    } finally {
      // Always release the query runner
      try {
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release the connection to the database',
          {
            description: String(error),
          },
        );
      }
    }
  }
}
