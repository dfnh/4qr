import bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const verifyPassword = async (password: string, hash: string) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};

export { hashPassword, verifyPassword };
