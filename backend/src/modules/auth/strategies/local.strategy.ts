import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends AuthGuard('local') {}
