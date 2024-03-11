import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validate as isValidUUID } from 'uuid';

@ValidatorConstraint({ name: 'IsUUIDorNull', async: true })
export class IsUUIDorNullConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return isValidUUID(value) || value === null;
  }

  defaultMessage({ property }: ValidationArguments): string {
    return `${property} must be a UUID or null`;
  }
}

export function IsUUIDorNull(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUUIDorNullConstraint,
    });
  };
}
