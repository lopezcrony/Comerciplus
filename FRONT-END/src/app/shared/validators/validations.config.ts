import { ModuleValidationConfig } from './validations.interface';

import { categoriesValidationConfig } from '../../modules/categories/categories.validation';
import { clientsValidationConfig } from '../../modules/clients/clients.validation';
import { providersValidationConfig } from '../../modules/providers/providers.validation';
import { rolesValidationConfig } from '../../modules/roles/roles.validations';
import { productsValidationConfig } from '../../modules/products/products.validations';
import { usersValidationConfig } from '../../modules/users/users.validations';
import { lossValidationConfig } from '../../modules/loss/loss.validations';

export const validationsConfig: ModuleValidationConfig = {
  roles: rolesValidationConfig,
  users: usersValidationConfig,

  clients: clientsValidationConfig,
  providers: providersValidationConfig,

  categories: categoriesValidationConfig,
  products: productsValidationConfig,

  loss: lossValidationConfig,

};
