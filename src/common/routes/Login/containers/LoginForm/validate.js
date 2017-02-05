export default function validate(values) {
  const errors = {};
  if (!values.login) {
    errors.login = 'Обязательно';
  }
  if (!values.password) {
    errors.password = 'Обязательно';
  }
  return errors;
}
