import { Organization } from '@entities/organization.entity';
import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationInput extends Organization { }
