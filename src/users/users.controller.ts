import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Patch,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { GenericResponseDto } from './dto/generic-response.dto';
import { CreateUserDto, UpdateUserDto } from './dto/index';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('get')
  async getAll(
    @Query('role') role?: string,
    @Query('full_name') fullName?: string,
    @Query('efficiency') efficiency?: number,
  ): Promise<GenericResponseDto<{ users: UserResponseDto[] }>> {
    const users = await this.usersService.getAll(role, fullName, efficiency);
    if (!users) {
      throw new HttpException(
        {
          success: false,
          result: { error: 'users not found' },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      success: true,
      result: { users },
    };
  }

  @Get('/get/:id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GenericResponseDto<{ users: UserResponseDto[] }>> {
    const user = await this.usersService.getOneById(id);
    if (!user) {
      throw new HttpException(
        {
          success: false,
          result: { error: 'users not found' },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      success: true,
      result: { users: user ? [user] : [] },
    };
  }

  @Post('create')
  async create(@Body() user: CreateUserDto): Promise<{
    success: boolean;
    result?: {
      id: number;
    };
  }> {
    const newUser = await this.usersService.create(user);
    if (!newUser) {
      return {
        success: false,
      };
    }
    return {
      success: true,
      result: { id: newUser.id },
    };
  }

  @Patch('/update/:id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<GenericResponseDto<UserResponseDto>> {
    const updatedUser = await this.usersService.update(id, user);
    if (!updatedUser) {
      return {
        success: false,
      };
    }
    return {
      success: true,
      result: updatedUser,
    };
  }

  @Delete('/delete/:id')
  async delete(
    @Param('id') id: number,
  ): Promise<GenericResponseDto<UserResponseDto>> {
    const deletedUser = await this.usersService.delete(id);
    if (!deletedUser) {
      return {
        success: false,
      };
    }
    return {
      success: true,
      result: deletedUser,
    };
  }

  @Delete('delete')
  async deleteAllUsers(): Promise<GenericResponseDto<void>> {
    await this.usersService.delete();
    return {
      success: true,
    };
  }
}
