export const validationPatterns = {
  onlyNumbers: /^[0-9]+$/,
  onlyLetters: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/,

  cedula: /^[0-9]{5,10}$/,
  phone: /^[0-9]{7,10}$/,
  price: /^(|[1-9][0-9]*)(\\.[0-9]+)?$/,

  nit: /^[0-9]{9}$/,

  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)$/, 

  dateTime: /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$/,

};
