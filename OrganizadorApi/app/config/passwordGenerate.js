async function generateTemporaryPassword() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    
    // Generar una cadena aleatoria de 8 caracteres
    for (let i = 0; i < 9; i++) {
      const randomIndex = await Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    const containsNumber = /\d/.test(password);
  const containsLetter = /[a-zA-Z]/.test(password);
  const containsUppercase = /[A-Z]/.test(password);
  
  if (containsNumber && containsLetter && containsUppercase) {
    return password;
  } else {
    // Si la contraseña generada no cumple con los requisitos, generar una nueva recursivamente
    return generateTemporaryPassword();
  }
}

module.exports = generateTemporaryPassword;